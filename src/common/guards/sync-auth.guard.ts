import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SyncAuthGuard extends AuthGuard("jwt") {
  constructor(private configService: ConfigService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const secret = request.headers["x-sync-secret"];
    const validSecret = this.configService.get<string>("SYNC_API_SECRET");

    // 1. Check for Sync Secret (High priority for external app)
    if (secret && validSecret && secret === validSecret) {
      // If secret is valid, we allow access.
      // We might want to set a flag or mock user if the controller expects req.user
      // The controller logic for external sync sends 'userId' in body usually,
      // but let's see how the controller uses req.user.
      return true;
    }

    // 2. Fallback to Standard JWT Auth
    try {
      const result = (await super.canActivate(context)) as boolean;
      return result;
    } catch (e) {
      // If secret was invalid/missing AND JWT failed, deny access
      throw new UnauthorizedException();
    }
  }

  handleRequest(err, user, info) {
    // You can customize this if needed, but default behavior should be fine
    // if super.canActivate returns true/false correctly.
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
