import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { randomUUID } from "node:crypto";

type Difficulty = "Easy" | "Medium" | "Hard" | "VeryHard";
type Session = { id: string; type: "FirstHatch"|"ThemeMission"; difficulty?: Difficulty; status: "InProgress"|"Completed"; answered: Map<string, boolean>; total: number; };

@Injectable()
export class DemoService {
  private bloo = { name: "Bloo", stage: "Egg" as "Egg"|"Hatchling", xp: 0 };
  private sessions = new Map<string, Session>();
  private completed = new Set<Difficulty>();

  login(login: string) { const role = login.toLowerCase() === "vh" ? "Admin" : "Student"; return { accessToken: `demo.${role.toLowerCase()}.token`, expiresIn: 600, user: { id: role === "Admin" ? "admin-vh" : "student-demo", displayName: role === "Admin" ? "Vitor" : "Lia", role, mustChangePassword: false } }; }
  home() { return { bloo: this.bloo, firstHatchAvailable: this.bloo.stage === "Egg", theme: this.bloo.stage === "Hatchling" ? { code: "GREETINGS", title: "Greetings", currentDifficulty: this.nextDifficulty() } : null, achievements: this.bloo.stage === "Hatchling" ? ["NEW_HATCHLING","FIRST_LESSON"] : [] }; }
  startFirst() { if (this.bloo.stage !== "Egg") throw new ConflictException("first_hatch_already_completed"); const existing = [...this.sessions.values()].find(s => s.type === "FirstHatch" && s.status === "InProgress"); if (existing) return existing; return this.create("FirstHatch", 6); }
  startTheme(difficulty: Difficulty) { if (this.bloo.stage !== "Hatchling") throw new ConflictException("bloo_not_hatched"); if (this.nextDifficulty() !== difficulty && !this.completed.has(difficulty)) throw new ConflictException("difficulty_locked"); return this.create("ThemeMission", 5, difficulty); }
  private create(type: Session["type"], total: number, difficulty?: Difficulty) { const session = { id: randomUUID(), type, difficulty, status: "InProgress" as const, answered: new Map<string, boolean>(), total }; this.sessions.set(session.id, session); return this.serialize(session); }
  answer(id: string, questionId: string, selected: number) { const session = this.get(id); if (session.status !== "InProgress") throw new ConflictException("session_completed"); if (session.answered.has(questionId)) return { questionId, isCorrect: session.answered.get(questionId), idempotentReplay: true, answered: session.answered.size }; const correct = selected === 0; session.answered.set(questionId, correct); return { questionId, isCorrect: correct, answered: session.answered.size, total: session.total }; }
  complete(id: string) { const session = this.get(id); if (session.status === "Completed") return { ...this.serialize(session), bloo: this.bloo, idempotentReplay: true }; if (session.answered.size !== session.total) throw new UnprocessableEntityException("session_incomplete"); const correct = [...session.answered.values()].filter(Boolean).length; session.status = "Completed"; let awardedXp = 0; if (session.type === "FirstHatch") { awardedXp = 60 + correct * 5; this.bloo.stage = "Hatchling"; } else if (session.difficulty && !this.completed.has(session.difficulty)) { awardedXp = 25 + correct * 5; this.completed.add(session.difficulty); } this.bloo.xp += awardedXp; return { ...this.serialize(session), correctAnswers: correct, awardedXp, bloo: this.bloo, nextDifficulty: this.nextDifficulty() }; }
  nameBloo(name?: string) { const value = (name ?? "Bloo").trim(); if (value !== "Bloo" && (!/^(?!\d+$)[\p{L}\d][\p{L}\d '\-]{1,19}$/u.test(value))) throw new UnprocessableEntityException("invalid_bloo_name"); this.bloo.name = value; return this.bloo; }
  progress() { return { theme: "GREETINGS", completedDifficulties: [...this.completed], currentDifficulty: this.nextDifficulty(), bloo: this.bloo }; }
  private nextDifficulty(): Difficulty|null { return (["Easy","Medium","Hard","VeryHard"] as Difficulty[]).find(d => !this.completed.has(d)) ?? null; }
  private get(id: string) { const session = this.sessions.get(id); if (!session) throw new NotFoundException("session_not_found"); return session; }
  private serialize(s: Session) { return { id: s.id, type: s.type, difficulty: s.difficulty, status: s.status, answered: s.answered.size, totalQuestions: s.total }; }
}
