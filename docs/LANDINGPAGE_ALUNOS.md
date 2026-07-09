# Landing Page dos Alunos — BirdLeague

Este documento define a primeira landing page voltada aos alunos da Bluebird. A página não é uma landing institucional para vender o produto para escolas. Ela é uma página de convite para fazer o aluno entrar no BirdLeague, realizar o primeiro treino e conhecer seu Bloo.

## 1. Objetivo

Incentivar alunos já cadastrados pela escola a acessarem o BirdLeague e concluírem o primeiro treino.

A página deve provocar uma ideia simples:

> "Tem um Bloo esperando para nascer."

## 2. Público

Público principal:

- Alunos da Bluebird com usuário e senha já criados pela escola.

Públicos secundários:

- Professores que vão apresentar o link em sala.
- Responsáveis que podem ver a página junto com alunos mais novos.

## 3. Contexto de acesso

No MVP, o aluno não precisa escolher idioma manualmente.

Fluxo esperado:

1. Escola cria o usuário e senha do aluno.
2. Escola associa o aluno a uma turma.
3. A turma já possui idioma definido.
4. Aluno acessa a landing.
5. Aluno clica para entrar.
6. Aluno informa usuário e senha.
7. Sistema abre diretamente o idioma associado à turma.
8. Aluno começa o primeiro treino.

Seleção de idioma só deve aparecer quando o aluno tiver matrículas ativas em mais de um idioma.

## 4. Mensagem central

O BirdLeague não deve ser apresentado como prova, tarefa ou sistema escolar tradicional.

Mensagem principal:

> Treine por alguns minutos, ajude o ovo a rachar e conheça seu Bloo.

Mensagens de apoio:

- Cada resposta ajuda o ovo a rachar.
- Errar também faz parte do treino.
- No final do primeiro treino, seu Bloo nasce.
- Depois disso, você continua treinando para ajudar seu Bloo a crescer.

## 5. Nomenclatura

- **Birds:** alunos da comunidade Bluebird.
- **Bloo:** personagem/avatar do aluno no BirdLeague.
- **BirdLeague:** jogo/plataforma de aprendizagem.

Evitar chamar o personagem de "Bird" na landing, para não confundir com os alunos.

## 6. Estrutura da página

### 6.1 Hero

Objetivo: criar vontade imediata de entrar.

Conteúdo sugerido:

```txt
Seu Bloo está pronto para nascer

Entre na BirdLeague, complete seu primeiro treino de Inglês e descubra quem está dentro do ovo.
```

CTA principal:

```txt
Começar agora
```

CTA secundário opcional:

```txt
Ver como funciona
```

Visual:

- Bloo ou ovo em destaque.
- Mockup de celular com a home do treino inicial.
- Marca Bluebird presente, mas sem transformar a página em institucional.

### 6.2 O que vai acontecer

Objetivo: reduzir ansiedade e explicar o fluxo em poucas etapas.

Itens:

1. Entre com o usuário e senha da Bluebird.
2. Comece o primeiro treino.
3. Responda 6 desafios rápidos.
4. Veja o ovo rachar a cada etapa.
5. Conheça seu Bloo.

Não incluir "escolha Inglês" no fluxo principal do MVP.

### 6.3 Não é prova

Objetivo: reforçar segurança emocional.

Texto sugerido:

```txt
Aqui, errar também treina.

Se você não souber uma resposta, tudo bem. O BirdLeague mostra uma dica, explica o caminho e deixa você continuar.
```

### 6.4 Prints ou mockups do sistema

Enquanto a aplicação ainda não existir, usar mockups fiéis à documentação. Quando a aplicação estiver funcional, substituir por screenshots reais.

Mockups prioritários:

- Home antes do nascimento: ovo, progresso `0/6`, botão "Começar treino".
- Pergunta do treino: enunciado curto, alternativas grandes e progresso da sessão.
- Feedback de acerto ou erro: mensagem gentil e explicação curta.
- Ovo rachando: progresso visual após uma resposta.
- Nascimento: Bloo filhote, título `New Hatchling` e campo para nome.

### 6.5 Sua primeira conquista

Objetivo: mostrar recompensa clara.

Elementos:

- Título `New Hatchling`.
- XP do primeiro treino.
- Nome do Bloo.
- Próximo objetivo: ajudar o Bloo a crescer.

Texto sugerido:

```txt
Concluiu o treino? Seu Bloo nasce e você recebe seu primeiro título.
```

### 6.6 O que vem depois

Objetivo: despertar retorno sem prometer escopo fora do MVP como se já estivesse pronto.

Itens:

- Novos treinos.
- Mais evolução visual.
- Habilidades em desenvolvimento.
- Conquistas futuras.
- Desafios da turma em próximas fases.

Usar linguagem de futuro quando o recurso não fizer parte do MVP.

### 6.7 CTA final

Texto sugerido:

```txt
O ovo não vai rachar sozinho.
```

Botão:

```txt
Entrar na BirdLeague
```

## 7. Tom de voz

A landing deve falar como um convite animado, não como comunicado escolar.

Usar:

- Frases curtas.
- Verbos de ação.
- Mensagens de incentivo.
- Humor leve, se couber.
- Clareza sobre o que acontece depois do clique.

Evitar:

- "Avaliação".
- "Prova".
- "Obrigatório".
- "Você falhou".
- Textos longos explicando todas as regras.

## 8. Direção visual

A página deve parecer jovem, clara e energética, mas não infantil demais.

Usar:

- Azul e laranja da Bluebird como base.
- Amarelo para conquista e nascimento.
- Fundos claros com áreas de destaque.
- Bloo, ovo e mockups como elementos principais.
- Botões grandes e fáceis de tocar no celular.

Evitar:

- Visual de sistema administrativo.
- Excesso de texto.
- Rankings agressivos.
- Promessas de batalha como foco principal.

## 9. Assets necessários

Assets mínimos:

- Logo da Bluebird.
- Bloo atual (`assets/BIRD.png`) como referência inicial.
- Ovo.
- Ovo com rachaduras.
- Hatchling/Bloo filhote.
- Mockups das telas do aluno.

Se os assets finais ainda não existirem, a landing pode usar protótipos visuais temporários, desde que estejam alinhados à direção de arte documentada.

## 10. Métricas de sucesso

Métricas recomendadas:

- Cliques no CTA principal.
- Alunos que saem da landing e fazem login.
- Alunos que iniciam o primeiro treino.
- Alunos que concluem o primeiro treino.
- Alunos que chegam ao nascimento do Bloo.
- Alunos que retornam em outro dia.

## 11. Não objetivos

A landing dos alunos não deve tentar explicar:

- Arquitetura técnica.
- Painel administrativo.
- Cadastro de turmas.
- Banco de perguntas.
- Relatórios do professor.
- Todas as funcionalidades futuras.

Esses assuntos pertencem a uma landing institucional ou documentação interna.
