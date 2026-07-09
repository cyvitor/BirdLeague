# Modelo de Dados do MVP â€” BirdLeague

Este documento detalha os dados mÃ­nimos para construir o MVP. Ele complementa a arquitetura tÃ©cnica e deve orientar as primeiras entidades, migrations e contratos da API.

## 1. ConvenÃ§Ãµes

- Todas as entidades principais devem ter `Id`, `CreatedAt`, `UpdatedAt` e, quando fizer sentido, `IsActive`.
- Datas devem ser salvas em UTC.
- ExclusÃµes devem ser lÃ³gicas quando houver histÃ³rico pedagÃ³gico ou progresso.
- Regras de permissÃ£o devem considerar a escola (`School`) como limite de dados.

## 2. School

Representa a escola ou unidade dona dos dados.

Campos mÃ­nimos:

- `Id`
- `Name`
- `Slug`
- `IsActive`
- `CreatedAt`
- `UpdatedAt`

## 3. User

Representa a identidade de login.

Campos mÃ­nimos:

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

PapÃ©is iniciais:

- `Admin`
- `Teacher`
- `Student`

No MVP, administradores podem cadastrar perguntas e publicar conteÃºdo.

## 4. StudentProfile

Campos mÃ­nimos:

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

Dados de responsÃ¡vel podem ser opcionais no MVP se a escola controlar fora da plataforma.

## 5. TeacherProfile

Campos mÃ­nimos:

- `Id`
- `UserId`
- `SchoolId`
- `FullName`
- `CreatedAt`
- `UpdatedAt`

## 6. Language

Campos mÃ­nimos:

- `Id`
- `SchoolId`
- `Name`
- `Code`
- `IsActive`

Registro inicial:

- `English`, cÃ³digo `en`.

## 7. CourseLevel

Representa o nÃ­vel usado pela escola ou uma aproximaÃ§Ã£o CEFR.

Campos mÃ­nimos:

- `Id`
- `SchoolId`
- `LanguageId`
- `Name`
- `Code`
- `Order`
- `IsActive`

NÃ­veis iniciais sugeridos:

- `Starter`
- `A1`
- `A2`
- `B1`
- `B2`
- `C1`

Se a escola usar nomes prÃ³prios, eles podem ser cadastrados depois.

## 8. Class

Campos mÃ­nimos:

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

Campos mÃ­nimos:

- `Id`
- `SchoolId`
- `StudentProfileId`
- `ClassId`
- `Status`
- `StartedAt`
- `EndedAt`

O idioma e o nÃ­vel da matrÃ­cula vÃªm da turma (`Class`). No MVP, nÃ£o devem ser duplicados diretamente em `Enrollment`, para evitar inconsistÃªncia entre aluno, turma e idioma.

Status:

- `Active`
- `Paused`
- `Finished`
- `Canceled`

## 10. Bloo

Representa o avatar do aluno em um idioma.

Campos mÃ­nimos:

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

EstÃ¡gios iniciais:

- `Egg`
- `Hatchling`

EstÃ¡gios futuros:

- `BabyBloo`
- `YoungBloo`
- `AdultBloo`
- `MasterBloo`
- `LegendaryBloo`

Regra:

- Deve existir apenas um Bloo por aluno e idioma.

## 11. BlooStageDefinition

Define estÃ¡gios e requisitos.

Campos mÃ­nimos:

- `Id`
- `LanguageId`
- `Stage`
- `DisplayName`
- `RequiredXP`
- `Order`
- `AssetKey`
- `IsActive`

No MVP, `Egg` e `Hatchling` sÃ£o obrigatÃ³rios.

## 12. SkillCategory

Categoria ampla da pergunta.

Campos mÃ­nimos:

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

No MVP, `Speaking` e `Writing` podem existir no cadastro, mas nÃ£o precisam aparecer no treino inicial.

## 13. Skill

Habilidade especÃ­fica dentro de uma categoria.

Campos mÃ­nimos:

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

Campos mÃ­nimos:

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

Campos mÃ­nimos:

- `Id`
- `QuestionId`
- `Text`
- `IsCorrect`
- `Order`

No MVP, perguntas objetivas devem ter uma Ãºnica opÃ§Ã£o correta.

## 16. TrainingSession

Campos mÃ­nimos:

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

Guarda quais perguntas entraram na sessÃ£o.

Campos mÃ­nimos:

- `Id`
- `TrainingSessionId`
- `QuestionId`
- `Order`
- `AnsweredAt`

## 18. TrainingAnswer

Campos mÃ­nimos:

- `Id`
- `TrainingSessionId`
- `TrainingQuestionId`
- `QuestionId`
- `SelectedOptionId`
- `IsCorrect`
- `AnsweredAt`
- `TimeSpentSeconds`

## 19. ProgressEvent

Registra mudanÃ§as de progresso.

Campos mÃ­nimos:

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

- Eventos derivados de uma mesma sessÃ£o devem ser idempotentes.

## 20. SkillMastery

Guarda progresso do aluno por habilidade.

Campos mÃ­nimos:

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

- Uma habilidade sÃ³ pode virar `Mastered` apÃ³s pelo menos 5 respostas em pelo menos 2 sessÃµes diferentes e acerto mÃ­nimo de 80%.

## 21. Title

Campos mÃ­nimos:

- `Id`
- `LanguageId`
- `Name`
- `Code`
- `Description`
- `RequirementType`
- `IsActive`

TÃ­tulos iniciais:

- `New Hatchling`: concedido ao nascer o primeiro Bloo.
- `Grammar Guardian`: futuro, por domÃ­nio de gramÃ¡tica.
- `Vocabulary Explorer`: futuro, por domÃ­nio de vocabulÃ¡rio.

## 22. StudentTitle

Campos mÃ­nimos:

- `Id`
- `StudentProfileId`
- `BlooId`
- `TitleId`
- `UnlockedAt`
- `IsEquipped`

## 23. Asset

Campos mÃ­nimos:

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

Campos mÃ­nimos:

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
