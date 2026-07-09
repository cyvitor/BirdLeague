# ConteÃºdo PedagÃ³gico Inicial â€” BirdLeague

Este documento define como o conteÃºdo do MVP serÃ¡ cadastrado, classificado e usado no primeiro treino.

## 1. DecisÃ£o inicial

O primeiro idioma do MVP serÃ¡ **InglÃªs**.

No inÃ­cio, todos os usuÃ¡rios com acesso de administrador poderÃ£o cadastrar e publicar perguntas. Isso reduz dependÃªncia operacional da escola. Depois, o produto pode evoluir para um fluxo com revisÃ£o pedagÃ³gica formal.

## 2. Por que classificar perguntas

As perguntas precisam ser classificadas para que o sistema consiga:

- Selecionar questÃµes adequadas ao nÃ­vel do aluno.
- Misturar habilidades no treino.
- Mostrar relatÃ³rios Ãºteis para professores.
- Calcular domÃ­nio por habilidade.
- Conceder tÃ­tulos futuros, como `Grammar Guardian` ou `Vocabulary Explorer`.

Sem classificaÃ§Ã£o, o app vira apenas um quiz genÃ©rico. Com classificaÃ§Ã£o, o conhecimento do aluno comeÃ§a a virar progressÃ£o.

## 3. ClassificaÃ§Ã£o obrigatÃ³ria da pergunta

Cada pergunta deve ter:

- Idioma.
- NÃ­vel.
- Categoria.
- Habilidade.
- Dificuldade.
- Tipo de pergunta.
- Status.

Exemplo:

```txt
Idioma: InglÃªs
NÃ­vel: A1
Categoria: Grammar
Habilidade: Verb To Be
Dificuldade: Easy
Tipo: MultipleChoice
Status: Published
```

## 4. Categorias iniciais

Categorias recomendadas para o MVP:

- `Vocabulary`: palavras e expressÃµes.
- `Grammar`: estrutura da lÃ­ngua.
- `Reading`: compreensÃ£o de texto curto.
- `Listening`: compreensÃ£o de Ã¡udio.

Categorias futuras:

- `Speaking`: pronÃºncia e fala.
- `Writing`: escrita.

Speaking e Writing ficam fora da primeira versÃ£o porque exigem avaliaÃ§Ã£o mais complexa.

## 5. Habilidades iniciais para InglÃªs

Para o MVP, criar um conjunto simples de habilidades de nÃ­vel inicial:

### Vocabulary

- Greetings.
- Colors.
- Numbers 1-20.
- Classroom Objects.
- Family Members.
- Common Verbs.

### Grammar

- Verb To Be.
- Personal Pronouns.
- Simple Present Basics.
- Articles A/An.
- Plural Nouns.

### Reading

- Short Introductions.
- Simple Classroom Instructions.
- Personal Information.

### Listening

- Recognizing Greetings.
- Recognizing Numbers.
- Simple Instructions.

Listening pode ser cadastrado, mas sÃ³ deve entrar no MVP se houver Ã¡udios bons e fÃ¡ceis de reproduzir no celular.

## 6. NÃ­veis iniciais

Para comeÃ§ar, usar:

- `Starter`
- `A1`
- `A2`

O MVP pode aceitar B1+ no cadastro, mas o primeiro treino deve usar `Starter` ou `A1`.

## 7. Tipos de pergunta

### MultipleChoice

Pergunta com alternativas.

Exemplo:

```txt
Prompt: What is the correct answer to "How are you?"
A) I'm fine, thanks.
B) I'm twelve.
C) It's blue.
D) At school.
```

### FillBlankWithOptions

Frase com lacuna e opÃ§Ãµes.

Exemplo:

```txt
Prompt: She ___ a student.
A) am
B) is
C) are
D) be
```

### Matching

AssociaÃ§Ã£o simples.

Exemplo:

```txt
Match:
Hello -> OlÃ¡
Goodbye -> Tchau
Thanks -> Obrigado
```

Matching pode entrar depois de MultipleChoice se a interface ficar mais trabalhosa.

## 8. Banco mÃ­nimo para o piloto

Para nÃ£o travar o desenvolvimento, o MVP deve comeÃ§ar com:

- 60 perguntas publicadas de InglÃªs.
- Pelo menos 30 perguntas Starter/A1.
- Pelo menos 20 perguntas de Vocabulary.
- Pelo menos 20 perguntas de Grammar.
- Pelo menos 10 perguntas de Reading.

Para o primeiro treino, separar um conjunto prioritÃ¡rio de 12 a 18 perguntas, das quais o sistema seleciona 6.

O primeiro banco sugerido estÃ¡ em [Banco de perguntas inicial](BANCO_DE_PERGUNTAS_INICIAL.md). Ele contÃ©m 60 perguntas publicadas e 18 perguntas marcadas como prioritÃ¡rias para o treino `FirstHatch`.

## 9. Regras de qualidade da pergunta

Toda pergunta deve:

- Ter enunciado claro e curto.
- Ter apenas uma resposta correta.
- Evitar pegadinhas no primeiro treino.
- Ter explicaÃ§Ã£o simples.
- Estar adequada ao nÃ­vel escolhido.
- Usar vocabulÃ¡rio que o aluno tenha chance de reconhecer.

Evitar:

- Frases longas demais.
- Alternativas ambÃ­guas.
- Humor que dependa de contexto cultural especÃ­fico.
- Perguntas que humilhem o erro.
- ConteÃºdo sensÃ­vel ou pessoal.

## 10. PadrÃ£o de explicaÃ§Ã£o

ExplicaÃ§Ãµes devem ter no mÃ¡ximo 2 frases no MVP.

Modelo:

```txt
A resposta correta Ã© "is" porque usamos "is" com he, she e it.
```

Para erro:

```txt
Quase! Usamos "are" com you, we e they.
```

## 11. DomÃ­nio de habilidade

O domÃ­nio nÃ£o deve ser concedido por uma Ãºnica pergunta. Regra inicial sugerida:

- MÃ­nimo de 5 tentativas na habilidade.
- Tentativas em pelo menos 2 sessÃµes diferentes.
- Pelo menos 80% de acerto.
- Nenhuma sessÃ£o sozinha pode conceder domÃ­nio completo.

Exemplo:

Um aluno pode receber o tÃ­tulo futuro `Grammar Guardian` quando dominar um conjunto de habilidades de gramÃ¡tica, como:

- Verb To Be.
- Personal Pronouns.
- Articles A/An.
- Simple Present Basics.

No MVP, os tÃ­tulos avanÃ§ados podem ficar bloqueados ou aparecer como "em breve". O importante Ã© jÃ¡ registrar os dados corretamente.

## 12. ConteÃºdo do primeiro treino

O primeiro treino deve usar:

- 2 perguntas de Vocabulary.
- 2 perguntas de Grammar.
- 1 pergunta de Reading.
- 1 pergunta mista ou de confianÃ§a.

DistribuiÃ§Ã£o:

- 4 fÃ¡ceis.
- 2 mÃ©dias.
- 0 difÃ­ceis.

## 13. PublicaÃ§Ã£o e revisÃ£o no MVP

Estados:

- `Draft`: pergunta em criaÃ§Ã£o.
- `Published`: pergunta disponÃ­vel para treino.
- `Archived`: pergunta removida de novos treinos, mas preservada no histÃ³rico.

No MVP, administradores podem publicar diretamente. Antes do piloto real, a escola deve revisar manualmente as perguntas publicadas.
