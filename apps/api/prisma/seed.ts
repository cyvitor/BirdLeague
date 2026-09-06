import { Difficulty, EditorialStatus, PrismaClient, ThemeStatus, UserRole } from "@prisma/client";
import argon2 = require("argon2");
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseGreetingsQuestionRows } from "./greetings-data";
import { seedFirstHatch } from "./first-hatch-seed";
import { dailyRoutinesQuestions, presentContinuousQuestions, ThemeQuestionSeed } from "./additional-themes-data";

const prisma = new PrismaClient();
const achievementNames = [
  ["NEW_HATCHLING", "New Hatchling"], ["FIRST_LESSON", "First Lesson"], ["FIRST_THEME", "First Theme"],
  ["THEME_EXPLORER", "Theme Explorer"], ["BLOO_IS_LEARNING", "Bloo Is Learning"], ["SKILL_LEARNED", "Skill Learned"],
  ["GREETINGS_CLIMBER", "Greetings Climber"], ["GREETINGS_MASTER", "Greetings Master"], ["VOCABULARY_EXPLORER", "Vocabulary Explorer"],
  ["ROUTINE_STARTER", "Routine Starter"], ["HABIT_BUILDER", "Habit Builder"], ["ROUTINE_MASTER", "Routine Master"], ["CONSISTENCY_EXPERT", "Consistency Expert"],
  ["ACTION_SPOTTER", "Action Spotter"], ["ING_CLIMBER", "-ing Climber"], ["ACTION_MASTER", "Action Master"], ["NOW_EXPERT", "Now Expert"],
];

const achievementRules: Record<string, { description: string; requirementType: string; requirementJson: object }> = {
  NEW_HATCHLING: { description: "Seu Bloo nasceu e a jornada de vocês começou.", requirementType: "BlooHatched", requirementJson: { version: 1 } },
  FIRST_LESSON: { description: "Você concluiu o primeiro treino do seu Bloo.", requirementType: "FirstTrainingCompleted", requirementJson: { version: 1 } },
  FIRST_THEME: { description: "Você começou sua primeira missão de aprendizado.", requirementType: "ThemeStarted", requirementJson: { version: 1, themeCode: "GREETINGS" } },
  THEME_EXPLORER: { description: "Você concluiu a primeira etapa de um tema.", requirementType: "ThemeDifficultyCompleted", requirementJson: { version: 1, difficulty: "Easy" } },
  BLOO_IS_LEARNING: { description: "Vocês praticaram a mesma habilidade em mais de um treino.", requirementType: "SkillPracticed", requirementJson: { version: 1, minimumAttempts: 5, minimumSessions: 2 } },
  SKILL_LEARNED: { description: "Seu Bloo demonstrou domínio em uma habilidade.", requirementType: "SkillMastered", requirementJson: { version: 1, minimumAttempts: 5, minimumSessions: 2, minimumAccuracy: 0.8 } },
  GREETINGS_CLIMBER: { description: "Você avançou de Easy até Hard em Greetings.", requirementType: "ThemeDifficultyCompleted", requirementJson: { version: 1, themeCode: "GREETINGS", requiredDifficulties: ["Easy", "Medium", "Hard"] } },
  GREETINGS_MASTER: { description: "Você concluiu todos os desafios de Greetings.", requirementType: "ThemeMastered", requirementJson: { version: 1, themeCode: "GREETINGS", requiredDifficulties: ["Easy", "Medium", "Hard", "VeryHard"], minimumAdvancedAccuracy: 0.8 } },
  VOCABULARY_EXPLORER: { description: "Seu Bloo dominou seus primeiros cumprimentos.", requirementType: "CategoryMastered", requirementJson: { version: 1, themeCode: "GREETINGS", skillCode: "BASIC_GREETINGS", minimumAccuracy: 0.8 } },
  ROUTINE_STARTER: { description: "Você concluiu os primeiros passos de uma rotina em inglês.", requirementType: "ThemeDifficultyCompleted", requirementJson: { version: 1, themeCode: "DAILY_ROUTINES", requiredDifficulties: ["Easy"] } },
  HABIT_BUILDER: { description: "Você avançou de Easy até Hard em Daily Routines.", requirementType: "ThemeDifficultyCompleted", requirementJson: { version: 1, themeCode: "DAILY_ROUTINES", requiredDifficulties: ["Easy", "Medium", "Hard"] } },
  ROUTINE_MASTER: { description: "Você concluiu todos os desafios de Daily Routines.", requirementType: "ThemeMastered", requirementJson: { version: 1, themeCode: "DAILY_ROUTINES", requiredDifficulties: ["Easy", "Medium", "Hard", "VeryHard"], minimumAdvancedAccuracy: 0.8 } },
  CONSISTENCY_EXPERT: { description: "Seu Bloo dominou formas, frequência e compreensão de rotinas.", requirementType: "ThemeSkillsMastered", requirementJson: { version: 1, themeCode: "DAILY_ROUTINES", skillCodes: ["SIMPLE_PRESENT_FORM", "ROUTINE_COMPREHENSION", "FREQUENCY_EXPRESSIONS"] } },
  ACTION_SPOTTER: { description: "Você reconheceu suas primeiras ações acontecendo agora.", requirementType: "ThemeDifficultyCompleted", requirementJson: { version: 1, themeCode: "PRESENT_CONTINUOUS", requiredDifficulties: ["Easy"] } },
  ING_CLIMBER: { description: "Você avançou de Easy até Hard em What’s Happening Now?.", requirementType: "ThemeDifficultyCompleted", requirementJson: { version: 1, themeCode: "PRESENT_CONTINUOUS", requiredDifficulties: ["Easy", "Medium", "Hard"] } },
  ACTION_MASTER: { description: "Você concluiu todos os desafios de What’s Happening Now?.", requirementType: "ThemeMastered", requirementJson: { version: 1, themeCode: "PRESENT_CONTINUOUS", requiredDifficulties: ["Easy", "Medium", "Hard", "VeryHard"], minimumAdvancedAccuracy: 0.8 } },
  NOW_EXPERT: { description: "Seu Bloo dominou forma, contexto e contraste das ações em progresso.", requirementType: "ThemeSkillsMastered", requirementJson: { version: 1, themeCode: "PRESENT_CONTINUOUS", skillCodes: ["PRESENT_CONTINUOUS_FORM", "ACTION_IN_PROGRESS", "SIMPLE_PRESENT_VS_CONTINUOUS"] } },
};

type AdditionalTheme = {
  code: string; title: string; description: string;
  skills: { code: string; name: string; category: string; primary?: boolean }[];
  questions: ThemeQuestionSeed[];
};

const additionalThemes: AdditionalTheme[] = [
  {
    code: "DAILY_ROUTINES", title: "Daily Routines", description: "Rotinas, hábitos, horários e frequência usando o Simple Present.",
    skills: [
      { code: "SIMPLE_PRESENT_FORM", name: "Simple Present Form", category: "GRAMMAR", primary: true },
      { code: "ROUTINE_COMPREHENSION", name: "Routine Comprehension", category: "READING" },
      { code: "FREQUENCY_EXPRESSIONS", name: "Frequency Expressions", category: "GRAMMAR" },
    ], questions: dailyRoutinesQuestions,
  },
  {
    code: "PRESENT_CONTINUOUS", title: "What’s Happening Now?", description: "Ações em andamento, situações temporárias e planos usando o Present Continuous.",
    skills: [
      { code: "PRESENT_CONTINUOUS_FORM", name: "Present Continuous Form", category: "GRAMMAR", primary: true },
      { code: "ACTION_IN_PROGRESS", name: "Actions in Progress", category: "READING" },
      { code: "SIMPLE_PRESENT_VS_CONTINUOUS", name: "Simple Present vs. Present Continuous", category: "GRAMMAR" },
    ], questions: presentContinuousQuestions,
  },
];

async function seedAdditionalTheme(themeData: AdditionalTheme, schoolId: string, languageId: string, adminId: string, categories: Map<string, string>) {
  if (themeData.questions.length !== 40) throw new Error(`${themeData.title}: esperadas 40 perguntas.`);
  const skillIds = new Map<string, string>();
  for (const definition of themeData.skills) {
    const skill = await prisma.skill.upsert({
      where: { languageId_code: { languageId, code: definition.code } },
      update: { name: definition.name, skillCategoryId: categories.get(definition.category)! },
      create: { languageId, code: definition.code, name: definition.name, skillCategoryId: categories.get(definition.category)! },
    });
    skillIds.set(definition.code, skill.id);
  }
  const theme = await prisma.theme.upsert({ where: { schoolId_code: { schoolId, code: themeData.code } }, update: {}, create: { schoolId, languageId, code: themeData.code, status: ThemeStatus.Active, createdByUserId: adminId } });
  const version = await prisma.themeVersion.upsert({ where: { themeId_versionNumber: { themeId: theme.id, versionNumber: 1 } }, update: {}, create: { themeId: theme.id, versionNumber: 1, title: themeData.title, description: themeData.description, status: EditorialStatus.Published, createdByUserId: adminId, publishedAt: new Date() } });
  if (!theme.currentPublishedVersionId) await prisma.theme.update({ where: { id: theme.id }, data: { currentPublishedVersionId: version.id } });
  for (const [order, difficulty] of ([Difficulty.Easy, Difficulty.Medium, Difficulty.Hard, Difficulty.VeryHard] as Difficulty[]).entries()) {
    await prisma.themeDifficulty.upsert({ where: { themeVersionId_difficulty: { themeVersionId: version.id, difficulty } }, update: { order: order + 1, isEnabled: true, questionsPerSession: 5 }, create: { themeVersionId: version.id, difficulty, order: order + 1, isEnabled: true, questionsPerSession: 5 } });
  }
  for (const definition of themeData.skills) {
    const skillId = skillIds.get(definition.code)!;
    await prisma.themeSkill.upsert({ where: { themeVersionId_skillId: { themeVersionId: version.id, skillId } }, update: { isPrimary: Boolean(definition.primary) }, create: { themeVersionId: version.id, skillId, isPrimary: Boolean(definition.primary) } });
  }
  for (const [order, row] of themeData.questions.entries()) {
    const skill = themeData.skills.find(item => item.code === row.skill);
    if (!skill) throw new Error(`${themeData.title}: habilidade desconhecida em ${row.code}.`);
    const question = await prisma.question.upsert({ where: { schoolId_code: { schoolId, code: row.code } }, update: {}, create: { schoolId, languageId, code: row.code, createdByUserId: adminId } });
    const questionVersion = await prisma.questionVersion.upsert({ where: { questionId_versionNumber: { questionId: question.id, versionNumber: 1 } }, update: {}, create: { questionId: question.id, versionNumber: 1, skillCategoryId: categories.get(skill.category)!, skillId: skillIds.get(row.skill)!, type: row.type, difficulty: row.difficulty, prompt: row.prompt, explanation: row.explanation, status: EditorialStatus.Published, publishedAt: new Date(), createdByUserId: adminId } });
    for (const [optionOrder, text] of row.options.entries()) await prisma.questionOption.upsert({ where: { questionVersionId_order: { questionVersionId: questionVersion.id, order: optionOrder } }, update: {}, create: { questionVersionId: questionVersion.id, text, isCorrect: optionOrder === row.correct, order: optionOrder } });
    await prisma.themeQuestion.upsert({ where: { themeVersionId_questionVersionId: { themeVersionId: version.id, questionVersionId: questionVersion.id } }, update: { order: order + 1 }, create: { themeVersionId: version.id, questionVersionId: questionVersion.id, order: order + 1 } });
  }
}

async function seed() {
  const school = await prisma.school.upsert({ where: { slug: "bluebird" }, update: {}, create: { name: "Bluebird", slug: "bluebird" } });
  const language = await prisma.language.upsert({ where: { schoolId_code: { schoolId: school.id, code: "en" } }, update: {}, create: { schoolId: school.id, name: "English", code: "en" } });
  const adminCount = await prisma.user.count({ where: { schoolId: school.id, role: UserRole.Admin } });
  if (!adminCount) {
    const login = process.env.INITIAL_ADMIN_LOGIN?.trim() || "vh";
    const password = process.env.INITIAL_ADMIN_PASSWORD || "BirdLeague@2026";
    await prisma.user.create({ data: { schoolId: school.id, displayName: "Administrador", login, normalizedLogin: login.toLocaleLowerCase("pt-BR"), passwordHash: await argon2.hash(password, { type: argon2.argon2id }), role: UserRole.Admin, mustChangePassword: true } });
  }
  const admin = await prisma.user.findFirstOrThrow({ where: { schoolId: school.id, role: UserRole.Admin }, orderBy: { createdAt: "asc" } });
  const categories = new Map<string, string>();
  for (const code of ["VOCABULARY", "GRAMMAR", "READING"]) {
    const category = await prisma.skillCategory.upsert({ where: { languageId_code: { languageId: language.id, code } }, update: {}, create: { languageId: language.id, code, name: code[0] + code.slice(1).toLowerCase() } });
    categories.set(code, category.id);
  }
  const skills = new Map<string, string>();
  for (const definition of [{ code: "BASIC_GREETINGS", name: "Basic Greetings", category: "VOCABULARY" }, { code: "GREETING_COMPREHENSION", name: "Greeting Comprehension", category: "READING" }]) {
    const skill = await prisma.skill.upsert({ where: { languageId_code: { languageId: language.id, code: definition.code } }, update: { name: definition.name, skillCategoryId: categories.get(definition.category)! }, create: { languageId: language.id, code: definition.code, name: definition.name, skillCategoryId: categories.get(definition.category)! } });
    skills.set(definition.code, skill.id);
  }
  for (const [code, name] of achievementNames) {
    const rule = achievementRules[code];
    await prisma.achievement.upsert({ where: { languageId_code: { languageId: language.id, code } }, update: { name, ...rule }, create: { languageId: language.id, code, name, ...rule } });
  }
  const theme = await prisma.theme.upsert({ where: { schoolId_code: { schoolId: school.id, code: "GREETINGS" } }, update: {}, create: { schoolId: school.id, languageId: language.id, code: "GREETINGS", status: ThemeStatus.Active, createdByUserId: admin.id } });
  const version = await prisma.themeVersion.upsert({ where: { themeId_versionNumber: { themeId: theme.id, versionNumber: 1 } }, update: {}, create: { themeId: theme.id, versionNumber: 1, title: "Greetings", description: "Cumprimentos, apresentações e despedidas em diferentes situações.", status: EditorialStatus.Published, createdByUserId: admin.id, publishedAt: new Date() } });
  if(!theme.currentPublishedVersionId) await prisma.theme.update({ where: { id: theme.id }, data: { currentPublishedVersionId: version.id } });
  for (const [order, difficulty] of ([Difficulty.Easy, Difficulty.Medium, Difficulty.Hard, Difficulty.VeryHard] as Difficulty[]).entries()) await prisma.themeDifficulty.upsert({ where: { themeVersionId_difficulty: { themeVersionId: version.id, difficulty } }, update: { order: order + 1, isEnabled: true, questionsPerSession: 5 }, create: { themeVersionId: version.id, difficulty, order: order + 1, isEnabled: true, questionsPerSession: 5 } });
  for (const skillId of skills.values()) await prisma.themeSkill.upsert({ where: { themeVersionId_skillId: { themeVersionId: version.id, skillId } }, update: {}, create: { themeVersionId: version.id, skillId, isPrimary: skillId === skills.get("BASIC_GREETINGS") } });
  const rows = parseGreetingsQuestionRows(readFileSync(resolve(process.cwd(), "../../docs/BANCO_DE_PERGUNTAS_INICIAL.md"), "utf8"));
  if (rows.length !== 40) throw new Error(`Esperadas 40 perguntas de Greetings, encontradas ${rows.length}.`);
  for (const [order, row] of rows.entries()) {
    const question = await prisma.question.upsert({ where: { schoolId_code: { schoolId: school.id, code: row.code } }, update: { isActive: true }, create: { schoolId: school.id, languageId: language.id, code: row.code, createdByUserId: admin.id } });
    const questionVersion = await prisma.questionVersion.upsert({ where: { questionId_versionNumber: { questionId: question.id, versionNumber: 1 } }, update: {}, create: { questionId: question.id, versionNumber: 1, skillCategoryId: categories.get(row.category)!, skillId: skills.get(row.skill)!, type: row.type, difficulty: row.difficulty, prompt: row.prompt, explanation: row.explanation, status: EditorialStatus.Published, publishedAt: new Date(), createdByUserId: admin.id } });
    for (const [optionOrder, text] of row.options.entries()) await prisma.questionOption.upsert({ where: { questionVersionId_order: { questionVersionId: questionVersion.id, order: optionOrder } }, update: {}, create: { questionVersionId: questionVersion.id, text, isCorrect: optionOrder === row.correct, order: optionOrder } });
    await prisma.themeQuestion.upsert({ where: { themeVersionId_questionVersionId: { themeVersionId: version.id, questionVersionId: questionVersion.id } }, update: { order: order + 1 }, create: { themeVersionId: version.id, questionVersionId: questionVersion.id, order: order + 1 } });
  }
  for (const themeData of additionalThemes) await seedAdditionalTheme(themeData, school.id, language.id, admin.id, categories);
  await seedFirstHatch(prisma,school.id,language.id,admin.id);
  console.log(`Seed concluído: ${school.name}, ${language.name}, banco com 180 perguntas, 3 temas de 40 perguntas, FirstHatch com 24 e ${achievementNames.length} conquistas.`);
}

seed().finally(() => prisma.$disconnect());
