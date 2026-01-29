import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SyncSecretGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const secret = request.headers["x-sync-secret"];
    const validSecret = this.configService.get<string>("SYNC_API_SECRET");

    if (secret && validSecret && secret === validSecret) {
      return true;
    }

    // If no secret or invalid, don't throw yet if we want to allow fallback to other guards,
    // but for now, we'll return false, meaning "access denied via this guard".
    // However, since we want to allow EITHER JWT OR Secret, usage will be tricky.
    // If we use this guard ALONE on an endpoint, it enforces the secret.
    return false;
  }
}
