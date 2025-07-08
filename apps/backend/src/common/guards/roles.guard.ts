import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}

// import { Roles } from '@/common/decorators/roles.decorator';
// import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
// import { RolesGuard } from '@/common/guards/roles.guard';

// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('ADMIN')
// @Get('admin-only')
// getAdminData() {
//   return { secret: 'admin data' };
// }