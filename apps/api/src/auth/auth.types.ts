import { UserRole } from "@prisma/client";

export type AuthUser = {
  id: string;
  schoolId: string;
  displayName: string;
  login: string;
  role: UserRole;
  mustChangePassword: boolean;
};

export type AccessPayload = {
  authVersion?: number;
  sub: string;
  schoolId: string;
  role: UserRole;
};
