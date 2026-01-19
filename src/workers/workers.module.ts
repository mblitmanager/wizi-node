import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NotificationProcessor } from "./notification.processor";
import { NotificationModule } from "../notification/notification.module";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [
    ConfigModule,
    CommonModule,
    // Provide a forwardRef if there are circular dependencies with NotificationModule
    // For now we'll just import it if needed for the processor's dependencies
    NotificationModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get("REDIS_HOST", "localhost"),
          port: configService.get("REDIS_PORT", 6379),
        },
      }),
    }),
    BullModule.registerQueue({
      name: "notifications",
    }),
  ],
  providers: [NotificationProcessor],
  exports: [BullModule],
})
export class WorkersModule {}
