# Fluxos do MVP — BirdLeague

Este documento define os fluxos iniciais que serão construídos no MVP. As decisões abaixo são hipóteses de produto para levar uma primeira versão funcional à escola, validar com uso real e ajustar depois.

## 1. Princípio dos fluxos

O MVP deve provar uma coisa principal: o aluno entende que estudar faz o Bloo nascer e sente vontade de continuar evoluindo.

Por isso, os fluxos devem ser curtos, guiados e com uma ação principal por tela. O aluno não deve precisar entender todas as regras do BirdLeague no primeiro acesso.

## 2. Fluxo do administrador

### 2.1 Login

1. Administrador acessa a plataforma.
2. Informa e-mail e senha.
3. Entra no painel administrativo.

Estados necessários:

- Credenciais inválidas.
- Usuário sem permissão administrativa.
- Esqueci minha senha pode ficar fora do MVP se a redefinição for manual.

### 2.2 Configuração mínima da escola

No MVP, a escola pode ser criada previamente no banco ou em uma tela simples de configuração. A prioridade é não travar o piloto.

Dados mínimos:

- Nome da escola.
- Idioma inicial: Inglês.
- Níveis disponíveis.

### 2.3 Cadastro de turma

1. Administrador abre "Turmas".
2. Clica em criar turma.
3. Informa nome, idioma, nível, período e professor responsável quando houver.
4. Salva.

Dados mínimos:

- Nome da turma.
- Idioma.
- Nível inicial.
- Período ou ano letivo.
- Status ativo/inativo.

### 2.4 Cadastro de aluno

1. Administrador abre "Alunos".
2. Clica em criar aluno.
3. Informa nome, usuário de acesso, senha temporária e turma.
4. Sistema cria o aluno e sua matrícula.
5. Sistema usa o idioma da turma para criar ou localizar o Bloo correspondente.
6. Se o aluno ainda não tiver Bloo naquele idioma, o sistema cria automaticamente um Bloo em estágio Egg.

Dados mínimos:

- Nome.
- Apelido opcional.
- Identificador de login.
- Senha temporária.
- Turma.

O idioma não deve ser escolhido diretamente no cadastro do aluno quando a matrícula estiver ligada a uma turma. O idioma vem da própria turma.

Regra para múltiplos idiomas:

- Um aluno pode estar em mais de uma turma.
- Se as turmas forem de idiomas diferentes, o aluno terá um Bloo para cada idioma.
- Se o aluno entrar em duas turmas do mesmo idioma, continua tendo apenas um Bloo daquele idioma.
- O vínculo do Bloo é sempre `Aluno + Idioma`, não `Aluno + Turma`.

### 2.5 Cadastro de perguntas

1. Administrador abre "Banco de questões".
2. Clica em criar questão.
3. Escolhe idioma, nível, categoria, habilidade, dificuldade e tipo.
4. Escreve enunciado, alternativas, resposta correta e explicação.
5. Salva como rascunho ou publica.

No MVP, usuários administradores podem cadastrar e publicar perguntas. Um fluxo de revisão formal pode entrar depois.

## 3. Fluxo do professor

No MVP, o professor pode usar as mesmas telas administrativas com permissões reduzidas. Se a escola ainda não definir professores, o papel pode existir tecnicamente, mas o piloto pode operar só com administradores.

Fluxos mínimos:

- Ver turmas.
- Ver alunos da turma.
- Ver quem iniciou, quem concluiu o primeiro treino e quem fez o Bloo nascer.
- Cadastrar perguntas se tiver permissão.

## 4. Fluxo do aluno

### 4.1 Login

1. Aluno acessa a plataforma.
2. Informa usuário e senha temporária.
3. Entra diretamente na home do idioma associado à sua turma principal.

No MVP, a troca obrigatória de senha pode ser adiada se a escola controlar as credenciais. Para turmas com alunos mais velhos, pode ser adicionada depois.

### 4.2 Entrada no idioma da turma

1. O sistema identifica a matrícula ativa do aluno.
2. Usa o idioma da turma para abrir o Bloo correspondente.
3. Se o aluno ainda não tiver Bloo naquele idioma, o sistema cria automaticamente um Bloo em estágio Egg.
4. O aluno vê diretamente a home daquele idioma.

No primeiro MVP, o idioma principal será Inglês e o aluno não precisa escolher o idioma manualmente. Uma seleção entre idiomas só será necessária quando o aluno tiver matrículas ativas em mais de um idioma ou quando a escola quiser oferecer essa navegação explicitamente.

### 4.3 Home do idioma antes do nascimento

Elementos principais:

- Ovo em destaque.
- Nome provisório: "Seu Bloo".
- Texto curto: "Complete o primeiro treino para conhecer seu Bloo."
- Botão principal: "Começar treino".
- Indicador de progresso: 0/6 etapas.

### 4.4 Tutorial curto

O tutorial acontece antes ou dentro do primeiro treino. Deve ter no máximo três telas curtas:

1. "Este ovo guarda seu Bloo de Inglês."
2. "Cada resposta ajuda o ovo a rachar."
3. "Erros trazem dicas. O importante é completar o treino."

Depois disso, o aluno começa a responder.

### 4.5 Primeiro treino

1. Sistema apresenta uma pergunta por tela.
2. Aluno escolhe uma resposta.
3. Sistema mostra feedback imediato.
4. Ovo ganha uma rachadura ou avança a animação.
5. Aluno toca em continuar.
6. Ao terminar, o ovo se abre.

### 4.6 Nascimento do Bloo

1. Tela mostra o ovo abrindo.
2. Bloo filhote aparece.
3. Mensagem de conquista.
4. Aluno escolhe o nome do Bloo.
5. Sistema concede o título inicial `New Hatchling`.
6. Aluno vai para a home do idioma.

### 4.7 Home do idioma depois do nascimento

Elementos principais:

- Bloo filhote em destaque.
- Nome escolhido.
- Estágio: Hatchling.
- Progresso para o próximo estágio, mesmo que ainda seja simbólico.
- Botão principal: "Fazer novo treino" ou "Continuar estudando".
- Resumo: último treino, acertos e habilidades praticadas.

## 5. Fluxo de abandono e retorno

Se o aluno sair antes de concluir o primeiro treino:

- A sessão fica como abandonada ou em andamento.
- Ao voltar, o sistema oferece "Continuar treino".
- O progresso visual das rachaduras pode ser retomado.
- Se houver dúvida técnica, é aceitável reiniciar o treino, mas sem duplicar XP.

## 6. Fluxo mínimo de relatórios

O painel do professor/administrador deve mostrar:

- Total de alunos da turma.
- Quantos fizeram primeiro acesso.
- Quantos iniciaram o treino.
- Quantos concluíram o treino.
- Quantos fizeram o Bloo nascer.
- Lista de alunos com status simples.

Status sugeridos:

- Não acessou.
- Acessou.
- Treino iniciado.
- Bloo nasceu.

## 7. Fora do fluxo do MVP

- Loja de itens.
- PvP.
- Ranking entre alunos.
- Boss raids.
- Chat.
- Customização avançada.
- Aplicativo nativo.
