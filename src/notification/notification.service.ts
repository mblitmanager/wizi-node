import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "../entities/notification.entity";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>
  ) {}

  async createNotification(
    userId: number,
    type: string,
    message: string,
    data: any = {}
  ) {
    const notification = this.notificationRepository.create({
      user_id: userId,
      type,
      message,
      data,
      read: false,
    });
    return this.notificationRepository.save(notification);
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
}
