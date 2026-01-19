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
      // Update user status asynchronously (don't block the request)
      this.userRepository
        .update(user.id, {
          is_online: true,
          last_activity_at: new Date(),
        })
        .catch((err) =>
          console.error(`Failed to update presence for user ${user.id}:`, err)
        );
    }

    return next.handle();
  }
}
