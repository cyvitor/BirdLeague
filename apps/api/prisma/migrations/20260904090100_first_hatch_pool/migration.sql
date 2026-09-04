CREATE TABLE `TrainingTemplateQuestion` (
  `id` CHAR(36) NOT NULL,
  `trainingTemplateId` CHAR(36) NOT NULL,
  `questionVersionId` CHAR(36) NOT NULL,
  UNIQUE INDEX `TrainingTemplateQuestion_template_question_key` (`trainingTemplateId`, `questionVersionId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
