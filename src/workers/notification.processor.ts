import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { FcmService } from "../notification/fcm.service";

@Processor("notifications")
@Injectable()
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private fcmService: FcmService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(
      `Processing notification job ${job.id} for user ${job.data.userId}`
    );

    const { userId, title, message, data, fcmToken } = job.data;

    try {
      if (fcmToken) {
        await this.fcmService.sendPushNotification(
          fcmToken,
          title,
          message,
          data
        );
        this.logger.log(`Push notification sent to user ${userId}`);
      }

      // Additional logic like sending email or logging could go here

      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to process notification for user ${userId}: ${error.message}`
      );
      throw error; // Let BullMQ handle retry
    }
  }
}
