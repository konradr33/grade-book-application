import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UserType } from '../../models/user-type';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (requiredRoles && !requiredRoles.some((role) => user.role === role)) {
      throw new UnauthorizedException(`User has not a ${requiredRoles} role`);
    }
    return user;
  }
}
