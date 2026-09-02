-- CreateTable
CREATE TABLE `School` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `slug` VARCHAR(80) NOT NULL,
    `timeZoneId` VARCHAR(80) NOT NULL DEFAULT 'America/Sao_Paulo',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `School_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` CHAR(36) NOT NULL,
    `schoolId` CHAR(36) NOT NULL,
    `displayName` VARCHAR(120) NOT NULL,
    `login` VARCHAR(80) NOT NULL,
    `normalizedLogin` VARCHAR(80) NOT NULL,
    `email` VARCHAR(190) NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `role` ENUM('Admin', 'Student') NOT NULL,
    `mustChangePassword` BOOLEAN NOT NULL DEFAULT true,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `User_schoolId_role_isActive_idx`(`schoolId`, `role`, `isActive`),
    UNIQUE INDEX `User_schoolId_normalizedLogin_key`(`schoolId`, `normalizedLogin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `familyId` CHAR(36) NOT NULL,
    `tokenHash` CHAR(64) NOT NULL,
    `parentTokenId` CHAR(36) NULL,
    `replacedByTokenId` CHAR(36) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `revocationReason` VARCHAR(100) NULL,
    `createdByIpHash` CHAR(64) NULL,
    `userAgentHash` CHAR(64) NULL,

    UNIQUE INDEX `RefreshToken_tokenHash_key`(`tokenHash`),
    INDEX `RefreshToken_userId_expiresAt_idx`(`userId`, `expiresAt`),
    INDEX `RefreshToken_familyId_idx`(`familyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentProfile` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `schoolId` CHAR(36) NOT NULL,
    `fullName` VARCHAR(160) NOT NULL,
    `nickname` VARCHAR(80) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StudentProfile_userId_key`(`userId`),
    INDEX `StudentProfile_schoolId_fullName_idx`(`schoolId`, `fullName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Language` (
    `id` CHAR(36) NOT NULL,
    `schoolId` CHAR(36) NOT NULL,
    `name` VARCHAR(80) NOT NULL,
    `code` VARCHAR(12) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Language_schoolId_code_key`(`schoolId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Class` (
    `id` CHAR(36) NOT NULL,
    `schoolId` CHAR(36) NOT NULL,
    `languageId` CHAR(36) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `levelLabel` VARCHAR(40) NULL,
    `period` VARCHAR(60) NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Class_schoolId_isActive_name_idx`(`schoolId`, `isActive`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enrollment` (
    `id` CHAR(36) NOT NULL,
    `schoolId` CHAR(36) NOT NULL,
    `studentProfileId` CHAR(36) NOT NULL,
    `classId` CHAR(36) NOT NULL,
    `status` ENUM('Active', 'Paused', 'Finished', 'Canceled') NOT NULL DEFAULT 'Active',
    `activeKey` VARCHAR(90) NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Enrollment_activeKey_key`(`activeKey`),
    INDEX `Enrollment_schoolId_classId_status_idx`(`schoolId`, `classId`, `status`),
    INDEX `Enrollment_studentProfileId_status_idx`(`studentProfileId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bloo` (
    `id` CHAR(36) NOT NULL,
    `schoolId` CHAR(36) NOT NULL,
    `studentProfileId` CHAR(36) NOT NULL,
    `languageId` CHAR(36) NOT NULL,
    `name` VARCHAR(20) NOT NULL DEFAULT 'Bloo',
    `hasCustomName` BOOLEAN NOT NULL DEFAULT false,
    `stage` ENUM('Egg', 'Hatchling') NOT NULL DEFAULT 'Egg',
    `xp` INTEGER NOT NULL DEFAULT 0,
    `hatchedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Bloo_schoolId_stage_idx`(`schoolId`, `stage`),
    UNIQUE INDEX `Bloo_studentProfileId_languageId_key`(`studentProfileId`, `languageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SkillCategory` (
    `id` CHAR(36) NOT NULL,
    `languageId` CHAR(36) NOT NULL,
    `name` VARCHAR(80) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `description` VARCHAR(500) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `SkillCategory_languageId_code_key`(`languageId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Skill` (
    `id` CHAR(36) NOT NULL,
    `languageId` CHAR(36) NOT NULL,
    `skillCategoryId` CHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `code` VARCHAR(60) NOT NULL,
    `description` VARCHAR(500) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Skill_languageId_code_key`(`languageId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Theme` (
    `id` CHAR(36) NOT NULL,
    `schoolId` CHAR(36) NOT NULL,
    `languageId` CHAR(36) NOT NULL,
    `code` VARCHAR(60) NOT NULL,
    `status` ENUM('Active', 'Closed', 'Archived') NOT NULL DEFAULT 'Active',
    `currentPublishedVersionId` CHAR(36) NULL,
    `createdByUserId` CHAR(36) NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Theme_schoolId_code_key`(`schoolId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThemeVersion` (
    `id` CHAR(36) NOT NULL,
    `themeId` CHAR(36) NOT NULL,
    `versionNumber` INTEGER NOT NULL,
    `title` VARCHAR(120) NOT NULL,
    `description` VARCHAR(800) NOT NULL,
    `status` ENUM('Draft', 'Published', 'Archived') NOT NULL DEFAULT 'Draft',
    `createdByUserId` CHAR(36) NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `archivedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ThemeVersion_themeId_versionNumber_key`(`themeId`, `versionNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThemeSkill` (
    `id` CHAR(36) NOT NULL,
    `themeVersionId` CHAR(36) NOT NULL,
    `skillId` CHAR(36) NOT NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ThemeSkill_themeVersionId_skillId_key`(`themeVersionId`, `skillId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThemeDifficulty` (
    `id` CHAR(36) NOT NULL,
    `themeVersionId` CHAR(36) NOT NULL,
    `difficulty` ENUM('Easy', 'Medium', 'Hard', 'VeryHard') NOT NULL,
    `order` INTEGER NOT NULL,
    `isEnabled` BOOLEAN NOT NULL DEFAULT true,
    `questionsPerSession` INTEGER NOT NULL DEFAULT 5,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ThemeDifficulty_themeVersionId_difficulty_key`(`themeVersionId`, `difficulty`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThemeClass` (
    `id` CHAR(36) NOT NULL,
    `schoolId` CHAR(36) NOT NULL,
    `themeId` CHAR(36) NOT NULL,
    `themeVersionId` CHAR(36) NOT NULL,
    `classId` CHAR(36) NOT NULL,
    `releaseMode` ENUM('Immediate', 'Scheduled') NOT NULL,
    `releaseAt` DATETIME(3) NULL,
    `dueAt` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ThemeClass_schoolId_classId_isActive_idx`(`schoolId`, `classId`, `isActive`),
    UNIQUE INDEX `ThemeClass_themeId_classId_key`(`themeId`, `classId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Question` (
    `id` CHAR(36) NOT NULL,
    `schoolId` CHAR(36) NOT NULL,
    `languageId` CHAR(36) NOT NULL,
    `code` VARCHAR(80) NOT NULL,
    `createdByUserId` CHAR(36) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Question_schoolId_code_key`(`schoolId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestionVersion` (
    `id` CHAR(36) NOT NULL,
    `questionId` CHAR(36) NOT NULL,
    `versionNumber` INTEGER NOT NULL,
    `skillCategoryId` CHAR(36) NOT NULL,
    `skillId` CHAR(36) NOT NULL,
    `type` ENUM('MultipleChoice', 'FillBlankWithOptions') NOT NULL,
    `difficulty` ENUM('Easy', 'Medium', 'Hard', 'VeryHard') NOT NULL,
    `prompt` VARCHAR(600) NOT NULL,
    `explanation` VARCHAR(600) NOT NULL,
    `status` ENUM('Draft', 'Published', 'Archived') NOT NULL DEFAULT 'Draft',
    `publishedAt` DATETIME(3) NULL,
    `archivedAt` DATETIME(3) NULL,
    `createdByUserId` CHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `QuestionVersion_skillId_difficulty_status_idx`(`skillId`, `difficulty`, `status`),
    UNIQUE INDEX `QuestionVersion_questionId_versionNumber_key`(`questionId`, `versionNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestionOption` (
    `id` CHAR(36) NOT NULL,
    `questionVersionId` CHAR(36) NOT NULL,
    `text` VARCHAR(300) NOT NULL,
    `isCorrect` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `QuestionOption_questionVersionId_order_key`(`questionVersionId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThemeQuestion` (
    `id` CHAR(36) NOT NULL,
    `themeVersionId` CHAR(36) NOT NULL,
    `questionVersionId` CHAR(36) NOT NULL,
    `order` INTEGER NOT NULL,
    `isRequired` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ThemeQuestion_themeVersionId_questionVersionId_key`(`themeVersionId`, `questionVersionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainingTemplate` (
    `id` CHAR(36) NOT NULL,
    `schoolId` CHAR(36) NOT NULL,
    `languageId` CHAR(36) NOT NULL,
    `code` VARCHAR(60) NOT NULL,
    `type` ENUM('FirstHatch', 'ThemeMission', 'Review') NOT NULL,
    `totalQuestions` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TrainingTemplate_schoolId_code_key`(`schoolId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainingSession` (
    `id` CHAR(36) NOT NULL,
    `schoolId` CHAR(36) NOT NULL,
    `studentProfileId` CHAR(36) NOT NULL,
    `blooId` CHAR(36) NOT NULL,
    `languageId` CHAR(36) NOT NULL,
    `trainingTemplateId` CHAR(36) NULL,
    `themeId` CHAR(36) NULL,
    `themeVersionId` CHAR(36) NULL,
    `difficulty` ENUM('Easy', 'Medium', 'Hard', 'VeryHard') NULL,
    `type` ENUM('FirstHatch', 'ThemeMission', 'Review') NOT NULL,
    `status` ENUM('InProgress', 'Completed', 'Abandoned') NOT NULL DEFAULT 'InProgress',
    `activeSessionKey` VARCHAR(100) NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastActivityAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,
    `abandonedAt` DATETIME(3) NULL,
    `totalQuestions` INTEGER NOT NULL,
    `correctAnswers` INTEGER NOT NULL DEFAULT 0,
    `baseXP` INTEGER NOT NULL DEFAULT 0,
    `bonusXP` INTEGER NOT NULL DEFAULT 0,
    `totalXP` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `TrainingSession_activeSessionKey_key`(`activeSessionKey`),
    INDEX `TrainingSession_studentProfileId_status_lastActivityAt_idx`(`studentProfileId`, `status`, `lastActivityAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainingQuestion` (
    `id` CHAR(36) NOT NULL,
    `trainingSessionId` CHAR(36) NOT NULL,
    `questionId` CHAR(36) NOT NULL,
    `questionVersionId` CHAR(36) NOT NULL,
    `order` INTEGER NOT NULL,
    `answeredAt` DATETIME(3) NULL,

    UNIQUE INDEX `TrainingQuestion_trainingSessionId_order_key`(`trainingSessionId`, `order`),
    UNIQUE INDEX `TrainingQuestion_trainingSessionId_questionVersionId_key`(`trainingSessionId`, `questionVersionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainingAnswer` (
    `id` CHAR(36) NOT NULL,
    `trainingSessionId` CHAR(36) NOT NULL,
    `trainingQuestionId` CHAR(36) NOT NULL,
    `selectedOptionId` CHAR(36) NOT NULL,
    `isCorrect` BOOLEAN NOT NULL,
    `answeredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `timeSpentSeconds` INTEGER NULL,

    UNIQUE INDEX `TrainingAnswer_trainingQuestionId_key`(`trainingQuestionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentThemeProgress` (
    `id` CHAR(36) NOT NULL,
    `schoolId` CHAR(36) NOT NULL,
    `studentProfileId` CHAR(36) NOT NULL,
    `blooId` CHAR(36) NOT NULL,
    `themeId` CHAR(36) NOT NULL,
    `status` ENUM('NotStarted', 'InProgress', 'Completed') NOT NULL DEFAULT 'NotStarted',
    `currentDifficulty` ENUM('Easy', 'Medium', 'Hard', 'VeryHard') NOT NULL DEFAULT 'Easy',
    `startedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StudentThemeProgress_studentProfileId_blooId_themeId_key`(`studentProfileId`, `blooId`, `themeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentThemeDifficultyProgress` (
    `id` CHAR(36) NOT NULL,
    `studentThemeProgressId` CHAR(36) NOT NULL,
    `difficulty` ENUM('Easy', 'Medium', 'Hard', 'VeryHard') NOT NULL,
    `lastThemeVersionId` CHAR(36) NULL,
    `status` ENUM('Locked', 'Available', 'Completed') NOT NULL DEFAULT 'Locked',
    `sessionsCompleted` INTEGER NOT NULL DEFAULT 0,
    `bestCorrectAnswers` INTEGER NOT NULL DEFAULT 0,
    `bestAccuracy` DECIMAL(5, 4) NOT NULL DEFAULT 0,
    `firstCompletedAt` DATETIME(3) NULL,
    `lastCompletedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StudentThemeDifficultyProgress_studentThemeProgressId_diffic_key`(`studentThemeProgressId`, `difficulty`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SkillMastery` (
    `id` CHAR(36) NOT NULL,
    `schoolId` CHAR(36) NOT NULL,
    `studentProfileId` CHAR(36) NOT NULL,
    `languageId` CHAR(36) NOT NULL,
    `skillId` CHAR(36) NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `correctAnswers` INTEGER NOT NULL DEFAULT 0,
    `distinctSessions` INTEGER NOT NULL DEFAULT 0,
    `masteryScore` DECIMAL(5, 4) NOT NULL DEFAULT 0,
    `status` ENUM('NotStarted', 'Practicing', 'Mastered') NOT NULL DEFAULT 'NotStarted',
    `lastPracticedAt` DATETIME(3) NULL,

    UNIQUE INDEX `SkillMastery_studentProfileId_skillId_key`(`studentProfileId`, `skillId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Achievement` (
    `id` CHAR(36) NOT NULL,
    `languageId` CHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `code` VARCHAR(60) NOT NULL,
    `description` VARCHAR(300) NOT NULL,
    `requirementType` VARCHAR(60) NOT NULL,
    `requirementJson` JSON NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Achievement_languageId_code_key`(`languageId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentAchievement` (
    `id` CHAR(36) NOT NULL,
    `studentProfileId` CHAR(36) NOT NULL,
    `blooId` CHAR(36) NOT NULL,
    `achievementId` CHAR(36) NOT NULL,
    `unlockedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `StudentAchievement_studentProfileId_blooId_achievementId_key`(`studentProfileId`, `blooId`, `achievementId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IdempotencyRecord` (
    `id` CHAR(36) NOT NULL,
    `schoolId` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `route` VARCHAR(180) NOT NULL,
    `idempotencyKey` CHAR(36) NOT NULL,
    `requestHash` CHAR(64) NOT NULL,
    `responseStatus` INTEGER NOT NULL,
    `responseJson` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,

    INDEX `IdempotencyRecord_expiresAt_idx`(`expiresAt`),
    UNIQUE INDEX `IdempotencyRecord_schoolId_userId_route_idempotencyKey_key`(`schoolId`, `userId`, `route`, `idempotencyKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProgressEvent` (
    `id` CHAR(36) NOT NULL,
    `schoolId` CHAR(36) NOT NULL,
    `studentProfileId` CHAR(36) NOT NULL,
    `blooId` CHAR(36) NOT NULL,
    `type` VARCHAR(70) NOT NULL,
    `xp` INTEGER NOT NULL DEFAULT 0,
    `sourceId` CHAR(36) NOT NULL,
    `sourceType` VARCHAR(60) NOT NULL,
    `idempotencyKey` VARCHAR(160) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ProgressEvent_idempotencyKey_key`(`idempotencyKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` CHAR(36) NOT NULL,
    `schoolId` CHAR(36) NULL,
    `actorUserId` CHAR(36) NULL,
    `action` VARCHAR(80) NOT NULL,
    `entityType` VARCHAR(60) NULL,
    `entityId` CHAR(36) NULL,
    `metadataJson` JSON NULL,
    `ipHash` CHAR(64) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_schoolId_createdAt_idx`(`schoolId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
