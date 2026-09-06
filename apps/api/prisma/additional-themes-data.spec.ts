import { describe, expect, it } from "vitest";
import { dailyRoutinesQuestions, presentContinuousQuestions } from "./additional-themes-data";

describe("additional theme content", () => {
  for (const [name, questions] of [["Daily Routines", dailyRoutinesQuestions], ["Present Continuous", presentContinuousQuestions]] as const) {
    it(`${name} has a valid 40-question distribution`, () => {
      expect(questions).toHaveLength(40);
      expect(new Set(questions.map(question => question.code)).size).toBe(40);
      for (const difficulty of ["Easy", "Medium", "Hard", "VeryHard"]) expect(questions.filter(question => question.difficulty === difficulty)).toHaveLength(10);
      for (const question of questions) {
        expect(question.options).toHaveLength(4);
        expect(question.correct).toBeGreaterThanOrEqual(0);
        expect(question.correct).toBeLessThan(4);
        expect(question.prompt.trim().length).toBeGreaterThan(5);
        expect(question.explanation.trim().length).toBeGreaterThan(10);
      }
      expect([0, 1, 2, 3].map(position => questions.filter(question => question.correct === position).length)).toEqual([10, 10, 10, 10]);
    });
  }
});
