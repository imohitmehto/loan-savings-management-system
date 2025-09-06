import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { ROLES_KEY } from "../decorators/roles.decorator";

/**
 * Guard that checks whether the authenticated user has one of the required roles.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles?.length) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user?.role) {
      throw new ForbiddenException("Access denied: role not found");
    }
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Access denied: requires one of [${requiredRoles.join(", ")}]`,
      );
    }
    return true;
  }
}
