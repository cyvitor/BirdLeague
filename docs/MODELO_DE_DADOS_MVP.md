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

### RefreshToken

`Id`, `UserId`, `FamilyId`, `TokenHash`, `ParentTokenId` opcional, `ReplacedByTokenId` opcional, `CreatedAt`, `ExpiresAt`, `RevokedAt` opcional, `RevocationReason` opcional, `CreatedByIpHash` opcional, `UserAgentHash` opcional.

- O token puro existe apenas no cookie; o banco armazena somente o hash.
- Índices em `UserId + ExpiresAt` e `FamilyId`; `TokenHash` é único.
- Cada renovação revoga o token usado e cria seu sucessor na mesma família.
- Reutilizar token já rotacionado revoga toda a família.
- Troca de senha, redefinição, desativação e logout global revogam todos os tokens ativos do usuário.

### LoginAttempt

`Id`, `SchoolId` opcional, `NormalizedLoginHash`, `IpHash` opcional, `Succeeded`, `FailureReason` opcional, `CreatedAt`.

Índices em `NormalizedLoginHash + CreatedAt` e `IpHash + CreatedAt`. Dados são retidos somente pelo período necessário para rate limiting e auditoria de segurança.

### StudentProfile

`Id`, `UserId`, `SchoolId`, `FullName`, `Nickname` opcional, `CreatedAt`, `UpdatedAt`.

Data de nascimento e dados de responsável não são necessários para codificar o MVP.

### Language

`Id`, `SchoolId`, `Name`, `Code`, `IsActive`. Seed: `English/en`.

### Class

`Id`, `SchoolId`, `LanguageId`, `Name`, `LevelLabel` opcional, `Period`, `IsActive`, `CreatedAt`, `UpdatedAt`.

`LevelLabel` é apenas a nomenclatura usada pela escola. Não controla automaticamente perguntas ou dificuldades. Ao associar um tema, a escola declara que aquela turma já estudou o assunto.

Ao desativar uma turma:

- novas matrículas e novas sessões são bloqueadas;
- matrículas e histórico são preservados;
- sessões já iniciadas podem ser concluídas;
- temas deixam de aparecer para novos inícios por meio daquela turma;
- reativar a turma restaura as associações ainda ativas.

### Enrollment

`Id`, `SchoolId`, `StudentProfileId`, `ClassId`, `Status`, `StartedAt`, `EndedAt`.

Status: `Active`, `Paused`, `Finished`, `Canceled`. Índice impede duas matrículas ativas idênticas.

- Pausar, finalizar ou cancelar bloqueia novas sessões por aquela matrícula.
- Sessão já iniciada pode terminar com o conteúdo fixado.
- No MySQL, a unicidade de matrícula ativa será protegida por transação e chave lógica, pois índice parcial não está disponível como em alguns outros bancos.

## 3. Bloo

### Bloo

`Id`, `SchoolId`, `StudentProfileId`, `LanguageId`, `Name`, `HasCustomName`, `Stage`, `XP`, `CreatedAt`, `UpdatedAt`, `HatchedAt`.

- Estágios do MVP: `Egg`, `Hatchling`.
- Índice único: `StudentProfileId + LanguageId`.
- É criado idempotentemente na primeira matrícula ativa do aluno naquele idioma.
- O login apenas garante sua existência; não cria duplicata.

Nome do Bloo:

- valor padrão: `Bloo`, com `HasCustomName = false`;
- nome personalizado é opcional após o nascimento;
- 2 a 20 caracteres após `trim`;
- letras Unicode, números, espaço, hífen e apóstrofo;
- sem espaços repetidos ou apenas números;
- lista de termos proibidos validada no backend;
- o aluno pode pular a nomeação e continuar usando `Bloo`;
- pode personalizar ou alterar depois, preservando auditoria básica.

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

Identidade estável do tema: `Id`, `SchoolId`, `LanguageId`, `Code`, `Status`, `CurrentPublishedVersionId` opcional, `CreatedByUserId`, `CreatedAt`, `UpdatedAt`.

Status operacional: `Active`, `Closed`, `Archived`.

- Tema não possui nível CEFR no MVP.
- `CurrentPublishedVersionId` aponta para a revisão usada em novas associações e deve pertencer ao próprio tema.
- `Closed`: bloqueia novas sessões, permanece visível no histórico e pode ser reaberto pelo administrador.
- `Archived`: não aparece para novos usos nem para o aluno, não pode ser reaberto no MVP e permanece no histórico.
- Sessões iniciadas antes de fechar ou arquivar podem terminar com suas versões fixadas.

### ThemeVersion

Conteúdo editorial versionado: `Id`, `ThemeId`, `VersionNumber`, `Title`, `Description`, `Status`, `CreatedByUserId`, `PublishedAt`, `ArchivedAt`, `CreatedAt`, `UpdatedAt`.

Status editorial: `Draft`, `Published`, `Archived`. Índice único: `ThemeId + VersionNumber`.

- Apenas o único `Draft` corrente pode ser editado.
- Publicar valida a revisão inteira, torna seu conteúdo imutável e atualiza `Theme.CurrentPublishedVersionId` na mesma transação.
- Uma revisão publicada precisa ter exatamente uma habilidade principal e ao menos 5 perguntas publicadas em cada dificuldade habilitada.
- “Criar nova revisão” copia a versão publicada para o próximo `VersionNumber` em estado `Draft`.
- Publicar uma revisão não modifica `ThemeClass`, sessões ou respostas existentes automaticamente.
- Após a primeira liberação do tema, revisões podem alterar título, descrição e substituir/adicionar perguntas sem mudar dificuldades habilitadas, ordem ou `QuestionsPerSession`. Mudança estrutural exige duplicar o tema no MVP.
- Uma versão publicada nunca é apagada fisicamente.

### ThemeSkill

`Id`, `ThemeVersionId`, `SkillId`, `IsPrimary`, `CreatedAt`.

Permite que um tema desenvolva várias habilidades sem duplicar domínio. Deve existir exatamente uma habilidade principal por tema.

### ThemeCategory

`Id`, `ThemeVersionId`, `SkillCategoryId`, `CreatedAt`.

Derivável pelas habilidades, mas persistido para filtros e validação editorial.

### ThemeDifficulty

`Id`, `ThemeVersionId`, `Difficulty`, `Order`, `IsEnabled`, `QuestionsPerSession`, `CreatedAt`, `UpdatedAt`.

Dificuldades: `Easy`, `Medium`, `Hard`, `VeryHard`. No seed `Greetings`, todas ficam habilitadas e `QuestionsPerSession = 5`.

### ThemeClass

`Id`, `SchoolId`, `ThemeId`, `ThemeVersionId`, `ClassId`, `ReleaseMode`, `ReleaseAt`, `DueAt`, `IsActive`, `CreatedAt`, `UpdatedAt`.

`ReleaseMode`: `Immediate`, `Scheduled`. O agendamento existe apenas aqui; `Theme` não possui estado `Scheduled`.

`DueAt` é apenas uma orientação de prazo no MVP: pode ser exibido ao aluno, mas não bloqueia início, conclusão ou revisão depois da data.

Validações:

- tema e turma pertencem à mesma escola e idioma;
- somente uma `ThemeVersion` publicada, pertencente a um tema `Active`, pode ficar disponível;
- `Scheduled` exige `ReleaseAt` futuro;
- índice único: `ThemeId + ClassId`.

`ThemeVersionId` fica fixado na associação. Uma revisão nova só chega à turma por uma ação explícita de “Atualizar versão”. A atualização afeta novas sessões; sessões em andamento preservam seu snapshot. Dificuldades já concluídas continuam concluídas, e sessões futuras usam as perguntas da nova revisão. Se a turma já iniciou o tema, a API rejeita revisão estrutural com `409 theme_revision_incompatible`.

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

`Id`, `ThemeVersionId`, `QuestionVersionId`, `Order`, `IsRequired`, `CreatedAt`.

É a única relação pergunta–tema; `Question` não possui `ThemeId`. Uma revisão publicada aponta para versões específicas e imutáveis, portanto uma nova versão de pergunta não altera temas existentes silenciosamente.

- Uma versão pode pertencer a vários temas.
- Índice único: `ThemeVersionId + QuestionVersionId`.
- `Order` é uma preferência editorial; a seleção da sessão continua seguindo novidade, erros e menor uso.
- Enunciados iguais ou muito semelhantes geram aviso editorial, mas não bloqueiam salvamento, pois variações intencionais são permitidas.
- Arquivar um tema bloqueia novas sessões; sessões já iniciadas podem terminar com suas versões fixadas.
- Para usar uma versão nova de pergunta, o administrador cria uma revisão do tema, substitui a associação e publica; depois atualiza explicitamente as turmas desejadas. Sessões antigas continuam com a versão anterior.

## 5. Treinamento

### TrainingTemplate

`Id`, `SchoolId`, `LanguageId`, `Code`, `Type`, `TotalQuestions`, `IsActive`, `CreatedAt`, `UpdatedAt`.

Seed do MVP: `FIRST_HATCH_EN`, tipo `FirstHatch`, total 6. Índice único: `SchoolId + Code`.

### TrainingTemplateDifficulty

`Id`, `TrainingTemplateId`, `Difficulty`, `QuestionCount`.

Seed: `Easy = 4`, `Medium = 2`. Índice único: `TrainingTemplateId + Difficulty`.

### TrainingTemplateQuestion

`Id`, `TrainingTemplateId`, `QuestionVersionId`, `IsActive`, `CreatedAt`.

Representa o conjunto elegível do treino. O seed associa as 24 versões `FirstHatch` publicadas. Índice único: `TrainingTemplateId + QuestionVersionId`.

### TrainingSession

`Id`, `SchoolId`, `StudentProfileId`, `BlooId`, `LanguageId`, `TrainingTemplateId` opcional, `ThemeId` opcional, `ThemeVersionId` opcional, `Difficulty` opcional, `Type`, `Status`, `ActiveSessionKey` opcional, `StartedAt`, `LastActivityAt`, `CompletedAt`, `AbandonedAt`, `TotalQuestions`, `CorrectAnswers`, `BaseXP`, `BonusXP`, `TotalXP`.

Tipos: `FirstHatch`, `ThemeMission`, `Review`. Status: `InProgress`, `Completed`, `Abandoned`.

- `Difficulty` é obrigatória em `ThemeMission` e nula em `FirstHatch`.
- `ThemeVersionId` é obrigatório em `ThemeMission` e fixa a revisão usada até o fim da sessão.
- `TrainingTemplateId` é obrigatório em `FirstHatch`.
- `ActiveSessionKey` é único enquanto a sessão está `InProgress` e vira nulo ao encerrar. Para o nascimento usa `FIRST_HATCH:{BlooId}`, impedindo duas sessões pendentes no MySQL.
- Sessão retomável permanece `InProgress`; `LastActivityAt` identifica inatividade.
- Após 24 horas, aparece como inativa, mas continua retomável.
- `Abandoned` é usado somente quando uma sessão é encerrada definitivamente por regra administrativa; ela não é retomável.

### TrainingQuestion

`Id`, `TrainingSessionId`, `QuestionId`, `QuestionVersionId`, `Order`, `AnsweredAt`.

As perguntas são fixadas na criação da sessão. Índices únicos: `TrainingSessionId + Order` e `TrainingSessionId + QuestionVersionId`.

### TrainingAnswer

`Id`, `TrainingSessionId`, `TrainingQuestionId`, `SelectedOptionId`, `IsCorrect`, `AnsweredAt`, `TimeSpentSeconds`.

Índice único em `TrainingQuestionId` garante uma resposta válida no MVP. Reenvio retorna o resultado existente.

Criação de sessão, resposta e conclusão usam transações curtas. A conclusão verifica novamente estado, quantidade de respostas e eventos existentes antes de atualizar XP, estágio, domínio e conquistas. Conflitos serializáveis são repetidos com limite controlado; chamadas HTTP continuam protegidas por `IdempotencyRecord`.

## 6. Progresso temático

### StudentThemeProgress

`Id`, `SchoolId`, `StudentProfileId`, `BlooId`, `ThemeId`, `Status`, `CurrentDifficulty`, `StartedAt`, `CompletedAt`, `UpdatedAt`.

Status: `NotStarted`, `InProgress`, `Completed`. Índice único: `StudentProfileId + BlooId + ThemeId`.

### StudentThemeDifficultyProgress

`Id`, `StudentThemeProgressId`, `Difficulty`, `LastThemeVersionId`, `Status`, `SessionsCompleted`, `BestCorrectAnswers`, `BestAccuracy`, `FirstCompletedAt`, `LastCompletedAt`, `UpdatedAt`.

Índice único: `StudentThemeProgressId + Difficulty`. O progresso usa a dificuldade estável, e não o ID de uma configuração versionada; assim, uma revisão compatível não remove etapas concluídas. `LastThemeVersionId` registra a revisão da sessão mais recente para auditoria.

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

### IdempotencyRecord

`Id`, `SchoolId`, `UserId`, `Route`, `IdempotencyKey`, `RequestHash`, `ResponseStatus`, `ResponseJson`, `CreatedAt`, `ExpiresAt`.

- Índice único: `SchoolId + UserId + Route + IdempotencyKey`.
- Mesma chave e mesmo payload retornam a resposta armazenada.
- Mesma chave com payload diferente retorna conflito.
- Retenção mínima de 24 horas; índices de domínio continuam sendo a proteção permanente.

### AuditLog

`Id`, `SchoolId` opcional, `ActorUserId` opcional, `Action`, `EntityType` opcional, `EntityId` opcional, `MetadataJson` opcional, `IpHash` opcional, `CreatedAt`.

Registra login, troca/redefinição de senha, revogação, criação/desativação de usuário, alterações de matrícula, publicação/versionamento/arquivamento de perguntas e temas. É separado de analytics e progresso e não contém senhas, tokens ou respostas sensíveis.

### Asset

`Id`, `Key`, `Type`, `Path`, `AltText`, `Width`, `Height`, `IsActive`.

### AnalyticsEvent

`Id`, `SchoolId`, `UserId`, `EventName`, `EntityType`, `EntityId`, `MetadataJson`, `CreatedAt`.

Eventos: login, início/retomada/conclusão de treino, nascimento, resposta, etapa liberada, tema concluído e conquista.

## 11. Pós-MVP preservado

Professor, geração por IA, configurações de provedor, lotes gerados, `Matching`, listening, speaking e escrita permanecem na visão do produto, mas não fazem parte das migrations, APIs ou telas iniciais do MVP.
