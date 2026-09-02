export type AuthUser = {
  id: string;
  schoolId: string;
  displayName: string;
  login: string;
  role: "Admin" | "Student";
  mustChangePassword: boolean;
};

export type AuthSession = { accessToken: string; expiresIn: number; user: AuthUser };
export type StudentRecord = { id: string; fullName: string; login: string; isActive: boolean; lastLoginAt?: string | null; createdAt: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(typeof body.message === "string" ? body.message : "request_failed");
  }
  return response.json() as Promise<T>;
}

export const api = {
  login: (login: string, password: string) => request<AuthSession>("/auth/login", { method: "POST", body: JSON.stringify({ login, password }) }),
  me: (token: string) => request<AuthUser>("/auth/me", {}, token),
  changePassword: (token: string, currentPassword: string, newPassword: string) => request<{ changed: true }>("/auth/change-password", { method: "POST", body: JSON.stringify({ currentPassword, newPassword }) }, token),
  listStudents: (token: string) => request<{ items: StudentRecord[]; totalItems: number }>("/admin/students", {}, token),
  createStudent: (token: string, data: { fullName: string; login: string; password: string }) => request<StudentRecord>("/admin/students", { method: "POST", body: JSON.stringify(data) }, token),
};
