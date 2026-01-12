import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In, SelectQueryBuilder } from "typeorm";
import { Announcement } from "../entities/announcement.entity";
import { User } from "../entities/user.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Formateur } from "../entities/formateur.entity";
import { Commercial } from "../entities/commercial.entity";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(Formateur)
    private formateurRepository: Repository<Formateur>,
    @InjectRepository(Commercial)
    private commercialRepository: Repository<Commercial>,
    private notificationService: NotificationService
  ) {}

  async getAnnouncements(user: any, page: number = 1, limit: number = 10) {
    const query = this.announcementRepository
      .createQueryBuilder("announcement")
      .leftJoinAndSelect("announcement.creator", "creator")
      .orderBy("announcement.created_at", "DESC");

    if (user.role !== "admin") {
      query.where("announcement.created_by = :userId", { userId: user.id });
    }

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: items,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async createAnnouncement(data: any, user: any) {
    const { title, message, target_audience, recipient_ids, scheduled_at } =
      data;

    // Authorization check
    if (
      user.role === "formateur" ||
      user.role === "formatrice" ||
      user.role === "commercial"
    ) {
      if (!["stagiaires", "specific_users"].includes(target_audience)) {
        throw new ForbiddenException(
          "Vous ne pouvez envoyer des annonces qu'aux stagiaires ou à des utilisateurs spécifiques."
        );
      }
    }

    let filteredIds = null;
    if (target_audience === "specific_users") {
      const allowedUsers = await this.getScopedStagiaireUsers(user);
      const allowedIds = allowedUsers.map((u) => u.id);

      if (user.role !== "admin") {
        filteredIds = recipient_ids.filter((id) => allowedIds.includes(id));
      } else {
        filteredIds = recipient_ids;
      }
    }

    const announcement = this.announcementRepository.create({
      title,
      message,
      target_audience,
      recipient_ids: filteredIds,
      created_by: user.id,
      scheduled_at: scheduled_at ? new Date(scheduled_at) : null,
      sent_at: scheduled_at ? null : new Date(),
      status: scheduled_at ? "scheduled" : "sent",
    });

    const savedAnnouncement =
      await this.announcementRepository.save(announcement);

    if (!scheduled_at) {
      // Immediate send
      const recipients = await this.getRecipientsForImmediateSend(
        target_audience,
        filteredIds,
        user
      );

      for (const recipient of recipients) {
        await this.notificationService.createNotification(
          recipient.id,
          "announcement",
          message,
          { type: "announcement", announcement_id: savedAnnouncement.id },
          title
        );
      }

      return {
        message: "Annonce créée et envoi démarré.",
        announcement: savedAnnouncement,
        recipients_count: recipients.length,
      };
    }

    return {
      message: "Annonce planifiée avec succès.",
      announcement: savedAnnouncement,
    };
  }

  async deleteAnnouncement(id: number, user: any) {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
    });

    if (!announcement) {
      throw new NotFoundException("Annonce introuvable.");
    }

    if (announcement.created_by !== user.id && user.role !== "admin") {
      throw new ForbiddenException("Non autorisé.");
    }

    await this.announcementRepository.remove(announcement);
    return { message: "Annonce supprimée avec succès." };
  }

  async getPotentialRecipients(user: any) {
    if (user.role === "admin") {
      return this.userRepository.find({
        select: ["id", "name", "email", "role"],
      });
    }

    const allowedUsers = await this.getScopedStagiaireUsers(user);
    return allowedUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
    }));
  }

  private async getScopedStagiaireUsers(sender: any): Promise<User[]> {
    if (sender.role === "admin") {
      return this.userRepository.find({ where: { role: "stagiaire" } });
    }

    if (sender.role === "formateur" || sender.role === "formatrice") {
      const formateur = await this.formateurRepository.findOne({
        where: { user_id: sender.id },
      });
      if (!formateur) return [];

      return this.userRepository
        .createQueryBuilder("user")
        .innerJoin("stagiaires", "stagiaire", "stagiaire.user_id = user.id")
        .innerJoin(
          "formateur_stagiaire",
          "fs",
          "fs.stagiaire_id = stagiaire.id"
        )
        .where("fs.formateur_id = :formateurId", { formateurId: formateur.id })
        .getMany();
    }

    if (sender.role === "commercial") {
      const commercial = await this.commercialRepository.findOne({
        where: { user_id: sender.id },
      });
      if (!commercial) return [];

      return this.userRepository
        .createQueryBuilder("user")
        .innerJoin("stagiaires", "stagiaire", "stagiaire.user_id = user.id")
        .innerJoin(
          "commercial_stagiaire",
          "cs",
          "cs.stagiaire_id = stagiaire.id"
        )
        .where("cs.commercial_id = :commercialId", {
          commercialId: commercial.id,
        })
        .getMany();
    }

    return [];
  }

  private async getRecipientsForImmediateSend(
    targetAudience: string,
    filteredIds: number[],
    user: any
  ): Promise<User[]> {
    let recipients: User[] = [];

    if (targetAudience === "all" && user.role === "admin") {
      recipients = await this.userRepository.find();
    } else if (targetAudience === "formateurs" && user.role === "admin") {
      recipients = await this.userRepository.find({
        where: { role: In(["formateur", "formatrice"]) },
      });
    } else if (targetAudience === "autres" && user.role === "admin") {
      recipients = await this.userRepository.find({
        where: { role: In(["commercial", "admin"]) },
      });
    } else if (targetAudience === "stagiaires") {
      recipients = await this.getScopedStagiaireUsers(user);
    } else if (targetAudience === "specific_users") {
      if (filteredIds && filteredIds.length > 0) {
        recipients = await this.userRepository.findBy({ id: In(filteredIds) });
      }
    }

    return recipients;
  }
}
