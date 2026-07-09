# Arquitetura TÃ©cnica â€” BirdLeague

## 1. Objetivo

Este documento define uma direÃ§Ã£o tÃ©cnica inicial para o BirdLeague. A prioridade Ã© entregar o MVP rapidamente sem criar uma base descartÃ¡vel, mantendo espaÃ§o para competiÃ§Ãµes, eventos e aplicativos mÃ³veis no futuro.

As decisÃµes podem ser revistas com dados reais, mas mudanÃ§as devem ser registradas para que a arquitetura continue compreensÃ­vel.

## 2. DireÃ§Ã£o recomendada

O MVP serÃ¡ uma aplicaÃ§Ã£o web responsiva composta por:

- Um portal administrativo para professores e administradores.
- Uma experiÃªncia de aluno otimizada para celular.
- Uma API central responsÃ¡vel pelas regras e pelos dados.
- Um banco de dados relacional.
- Armazenamento de imagens e Ã¡udios.

Uma aplicaÃ§Ã£o web responsiva reduz o custo inicial, funciona em computadores e celulares e permite validar o produto antes de manter aplicativos nativos. Futuramente, o aplicativo do aluno poderÃ¡ ser distribuÃ­do como PWA ou criado com tecnologia mÃ³vel consumindo a mesma API.

## 3. Tecnologias

### 3.1 Backend

- **Plataforma:** .NET 10 com ASP.NET Core Web API.
- **Linguagem:** C#.
- **Acesso a dados:** Entity Framework Core.
- **Banco de dados:** MySQL.
- **AutenticaÃ§Ã£o:** ASP.NET Core Identity com tokens de acesso e renovaÃ§Ã£o.
- **ValidaÃ§Ã£o:** validaÃ§Ã£o explÃ­cita na camada de aplicaÃ§Ã£o.
- **DocumentaÃ§Ã£o da API:** OpenAPI.
- **Tarefas em segundo plano:** comeÃ§ar com serviÃ§os internos simples; adotar uma fila somente quando houver necessidade comprovada.
- **Testes:** xUnit para testes unitÃ¡rios e de integraÃ§Ã£o.

.NET oferece boa seguranÃ§a de tipos, ferramentas maduras para autenticaÃ§Ã£o e dados e uma evoluÃ§Ã£o natural para recursos em tempo real por meio de SignalR quando as batalhas chegarem.

### 3.2 Frontend web

- **Framework:** Next.js com React e TypeScript.
- **Estilos:** Tailwind CSS com componentes prÃ³prios do BirdLeague.
- **FormulÃ¡rios:** React Hook Form e validaÃ§Ã£o por esquema.
- **ComunicaÃ§Ã£o com a API:** cliente tipado gerado ou mantido a partir do contrato OpenAPI.
- **Estado remoto:** TanStack Query.
- **Testes de componentes:** Vitest e Testing Library.
- **Testes ponta a ponta:** Playwright.

O portal administrativo e a interface do aluno podem comeÃ§ar na mesma aplicaÃ§Ã£o Next.js, com Ã¡reas e layouts separados. Isso reduz duplicaÃ§Ã£o no MVP sem impedir uma separaÃ§Ã£o futura.

### 3.3 Aplicativo mÃ³vel

NÃ£o haverÃ¡ aplicativo nativo no primeiro MVP. A experiÃªncia do aluno serÃ¡ responsiva e preparada para instalaÃ§Ã£o como PWA em uma etapa posterior.

Se notificaÃ§Ãµes, uso offline ou recursos nativos se tornarem essenciais, a direÃ§Ã£o sugerida Ã© React Native com Expo, reutilizando TypeScript, contratos da API e parte do conhecimento da equipe.

### 3.4 Infraestrutura

- ContÃªineres Docker para desenvolvimento e implantaÃ§Ã£o.
- MySQL gerenciado em produÃ§Ã£o.
- Armazenamento compatÃ­vel com S3 para imagens, Ã¡udios e futuros assets.
- CDN para entrega dos assets do Bloo.
- CI/CD para testes, build e implantaÃ§Ã£o.
- Ambientes separados de desenvolvimento, homologaÃ§Ã£o e produÃ§Ã£o.
- Monitoramento de erros, logs estruturados e mÃ©tricas bÃ¡sicas desde o MVP.

O provedor de nuvem nÃ£o precisa ser definido antes de conhecer orÃ§amento, regiÃ£o dos usuÃ¡rios e experiÃªncia da equipe.

## 4. OrganizaÃ§Ã£o da soluÃ§Ã£o

O backend comeÃ§arÃ¡ como um monÃ³lito modular. Um Ãºnico deploy Ã© mais simples para o MVP, enquanto mÃ³dulos bem definidos evitam que as regras se misturem.

MÃ³dulos iniciais:

- **Identidade:** login, credenciais, papÃ©is e sessÃµes.
- **OrganizaÃ§Ã£o escolar:** escola, idiomas, turmas, matrÃ­culas e perÃ­odos.
- **ConteÃºdo:** banco de questÃµes, alternativas, explicaÃ§Ãµes e assets.
- **Treinamento:** sessÃµes, seleÃ§Ã£o de questÃµes, respostas e feedback.
- **ProgressÃ£o:** Bloos, XP, estÃ¡gios, domÃ­nio e conquistas.
- **RelatÃ³rios:** visÃµes de progresso para professor e aluno.

MÃ³dulos futuros:

- Cartas e poderes.
- Batalhas.
- Guerras entre turmas.
- Eventos e bosses.
- Rankings e ligas.
- NotificaÃ§Ãµes.

MicroserviÃ§os nÃ£o sÃ£o recomendados no inÃ­cio. Partes especÃ­ficas podem ser extraÃ­das quando escala, isolamento operacional ou ritmo de desenvolvimento justificarem a complexidade.

## 5. PapÃ©is e permissÃµes

### Administrador

- Configura a escola.
- Gerencia professores, idiomas, turmas e alunos.
- Acessa relatÃ³rios gerais.
- Gerencia regras e perÃ­odos.
- Pode importar e exportar dados autorizados.

### Professor

- Visualiza e gerencia suas turmas.
- Cadastra ou recomenda conteÃºdos conforme permissÃ£o.
- Acompanha alunos matriculados em suas turmas.
- Registra ou valida atividades autorizadas.

### Aluno

- Acessa somente o prÃ³prio perfil.
- Acessa diretamente o idioma associado Ã  sua turma principal no MVP.
- Pode visualizar mÃºltiplos idiomas e Bloos associados quando tiver mais de uma matrÃ­cula ativa.
- Realiza treinamentos.
- Consulta progresso, conquistas e histÃ³rico permitido.

PermissÃµes devem ser verificadas no backend. Ocultar um botÃ£o no frontend nÃ£o Ã© controle de acesso.

## 6. Modelo conceitual de dados

### Entidades escolares

- **School:** organizaÃ§Ã£o proprietÃ¡ria dos dados.
- **User:** identidade usada para autenticaÃ§Ã£o.
- **StudentProfile:** informaÃ§Ãµes do aluno associadas ao usuÃ¡rio.
- **TeacherProfile:** informaÃ§Ãµes do professor associadas ao usuÃ¡rio.
- **Language:** idioma oferecido pela escola.
- **Class:** turma, perÃ­odo, professor e idioma principal.
- **Enrollment:** associaÃ§Ã£o entre aluno e turma.

Um aluno poderÃ¡ possuir vÃ¡rias matrÃ­culas. O vÃ­nculo do Bloo serÃ¡ com aluno e idioma, nÃ£o apenas com a turma. Assim, uma troca de turma nÃ£o apaga a evoluÃ§Ã£o conquistada naquele idioma.

### Entidades pedagÃ³gicas

- **Skill:** habilidade especÃ­fica dentro de um idioma e nÃ­vel.
- **Question:** enunciado, tipo, dificuldade e explicaÃ§Ã£o.
- **QuestionOption:** alternativas quando aplicÃ¡vel.
- **QuestionAsset:** Ã¡udio, imagem ou outro material.
- **TrainingSession:** inÃ­cio, fim, objetivo e estado de um treino.
- **TrainingAnswer:** resposta, resultado, tempo e feedback apresentado.
- **SkillMastery:** progresso do aluno em determinada habilidade.

### Entidades de progressÃ£o

- **Bloo:** avatar do aluno em um idioma.
- **BlooStage:** estÃ¡gio visual e requisitos de evoluÃ§Ã£o.
- **ProgressEvent:** registro de XP ou progresso, sua origem e data.
- **Achievement:** definiÃ§Ã£o de uma conquista.
- **StudentAchievement:** conquista recebida pelo aluno.
- **Title:** tÃ­tulo que pode ser exibido no perfil.

O histÃ³rico de progresso deve registrar a origem de cada alteraÃ§Ã£o. Isso permite auditoria e evita valores de XP impossÃ­veis de explicar.

## 7. Assets do Bloo e acessÃ³rios

Os assets do Bloo devem ser organizados para permitir evoluÃ§Ã£o visual e personalizaÃ§Ã£o sem gerar uma imagem final para cada combinaÃ§Ã£o possÃ­vel. A direÃ§Ã£o tÃ©cnica recomendada Ã© tratar o personagem como uma composiÃ§Ã£o em camadas:

1. Base do Bloo.
2. Roupa ou variaÃ§Ã£o corporal.
3. AcessÃ³rios, como Ã³culos, chapÃ©us e medalhas.
4. Efeitos visuais temporÃ¡rios, como brilho de conquista.

Uma estrutura inicial de pastas pode seguir este formato:

```txt
assets/characters/bloo-bb/baby/
assets/characters/bloo-bb/kid/
assets/characters/bloo-bb/teen/
assets/characters/bloo-bb/adult/
assets/accessories/glasses/
assets/accessories/hats/
assets/accessories/medals/
assets/effects/
```

Cada fase do Bloo deve ter poses nomeadas de forma consistente, por exemplo `idle`, `happy`, `thinking`, `celebrate`, `run`, `victory` e `defeat`. Os acessÃ³rios devem ter fundo transparente e, quando necessÃ¡rio, variaÃ§Ãµes por Ã¢ngulo, como `front`, `right-3q` e `left-3q`.

Para que Ã³culos e outros acessÃ³rios encaixem corretamente em cada fase, o app deve manter metadados de pontos de encaixe. Esses dados podem ficar em JSON ou no banco, dependendo do volume e da necessidade de ediÃ§Ã£o administrativa:

```json
{
  "blooBb": {
    "baby": {
      "idle": {
        "glasses": { "x": 120, "y": 80, "scale": 0.75, "rotation": 0 }
      }
    },
    "adult": {
      "idle": {
        "glasses": { "x": 155, "y": 70, "scale": 1.1, "rotation": 0 }
      }
    }
  }
}
```

No MVP, ainda Ã© aceitÃ¡vel usar imagens fixas para Egg, rachaduras e Hatchling. Mesmo assim, os nomes de arquivos, dimensÃµes e enquadramentos jÃ¡ devem ser definidos pensando na futura composiÃ§Ã£o em camadas. Isso evita retrabalho quando a personalizaÃ§Ã£o cosmÃ©tica entrar no produto.

## 8. Banco de questÃµes

Cada questÃ£o deve registrar, no mÃ­nimo:

- Idioma.
- NÃ­vel de proficiÃªncia.
- Tema e habilidade.
- Tipo de questÃ£o.
- Dificuldade.
- Enunciado.
- Resposta correta ou critÃ©rios de correÃ§Ã£o.
- ExplicaÃ§Ã£o pedagÃ³gica.
- Estado editorial: rascunho, em revisÃ£o, publicada ou arquivada.
- Autor e revisor.
- Data de criaÃ§Ã£o e alteraÃ§Ã£o.

Tipos iniciais recomendados:

- MÃºltipla escolha.
- Completar lacuna com opÃ§Ãµes.
- AssociaÃ§Ã£o simples.
- CompreensÃ£o de Ã¡udio com mÃºltipla escolha.

Respostas abertas, pronÃºncia avaliada automaticamente e correÃ§Ã£o por inteligÃªncia artificial devem vir depois. Elas exigem critÃ©rios de avaliaÃ§Ã£o, tratamento de incerteza, custo e revisÃ£o de privacidade.

QuestÃµes jÃ¡ respondidas podem reaparecer em variaÃ§Ãµes e revisÃµes espaÃ§adas. O sistema nÃ£o deve considerar domÃ­nio a partir de uma Ãºnica resposta.

## 9. Motor de treinamento do MVP

O motor inicial pode usar regras determinÃ­sticas e compreensÃ­veis:

1. Selecionar o idioma e o objetivo da sessÃ£o.
2. Priorizar questÃµes adequadas ao nÃ­vel atribuÃ­do ao aluno.
3. Misturar conteÃºdo novo com revisÃ£o.
4. Evitar repetiÃ§Ã£o imediata da mesma questÃ£o.
5. Registrar respostas e apresentar feedback.
6. Atualizar progresso ao concluir a sessÃ£o.

No treinamento de nascimento, a sequÃªncia pode ser predefinida por nÃ­vel e idioma. A evoluÃ§Ã£o para Hatchling ocorre pela conclusÃ£o. O desempenho Ã© armazenado para orientar treinos seguintes, mas nÃ£o bloqueia o nascimento.

Uma adaptaÃ§Ã£o mais sofisticada deve ser introduzida apenas depois de haver volume de respostas suficiente para avaliar suas decisÃµes.

## 10. ProgressÃ£o e consistÃªncia

Regras de XP e evoluÃ§Ã£o devem residir no backend. O cliente apenas apresenta o resultado.

Todo evento de progresso deve ser:

- IdentificÃ¡vel por origem.
- Idempotente, para evitar pontuaÃ§Ã£o duplicada em reenvios.
- Registrado com data e aluno.
- Limitado conforme as regras da atividade.

Para o MVP:

- A sessÃ£o concluÃ­da concede progresso base.
- Acertos podem conceder um bÃ´nus pequeno.
- O estÃ¡gio Egg evolui para Hatchling ao concluir o primeiro treino.
- O aluno visualiza o progresso para o prÃ³ximo objetivo, ainda que a prÃ³xima evoluÃ§Ã£o nÃ£o esteja implementada.

## 11. Interface administrativa

O portal serÃ¡ desenhado para uso em desktop e tablet, com navegaÃ§Ã£o lateral.

### Painel inicial

- Quantidade de alunos ativos.
- Turmas ativas.
- ParticipaÃ§Ã£o nos Ãºltimos dias.
- Alunos que ainda nÃ£o iniciaram.
- Atalhos para criar turma e cadastrar alunos.

### Idiomas

- Listagem de idiomas oferecidos.
- AtivaÃ§Ã£o e desativaÃ§Ã£o.
- ConfiguraÃ§Ã£o de nÃ­veis disponÃ­veis.

### Turmas

- Criar e editar turma.
- Definir idioma, nÃ­vel, perÃ­odo e professores.
- Matricular ou remover alunos.
- Visualizar progresso agregado.

### Alunos

- Cadastro individual.
- ImportaÃ§Ã£o por planilha em fase posterior ou ainda no MVP se o volume exigir.
- AssociaÃ§Ã£o a mÃºltiplas turmas.
- GeraÃ§Ã£o e redefiniÃ§Ã£o de senha temporÃ¡ria.
- Estado do primeiro acesso.
- VisÃ£o resumida de Bloos e progresso.

### Banco de questÃµes

- Filtros por idioma, nÃ­vel, tema, habilidade e estado.
- CriaÃ§Ã£o e ediÃ§Ã£o de questÃµes.
- PrÃ©-visualizaÃ§Ã£o como aluno.
- Fluxo simples de revisÃ£o e publicaÃ§Ã£o.
- Arquivamento sem apagar o histÃ³rico de respostas.

### RelatÃ³rios

- ParticipaÃ§Ã£o por turma.
- ConclusÃ£o do tutorial e primeiro treino.
- Acertos por habilidade.
- Alunos que podem precisar de acompanhamento.

RelatÃ³rios nÃ£o devem rotular alunos como fracos. A linguagem deve destacar comportamentos observÃ¡veis, como â€œnÃ£o realizou treinamento nos Ãºltimos sete diasâ€.

## 12. Interface do aluno

A interface serÃ¡ mobile-first, com botÃµes grandes, textos curtos e foco em uma aÃ§Ã£o principal por tela.

### Login

- IdentificaÃ§Ã£o e senha temporÃ¡ria fornecidas pela escola.
- Troca de senha no primeiro acesso quando apropriado Ã  faixa etÃ¡ria.
- RecuperaÃ§Ã£o ou redefiniÃ§Ã£o mediada pela escola no MVP.

### Entrada no idioma da turma

- ApÃ³s o login, o sistema identifica a matrÃ­cula ativa do aluno.
- No MVP, abre diretamente a home do idioma associado Ã  turma principal.
- Se houver mais de uma matrÃ­cula ativa em idiomas diferentes, uma seleÃ§Ã£o de idioma pode ser exibida.
- Cada idioma mantÃ©m Bloo, estÃ¡gio e progresso prÃ³prios.

### Home do idioma

- Bloo em destaque.
- Nome e estÃ¡gio.
- Progresso para o prÃ³ximo objetivo.
- BotÃ£o principal de treinamento.
- MissÃ£o ou orientaÃ§Ã£o atual.
- Resumo curto de sequÃªncia e habilidades.

### Treinamento

- Uma pergunta por tela.
- IndicaÃ§Ã£o clara de progresso da sessÃ£o.
- Controles acessÃ­veis para Ã¡udio.
- Feedback imediato apÃ³s responder.
- ExplicaÃ§Ã£o simples para resposta incorreta.
- Possibilidade de continuar sem telas intermediÃ¡rias excessivas.

### Nascimento do Bloo

- Rachaduras no ovo ao longo da sessÃ£o.
- Cena de nascimento ao concluir.
- Escolha do nome do Bloo.
- ExibiÃ§Ã£o do tÃ­tulo New Hatchling.
- Convite claro para o prÃ³ximo treinamento.

### Perfil e progresso

- Bloos por idioma.
- EstÃ¡gio atual.
- Habilidades em desenvolvimento.
- TÃ­tulos e conquistas.
- HistÃ³rico resumido, sem excesso de mÃ©tricas escolares.

## 13. AutenticaÃ§Ã£o e seguranÃ§a

- Senhas armazenadas apenas por hash seguro.
- Senhas temporÃ¡rias expiram ou exigem troca quando adequado.
- Tokens curtos com renovaÃ§Ã£o segura.
- RevogaÃ§Ã£o de sessÃµes em redefiniÃ§Ã£o de senha.
- LimitaÃ§Ã£o de tentativas de login.
- Auditoria de aÃ§Ãµes administrativas sensÃ­veis.
- SeparaÃ§Ã£o dos dados por escola desde o inÃ­cio.
- ValidaÃ§Ã£o de autorizaÃ§Ã£o em todas as consultas.
- Backups automÃ¡ticos e restauraÃ§Ã£o testada.
- Criptografia em trÃ¢nsito e, quando disponÃ­vel, em repouso.

Como o sistema pode tratar dados de menores, a escola precisarÃ¡ definir bases legais, termos, consentimentos aplicÃ¡veis, retenÃ§Ã£o e atendimento Ã  LGPD antes do uso em produÃ§Ã£o.

O MVP nÃ£o deve incluir chat livre entre alunos. Nomes pÃºblicos podem ser substituÃ­dos por apelidos controlados quando houver rankings ou batalhas.

## 14. Acessibilidade e experiÃªncia

- Contraste e tamanho de fonte adequados.
- NavegaÃ§Ã£o por teclado no portal web.
- Textos alternativos para imagens informativas.
- NÃ£o depender apenas de cor para indicar acerto ou erro.
- Legendas ou transcriÃ§Ãµes quando pedagogicamente apropriado.
- ReduÃ§Ã£o de animaÃ§Ãµes para usuÃ¡rios que solicitarem.
- Tempo suficiente para leitura; velocidade nÃ£o serÃ¡ requisito no MVP.
- Testes em aparelhos mÃ³veis de entrada e conexÃµes lentas.

## 15. Observabilidade e mÃ©tricas

O sistema deve registrar eventos de produto sem armazenar conteÃºdo sensÃ­vel desnecessÃ¡rio:

- Primeiro acesso concluÃ­do.
- Tutorial iniciado e concluÃ­do.
- Treinamento iniciado, concluÃ­do ou abandonado.
- Bloo desbloqueado.
- Retorno em dias posteriores.
- Erros tÃ©cnicos por tela e endpoint.

Logs nÃ£o devem conter senhas, tokens ou respostas pessoais sensÃ­veis. MÃ©tricas pedagÃ³gicas e mÃ©tricas tÃ©cnicas devem ser distinguÃ­veis.

## 16. Testes

### Backend

- Regras de matrÃ­culas e mÃºltiplos idiomas.
- AutorizaÃ§Ã£o e isolamento entre escolas.
- SeleÃ§Ã£o e conclusÃ£o do treinamento.
- IdempotÃªncia da progressÃ£o.
- EvoluÃ§Ã£o Egg para Hatchling.

### Frontend

- FormulÃ¡rios administrativos.
- Estados de carregamento e erro.
- Fluxo de login.
- Entrada direta no idioma da turma.
- SeleÃ§Ã£o de idioma apenas quando houver mÃºltiplas matrÃ­culas ativas em idiomas diferentes.
- Resposta e feedback.

### Ponta a ponta

O fluxo crÃ­tico automatizado serÃ¡:

1. Administrador cria idioma, turma e aluno.
2. Aluno entra com a credencial.
3. Sistema abre o idioma associado Ã  turma do aluno.
4. Aluno conclui tutorial e treinamento.
5. O ovo se transforma em Hatchling.
6. Professor visualiza a conclusÃ£o.

## 17. PreparaÃ§Ã£o para funcionalidades futuras

### Tempo real

SignalR poderÃ¡ suportar presenÃ§a, estado de partida e eventos de batalha. Isso sÃ³ deve ser introduzido com regras de jogo maduras e protÃ³tipos validados.

### Eventos e filas

Boss raids e guerras entre turmas podem exigir processamento assÃ­ncrono e agregaÃ§Ã£o de pontuaÃ§Ã£o. Uma fila serÃ¡ adotada quando tarefas em segundo plano comeÃ§arem a competir com requisiÃ§Ãµes de usuÃ¡rio.

### ConteÃºdo adaptativo

O histÃ³rico de respostas jÃ¡ serÃ¡ armazenado de forma estruturada. Isso permitirÃ¡ revisar algoritmos sem perder dados, mas decisÃµes automÃ¡ticas relevantes deverÃ£o permanecer explicÃ¡veis para professores.

### Escala

O monÃ³lito modular poderÃ¡ ter mÃºltiplas instÃ¢ncias. Cache, filas e serviÃ§os especializados serÃ£o adicionados com base em gargalos medidos, nÃ£o antecipados.

## 18. DecisÃµes pendentes antes da implementaÃ§Ã£o

- Provedor de hospedagem e orÃ§amento mensal.
- Faixa etÃ¡ria inicial e regras de credencial.
- Primeiro idioma e nÃ­veis atendidos.
- Origem, autoria e volume inicial das questÃµes.
- Necessidade de importaÃ§Ã£o de alunos por planilha no MVP.
- Identidade visual e arquivos dos estÃ¡gios Egg e Hatchling.
- Regras exatas de XP.
- PolÃ­tica de privacidade e retenÃ§Ã£o.
- Requisitos de acessibilidade definidos pela escola.
