import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan } from "typeorm";
import { User } from "../../entities/user.entity";

@Injectable()
export class UserStatusTaskService {
  private readonly logger = new Logger(UserStatusTaskService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug("Checking for inactive users...");

    // Timeout after 15 minutes of inactivity
    const timeoutThreshold = new Date(Date.now() - 15 * 60 * 1000);

    const result = await this.userRepository.update(
      {
        is_online: true,
        last_activity_at: LessThan(timeoutThreshold),
      },
      {
        is_online: false,
      }
    );

    if (result.affected && result.affected > 0) {
      this.logger.log(`Marked ${result.affected} users as offline.`);
    }
  }
}
