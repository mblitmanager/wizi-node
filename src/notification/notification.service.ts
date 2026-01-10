import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "../entities/notification.entity";
import { User } from "../entities/user.entity";
import { FcmService } from "./fcm.service";
import { ParrainageEvent } from "../entities/parrainage-event.entity";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ParrainageEvent)
    private parrainageEventRepository: Repository<ParrainageEvent>,
    private fcmService: FcmService
  ) {}

  async createNotification(
    userId: number,
    type: string,
    message: string,
    data: any = {},
    title?: string
  ) {
    const notification = this.notificationRepository.create({
      user_id: userId,
      type,
      title: title || null,
      message,
      data,
      read: false,
    });
    const savedNotification =
      await this.notificationRepository.save(notification);

    // Send Push Notification via FCM
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user && user.fcm_token) {
        await this.fcmService.sendPushNotification(
          user.fcm_token,
          title || "Nouvelle notification",
          message,
          data
        );
      }
    } catch (error) {
      console.error("Failed to send push notification:", error);
    }

    return savedNotification;
  }

  async getNotifications(userId: number) {
    return this.notificationRepository.find({
      where: { user_id: userId },
      order: { created_at: "DESC" },
    });
  }

  async markAsRead(notificationId: number) {
    return this.notificationRepository.update(notificationId, { read: true });
  }

  async getUnreadCount(userId: number) {
    return this.notificationRepository.count({
      where: { user_id: userId, read: false },
    });
  }

  async markAllAsRead(userId: number) {
    return this.notificationRepository.update(
      { user_id: userId },
      { read: true }
    );
  }

  async getParrainageEvents() {
    const events = await this.parrainageEventRepository.find({
      order: { date_debut: "DESC" },
    });

    // Format dates to match Laravel output
    return events.map((event) => ({
      id: event.id,
      titre: event.titre,
      prix: event.prix ? event.prix.toString() : "0.00",
      date_debut: event.date_debut
        ? new Date(event.date_debut).toISOString().split("T")[0]
        : null,
      date_fin: event.date_fin
        ? new Date(event.date_fin).toISOString().split("T")[0]
        : null,
      created_at: event.created_at?.toISOString(),
      updated_at: event.updated_at?.toISOString(),
      status: event.status,
    }));
  }
}
