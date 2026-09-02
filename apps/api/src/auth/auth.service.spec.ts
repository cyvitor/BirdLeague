import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@prisma/client";
import argon2 = require("argon2");
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PrismaService } from "../database/prisma.service";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;
  let prisma: Record<string, unknown>;
  const user = { id: "admin-id", schoolId: "school-id", displayName: "Administrador", login: "vh", normalizedLogin: "vh", passwordHash: "", role: UserRole.Admin, mustChangePassword: true, isActive: true };

  beforeEach(async () => {
    user.passwordHash = await argon2.hash("BirdLeague@2026", { type: argon2.argon2id });
    prisma = {
      user: { findFirst: vi.fn().mockResolvedValue(user), findUnique: vi.fn().mockResolvedValue(user), update: vi.fn().mockResolvedValue(user) },
      refreshToken: { updateMany: vi.fn().mockResolvedValue({ count: 0 }) },
      $transaction: vi.fn(async (value: unknown) => Array.isArray(value) ? Promise.all(value) : value),
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
});
