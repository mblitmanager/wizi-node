import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Global, Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { ConfigService } from "@nestjs/config";
import { join } from "path";

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get("MAIL_HOST"),
          port: parseInt(config.get("MAIL_PORT")),
          secure:
            config.get("MAIL_ENCRYPTION") === "ssl" ||
            config.get("MAIL_PORT") === "465",
          auth: {
            user: config.get("MAIL_USERNAME"),
            pass: config.get("MAIL_PASSWORD"),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"${config.get("MAIL_FROM_NAME")}" <${config.get("MAIL_FROM_ADDRESS")}>`,
        },
        template: {
          dir: join(process.cwd(), "src", "mail", "templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
