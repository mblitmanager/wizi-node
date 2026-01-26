import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(
    to: string,
    subject: string,
    template: string,
    context: any,
    attachments?: any[],
  ) {
    try {
      console.log(
        `[MailService] Sending email to: ${to} | Subject: ${subject} | Template: ${template}`,
      );
      const info = await this.mailerService.sendMail({
        to,
        subject,
        template: `./${template}`,
        context,
        attachments,
      });
      console.log(
        `[MailService] Email sent successfully to ${to}. MessageId: ${info?.messageId}`,
      );
      return true;
    } catch (error) {
      console.error(`[MailService] Error sending email to ${to}:`, error);
      throw error;
    }
  }

  async sendPlainTextMail(to: string, subject: string, text: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text,
      });
      return true;
    } catch (error) {
      console.error("Error sending plain text email:", error);
      throw error;
    }
  }

  async sendUserEmail(user: any, subject: string, html: string) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject,
        html,
      });
      return true;
    } catch (error) {
      console.error("Error sending user email:", error);
      throw error;
    }
  }
}
