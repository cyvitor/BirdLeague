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

## 14. Theme

Representa um tema ou missão pedagógica criada pelo professor para uma ou mais turmas.

Campos mínimos:

- `Id`
- `SchoolId`
- `LanguageId`
- `CourseLevelId`
- `Title`
- `Description`
- `PrimarySkillId`
- `Status`
- `CreatedByUserId`
- `CreatedAt`
- `UpdatedAt`

Status:

- `Draft`
- `Scheduled`
- `Published`
- `Closed`
- `Archived`

Seeds iniciais:

- `Verb To Be`
- `Greetings`
- `Colors`
- `Simple Present`
- `Restaurant Vocabulary`
- `Classroom Objects`

## 15. ThemeClass

Associa um tema a uma turma e controla sua liberação.

Campos mínimos:

- `Id`
- `SchoolId`
- `ThemeId`
- `ClassId`
- `ReleaseMode`
- `ReleaseAt`
- `DueAt`
- `IsActive`
- `CreatedAt`
- `UpdatedAt`

`ReleaseMode`:

- `Immediate`
- `Scheduled`

## 16. ThemeQuestion

Associa perguntas a um tema.

Campos mínimos:

- `Id`
- `ThemeId`
- `QuestionId`
- `Order`
- `IsRequired`
- `CreatedAt`

## 17. Question

Campos mínimos:

- `Id`
- `SchoolId`
- `LanguageId`
- `CourseLevelId`
- `SkillCategoryId`
- `SkillId`
- `ThemeId`
- `Type`
- `Difficulty`
- `Prompt`
- `Explanation`
- `Status`
- `GenerationSource`
- `AiModel`
- `AiPromptVersion`
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
- `VeryHard`

Status:

- `Draft`
- `AiGenerated`
- `Published`
- `Rejected`
- `Archived`

Origem da geração:

- `Manual`
- `AiGenerated`

## 18. QuestionOption

Campos mínimos:

- `Id`
- `QuestionId`
- `Text`
- `IsCorrect`
- `Order`

No MVP, perguntas objetivas devem ter uma única opção correta.

## 19. TrainingSession

Campos mínimos:

- `Id`
- `SchoolId`
- `StudentProfileId`
- `BlooId`
- `LanguageId`
- `ThemeId`
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
- `ThemeMission`
- `Practice`
- `Review`

Status:

- `InProgress`
- `Completed`
- `Abandoned`

## 20. TrainingQuestion

Guarda quais perguntas entraram na sessão.

Campos mínimos:

- `Id`
- `TrainingSessionId`
- `QuestionId`
- `Order`
- `AnsweredAt`

## 21. TrainingAnswer

Campos mínimos:

- `Id`
- `TrainingSessionId`
- `TrainingQuestionId`
- `QuestionId`
- `SelectedOptionId`
- `IsCorrect`
- `AnsweredAt`
- `TimeSpentSeconds`

## 22. ProgressEvent

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
- `BlooPracticedSkill`
- `BlooLearnedSkill`
- `TitleUnlocked`

Regra:

- Eventos derivados de uma mesma sessão devem ser idempotentes.

## 23. SkillMastery

Guarda progresso do aluno por habilidade. Na interface do aluno, esse progresso também representa o que o Bloo está aprendendo.

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

Apresentação no app:

- `Practicing` pode aparecer para o aluno como "Bloo está aprendendo".
- `Mastered` pode aparecer como "Bloo aprendeu" ou "Bloo dominou", conforme a idade e tom escolhido.
- O modelo não deve criar uma segunda verdade separada para aluno e Bloo no MVP. O aprendizado do Bloo é uma camada narrativa sobre o domínio pedagógico.

## 24. Title

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

## 25. Achievement

Representa conquistas que podem ser liberadas por nascimento, tema, constância ou domínio.

Campos mínimos:

- `Id`
- `LanguageId`
- `Name`
- `Code`
- `Description`
- `RequirementType`
- `RequirementJson`
- `IsActive`

Seeds iniciais recomendadas:

- `New Hatchling`: Bloo nasceu.
- `First Lesson`: primeiro treino concluído.
- `First Theme`: primeiro tema iniciado.
- `Theme Explorer`: etapa fácil de um tema concluída.
- `Bloo Is Learning`: habilidade praticada em um tema.
- `Skill Learned`: habilidade dominada.
- `Grammar Guardian`: conjunto de habilidades de gramática dominado.
- `Vocabulary Explorer`: conjunto de habilidades de vocabulário dominado.

## 26. StudentTitle

Campos mínimos:

- `Id`
- `StudentProfileId`
- `BlooId`
- `TitleId`
- `UnlockedAt`
- `IsEquipped`

## 27. StudentAchievement

Campos mínimos:

- `Id`
- `StudentProfileId`
- `BlooId`
- `AchievementId`
- `UnlockedAt`

## 28. Asset

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

## 29. AiProviderSettings

Configuração administrativa do provedor de IA.

Campos mínimos:

- `Id`
- `SchoolId`
- `Provider`
- `ApiKeySecretRef`
- `Model`
- `Temperature`
- `MaxTokens`
- `IsEnabled`
- `CreatedAt`
- `UpdatedAt`

A chave da API não deve ser exposta ao professor.

## 30. AiQuestionGenerationBatch

Registra um lote de perguntas geradas por IA.

Campos mínimos:

- `Id`
- `SchoolId`
- `ThemeId`
- `RequestedByUserId`
- `Provider`
- `Model`
- `PromptVersion`
- `RequestedCount`
- `Status`
- `CreatedAt`

Status:

- `Requested`
- `Completed`
- `Failed`
- `Reviewed`

## 31. AnalyticsEvent

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
