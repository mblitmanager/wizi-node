import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "../entities/notification.entity";
import { User } from "../entities/user.entity";
import { FcmService } from "./fcm.service";
import { ParrainageEvent } from "../entities/parrainage-event.entity";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ParrainageEvent)
    private parrainageEventRepository: Repository<ParrainageEvent>,
    private fcmService: FcmService,
    @InjectQueue("notifications")
    private readonly notificationsQueue: Queue
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

    // Offload Push Notification to Worker via BullMQ
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      await this.notificationsQueue.add("send-push", {
        userId,
        title: title || "Nouvelle notification",
        message,
        data,
        fcmToken: user?.fcm_token,
      });
    } catch (error) {
      console.error("Failed to queue notification job:", error);
    }

    return savedNotification;
  }

  async getNotifications(userId: number) {
    const notifications = await this.notificationRepository.find({
      where: { user_id: userId },
      order: { created_at: "DESC" },
    });

    // Ensure data field is properly formatted as object or empty array
    const formattedNotifications = notifications.map((notification) => ({
      id: notification.id,
      message: notification.message,
      data: notification.data || [],
      type: notification.type,
      title: notification.title,
      read: notification.read,
      user_id: notification.user_id,
      created_at: notification.created_at?.toISOString(),
      updated_at: notification.updated_at?.toISOString(),
    }));

    return { data: formattedNotifications };
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

  async deleteNotification(notificationId: number) {
    return this.notificationRepository.delete(notificationId);
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
      created_at: this.formatIso(event.created_at),
      updated_at: this.formatIso(event.updated_at),
      status: event.status,
    }));
  }

  async getNotificationHistoryPaginated(
    userId: number,
    page: number = 1,
    perPage: number = 10,
    baseUrl: string = ""
  ) {
    const [data, total] = await this.notificationRepository
      .createQueryBuilder("n")
      .where("n.user_id = :userId", { userId })
      .orderBy("n.created_at", "DESC")
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    const formattedData = data.map((n) => ({
      id: n.id,
      type: n.type,
      notifiable_type: "App\\Models\\User", // Standard Laravel field
      notifiable_id: n.user_id,
      data: typeof n.data === "string" ? JSON.parse(n.data) : n.data || {},
      read_at: n.read ? this.formatDateTime(n.updated_at) : null,
      created_at: this.formatIso(n.created_at),
      updated_at: this.formatIso(n.updated_at),
    }));

    return this.formatPagination(formattedData, total, page, perPage, baseUrl);
  }

  private formatPagination(
    data: any[],
    total: number,
    page: number,
    perPage: number,
    baseUrl: string
  ) {
    const lastPage = Math.max(1, Math.ceil(total / perPage));

    return {
      current_page: Number(page),
      data,
      first_page_url: `${baseUrl}?page=1`,
      from: total > 0 ? (page - 1) * perPage + 1 : null,
      last_page: lastPage,
      last_page_url: `${baseUrl}?page=${lastPage}`,
      links: this.generateLinks(page, lastPage, baseUrl),
      next_page_url: page < lastPage ? `${baseUrl}?page=${page + 1}` : null,
      path: baseUrl,
      per_page: perPage,
      prev_page_url: page > 1 ? `${baseUrl}?page=${page - 1}` : null,
      to: total > 0 ? Math.min(page * perPage, total) : null,
      total,
    };
  }

  private generateLinks(
    currentPage: number,
    lastPage: number,
    baseUrl: string
  ) {
    const links: any[] = [];
    links.push({
      url: currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : null,
      label: "pagination.previous",
      active: false,
    });
    for (let i = 1; i <= lastPage; i++) {
      links.push({
        url: `${baseUrl}?page=${i}`,
        label: i.toString(),
        active: i === currentPage,
      });
    }
    links.push({
      url: currentPage < lastPage ? `${baseUrl}?page=${currentPage + 1}` : null,
      label: "pagination.next",
      active: false,
    });
    return links;
  }

  private formatIso(date: any) {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().replace(".000Z", ".000000Z");
  }

  private formatDateTime(date: any) {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split(".")[0].replace("T", " ");
  }
}
