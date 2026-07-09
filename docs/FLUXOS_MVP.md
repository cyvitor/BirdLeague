# Fluxos do MVP â€” BirdLeague

Este documento define os fluxos iniciais que serÃ£o construÃ­dos no MVP. As decisÃµes abaixo sÃ£o hipÃ³teses de produto para levar uma primeira versÃ£o funcional Ã  escola, validar com uso real e ajustar depois.

## 1. PrincÃ­pio dos fluxos

O MVP deve provar uma coisa principal: o aluno entende que estudar faz o Bloo nascer e sente vontade de continuar evoluindo.

Por isso, os fluxos devem ser curtos, guiados e com uma aÃ§Ã£o principal por tela. O aluno nÃ£o deve precisar entender todas as regras do BirdLeague no primeiro acesso.

## 2. Fluxo do administrador

### 2.1 Login

1. Administrador acessa a plataforma.
2. Informa e-mail e senha.
3. Entra no painel administrativo.

Estados necessÃ¡rios:

- Credenciais invÃ¡lidas.
- UsuÃ¡rio sem permissÃ£o administrativa.
- Esqueci minha senha pode ficar fora do MVP se a redefiniÃ§Ã£o for manual.

### 2.2 ConfiguraÃ§Ã£o mÃ­nima da escola

No MVP, a escola pode ser criada previamente no banco ou em uma tela simples de configuraÃ§Ã£o. A prioridade Ã© nÃ£o travar o piloto.

Dados mÃ­nimos:

- Nome da escola.
- Idioma inicial: InglÃªs.
- NÃ­veis disponÃ­veis.

### 2.3 Cadastro de turma

1. Administrador abre "Turmas".
2. Clica em criar turma.
3. Informa nome, idioma, nÃ­vel, perÃ­odo e professor responsÃ¡vel quando houver.
4. Salva.

Dados mÃ­nimos:

- Nome da turma.
- Idioma.
- NÃ­vel inicial.
- PerÃ­odo ou ano letivo.
- Status ativo/inativo.

### 2.4 Cadastro de aluno

1. Administrador abre "Alunos".
2. Clica em criar aluno.
3. Informa nome, usuÃ¡rio de acesso, senha temporÃ¡ria e turma.
4. Sistema cria o aluno e sua matrÃ­cula.
5. Sistema usa o idioma da turma para criar ou localizar o Bloo correspondente.
6. Se o aluno ainda nÃ£o tiver Bloo naquele idioma, o sistema cria automaticamente um Bloo em estÃ¡gio Egg.

Dados mÃ­nimos:

- Nome.
- Apelido opcional.
- Identificador de login.
- Senha temporÃ¡ria.
- Turma.

O idioma nÃ£o deve ser escolhido diretamente no cadastro do aluno quando a matrÃ­cula estiver ligada a uma turma. O idioma vem da prÃ³pria turma.

Regra para mÃºltiplos idiomas:

- Um aluno pode estar em mais de uma turma.
- Se as turmas forem de idiomas diferentes, o aluno terÃ¡ um Bloo para cada idioma.
- Se o aluno entrar em duas turmas do mesmo idioma, continua tendo apenas um Bloo daquele idioma.
- O vÃ­nculo do Bloo Ã© sempre `Aluno + Idioma`, nÃ£o `Aluno + Turma`.

### 2.5 Cadastro de perguntas

1. Administrador abre "Banco de questÃµes".
2. Clica em criar questÃ£o.
3. Escolhe idioma, nÃ­vel, categoria, habilidade, dificuldade e tipo.
4. Escreve enunciado, alternativas, resposta correta e explicaÃ§Ã£o.
5. Salva como rascunho ou publica.

No MVP, usuÃ¡rios administradores podem cadastrar e publicar perguntas. Um fluxo de revisÃ£o formal pode entrar depois.

## 3. Fluxo do professor

No MVP, o professor pode usar as mesmas telas administrativas com permissÃµes reduzidas. Se a escola ainda nÃ£o definir professores, o papel pode existir tecnicamente, mas o piloto pode operar sÃ³ com administradores.

Fluxos mÃ­nimos:

- Ver turmas.
- Ver alunos da turma.
- Ver quem iniciou, quem concluiu o primeiro treino e quem fez o Bloo nascer.
- Cadastrar perguntas se tiver permissÃ£o.

## 4. Fluxo do aluno

### 4.1 Login

1. Aluno acessa a plataforma.
2. Informa usuÃ¡rio e senha temporÃ¡ria.
3. Entra diretamente na home do idioma associado Ã  sua turma principal.

No MVP, a troca obrigatÃ³ria de senha pode ser adiada se a escola controlar as credenciais. Para turmas com alunos mais velhos, pode ser adicionada depois.

### 4.2 Entrada no idioma da turma

1. O sistema identifica a matrÃ­cula ativa do aluno.
2. Usa o idioma da turma para abrir o Bloo correspondente.
3. Se o aluno ainda nÃ£o tiver Bloo naquele idioma, o sistema cria automaticamente um Bloo em estÃ¡gio Egg.
4. O aluno vÃª diretamente a home daquele idioma.

No primeiro MVP, o idioma principal serÃ¡ InglÃªs e o aluno nÃ£o precisa escolher o idioma manualmente. Uma seleÃ§Ã£o entre idiomas sÃ³ serÃ¡ necessÃ¡ria quando o aluno tiver matrÃ­culas ativas em mais de um idioma ou quando a escola quiser oferecer essa navegaÃ§Ã£o explicitamente.

### 4.3 Home do idioma antes do nascimento

Elementos principais:

- Ovo em destaque.
- Nome provisÃ³rio: "Seu Bloo".
- Texto curto: "Complete o primeiro treino para conhecer seu Bloo."
- BotÃ£o principal: "ComeÃ§ar treino".
- Indicador de progresso: 0/6 etapas.

### 4.4 Tutorial curto

O tutorial acontece antes ou dentro do primeiro treino. Deve ter no mÃ¡ximo trÃªs telas curtas:

1. "Este ovo guarda seu Bloo de InglÃªs."
2. "Cada resposta ajuda o ovo a rachar."
3. "Erros trazem dicas. O importante Ã© completar o treino."

Depois disso, o aluno comeÃ§a a responder.

### 4.5 Primeiro treino

1. Sistema apresenta uma pergunta por tela.
2. Aluno escolhe uma resposta.
3. Sistema mostra feedback imediato.
4. Ovo ganha uma rachadura ou avanÃ§a a animaÃ§Ã£o.
5. Aluno toca em continuar.
6. Ao terminar, o ovo se abre.

### 4.6 Nascimento do Bloo

1. Tela mostra o ovo abrindo.
2. Bloo filhote aparece.
3. Mensagem de conquista.
4. Aluno escolhe o nome do Bloo.
5. Sistema concede o tÃ­tulo inicial `New Hatchling`.
6. Aluno vai para a home do idioma.

### 4.7 Home do idioma depois do nascimento

Elementos principais:

- Bloo filhote em destaque.
- Nome escolhido.
- EstÃ¡gio: Hatchling.
- Progresso para o prÃ³ximo estÃ¡gio, mesmo que ainda seja simbÃ³lico.
- BotÃ£o principal: "Fazer novo treino" ou "Continuar estudando".
- Resumo: Ãºltimo treino, acertos e habilidades praticadas.

## 5. Fluxo de abandono e retorno

Se o aluno sair antes de concluir o primeiro treino:

- A sessÃ£o fica como abandonada ou em andamento.
- Ao voltar, o sistema oferece "Continuar treino".
- O progresso visual das rachaduras pode ser retomado.
- Se houver dÃºvida tÃ©cnica, Ã© aceitÃ¡vel reiniciar o treino, mas sem duplicar XP.

## 6. Fluxo mÃ­nimo de relatÃ³rios

O painel do professor/administrador deve mostrar:

- Total de alunos da turma.
- Quantos fizeram primeiro acesso.
- Quantos iniciaram o treino.
- Quantos concluÃ­ram o treino.
- Quantos fizeram o Bloo nascer.
- Lista de alunos com status simples.

Status sugeridos:

- NÃ£o acessou.
- Acessou.
- Treino iniciado.
- Bloo nasceu.

## 7. Fora do fluxo do MVP

- Loja de itens.
- PvP.
- Ranking entre alunos.
- Boss raids.
- Chat.
- CustomizaÃ§Ã£o avanÃ§ada.
- Aplicativo nativo.
