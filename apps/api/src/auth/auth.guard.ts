import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../database/prisma.service";
import { AccessPayload, AuthUser } from "./auth.types";

type AuthRequest = { headers: { authorization?: string }; ip?: string; user?: AuthUser };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService, private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const [type, token] = (request.headers.authorization ?? "").split(" ");
    if (type !== "Bearer" || !token) throw new UnauthorizedException("invalid_credentials");
    try {
      const payload = await this.jwt.verifyAsync<AccessPayload>(token);
      const user = await this.prisma.user.findFirst({ where: { id: payload.sub, schoolId: payload.schoolId, isActive: true } });
      if (!user || (payload.authVersion ?? 0) !== user.authVersion) throw new UnauthorizedException("invalid_credentials");
      request.user = { id: user.id, schoolId: user.schoolId, displayName: user.displayName, login: user.login, role: user.role, mustChangePassword: user.mustChangePassword };
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException("invalid_credentials");
    }
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const user = context.switchToHttp().getRequest<AuthRequest>().user;
    if (!user || user.role !== "Admin") throw new ForbiddenException("admin_required");
    if (user.mustChangePassword) throw new ForbiddenException("password_change_required");
    return true;
  }
}

@Injectable()
export class StudentGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const user = context.switchToHttp().getRequest<AuthRequest>().user;
    if (!user || user.role !== "Student") throw new ForbiddenException("student_required");
    if (user.mustChangePassword) throw new ForbiddenException("password_change_required");
    return true;
  }
}

export type { AuthRequest };
