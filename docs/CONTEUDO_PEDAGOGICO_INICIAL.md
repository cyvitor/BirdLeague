# Conteúdo Pedagógico Inicial — BirdLeague

Este documento define como o conteúdo do MVP será cadastrado, classificado e usado no primeiro treino.

## 1. Decisão inicial

O primeiro idioma do MVP será **Inglês**.

No início, todos os usuários com acesso de administrador poderão cadastrar e publicar perguntas. Isso reduz dependência operacional da escola. Depois, o produto pode evoluir para um fluxo com revisão pedagógica formal.

## 2. Por que classificar perguntas

As perguntas precisam ser classificadas para que o sistema consiga:

- Selecionar questões adequadas ao nível do aluno.
- Misturar habilidades no treino.
- Mostrar relatórios úteis para professores.
- Calcular domínio por habilidade.
- Conceder títulos futuros, como `Grammar Guardian` ou `Vocabulary Explorer`.

Sem classificação, o app vira apenas um quiz genérico. Com classificação, o conhecimento do aluno começa a virar progressão.

## 3. Classificação obrigatória da pergunta

Cada pergunta deve ter:

- Idioma.
- Nível.
- Categoria.
- Habilidade.
- Dificuldade.
- Tipo de pergunta.
- Status.

Exemplo:

```txt
Idioma: Inglês
Nível: A1
Categoria: Grammar
Habilidade: Verb To Be
Dificuldade: Easy
Tipo: MultipleChoice
Status: Published
```

## 4. Categorias iniciais

Categorias recomendadas para o MVP:

- `Vocabulary`: palavras e expressões.
- `Grammar`: estrutura da língua.
- `Reading`: compreensão de texto curto.
- `Listening`: compreensão de áudio.

Categorias futuras:

- `Speaking`: pronúncia e fala.
- `Writing`: escrita.

Speaking e Writing ficam fora da primeira versão porque exigem avaliação mais complexa.

## 5. Habilidades iniciais para Inglês

Para o MVP, criar um conjunto simples de habilidades de nível inicial:

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

Listening pode ser cadastrado, mas só deve entrar no MVP se houver áudios bons e fáceis de reproduzir no celular.

## 6. Níveis iniciais

Para começar, usar:

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

Frase com lacuna e opções.

Exemplo:

```txt
Prompt: She ___ a student.
A) am
B) is
C) are
D) be
```

### Matching

Associação simples.

Exemplo:

```txt
Match:
Hello -> Olá
Goodbye -> Tchau
Thanks -> Obrigado
```

Matching pode entrar depois de MultipleChoice se a interface ficar mais trabalhosa.

## 8. Banco mínimo para o piloto

Para não travar o desenvolvimento, o MVP deve começar com:

- 60 perguntas publicadas de Inglês.
- Pelo menos 30 perguntas Starter/A1.
- Pelo menos 20 perguntas de Vocabulary.
- Pelo menos 20 perguntas de Grammar.
- Pelo menos 10 perguntas de Reading.

Para o primeiro treino, separar um conjunto prioritário de 12 a 18 perguntas, das quais o sistema seleciona 6.

O primeiro banco sugerido está em [Banco de perguntas inicial](BANCO_DE_PERGUNTAS_INICIAL.md). Ele contém 60 perguntas publicadas e 18 perguntas marcadas como prioritárias para o treino `FirstHatch`.

## 9. Regras de qualidade da pergunta

Toda pergunta deve:

- Ter enunciado claro e curto.
- Ter apenas uma resposta correta.
- Evitar pegadinhas no primeiro treino.
- Ter explicação simples.
- Estar adequada ao nível escolhido.
- Usar vocabulário que o aluno tenha chance de reconhecer.

Evitar:

- Frases longas demais.
- Alternativas ambíguas.
- Humor que dependa de contexto cultural específico.
- Perguntas que humilhem o erro.
- Conteúdo sensível ou pessoal.

## 10. Padrão de explicação

Explicações devem ter no máximo 2 frases no MVP.

Modelo:

```txt
A resposta correta é "is" porque usamos "is" com he, she e it.
```

Para erro:

```txt
Quase! Usamos "are" com you, we e they.
```

## 11. Domínio de habilidade

O domínio não deve ser concedido por uma única pergunta. Regra inicial sugerida:

- Mínimo de 5 tentativas na habilidade.
- Tentativas em pelo menos 2 sessões diferentes.
- Pelo menos 80% de acerto.
- Nenhuma sessão sozinha pode conceder domínio completo.

Exemplo:

Um aluno pode receber o título futuro `Grammar Guardian` quando dominar um conjunto de habilidades de gramática, como:

- Verb To Be.
- Personal Pronouns.
- Articles A/An.
- Simple Present Basics.

No MVP, os títulos avançados podem ficar bloqueados ou aparecer como "em breve". O importante é já registrar os dados corretamente.

## 12. Conteúdo do primeiro treino

O primeiro treino deve usar:

- 2 perguntas de Vocabulary.
- 2 perguntas de Grammar.
- 1 pergunta de Reading.
- 1 pergunta mista ou de confiança.

Distribuição:

- 4 fáceis.
- 2 médias.
- 0 difíceis.

## 13. Publicação e revisão no MVP

Estados:

- `Draft`: pergunta em criação.
- `Published`: pergunta disponível para treino.
- `Archived`: pergunta removida de novos treinos, mas preservada no histórico.

No MVP, administradores podem publicar diretamente. Antes do piloto real, a escola deve revisar manualmente as perguntas publicadas.
