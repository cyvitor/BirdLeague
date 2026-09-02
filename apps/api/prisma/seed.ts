import { PrismaClient, UserRole } from "@prisma/client";
import argon2 = require("argon2");

const prisma = new PrismaClient();
const achievementNames = [
  ["NEW_HATCHLING", "New Hatchling"], ["FIRST_LESSON", "First Lesson"], ["FIRST_THEME", "First Theme"],
  ["THEME_EXPLORER", "Theme Explorer"], ["BLOO_IS_LEARNING", "Bloo Is Learning"], ["SKILL_LEARNED", "Skill Learned"],
  ["GREETINGS_CLIMBER", "Greetings Climber"], ["GREETINGS_MASTER", "Greetings Master"], ["VOCABULARY_EXPLORER", "Vocabulary Explorer"],
];

async function seed() {
  const school = await prisma.school.upsert({ where: { slug: "bluebird" }, update: {}, create: { name: "Bluebird", slug: "bluebird" } });
  const language = await prisma.language.upsert({ where: { schoolId_code: { schoolId: school.id, code: "en" } }, update: {}, create: { schoolId: school.id, name: "English", code: "en" } });
  const adminCount = await prisma.user.count({ where: { schoolId: school.id, role: UserRole.Admin } });
  if (!adminCount) {
    const login = process.env.INITIAL_ADMIN_LOGIN?.trim() || "vh";
    const password = process.env.INITIAL_ADMIN_PASSWORD || "BirdLeague@2026";
    await prisma.user.create({ data: { schoolId: school.id, displayName: "Administrador", login, normalizedLogin: login.toLocaleLowerCase("pt-BR"), passwordHash: await argon2.hash(password, { type: argon2.argon2id }), role: UserRole.Admin, mustChangePassword: true } });
  }
  for (const code of ["VOCABULARY", "GRAMMAR", "READING"]) await prisma.skillCategory.upsert({ where: { languageId_code: { languageId: language.id, code } }, update: {}, create: { languageId: language.id, code, name: code[0] + code.slice(1).toLowerCase() } });
  for (const [code, name] of achievementNames) await prisma.achievement.upsert({ where: { languageId_code: { languageId: language.id, code } }, update: {}, create: { languageId: language.id, code, name, description: name, requirementType: code, requirementJson: { version: 1 } } });
  console.log(`Seed concluído: ${school.name}, ${language.name}, ${achievementNames.length} conquistas.`);
}

seed().finally(() => prisma.$disconnect());
