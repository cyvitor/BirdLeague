# Modelo de Dados do MVP — BirdLeague

Este documento detalha os dados mínimos para construir o MVP. Ele complementa a arquitetura técnica e deve orientar as primeiras entidades, migrations e contratos da API.

## 1. Convenções

- Todas as entidades principais devem ter `Id`, `CreatedAt`, `UpdatedAt` e, quando fizer sentido, `IsActive`.
- Datas devem ser salvas em UTC.
- Exclusões devem ser lógicas quando houver histórico pedagógico ou progresso.
- Regras de permissão devem considerar a escola (`School`) como limite de dados.

## 2. School

Representa a escola ou unidade dona dos dados.

Campos mínimos:

- `Id`
- `Name`
- `Slug`
- `IsActive`
- `CreatedAt`
- `UpdatedAt`

## 3. User

Representa a identidade de login.

Campos mínimos:

- `Id`
- `SchoolId`
- `DisplayName`
- `Login`
- `Email`
- `PasswordHash`
- `Role`
- `MustChangePassword`
- `IsActive`
- `LastLoginAt`
- `CreatedAt`
- `UpdatedAt`

Papéis iniciais:

- `Admin`
- `Teacher`
- `Student`

No MVP, administradores podem cadastrar perguntas e publicar conteúdo.

## 4. StudentProfile

Campos mínimos:

- `Id`
- `UserId`
- `SchoolId`
- `FullName`
- `Nickname`
- `BirthDate`
- `GuardianName`
- `GuardianContact`
- `CreatedAt`
- `UpdatedAt`

Dados de responsável podem ser opcionais no MVP se a escola controlar fora da plataforma.

## 5. TeacherProfile

Campos mínimos:

- `Id`
- `UserId`
- `SchoolId`
- `FullName`
- `CreatedAt`
- `UpdatedAt`

## 6. Language

Campos mínimos:

- `Id`
- `SchoolId`
- `Name`
- `Code`
- `IsActive`

Registro inicial:

- `English`, código `en`.

## 7. CourseLevel

Representa o nível usado pela escola ou uma aproximação CEFR.

Campos mínimos:

- `Id`
- `SchoolId`
- `LanguageId`
- `Name`
- `Code`
- `Order`
- `IsActive`

Níveis iniciais sugeridos:

- `Starter`
- `A1`
- `A2`
- `B1`
- `B2`
- `C1`

Se a escola usar nomes próprios, eles podem ser cadastrados depois.

## 8. Class

Campos mínimos:

- `Id`
- `SchoolId`
- `LanguageId`
- `CourseLevelId`
- `Name`
- `Period`
- `TeacherId`
- `IsActive`
- `CreatedAt`
- `UpdatedAt`

## 9. Enrollment

Liga aluno e turma.

Campos mínimos:

- `Id`
- `SchoolId`
- `StudentProfileId`
- `ClassId`
- `Status`
- `StartedAt`
- `EndedAt`

O idioma e o nível da matrícula vêm da turma (`Class`). No MVP, não devem ser duplicados diretamente em `Enrollment`, para evitar inconsistência entre aluno, turma e idioma.

Status:

- `Active`
- `Paused`
- `Finished`
- `Canceled`

## 10. Bloo

Representa o avatar do aluno em um idioma.

Campos mínimos:

- `Id`
- `SchoolId`
- `StudentProfileId`
- `LanguageId`
- `Name`
- `Stage`
- `XP`
- `CreatedAt`
- `UpdatedAt`
- `HatchedAt`

Estágios iniciais:

- `Egg`
- `Hatchling`

Estágios futuros:

- `BabyBloo`
- `YoungBloo`
- `AdultBloo`
- `MasterBloo`
- `LegendaryBloo`

Regra:

- Deve existir apenas um Bloo por aluno e idioma.

## 11. BlooStageDefinition

Define estágios e requisitos.

Campos mínimos:

- `Id`
- `LanguageId`
- `Stage`
- `DisplayName`
- `RequiredXP`
- `Order`
- `AssetKey`
- `IsActive`

No MVP, `Egg` e `Hatchling` são obrigatórios.

## 12. SkillCategory

Categoria ampla da pergunta.

Campos mínimos:

- `Id`
- `LanguageId`
- `Name`
- `Code`
- `Description`
- `IsActive`

Categorias iniciais:

- `Vocabulary`
- `Grammar`
- `Reading`
- `Listening`
- `Speaking`
- `Writing`

No MVP, `Speaking` e `Writing` podem existir no cadastro, mas não precisam aparecer no treino inicial.

## 13. Skill

Habilidade específica dentro de uma categoria.

Campos mínimos:

- `Id`
- `LanguageId`
- `SkillCategoryId`
- `CourseLevelId`
- `Name`
- `Code`
- `Description`
- `IsActive`

Exemplos:

- `Basic Greetings`
- `Colors`
- `Numbers`
- `Simple Present`
- `Verb To Be`
- `Classroom Objects`

## 14. Question

Campos mínimos:

- `Id`
- `SchoolId`
- `LanguageId`
- `CourseLevelId`
- `SkillCategoryId`
- `SkillId`
- `Type`
- `Difficulty`
- `Prompt`
- `Explanation`
- `Status`
- `CreatedByUserId`
- `PublishedAt`
- `CreatedAt`
- `UpdatedAt`

Tipos:

- `MultipleChoice`
- `FillBlankWithOptions`
- `Matching`

Dificuldades:

- `Easy`
- `Medium`
- `Hard`

Status:

- `Draft`
- `Published`
- `Archived`

## 15. QuestionOption

Campos mínimos:

- `Id`
- `QuestionId`
- `Text`
- `IsCorrect`
- `Order`

No MVP, perguntas objetivas devem ter uma única opção correta.

## 16. TrainingSession

Campos mínimos:

- `Id`
- `SchoolId`
- `StudentProfileId`
- `BlooId`
- `LanguageId`
- `Type`
- `Status`
- `StartedAt`
- `CompletedAt`
- `AbandonedAt`
- `TotalQuestions`
- `CorrectAnswers`
- `BaseXP`
- `BonusXP`
- `TotalXP`

Tipos:

- `FirstHatch`
- `Practice`

Status:

- `InProgress`
- `Completed`
- `Abandoned`

## 17. TrainingQuestion

Guarda quais perguntas entraram na sessão.

Campos mínimos:

- `Id`
- `TrainingSessionId`
- `QuestionId`
- `Order`
- `AnsweredAt`

## 18. TrainingAnswer

Campos mínimos:

- `Id`
- `TrainingSessionId`
- `TrainingQuestionId`
- `QuestionId`
- `SelectedOptionId`
- `IsCorrect`
- `AnsweredAt`
- `TimeSpentSeconds`

## 19. ProgressEvent

Registra mudanças de progresso.

Campos mínimos:

- `Id`
- `SchoolId`
- `StudentProfileId`
- `BlooId`
- `Type`
- `XP`
- `SourceId`
- `SourceType`
- `CreatedAt`

Tipos iniciais:

- `FirstTrainingCompleted`
- `QuestionAnsweredCorrectly`
- `BlooHatched`
- `TitleUnlocked`

Regra:

- Eventos derivados de uma mesma sessão devem ser idempotentes.

## 20. SkillMastery

Guarda progresso do aluno por habilidade.

Campos mínimos:

- `Id`
- `SchoolId`
- `StudentProfileId`
- `LanguageId`
- `SkillId`
- `Attempts`
- `CorrectAnswers`
- `MasteryScore`
- `Status`
- `LastPracticedAt`

Status:

- `NotStarted`
- `Practicing`
- `Mastered`

Regra inicial:

- Uma habilidade só pode virar `Mastered` após pelo menos 5 respostas em pelo menos 2 sessões diferentes e acerto mínimo de 80%.

## 21. Title

Campos mínimos:

- `Id`
- `LanguageId`
- `Name`
- `Code`
- `Description`
- `RequirementType`
- `IsActive`

Títulos iniciais:

- `New Hatchling`: concedido ao nascer o primeiro Bloo.
- `Grammar Guardian`: futuro, por domínio de gramática.
- `Vocabulary Explorer`: futuro, por domínio de vocabulário.

## 22. StudentTitle

Campos mínimos:

- `Id`
- `StudentProfileId`
- `BlooId`
- `TitleId`
- `UnlockedAt`
- `IsEquipped`

## 23. Asset

Campos mínimos:

- `Id`
- `Key`
- `Type`
- `Path`
- `AltText`
- `Width`
- `Height`
- `IsActive`

Tipos:

- `BlooStage`
- `Accessory`
- `Effect`
- `QuestionImage`
- `Audio`

## 24. AnalyticsEvent

Campos mínimos:

- `Id`
- `SchoolId`
- `UserId`
- `EventName`
- `EntityType`
- `EntityId`
- `MetadataJson`
- `CreatedAt`

Eventos principais:

- `StudentLoggedIn`
- `LanguageSelected`
- `FirstTrainingStarted`
- `FirstTrainingCompleted`
- `BlooHatched`
- `QuestionAnswered`
