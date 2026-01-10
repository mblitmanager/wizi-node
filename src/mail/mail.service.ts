import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(to: string, subject: string, template: string, context: any) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: `./${template}`,
        context,
      });
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
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
}
