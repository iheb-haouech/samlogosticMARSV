// src/auth/role.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { USERROLES } from '../utils/enum';

@Injectable()
export class RoleGuard {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<number[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No authorization token provided');
    }

    try {
      const decodedToken = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const foundedUser = await this.prisma.user.findUnique({
        where: { id: decodedToken?.userId },
      });

      if (!foundedUser) {
        throw new UnauthorizedException('User not found');
      }

      if (foundedUser?.blocked) {
        throw new ForbiddenException('Account blocked');
      }

      // Check role if roles are specified
      if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole =
          foundedUser?.roleId === USERROLES.superadmin.id ||
          requiredRoles.some((role) => foundedUser?.roleId === role);

        if (!hasRequiredRole) {
          throw new ForbiddenException('Insufficient permissions');
        }
      }

      // Attach user to request for later use
      request.user = foundedUser;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}