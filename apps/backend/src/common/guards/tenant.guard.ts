import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '../../auth/constants';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Super Admin can access everything
    if (user.role === Role.SUPER_ADMIN) {
      return true;
    }

    // For other roles, ensure opdId matches if it's provided in the request
    const opdId = request.params.opdId || request.query.opdId || request.body.opdId;

    if (opdId && user.opdId !== opdId) {
      throw new ForbiddenException('Akses ditolak: Data lintas OPD tidak diizinkan');
    }

    return true;
  }
}
