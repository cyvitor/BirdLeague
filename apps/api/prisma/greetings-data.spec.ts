import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseGreetingsQuestionRows } from "./greetings-data";

describe("banco pedagógico de Greetings", () => {
  const rows = parseGreetingsQuestionRows(readFileSync(resolve(process.cwd(), "../../docs/BANCO_DE_PERGUNTAS_INICIAL.md"), "utf8"));

  it("publica 40 questões, dez por dificuldade", () => {
    expect(rows).toHaveLength(40);
    expect(["Easy", "Medium", "Hard", "VeryHard"].map(difficulty => rows.filter(row => row.difficulty === difficulty).length)).toEqual([10, 10, 10, 10]);
  });

  it("mantém quatro alternativas e uma resposta válida em cada questão", () => {
    for (const row of rows) {
      expect(row.options).toHaveLength(4);
      expect(row.correct).toBeGreaterThanOrEqual(0);
      expect(row.correct).toBeLessThan(4);
      expect(row.options[row.correct]).toBeTruthy();
    }
  });
});
