import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      console.log("RolesGuard: No user found in request");
      return false;
    }

    const hasRole = requiredRoles.some((role) => user.role?.includes(role));

    if (!hasRole) {
      throw new ForbiddenException({
        error: "Accès refusé",
        message:
          "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.",
        required_roles: requiredRoles,
        your_role: user.role,
      });
    }

    return true;
  }
}
