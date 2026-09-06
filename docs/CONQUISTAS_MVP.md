# Conquistas do MVP — BirdLeague

## 1. Princípios

- Conquistas celebram marcos compreensíveis, não substituem a avaliação pedagógica.
- Cada desbloqueio é único por `Student + Bloo + Achievement`.
- O backend é a única fonte de verdade.
- Toda avaliação ocorre após a transação que registra a resposta ou conclui a sessão.
- Reenvios não podem duplicar conquista, XP ou evento.
- Conquista não concede XP adicional no MVP, evitando ciclos de pontuação e simplificando auditoria.

## 2. Conquistas implementadas

| Código | Nome | Condição exata | Momento |
| --- | --- | --- | --- |
| `NEW_HATCHLING` | New Hatchling | Primeiro `BlooHatched` daquele Bloo | Conclusão do `FirstHatch` |
| `FIRST_LESSON` | First Lesson | Primeira sessão `FirstHatch` concluída | Conclusão do `FirstHatch` |
| `FIRST_THEME` | First Theme | Primeira sessão `ThemeMission` iniciada; no seed será `Greetings/Easy` | Criação da sessão |
| `THEME_EXPLORER` | Theme Explorer | Concluir pela primeira vez uma etapa `Easy` de qualquer tema | Conclusão da etapa |
| `BLOO_IS_LEARNING` | Bloo Is Learning | Acumular 5 respostas válidas na mesma habilidade em pelo menos 2 sessões | Registro da resposta |
| `SKILL_LEARNED` | Skill Learned | Habilidade com pelo menos 5 respostas, em 2 sessões, e acerto global ≥ 80% | Recalcular domínio |
| `GREETINGS_CLIMBER` | Greetings Climber | Concluir `Easy`, `Medium` e `Hard` de `Greetings` | Conclusão de `Hard` |
| `GREETINGS_MASTER` | Greetings Master | Concluir as quatro dificuldades e obter ≥ 80% em uma sessão `Hard` ou `VeryHard` | Conclusão da sessão |
| `VOCABULARY_EXPLORER` | Vocabulary Explorer | Dominar `Greetings` e concluir as quatro dificuldades do tema | Recalcular domínio ou concluir tema |
| `ROUTINE_STARTER` | Routine Starter | Concluir `Easy` de `Daily Routines` | Conclusão de `Easy` |
| `HABIT_BUILDER` | Habit Builder | Concluir `Easy`, `Medium` e `Hard` de `Daily Routines` | Conclusão de `Hard` |
| `ROUTINE_MASTER` | Routine Master | Concluir as quatro dificuldades e obter ≥ 80% em `Hard` ou `VeryHard` | Conclusão da sessão |
| `CONSISTENCY_EXPERT` | Consistency Expert | Dominar as três habilidades de `Daily Routines` | Recalcular domínio |
| `ACTION_SPOTTER` | Action Spotter | Concluir `Easy` de `What’s Happening Now?` | Conclusão de `Easy` |
| `ING_CLIMBER` | -ing Climber | Concluir `Easy`, `Medium` e `Hard` de `What’s Happening Now?` | Conclusão de `Hard` |
| `ACTION_MASTER` | Action Master | Concluir as quatro dificuldades e obter ≥ 80% em `Hard` ou `VeryHard` | Conclusão da sessão |
| `NOW_EXPERT` | Now Expert | Dominar as três habilidades de `What’s Happening Now?` | Recalcular domínio |

As conquistas específicas de tema usam regras genéricas persistidas no banco. `Vocabulary Explorer` é uma conquista de categoria; `Consistency Expert` e `Now Expert` exigem domínio de todas as habilidades declaradas na revisão do respectivo tema.

### Participação versus domínio

Conquistas de jornada não exigem acerto mínimo:

- `New Hatchling`, `First Lesson`, `First Theme`, `Theme Explorer` e `Greetings Climber`.

Elas reconhecem participação e conclusão, garantindo que errar não impeça o nascimento nem o avanço pela trilha.

Conquistas ligadas ao conhecimento exigem acertos:

- `Skill Learned`: pelo menos 80% global na habilidade, 5 respostas e 2 sessões;
- `Greetings Master`: concluir todas as dificuldades e obter pelo menos 80% em uma sessão `Hard` ou `VeryHard`;
- `Vocabulary Explorer`: concluir todas as dificuldades e dominar `BASIC_GREETINGS` com pelo menos 80%;
- `Bloo Is Learning` reconhece prática em 2 sessões, mas ainda não declara domínio.

### Texto apresentado ao aluno

| Código | Nome principal | Tradução auxiliar | Descrição curta |
| --- | --- | --- | --- |
| `NEW_HATCHLING` | New Hatchling | Novo Filhote | Seu Bloo nasceu e a jornada de vocês começou. |
| `FIRST_LESSON` | First Lesson | Primeira Lição | Você concluiu o primeiro treino do seu Bloo. |
| `FIRST_THEME` | First Theme | Primeiro Tema | Você começou sua primeira missão de aprendizado. |
| `THEME_EXPLORER` | Theme Explorer | Explorador de Temas | Você concluiu a primeira etapa de um tema. |
| `BLOO_IS_LEARNING` | Bloo Is Learning | Bloo Está Aprendendo | Vocês praticaram a mesma habilidade em mais de um treino. |
| `SKILL_LEARNED` | Skill Learned | Habilidade Aprendida | Seu Bloo demonstrou domínio em uma habilidade. |
| `GREETINGS_CLIMBER` | Greetings Climber | Escalando Greetings | Você avançou de Easy até Hard em Greetings. |
| `GREETINGS_MASTER` | Greetings Master | Mestre de Greetings | Você concluiu todos os desafios de Greetings. |
| `VOCABULARY_EXPLORER` | Vocabulary Explorer | Explorador de Vocabulário | Seu Bloo dominou seus primeiros cumprimentos. |

Na interface em português, mostrar `Nome principal` e a tradução auxiliar abaixo em fonte menor. A descrição nunca menciona fracasso, superioridade sobre colegas ou velocidade.

## 3. Sessões e progressão de Greetings

O banco contém 10 perguntas por dificuldade. Cada sessão temática seleciona 5 perguntas sem repetição dentro da sessão.

- `Easy` começa desbloqueada.
- Concluir uma sessão libera `Medium`.
- Concluir `Medium` libera `Hard`.
- Concluir `Hard` libera `VeryHard`.
- Concluir significa responder às 5 perguntas, independentemente da nota.
- Uma nova tentativa prioriza perguntas ainda não respondidas e depois perguntas erradas.
- Para atingir domínio, o aluno precisa de pelo menos duas sessões; uma única passagem não concede `Skill Learned`.

Isso permite duas sessões diferentes por dificuldade antes de esgotar o conjunto e dá variedade suficiente para conquistas e domínio.

`Greetings` trabalha duas habilidades: `BASIC_GREETINGS` (`Vocabulary`) e `GREETING_COMPREHENSION` (`Reading`). Domínio é calculado separadamente por habilidade; conclusão do tema é registrada em `StudentThemeProgress`.

## 4. XP temático

Na primeira conclusão de cada dificuldade, conceder 25 XP base e 5 XP por acerto, até 50 XP. Repetições atualizam domínio e melhor resultado, mas não concedem XP no MVP. Assim, `Greetings` concede no máximo 200 XP.

## 5. Modelo de avaliação

Cada conquista deve ter `RequirementType` e `RequirementJson` versionados. Exemplos:

```json
{
  "version": 1,
  "event": "ThemeDifficultyCompleted",
  "themeCode": "GREETINGS",
  "requiredDifficulties": ["Easy", "Medium", "Hard"]
}
```

```json
{
  "version": 1,
  "event": "SkillMasteryChanged",
  "skillCode": "BASIC_GREETINGS",
  "minimumAttempts": 5,
  "minimumSessions": 2,
  "minimumAccuracy": 0.8
}
```

## 6. Persistência e idempotência

- Criar índice único em `StudentAchievement(StudentProfileId, BlooId, AchievementId)`.
- Registrar `AchievementUnlocked` em `ProgressEvent` com `SourceId` igual ao `StudentAchievement.Id`.
- Processar a avaliação na mesma transação da conclusão quando possível.
- Se duas requisições concorrerem, o índice único determina um único desbloqueio.
- Repetir a mesma sessão não revoga nem recria conquistas.

## 7. Apresentação

Ao desbloquear, mostrar nome, descrição curta, ícone e botão “Continuar”. A celebração não deve interromper uma pergunta; aparece após o feedback ou no resumo. Conquistas já obtidas ficam no perfil com data de desbloqueio.

A interface separa:

- **Trilha do tema:** etapas concluídas e próxima dificuldade;
- **O que seu Bloo está aprendendo:** `NotStarted`, `Practicing` ou `Mastered` por habilidade.

Durante `Practicing`, mostrar orientação como “Pratique esta habilidade em mais um treino” ou “Vamos revisar algumas respostas?”. Nunca retirar uma etapa temática já concluída porque o domínio ainda não foi alcançado.
