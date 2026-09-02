import { ConflictException, Injectable, OnModuleInit, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@prisma/client";
import argon2 from "argon2";
import { PrismaService } from "../database/prisma.service";
import { AuthUser } from "./auth.types";

const COMMON_PASSWORDS = new Set(["123456", "12345678", "password", "senha123", "qwerty123"]);

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly failures = new Map<string, { count: number; firstAt: number }>();
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async onModuleInit() { await this.ensureInitialAdmin(); }

  private normalize(login: string) { return login.trim().toLocaleLowerCase("pt-BR"); }

  private async ensureInitialAdmin() {
    const school = await this.prisma.school.upsert({ where: { slug: "bluebird" }, update: {}, create: { name: "Bluebird", slug: "bluebird" } });
    const exists = await this.prisma.user.count({ where: { schoolId: school.id, role: UserRole.Admin } });
    if (exists) return;
    const login = process.env.INITIAL_ADMIN_LOGIN?.trim() || "vh";
    const password = process.env.INITIAL_ADMIN_PASSWORD || "BirdLeague@2026";
    await this.prisma.user.create({ data: { schoolId: school.id, displayName: "Administrador", login, normalizedLogin: this.normalize(login), passwordHash: await argon2.hash(password, { type: argon2.argon2id }), role: UserRole.Admin, mustChangePassword: true } });
  }

  private publicUser(user: AuthUser) { return user; }

  async login(loginInput: string, password: string, ip: string) {
    const normalizedLogin = this.normalize(loginInput);
    const failureKey = `${ip}:${normalizedLogin}`;
    const now = Date.now();
    const failure = this.failures.get(failureKey);
    if (failure && now - failure.firstAt < 15 * 60_000 && failure.count >= 5) throw new UnauthorizedException("invalid_credentials");
    if (failure && now - failure.firstAt >= 15 * 60_000) this.failures.delete(failureKey);

    const user = await this.prisma.user.findFirst({ where: { normalizedLogin, isActive: true } });
    const valid = user ? await argon2.verify(user.passwordHash, password) : false;
    if (!user || !valid) {
      const current = this.failures.get(failureKey);
      this.failures.set(failureKey, current ? { ...current, count: current.count + 1 } : { count: 1, firstAt: now });
      throw new UnauthorizedException("invalid_credentials");
    }
    this.failures.delete(failureKey);
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const authUser = this.publicUser({ id: user.id, schoolId: user.schoolId, displayName: user.displayName, login: user.login, role: user.role, mustChangePassword: user.mustChangePassword });
    return { accessToken: await this.jwt.signAsync({ sub: user.id, schoolId: user.schoolId, role: user.role }), expiresIn: 600, user: authUser };
  }

  async changePassword(user: AuthUser, currentPassword: string, newPassword: string) {
    const record = await this.prisma.user.findUnique({ where: { id: user.id } });
    if (!record || !(await argon2.verify(record.passwordHash, currentPassword))) throw new UnauthorizedException("invalid_credentials");
    this.validatePassword(newPassword, record.login, record.role === UserRole.Admin ? 12 : 8);
    if (await argon2.verify(record.passwordHash, newPassword)) throw new UnprocessableEntityException("password_must_be_different");
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: user.id }, data: { passwordHash: await argon2.hash(newPassword, { type: argon2.argon2id }), mustChangePassword: false } }),
      this.prisma.refreshToken.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date(), revocationReason: "password_changed" } }),
    ]);
    return { changed: true };
  }

  async createStudent(admin: AuthUser, fullNameInput: string, loginInput: string, password: string) {
    const fullName = fullNameInput.trim();
    const login = loginInput.trim();
    const normalizedLogin = this.normalize(login);
    this.validatePassword(password, login, 8);
    if (!/^[a-zA-Z0-9._-]{3,80}$/.test(login)) throw new UnprocessableEntityException("invalid_login");
    const duplicate = await this.prisma.user.findFirst({ where: { schoolId: admin.schoolId, normalizedLogin } });
    if (duplicate) throw new ConflictException("login_already_exists");
    return this.prisma.$transaction(async tx => {
      const user = await tx.user.create({ data: { schoolId: admin.schoolId, displayName: fullName, login, normalizedLogin, passwordHash: await argon2.hash(password, { type: argon2.argon2id }), role: UserRole.Student, mustChangePassword: false } });
      await tx.studentProfile.create({ data: { userId: user.id, schoolId: admin.schoolId, fullName } });
      return { id: user.id, fullName, login: user.login, isActive: user.isActive, createdAt: user.createdAt };
    });
  }

  async listStudents(admin: AuthUser) {
    const users = await this.prisma.user.findMany({ where: { schoolId: admin.schoolId, role: UserRole.Student }, orderBy: { createdAt: "desc" } });
    return { items: users.map(user => ({ id: user.id, fullName: user.displayName, login: user.login, isActive: user.isActive, lastLoginAt: user.lastLoginAt, createdAt: user.createdAt })), page: 1, pageSize: users.length, totalItems: users.length, totalPages: users.length ? 1 : 0 };
  }

  private validatePassword(password: string, login: string, min: number) {
    const lowered = password.toLocaleLowerCase("pt-BR");
    if (password.length < min || password.length > 128 || lowered === this.normalize(login) || COMMON_PASSWORDS.has(lowered)) throw new UnprocessableEntityException("weak_password");
  }
}
