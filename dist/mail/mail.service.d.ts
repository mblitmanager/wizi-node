import { MailerService } from "@nestjs-modules/mailer";
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendMail(to: string, subject: string, template: string, context: any, attachments?: any[]): Promise<boolean>;
    sendPlainTextMail(to: string, subject: string, text: string): Promise<boolean>;
    sendUserEmail(user: any, subject: string, html: string): Promise<boolean>;
}
