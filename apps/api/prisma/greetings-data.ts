import { Difficulty, QuestionType } from "@prisma/client";

export type GreetingsQuestionRow = { code: string; category: string; skill: string; difficulty: Difficulty; type: QuestionType; prompt: string; options: string[]; correct: number; explanation: string };

export function parseGreetingsQuestionRows(document: string): GreetingsQuestionRow[] {
  return document.split(/\r?\n/).filter(line => /^\| BL-EN-(0(?:6[1-9]|[7-9]\d)|100) \|/.test(line)).map(line => {
    const columns = line.split("|").slice(1, -1).map(value => value.trim());
    return { code: columns[0], category: columns[3].toUpperCase(), skill: columns[4] === "Basic Greetings" ? "BASIC_GREETINGS" : "GREETING_COMPREHENSION", difficulty: columns[5] as Difficulty, type: columns[6] as QuestionType, prompt: columns[7], options: columns.slice(8, 12), correct: columns[12].charCodeAt(0) - 65, explanation: columns[13] };
  });
}
