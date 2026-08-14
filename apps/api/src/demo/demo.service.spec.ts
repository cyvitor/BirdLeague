import { describe, expect, it } from "vitest";
import { DemoService } from "./demo.service";

describe("MVP training rules", () => {
  it("hatches after six answers even when all are wrong", () => {
    const service = new DemoService(); const session = service.startFirst();
    for (let i=0;i<6;i++) service.answer(session.id, `q-${i}`, 1);
    const result = service.complete(session.id);
    expect(result.bloo.stage).toBe("Hatchling"); expect(result.awardedXp).toBe(60);
  });
  it("does not duplicate XP when completion is retried", () => {
    const service = new DemoService(); const session = service.startFirst();
    for (let i=0;i<6;i++) service.answer(session.id, `q-${i}`, 0);
    service.complete(session.id); const replay = service.complete(session.id);
    expect(replay.bloo.xp).toBe(90); expect(replay.idempotentReplay).toBe(true);
  });
});
