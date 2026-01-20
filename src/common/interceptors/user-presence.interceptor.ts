import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../entities/user.entity";

@Injectable()
export class UserPresenceInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.id) {
      console.log(
        `[DEBUG] Updating presence for user ${user.id} (${user.email || "no email"})`
      );
      // Update user status asynchronously (don't block the request)
      this.userRepository
        .update(user.id, {
          is_online: true,
          last_activity_at: new Date(),
        })
        .then(() => {
          // console.log(`[DEBUG] Presence updated for user ${user.id}`);
        })
        .catch((err) =>
          console.error(
            `[ERROR] Failed to update presence for user ${user.id}:`,
            err
          )
        );
    } else {
      // console.log('[DEBUG] No user in request for presence tracking');
    }

    return next.handle();
  }
}
