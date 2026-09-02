import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@prisma/client";
import argon2 = require("argon2");
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PrismaService } from "../database/prisma.service";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;
  let prisma: { user: Record<string, ReturnType<typeof vi.fn>>; refreshToken: Record<string, ReturnType<typeof vi.fn>>; auditLog: Record<string, ReturnType<typeof vi.fn>>; $transaction: ReturnType<typeof vi.fn> };
  const user = { id: "admin-id", schoolId: "school-id", displayName: "Administrador", login: "vh", normalizedLogin: "vh", passwordHash: "", role: UserRole.Admin, mustChangePassword: true, isActive: true };

  beforeEach(async () => {
    user.passwordHash = await argon2.hash("BirdLeague@2026", { type: argon2.argon2id });
    prisma = {
      user: { findFirst: vi.fn().mockResolvedValue(user), findUnique: vi.fn().mockResolvedValue(user), findMany: vi.fn().mockResolvedValue([user]), update: vi.fn().mockResolvedValue(user), create: vi.fn().mockImplementation(async ({ data }) => ({ id: "new-admin-id", ...data, isActive: true, lastLoginAt: null, createdAt: new Date() })) },
      refreshToken: { updateMany: vi.fn().mockResolvedValue({ count: 0 }) },
      auditLog: { create: vi.fn().mockResolvedValue({ id: "audit-id" }) },
      $transaction: vi.fn(async (value: unknown) => typeof value === "function" ? value(prisma) : Array.isArray(value) ? Promise.all(value) : value),
    };
    const jwt = { signAsync: vi.fn().mockResolvedValue("signed-token") } as unknown as JwtService;
    service = new AuthService(prisma as unknown as PrismaService, jwt);
  });

  it("rejeita senha incorreta sem autenticar por login", async () => {
    await expect(service.login("vh", "senha-incorreta", "127.0.0.1")).rejects.toThrow("invalid_credentials");
  });

  it("autentica apenas com o hash correto e informa a troca obrigatória", async () => {
    const result = await service.login("VH", "BirdLeague@2026", "127.0.0.1");
    expect(result.accessToken).toBe("signed-token");
    expect(result.user).toMatchObject({ login: "vh", role: "Admin", mustChangePassword: true });
  });

  it("rejeita nova senha comum", async () => {
    await expect(service.changePassword({ id: user.id, schoolId: user.schoolId, displayName: user.displayName, login: user.login, role: user.role, mustChangePassword: true }, "BirdLeague@2026", "12345678")).rejects.toThrow("weak_password");
  });

  it("cria administrador com troca obrigatória e registra auditoria", async () => {
    prisma.user.findFirst.mockResolvedValueOnce(null);
    const created = await service.createAdmin({ id: user.id, schoolId: user.schoolId, displayName: user.displayName, login: user.login, role: user.role, mustChangePassword: false }, "Coordenadora", "coord.pedagogica", "SenhaProvisoria@2026");
    expect(created).toMatchObject({ login: "coord.pedagogica", mustChangePassword: true });
    expect(prisma.user.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ role: "Admin", mustChangePassword: true }) }));
    expect(prisma.auditLog.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ action: "admin.created", actorUserId: user.id }) }));
  });
});
