# Fluxos do MVP — BirdLeague

Este documento descreve os fluxos operacionais do administrador e do aluno. No MVP existem somente `Admin` e `Student`; professor e IA ficam para depois.

## 1. Administrador

### 1.1 Login

1. Informa login e senha.
2. O backend valida credenciais, usuário ativo e papel `Admin`.
3. Entra no dashboard.

Estados: carregando, credenciais inválidas, usuário inativo, sem permissão e indisponibilidade. Recuperação autônoma fica fora do MVP.

### 1.2 Turma

1. Abre “Turmas” e cria uma turma.
2. Informa nome, idioma, identificação de nível usada pela escola e período.
3. Salva como ativa ou inativa.

O nível é informativo. A escola decide fora do sistema se a turma está preparada para um tema.

### 1.3 Aluno, matrícula e Bloo

1. Abre “Alunos”.
2. Informa nome, apelido opcional, login único, senha inicial e turma.
3. Sistema cria `User`, `StudentProfile` e `Enrollment` numa transação.
4. Na primeira matrícula ativa em um idioma, cria idempotentemente um Bloo `Egg` para `Aluno + Idioma`.
5. Outra turma do mesmo idioma reutiliza o mesmo Bloo; outro idioma cria outro Bloo.

O administrador pode ativar/desativar aluno, gerir matrículas e redefinir a senha. O login do aluno apenas garante que o Bloo já exista.

### 1.4 Pergunta nova

1. Abre “Banco de questões” e cria uma pergunta.
2. Define idioma, categoria, habilidade, dificuldade e tipo.
3. Informa enunciado, explicação e opções.
4. Salva como `Draft` ou publica.

Tipos: `MultipleChoice` e `FillBlankWithOptions`. Publicação exige ao menos duas opções e exatamente uma correta.

### 1.5 Editar pergunta publicada

1. Administrador abre uma pergunta publicada.
2. Escolhe “Criar nova versão”.
3. Sistema copia o conteúdo para um novo `Draft`.
4. Administrador edita e pré-visualiza.
5. Ao publicar, a versão anterior deixa de entrar em novas sessões, mas continua ligada às respostas históricas.

Pergunta usada não pode ser apagada fisicamente. Pode ser arquivada. Mudança de idioma exige nova pergunta.

### 1.6 Tema

1. Abre “Temas” e cria um tema `Draft`.
2. Informa título, idioma, descrição, habilidade principal e demais habilidades/categorias.
3. Habilita `Easy`, `Medium`, `Hard` e/ou `VeryHard` e define cinco perguntas por sessão.
4. Associa perguntas publicadas do mesmo idioma às dificuldades correspondentes.
5. Pré-visualiza cada dificuldade.
6. Publica quando cada dificuldade habilitada possuir ao menos cinco perguntas válidas.

A dificuldade é interna ao tema e não representa CEFR. Associar o tema a uma turma declara que a escola já trabalhou aquele conteúdo.

### 1.7 Liberar tema para turma

1. Em tema publicado, seleciona uma ou mais turmas do mesmo idioma.
2. Escolhe liberação imediata ou agenda `ReleaseAt`.
3. O aluno passa a ver o tema quando a associação estiver ativa e a data chegar.

Agendamento pertence à associação tema–turma, não ao estado editorial do tema.

### 1.8 Acompanhamento

Dashboard e detalhe da turma mostram:

- alunos ativos;
- não acessou, acessou, treino iniciado, Bloo nasceu;
- etapa atual e conclusão de `Greetings`;
- melhor resultado por dificuldade;
- habilidades praticadas/dominadas;
- XP e conquistas.

## 2. Aluno

### 2.1 Login e entrada

1. Informa login e senha.
2. Sistema localiza matrículas ativas e garante o Bloo por idioma.
3. No MVP em inglês, abre diretamente a home do Bloo.

Se existirem duas turmas do mesmo idioma, temas disponíveis são unidos sem duplicar o mesmo `ThemeId`.

### 2.2 Egg e tutorial

Home mostra Egg, texto de orientação, progresso `0/6` e “Ensinar meu Bloo”. Antes do primeiro treino, apresenta até três passos explicando que respostas ensinam o Bloo e erros não impedem o nascimento.

### 2.3 FirstHatch

1. Backend cria ou retoma a única sessão `FirstHatch` pendente.
2. Fixa seis perguntas: quatro `Easy` e duas `Medium`.
3. Aluno responde uma por tela e recebe feedback e explicação.
4. Cada resposta avança as rachaduras, acertando ou errando.
5. `LastActivityAt` é atualizado.
6. Após seis respostas, a transação conclui sessão, concede 60 + 5 por acerto, faz o Bloo nascer e cria título e conquista `New Hatchling` e conquista `First Lesson`.

Reenvios retornam o resultado existente. Uma sessão inativa por 24 horas continua retomável da primeira pergunta não respondida.

### 2.4 Nomeação

Após o nascimento, o aluno informa um nome de 2–20 caracteres conforme as regras do modelo. Só depois segue para a home Hatchling.

### 2.5 Greetings

1. Home mostra `Greetings` se o tema estiver liberado para alguma matrícula ativa.
2. `Easy` começa disponível; demais etapas ficam bloqueadas.
3. Ao iniciar, recebe cinco perguntas fixadas para a sessão, sem repetição.
4. Seleção prioriza nunca vistas, depois erradas e depois menos usadas; empates são embaralhados e persistidos na sessão.
5. Responde, recebe feedback e conclui independentemente da nota.
6. Primeira conclusão concede 25 XP + 5 por acerto e libera a próxima dificuldade.
7. Repetições priorizam aprendizado e melhor resultado, mas não concedem XP no MVP.

Após `VeryHard`, o tema fica concluído. Domínio das habilidades é calculado separadamente pelas respostas.

### 2.6 Conquistas

- Nascimento: `New Hatchling` e `First Lesson`.
- Início de `Greetings/Easy`: `First Theme`.
- Conclusão de `Easy`: `Theme Explorer`.
- Cinco respostas da mesma habilidade em duas sessões: `Bloo Is Learning`.
- Cinco respostas, duas sessões e ≥80% na habilidade: `Skill Learned`.
- Conclusão até `Hard`: `Greetings Climber`.
- Quatro dificuldades + ≥80% em uma sessão Hard/VeryHard: `Greetings Master`.
- Todas as dificuldades + domínio de `BASIC_GREETINGS`: `Vocabulary Explorer`.

Conquistas aparecem no resumo e não interrompem uma pergunta.

## 3. Estados de erro essenciais

- tema removido/fechado durante sessão: sessão iniciada pode terminar usando as versões fixadas;
- pergunta arquivada durante sessão: versão fixada continua válida;
- matrícula desativada: novas sessões são bloqueadas; histórico é preservado;
- concorrência/reenvio: índices únicos e transações retornam o resultado já criado;
- falha ao concluir: XP, estágio, progresso e conquistas são confirmados juntos ou revertidos juntos.

## 4. Fora do MVP

Professor, IA, importação por planilha, `Matching`, listening, speaking, escrita aberta, ranking, PvP, bosses, loja, chat e aplicativo nativo.
