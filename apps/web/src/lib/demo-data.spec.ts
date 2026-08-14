import { describe, expect, it } from "vitest";
import { firstHatchQuestions, greetingQuestions } from "./demo-data";

describe("conteúdo jogável do MVP", () => {
  it("mantém o FirstHatch com quatro perguntas Easy e duas Medium", () => {
    expect(firstHatchQuestions).toHaveLength(6);
    expect(firstHatchQuestions.filter(q => q.difficulty === "Easy")).toHaveLength(4);
    expect(firstHatchQuestions.filter(q => q.difficulty === "Medium")).toHaveLength(2);
  });

  it("oferece cinco perguntas em cada etapa demonstrável de Greetings", () => {
    expect(Object.values(greetingQuestions).map(questions => questions.length)).toEqual([5, 5, 5, 5]);
    for (const questions of Object.values(greetingQuestions)) {
      for (const question of questions) expect(question.options[question.correct]).toBeTruthy();
    }
  });
});
