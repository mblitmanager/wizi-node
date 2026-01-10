import { MailerService } from "@nestjs-modules/mailer";
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendMail(to: string, subject: string, template: string, context: any): Promise<boolean>;
    sendPlainTextMail(to: string, subject: string, text: string): Promise<boolean>;
}
