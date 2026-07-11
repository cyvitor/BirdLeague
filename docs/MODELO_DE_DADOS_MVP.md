# Modelo de Dados do MVP — BirdLeague

Este documento orienta entidades, migrations e contratos. Professor e IA permanecem na visão futura, mas suas entidades não são necessárias no schema inicial do MVP.

## 1. Convenções

- Entidades principais têm `Id`, `CreatedAt`, `UpdatedAt` e, quando aplicável, `IsActive`.
- Datas são UTC; exclusões são lógicas quando existe histórico.
- `SchoolId` delimita dados e deve participar das validações de autorização.
- Códigos de seed são estáveis e índices únicos protegem idempotência.

## 2. Organização e identidade

### School

`Id`, `Name`, `Slug`, `TimeZoneId`, `IsActive`, `CreatedAt`, `UpdatedAt`.

### User

`Id`, `SchoolId`, `DisplayName`, `Login`, `Email` opcional, `PasswordHash`, `Role`, `MustChangePassword`, `IsActive`, `LastLoginAt`, `CreatedAt`, `UpdatedAt`.

- Login do sistema inteiro: `Login + Password`.
- Papéis operacionais do MVP: `Admin`, `Student`.
- `Teacher` fica reservado para pós-MVP.
- Índice único: `SchoolId + Login`.
- Redefinição de senha revoga refresh tokens e marca `MustChangePassword`.
- Política completa em [Autenticação e Segurança](AUTENTICACAO_E_SEGURANCA_MVP.md).

### StudentProfile

`Id`, `UserId`, `SchoolId`, `FullName`, `Nickname` opcional, `CreatedAt`, `UpdatedAt`.

Data de nascimento e dados de responsável não são necessários para codificar o MVP.

### Language

`Id`, `SchoolId`, `Name`, `Code`, `IsActive`. Seed: `English/en`.

### Class

`Id`, `SchoolId`, `LanguageId`, `Name`, `LevelLabel` opcional, `Period`, `IsActive`, `CreatedAt`, `UpdatedAt`.

`LevelLabel` é apenas a nomenclatura usada pela escola. Não controla automaticamente perguntas ou dificuldades. Ao associar um tema, a escola declara que aquela turma já estudou o assunto.

### Enrollment

`Id`, `SchoolId`, `StudentProfileId`, `ClassId`, `Status`, `StartedAt`, `EndedAt`.

Status: `Active`, `Paused`, `Finished`, `Canceled`. Índice impede duas matrículas ativas idênticas.

## 3. Bloo

### Bloo

`Id`, `SchoolId`, `StudentProfileId`, `LanguageId`, `Name`, `Stage`, `XP`, `CreatedAt`, `UpdatedAt`, `HatchedAt`.

- Estágios do MVP: `Egg`, `Hatchling`.
- Índice único: `StudentProfileId + LanguageId`.
- É criado idempotentemente na primeira matrícula ativa do aluno naquele idioma.
- O login apenas garante sua existência; não cria duplicata.

Nome do Bloo:

- obrigatório após o nascimento;
- 2 a 20 caracteres após `trim`;
- letras Unicode, números, espaço, hífen e apóstrofo;
- sem espaços repetidos ou apenas números;
- lista de termos proibidos validada no backend;
- pode ser alterado pelo aluno no MVP, preservando auditoria básica.

### BlooStageDefinition

`Id`, `LanguageId`, `Stage`, `DisplayName`, `RequiredXP`, `Order`, `AssetKey`, `IsActive`.

O nascimento depende da conclusão de `FirstHatch`, não de `RequiredXP`.

## 4. Conteúdo pedagógico

### SkillCategory

`Id`, `LanguageId`, `Name`, `Code`, `Description`, `IsActive`.

Seeds do MVP: `Vocabulary`, `Grammar`, `Reading`.

### Skill

`Id`, `LanguageId`, `SkillCategoryId`, `Name`, `Code`, `Description`, `IsActive`.

O nível CEFR não faz parte da identidade da habilidade no MVP. Para `Greetings`:

- `BASIC_GREETINGS`, categoria `Vocabulary`;
- `GREETING_COMPREHENSION`, categoria `Reading`.

### Theme

`Id`, `SchoolId`, `LanguageId`, `Code`, `Title`, `Description`, `Status`, `CreatedByUserId`, `PublishedAt`, `CreatedAt`, `UpdatedAt`.

Status: `Draft`, `Published`, `Closed`, `Archived`.

- Tema não possui nível CEFR no MVP.
- Um tema publicado precisa ter ao menos 5 perguntas publicadas em cada dificuldade habilitada.
- Não pode voltar para `Draft` depois de usado; pode ser fechado ou arquivado.

### ThemeSkill

`Id`, `ThemeId`, `SkillId`, `IsPrimary`, `CreatedAt`.

Permite que um tema desenvolva várias habilidades sem duplicar domínio. Deve existir exatamente uma habilidade principal por tema.

### ThemeCategory

`Id`, `ThemeId`, `SkillCategoryId`, `CreatedAt`.

Derivável pelas habilidades, mas persistido para filtros e validação editorial.

### ThemeDifficulty

`Id`, `ThemeId`, `Difficulty`, `Order`, `IsEnabled`, `QuestionsPerSession`, `CreatedAt`, `UpdatedAt`.

Dificuldades: `Easy`, `Medium`, `Hard`, `VeryHard`. No seed `Greetings`, todas ficam habilitadas e `QuestionsPerSession = 5`.

### ThemeClass

`Id`, `SchoolId`, `ThemeId`, `ClassId`, `ReleaseMode`, `ReleaseAt`, `DueAt`, `IsActive`, `CreatedAt`, `UpdatedAt`.

`ReleaseMode`: `Immediate`, `Scheduled`. O agendamento existe apenas aqui; `Theme` não possui estado `Scheduled`.

Validações:

- tema e turma pertencem à mesma escola e idioma;
- somente tema `Published` pode ficar disponível;
- `Scheduled` exige `ReleaseAt` futuro;
- índice único: `ThemeId + ClassId`.

### Question

Identidade estável da pergunta: `Id`, `SchoolId`, `LanguageId`, `Code`, `CreatedByUserId`, `IsActive`, `CreatedAt`, `UpdatedAt`.

### QuestionVersion

Conteúdo imutável de uma versão: `Id`, `QuestionId`, `VersionNumber`, `SkillCategoryId`, `SkillId`, `Type`, `Difficulty`, `Prompt`, `Explanation`, `Status`, `PublishedAt`, `ArchivedAt`, `CreatedByUserId`, `CreatedAt`.

Tipos do MVP: `MultipleChoice`, `FillBlankWithOptions`. `Matching` fica pós-MVP.

Status: `Draft`, `Published`, `Archived`.

Regras editoriais:

- rascunho pode ser editado livremente;
- publicação valida enunciado, explicação, habilidade, dificuldade e exatamente uma opção correta;
- versão publicada é imutável;
- editar conteúdo publicado cria nova versão `Draft`;
- publicar a nova versão arquiva a anterior para novas sessões, preservando o histórico;
- pergunta usada nunca é apagada fisicamente;
- troca de idioma cria outra pergunta, não outra versão.

### QuestionOption

`Id`, `QuestionVersionId`, `Text`, `IsCorrect`, `Order`.

Mínimo de 2 opções e exatamente uma correta. Opções de versão publicada são imutáveis.

### ThemeQuestion

`Id`, `ThemeId`, `QuestionId`, `Order`, `IsRequired`, `CreatedAt`.

É a única relação pergunta–tema; `Question` não possui `ThemeId`. Ao criar uma sessão, o sistema fixa a versão publicada vigente.

- Uma pergunta pode pertencer a vários temas.
- Índice único: `ThemeId + QuestionId`.
- `Order` é uma preferência editorial; a seleção da sessão continua seguindo novidade, erros e menor uso.
- Enunciados iguais ou muito semelhantes geram aviso editorial, mas não bloqueiam salvamento, pois variações intencionais são permitidas.
- Arquivar um tema bloqueia novas sessões; sessões já iniciadas podem terminar com suas versões fixadas.

## 5. Treinamento

### TrainingSession

`Id`, `SchoolId`, `StudentProfileId`, `BlooId`, `LanguageId`, `ThemeId` opcional, `Difficulty` opcional, `Type`, `Status`, `StartedAt`, `LastActivityAt`, `CompletedAt`, `AbandonedAt`, `TotalQuestions`, `CorrectAnswers`, `BaseXP`, `BonusXP`, `TotalXP`.

Tipos: `FirstHatch`, `ThemeMission`, `Review`. Status: `InProgress`, `Completed`, `Abandoned`.

- `Difficulty` é obrigatória em `ThemeMission` e nula em `FirstHatch`.
- Sessão retomável permanece `InProgress`; `LastActivityAt` identifica inatividade.
- Após 24 horas, aparece como inativa, mas continua retomável.
- `Abandoned` é usado somente quando uma sessão é encerrada definitivamente por regra administrativa; ela não é retomável.

### TrainingQuestion

`Id`, `TrainingSessionId`, `QuestionId`, `QuestionVersionId`, `Order`, `AnsweredAt`.

As perguntas são fixadas na criação da sessão. Índices únicos: `TrainingSessionId + Order` e `TrainingSessionId + QuestionVersionId`.

### TrainingAnswer

`Id`, `TrainingSessionId`, `TrainingQuestionId`, `SelectedOptionId`, `IsCorrect`, `AnsweredAt`, `TimeSpentSeconds`.

Índice único em `TrainingQuestionId` garante uma resposta válida no MVP. Reenvio retorna o resultado existente.

## 6. Progresso temático

### StudentThemeProgress

`Id`, `SchoolId`, `StudentProfileId`, `BlooId`, `ThemeId`, `Status`, `CurrentDifficulty`, `StartedAt`, `CompletedAt`, `UpdatedAt`.

Status: `NotStarted`, `InProgress`, `Completed`. Índice único: `StudentProfileId + BlooId + ThemeId`.

### StudentThemeDifficultyProgress

`Id`, `StudentThemeProgressId`, `ThemeDifficultyId`, `Status`, `SessionsCompleted`, `BestCorrectAnswers`, `BestAccuracy`, `FirstCompletedAt`, `LastCompletedAt`, `UpdatedAt`.

Status: `Locked`, `Available`, `Completed`.

- primeira dificuldade começa `Available`;
- concluir as 5 perguntas marca a etapa `Completed` e libera a seguinte;
- nota não bloqueia a progressão;
- repetições atualizam sessões e melhor resultado;
- concluir todas as etapas marca o tema `Completed`.

## 7. Domínio

### SkillMastery

`Id`, `SchoolId`, `StudentProfileId`, `LanguageId`, `SkillId`, `Attempts`, `CorrectAnswers`, `DistinctSessions`, `MasteryScore`, `Status`, `LastPracticedAt`.

Status: `NotStarted`, `Practicing`, `Mastered`.

Uma habilidade vira `Mastered` com no mínimo 5 respostas, 2 sessões distintas e 80% de acerto global. Cada pergunta atualiza somente sua própria habilidade.

O tema e a habilidade são conceitos diferentes:

- progresso temático mede etapas concluídas;
- domínio mede conhecimento demonstrado nas habilidades;
- `Greetings Master` usa conclusão temática e desempenho avançado;
- `Vocabulary Explorer` exige domínio de `BASIC_GREETINGS` e conclusão de todas as etapas.

## 8. XP do MVP

### FirstHatch

- 60 XP pela primeira conclusão;
- 5 XP por acerto;
- máximo 90 XP;
- nunca recompensa novamente.

### ThemeMission

Na primeira conclusão de cada dificuldade:

- 25 XP base;
- 5 XP por acerto entre as 5 perguntas;
- máximo 50 XP por dificuldade e 200 XP no tema `Greetings`.

Repetições não concedem XP no MVP, mas atualizam domínio e melhor resultado. Isso recompensa avanço e impede cultivo infinito de perguntas fáceis.

## 9. Eventos, títulos e conquistas

### ProgressEvent

`Id`, `SchoolId`, `StudentProfileId`, `BlooId`, `Type`, `XP`, `SourceId`, `SourceType`, `IdempotencyKey`, `CreatedAt`.

Tipos: `FirstTrainingCompleted`, `QuestionAnsweredCorrectly`, `ThemeDifficultyCompleted`, `ThemeCompleted`, `BlooHatched`, `BlooPracticedSkill`, `SkillMasteryChanged`, `BlooLearnedSkill`, `AchievementUnlocked`, `TitleUnlocked`.

Índice único em `IdempotencyKey`.

### Title e StudentTitle

`Title`: `Id`, `LanguageId`, `Name`, `Code`, `Description`, `RequirementType`, `IsActive`.

`StudentTitle`: `Id`, `StudentProfileId`, `BlooId`, `TitleId`, `UnlockedAt`, `IsEquipped`.

`New Hatchling` é simultaneamente título equipável e conquista. O evento `BlooHatched` cria ambos, cada um com seu índice único.

### Achievement e StudentAchievement

`Achievement`: `Id`, `LanguageId`, `Name`, `Code`, `Description`, `RequirementType`, `RequirementJson`, `IsActive`.

`StudentAchievement`: `Id`, `StudentProfileId`, `BlooId`, `AchievementId`, `UnlockedAt`.

Índice único: `StudentProfileId + BlooId + AchievementId`. Condições em [Conquistas do MVP](CONQUISTAS_MVP.md).

## 10. Assets e analytics

### Asset

`Id`, `Key`, `Type`, `Path`, `AltText`, `Width`, `Height`, `IsActive`.

### AnalyticsEvent

`Id`, `SchoolId`, `UserId`, `EventName`, `EntityType`, `EntityId`, `MetadataJson`, `CreatedAt`.

Eventos: login, início/retomada/conclusão de treino, nascimento, resposta, etapa liberada, tema concluído e conquista.

## 11. Pós-MVP preservado

Professor, geração por IA, configurações de provedor, lotes gerados, `Matching`, listening, speaking e escrita permanecem na visão do produto, mas não fazem parte das migrations, APIs ou telas iniciais do MVP.
