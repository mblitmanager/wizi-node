import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThanOrEqual } from "typeorm";
import { Agenda } from "../entities/agenda.entity";
import { Stagiaire } from "../entities/stagiaire.entity";
import { Notification } from "../entities/notification.entity";

@Injectable()
export class AgendaService {
  constructor(
    @InjectRepository(Agenda)
    private agendaRepository: Repository<Agenda>,
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>
  ) {}

  async getStagiaireAgenda(userId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
      relations: [
        "stagiaire_catalogue_formations",
        "stagiaire_catalogue_formations.catalogue_formation",
        "stagiaire_catalogue_formations.catalogue_formation.formation",
      ],
    });

    if (!stagiaire) {
      throw new NotFoundException(
        `Stagiaire avec l'utilisateur ID ${userId} introuvable`
      );
    }

    const formations = (stagiaire.stagiaire_catalogue_formations || [])
      .map((scf) => scf.catalogue_formation?.formation)
      .filter((f) => !!f);

    const events = await this.agendaRepository.find({
      where: { stagiaire_id: stagiaire.id },
      order: { date_debut: "ASC" },
    });

    const now = new Date();
    const upcoming_events = events.filter((e) => e.date_debut >= now);

    return {
      formations,
      events,
      upcoming_events,
    };
  }

  async exportAgendaToICS(userId: number): Promise<string> {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
    });

    if (!stagiaire) {
      throw new NotFoundException(`Stagiaire introuvable`);
    }

    const events = await this.agendaRepository.find({
      where: { stagiaire_id: stagiaire.id },
    });

    let icsContent =
      "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//WiziLearn//NONSGML v1.0//EN\r\n";

    for (const event of events) {
      icsContent += "BEGIN:VEVENT\r\n";
      icsContent += `DTSTART:${this.formatDateForICS(event.date_debut)}\r\n`;
      icsContent += `DTEND:${this.formatDateForICS(event.date_fin)}\r\n`;
      icsContent += `SUMMARY:${event.titre}\r\n`;
      icsContent += `DESCRIPTION:${event.description || ""}\r\n`;
      icsContent += "END:VEVENT\r\n";
    }

    icsContent += "END:VCALENDAR";
    return icsContent;
  }

  async getStagiaireNotifications(userId: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { user_id: userId },
    });

    if (!stagiaire) {
      throw new NotFoundException(`Stagiaire introuvable`);
    }

    return this.notificationRepository.find({
      where: { user_id: userId },
      order: { created_at: "DESC" },
    });
  }

  private formatDateForICS(date: Date): string {
    if (!date) return "";
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }
}
