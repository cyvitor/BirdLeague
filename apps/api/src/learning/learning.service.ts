import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { BlooStage, Difficulty, DifficultyStatus, MasteryStatus, ProgressStatus, TrainingStatus, TrainingType } from "@prisma/client";
import { AuthUser } from "../auth/auth.types";
import { PrismaService } from "../database/prisma.service";

const LEVELS = [Difficulty.Easy, Difficulty.Medium, Difficulty.Hard, Difficulty.VeryHard] as const;
type SubmittedAnswer = { questionId: string; selectedOptionId: string };

@Injectable()
export class LearningService {
  constructor(private readonly prisma: PrismaService) {}

  private async context(user: AuthUser) {
    const student = await this.prisma.studentProfile.findUnique({ where: { userId: user.id } });
    if (!student) throw new NotFoundException("student_profile_not_found");
    const language = await this.prisma.language.findFirst({ where: { schoolId: user.schoolId, code: "en", isActive: true } });
    const theme = await this.prisma.theme.findFirst({ where: { schoolId: user.schoolId, code: "GREETINGS", status: "Active" } });
    if (!language || !theme?.currentPublishedVersionId) throw new NotFoundException("greetings_not_published");
    const bloo = await this.prisma.bloo.upsert({
      where: { studentProfileId_languageId: { studentProfileId: student.id, languageId: language.id } },
      update: {},
      create: { schoolId: user.schoolId, studentProfileId: student.id, languageId: language.id },
    });
    const progress = await this.prisma.studentThemeProgress.upsert({
      where: { studentProfileId_blooId_themeId: { studentProfileId: student.id, blooId: bloo.id, themeId: theme.id } },
      update: {},
      create: { schoolId: user.schoolId, studentProfileId: student.id, blooId: bloo.id, themeId: theme.id },
    });
    await Promise.all(LEVELS.map((difficulty, index) => this.prisma.studentThemeDifficultyProgress.upsert({
      where: { studentThemeProgressId_difficulty: { studentThemeProgressId: progress.id, difficulty } },
      update: {},
      create: { studentThemeProgressId: progress.id, difficulty, status: index === 0 ? DifficultyStatus.Available : DifficultyStatus.Locked },
    })));
    return { student, language, theme, bloo, progress, themeVersionId: theme.currentPublishedVersionId };
  }

  async getGreetings(user: AuthUser) {
    const ctx = await this.context(user);
    const version = await this.prisma.themeVersion.findUniqueOrThrow({ where: { id: ctx.themeVersionId } });
    const [levels, unlocked, masteries] = await Promise.all([
      this.prisma.studentThemeDifficultyProgress.findMany({ where: { studentThemeProgressId: ctx.progress.id } }),
      this.prisma.studentAchievement.findMany({ where: { studentProfileId: ctx.student.id, blooId: ctx.bloo.id } }),
      this.prisma.skillMastery.findMany({ where: { studentProfileId: ctx.student.id, languageId: ctx.language.id } }),
    ]);
    const achievements = unlocked.length ? await this.prisma.achievement.findMany({ where: { id: { in: unlocked.map(item => item.achievementId) } } }) : [];
    const skills = masteries.length ? await this.prisma.skill.findMany({ where: { id: { in: masteries.map(item => item.skillId) } } }) : [];
    return {
      code: ctx.theme.code, title: version.title, description: version.description,
      bloo: { name: ctx.bloo.name, stage: ctx.bloo.stage, xp: ctx.bloo.xp },
      status: ctx.progress.status, currentDifficulty: ctx.progress.currentDifficulty,
      levels: LEVELS.map(difficulty => {
        const level = levels.find(item => item.difficulty === difficulty)!;
        return { difficulty, status: level.status, sessionsCompleted: level.sessionsCompleted, bestCorrectAnswers: level.bestCorrectAnswers, bestAccuracy: Number(level.bestAccuracy) };
      }),
      achievements: achievements.map(item => item.code),
      skills: masteries.map(item => ({ code: skills.find(skill => skill.id === item.skillId)?.code, attempts: item.attempts, accuracy: Number(item.masteryScore), status: item.status })),
    };
  }

  async startGreetings(user: AuthUser, difficulty: Difficulty) {
    const ctx = await this.context(user);
    const level = await this.prisma.studentThemeDifficultyProgress.findUniqueOrThrow({ where: { studentThemeProgressId_difficulty: { studentThemeProgressId: ctx.progress.id, difficulty } } });
    if (level.status === DifficultyStatus.Locked) throw new ConflictException("difficulty_locked");
    const configuration = await this.prisma.themeDifficulty.findUnique({ where: { themeVersionId_difficulty: { themeVersionId: ctx.themeVersionId, difficulty } } });
    if (!configuration?.isEnabled) throw new NotFoundException("difficulty_not_available");
    const themeQuestions = await this.prisma.themeQuestion.findMany({ where: { themeVersionId: ctx.themeVersionId }, orderBy: { order: "asc" } });
    const versions = await this.prisma.questionVersion.findMany({ where: { id: { in: themeQuestions.map(item => item.questionVersionId) }, difficulty, status: "Published" } });
    if (versions.length < configuration.questionsPerSession) throw new ConflictException("insufficient_published_questions");
    const chosen = [...versions].sort(() => Math.random() - 0.5).slice(0, configuration.questionsPerSession);
    const [questions, options, skills] = await Promise.all([
      this.prisma.question.findMany({ where: { id: { in: chosen.map(item => item.questionId) }, isActive: true } }),
      this.prisma.questionOption.findMany({ where: { questionVersionId: { in: chosen.map(item => item.id) } }, orderBy: { order: "asc" } }),
      this.prisma.skill.findMany({ where: { id: { in: chosen.map(item => item.skillId) } } }),
    ]);
    const session = await this.prisma.$transaction(async tx => {
      const created = await tx.trainingSession.create({ data: { schoolId: user.schoolId, studentProfileId: ctx.student.id, blooId: ctx.bloo.id, languageId: ctx.language.id, themeId: ctx.theme.id, themeVersionId: ctx.themeVersionId, difficulty, type: TrainingType.ThemeMission, totalQuestions: chosen.length } });
      await Promise.all(chosen.map((version, order) => tx.trainingQuestion.create({ data: { trainingSessionId: created.id, questionId: version.questionId, questionVersionId: version.id, order } })));
      await tx.studentThemeProgress.update({ where: { id: ctx.progress.id }, data: { status: ProgressStatus.InProgress, currentDifficulty: difficulty, startedAt: ctx.progress.startedAt ?? new Date() } });
      return created;
    });
    const newlyUnlocked = await this.unlock(ctx, ["FIRST_THEME"]);
    return {
      id: session.id, difficulty, newlyUnlocked,
      questions: chosen.map(version => {
        const question = questions.find(item => item.id === version.questionId)!;
        const questionOptions = options.filter(item => item.questionVersionId === version.id);
        return { id: question.id, code: question.code, prompt: version.prompt, explanation: version.explanation, skill: skills.find(item => item.id === version.skillId)?.name ?? "Greetings", difficulty: version.difficulty, options: questionOptions.map(item => ({ id: item.id, text: item.text })), correctOptionId: questionOptions.find(item => item.isCorrect)!.id };
      }),
    };
  }

  async completeGreetings(user: AuthUser, sessionId: string, submitted: SubmittedAnswer[]) {
    const ctx = await this.context(user);
    const session = await this.prisma.trainingSession.findFirst({ where: { id: sessionId, studentProfileId: ctx.student.id, themeId: ctx.theme.id } });
    if (!session) throw new NotFoundException("training_session_not_found");
    if (session.status === TrainingStatus.Completed) return this.completionResult(ctx, session.id, [], false);
    if (session.status !== TrainingStatus.InProgress || !session.difficulty) throw new ConflictException("training_session_not_active");
    const trainingQuestions = await this.prisma.trainingQuestion.findMany({ where: { trainingSessionId: session.id } });
    if (submitted.length !== trainingQuestions.length || new Set(submitted.map(item => item.questionId)).size !== trainingQuestions.length) throw new BadRequestException("all_questions_required");
    const options = await this.prisma.questionOption.findMany({ where: { questionVersionId: { in: trainingQuestions.map(item => item.questionVersionId) } } });
    const checked = trainingQuestions.map(item => {
      const answer = submitted.find(entry => entry.questionId === item.questionId);
      const option = answer && options.find(entry => entry.id === answer.selectedOptionId && entry.questionVersionId === item.questionVersionId);
      if (!answer || !option) throw new BadRequestException("invalid_answer");
      return { item, option, correct: option.isCorrect };
    });
    const correctAnswers = checked.filter(item => item.correct).length;
    const difficultyProgress = await this.prisma.studentThemeDifficultyProgress.findUniqueOrThrow({ where: { studentThemeProgressId_difficulty: { studentThemeProgressId: ctx.progress.id, difficulty: session.difficulty } } });
    const firstCompletion = difficultyProgress.sessionsCompleted === 0;
    const awardedXP = firstCompletion ? 25 + correctAnswers * 5 : 0;
    const accuracy = correctAnswers / trainingQuestions.length;
    const levelIndex = LEVELS.indexOf(session.difficulty);
    const levelStates = await this.prisma.studentThemeDifficultyProgress.findMany({ where: { studentThemeProgressId: ctx.progress.id } });
    const completedAfterThisSession = LEVELS.filter(difficulty => difficulty === session.difficulty || levelStates.some(item => item.difficulty === difficulty && item.status === DifficultyStatus.Completed));
    const nextDifficulty = LEVELS.find(difficulty => !completedAfterThisSession.includes(difficulty));
    await this.prisma.$transaction(async tx => {
      for (const entry of checked) {
        await tx.trainingAnswer.create({ data: { trainingSessionId: session.id, trainingQuestionId: entry.item.id, selectedOptionId: entry.option.id, isCorrect: entry.correct } });
        await tx.trainingQuestion.update({ where: { id: entry.item.id }, data: { answeredAt: new Date() } });
      }
      await tx.trainingSession.update({ where: { id: session.id }, data: { status: TrainingStatus.Completed, correctAnswers, baseXP: firstCompletion ? 25 : 0, bonusXP: firstCompletion ? correctAnswers * 5 : 0, totalXP: awardedXP, completedAt: new Date(), lastActivityAt: new Date(), activeSessionKey: null } });
      await tx.studentThemeDifficultyProgress.update({ where: { id: difficultyProgress.id }, data: { status: DifficultyStatus.Completed, sessionsCompleted: { increment: 1 }, bestCorrectAnswers: Math.max(difficultyProgress.bestCorrectAnswers, correctAnswers), bestAccuracy: Math.max(Number(difficultyProgress.bestAccuracy), accuracy), firstCompletedAt: difficultyProgress.firstCompletedAt ?? new Date(), lastCompletedAt: new Date(), lastThemeVersionId: ctx.themeVersionId } });
      if (levelIndex < LEVELS.length - 1) await tx.studentThemeDifficultyProgress.updateMany({ where: { studentThemeProgressId: ctx.progress.id, difficulty: LEVELS[levelIndex + 1], status: DifficultyStatus.Locked }, data: { status: DifficultyStatus.Available } });
      await tx.studentThemeProgress.update({ where: { id: ctx.progress.id }, data: { status: nextDifficulty ? ProgressStatus.InProgress : ProgressStatus.Completed, currentDifficulty: nextDifficulty ?? Difficulty.VeryHard, completedAt: nextDifficulty ? null : (ctx.progress.completedAt ?? new Date()) } });
      if (awardedXP) {
        await tx.bloo.update({ where: { id: ctx.bloo.id }, data: { xp: { increment: awardedXP }, stage: BlooStage.Hatchling, hatchedAt: ctx.bloo.hatchedAt ?? new Date() } });
        await tx.progressEvent.create({ data: { schoolId: user.schoolId, studentProfileId: ctx.student.id, blooId: ctx.bloo.id, type: "THEME_DIFFICULTY_COMPLETED", xp: awardedXP, sourceId: session.id, sourceType: "TrainingSession", idempotencyKey: `theme-session:${session.id}` } });
      }
    });
    const skillState = await this.refreshSkills(ctx);
    const completedLevels = await this.prisma.studentThemeDifficultyProgress.findMany({ where: { studentThemeProgressId: ctx.progress.id, status: DifficultyStatus.Completed } });
    const codes: string[] = [];
    if (session.difficulty === Difficulty.Easy) codes.push("THEME_EXPLORER");
    if (completedLevels.some(item => item.difficulty === Difficulty.Hard)) codes.push("GREETINGS_CLIMBER");
    if (skillState.some(item => item.attempts >= 5 && item.distinctSessions >= 2)) codes.push("BLOO_IS_LEARNING");
    if (skillState.some(item => item.status === MasteryStatus.Mastered)) codes.push("SKILL_LEARNED");
    const allCompleted = LEVELS.every(difficulty => completedLevels.some(item => item.difficulty === difficulty));
    const advanced = completedLevels.some(item => (item.difficulty === Difficulty.Hard || item.difficulty === Difficulty.VeryHard) && Number(item.bestAccuracy) >= 0.8);
    if (allCompleted && advanced) codes.push("GREETINGS_MASTER");
    const basic = skillState.find(item => item.code === "BASIC_GREETINGS");
    if (allCompleted && basic?.status === MasteryStatus.Mastered) codes.push("VOCABULARY_EXPLORER");
    const newlyUnlocked = await this.unlock(ctx, codes);
    return this.completionResult(ctx, session.id, newlyUnlocked, firstCompletion);
  }

  private async refreshSkills(ctx: Awaited<ReturnType<LearningService["context"]>>) {
    const sessions = await this.prisma.trainingSession.findMany({ where: { studentProfileId: ctx.student.id, themeId: ctx.theme.id, status: TrainingStatus.Completed } });
    const trainingQuestions = await this.prisma.trainingQuestion.findMany({ where: { trainingSessionId: { in: sessions.map(item => item.id) } } });
    const [versions, answers, skills] = await Promise.all([
      this.prisma.questionVersion.findMany({ where: { id: { in: trainingQuestions.map(item => item.questionVersionId) } } }),
      this.prisma.trainingAnswer.findMany({ where: { trainingQuestionId: { in: trainingQuestions.map(item => item.id) } } }),
      this.prisma.skill.findMany({ where: { languageId: ctx.language.id, code: { in: ["BASIC_GREETINGS", "GREETING_COMPREHENSION"] } } }),
    ]);
    const result = [];
    for (const skill of skills) {
      const relevant = trainingQuestions.filter(item => versions.find(version => version.id === item.questionVersionId)?.skillId === skill.id);
      const relevantAnswers = answers.filter(answer => relevant.some(item => item.id === answer.trainingQuestionId));
      const attempts = relevantAnswers.length;
      const correctAnswers = relevantAnswers.filter(item => item.isCorrect).length;
      const distinctSessions = new Set(relevant.filter(item => relevantAnswers.some(answer => answer.trainingQuestionId === item.id)).map(item => item.trainingSessionId)).size;
      const score = attempts ? correctAnswers / attempts : 0;
      const status = attempts >= 5 && distinctSessions >= 2 && score >= 0.8 ? MasteryStatus.Mastered : attempts ? MasteryStatus.Practicing : MasteryStatus.NotStarted;
      await this.prisma.skillMastery.upsert({ where: { studentProfileId_skillId: { studentProfileId: ctx.student.id, skillId: skill.id } }, update: { attempts, correctAnswers, distinctSessions, masteryScore: score, status, lastPracticedAt: new Date() }, create: { schoolId: ctx.student.schoolId, studentProfileId: ctx.student.id, languageId: ctx.language.id, skillId: skill.id, attempts, correctAnswers, distinctSessions, masteryScore: score, status, lastPracticedAt: new Date() } });
      result.push({ code: skill.code, attempts, distinctSessions, status });
    }
    return result;
  }

  private async unlock(ctx: Awaited<ReturnType<LearningService["context"]>>, codes: string[]) {
    if (!codes.length) return [];
    const achievements = await this.prisma.achievement.findMany({ where: { languageId: ctx.language.id, code: { in: codes }, isActive: true } });
    const newlyUnlocked: string[] = [];
    for (const achievement of achievements) {
      const exists = await this.prisma.studentAchievement.findUnique({ where: { studentProfileId_blooId_achievementId: { studentProfileId: ctx.student.id, blooId: ctx.bloo.id, achievementId: achievement.id } } });
      if (!exists) {
        await this.prisma.studentAchievement.create({ data: { studentProfileId: ctx.student.id, blooId: ctx.bloo.id, achievementId: achievement.id } });
        newlyUnlocked.push(achievement.code);
      }
    }
    return newlyUnlocked;
  }

  private async completionResult(ctx: Awaited<ReturnType<LearningService["context"]>>, sessionId: string, newlyUnlocked: string[], firstCompletion: boolean) {
    const [session, state] = await Promise.all([this.prisma.trainingSession.findUniqueOrThrow({ where: { id: sessionId } }), this.getGreetings({ id: ctx.student.userId, schoolId: ctx.student.schoolId, displayName: "", login: "", role: "Student", mustChangePassword: false })]);
    return { correctAnswers: session.correctAnswers, totalQuestions: session.totalQuestions, awardedXP: session.totalXP, firstCompletion, newlyUnlocked, theme: state };
  }
}
