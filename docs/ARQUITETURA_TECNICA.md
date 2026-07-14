# Arquitetura Técnica — BirdLeague

## 1. Objetivo

Este documento define uma direção técnica inicial para o BirdLeague. A prioridade é entregar o MVP rapidamente sem criar uma base descartável, mantendo espaço para competições, eventos e aplicativos móveis no futuro.

As decisões podem ser revistas com dados reais, mas mudanças devem ser registradas para que a arquitetura continue compreensível.

## 2. Direção recomendada

O MVP será uma aplicação web responsiva composta por:

- Um portal administrativo para administradores no MVP, extensível a professores posteriormente.
- Uma experiência de aluno otimizada para celular.
- Uma API central responsável pelas regras e pelos dados.
- Um banco de dados relacional.
- Armazenamento de imagens e áudios.

Uma aplicação web responsiva reduz o custo inicial, funciona em computadores e celulares e permite validar o produto antes de manter aplicativos nativos. Futuramente, o aplicativo do aluno poderá ser distribuído como PWA ou criado com tecnologia móvel consumindo a mesma API.

## 3. Tecnologias

### 3.1 Backend

- **Plataforma:** Node.js 24 LTS com NestJS.
- **Linguagem:** TypeScript em modo estrito.
- **Acesso a dados:** Prisma ORM e Prisma Migrate.
- **Banco de dados:** MySQL.
- **Autenticação:** módulo próprio com Argon2id, access token JWT e refresh token opaco rotativo.
- **Validação:** DTOs e validação explícita na camada de aplicação.
- **Documentação da API:** OpenAPI com `@nestjs/swagger`.
- **Tarefas em segundo plano:** começar com serviços internos simples; adotar uma fila somente quando houver necessidade comprovada.
- **Testes:** Vitest para testes unitários, Supertest para integração e Playwright ponta a ponta.

NestJS mantém uma arquitetura modular, injeção de dependência e guards de autorização. Prisma fornece migrations SQL versionadas, cliente tipado e transações para progresso, XP e conquistas. Para recursos em tempo real futuros, o NestJS oferece WebSocket Gateways; Redis e filas só entram quando houver necessidade comprovada.

O desenho de cookies, rotação de refresh token, bootstrap e proxy Cloudflare está em [Autenticação e Segurança do MVP](AUTENTICACAO_E_SEGURANCA_MVP.md). Os contratos HTTP estão em [Contrato da API](CONTRATO_API_MVP.md).

### 3.2 Frontend web

- **Framework:** Next.js com React e TypeScript.
- **Estilos:** Tailwind CSS com componentes próprios do BirdLeague.
- **Formulários:** React Hook Form e validação por esquema.
- **Comunicação com a API:** cliente tipado gerado ou mantido a partir do contrato OpenAPI.
- **Estado remoto:** TanStack Query.
- **Testes de componentes:** Vitest e Testing Library.
- **Testes ponta a ponta:** Playwright.

O portal administrativo e a interface do aluno podem começar na mesma aplicação Next.js, com áreas e layouts separados. Isso reduz duplicação no MVP sem impedir uma separação futura.

### 3.3 Aplicativo móvel

Não haverá aplicativo nativo no primeiro MVP. A experiência do aluno será responsiva e preparada para instalação como PWA em uma etapa posterior.

Se notificações, uso offline ou recursos nativos se tornarem essenciais, a direção sugerida é React Native com Expo, reutilizando TypeScript, contratos da API e parte do conhecimento da equipe.

### 3.4 Infraestrutura

- Contêineres Docker para desenvolvimento e implantação.
- MySQL gerenciado em produção.
- Armazenamento compatível com S3 para imagens, áudios e futuros assets.
- CDN para entrega dos assets do Bloo.
- CI/CD para testes, build e implantação.
- Ambientes separados de desenvolvimento, homologação e produção.
- Monitoramento de erros, logs estruturados e métricas básicas desde o MVP.

O provedor de nuvem não precisa ser definido antes de conhecer orçamento, região dos usuários e experiência da equipe.

## 4. Organização da solução

O backend começará como um monólito modular. Um único deploy é mais simples para o MVP, enquanto módulos bem definidos evitam que as regras se misturem.

O repositório usará monorepo com pnpm workspaces:

```text
apps/
  api/       # NestJS e Prisma
  web/       # Next.js
packages/
  contracts/ # cliente e tipos gerados do OpenAPI
  config/    # configurações compartilhadas de TypeScript e lint
```

API e web são processos e imagens separados. Não compartilham diretamente modelos internos do Prisma; o contrato entre elas é o OpenAPI, evitando acoplamento do frontend ao banco.

Módulos iniciais:

- **Identidade:** login, credenciais, papéis e sessões.
- **Organização escolar:** escola, idiomas, turmas, matrículas e períodos.
- **Conteúdo:** temas, versões de questões, alternativas, explicações e assets. Geração por IA entra posteriormente.
- **Treinamento:** sessões, seleção de questões, respostas, feedback e reações do Bloo.
- **Progressão:** Bloos, XP, estágios, domínio, aprendizado do Bloo e conquistas.
- **Acompanhamento operacional:** status mínimo de acesso, nascimento e etapa atual. Relatórios detalhados entram depois do MVP.

Módulos futuros:

- Cartas e poderes.
- Batalhas.
- Guerras entre turmas.
- Eventos e bosses.
- Rankings e ligas.
- Notificações.

Microserviços não são recomendados no início. Partes específicas podem ser extraídas quando escala, isolamento operacional ou ritmo de desenvolvimento justificarem a complexidade.

## 5. Papéis e permissões

### Administrador

- Configura a escola.
- Gerencia turmas, alunos, temas e perguntas no MVP.
- Consulta status operacional mínimo nas turmas.
- Gerencia regras e períodos.
- Pode importar e exportar dados autorizados.

### Professor

Pós-MVP:

- Visualiza e gerencia suas turmas.
- Cadastra ou recomenda conteúdos conforme permissão.
- Acompanha alunos matriculados em suas turmas.
- Registra ou valida atividades autorizadas.

### Aluno

- Acessa somente o próprio perfil.
- Acessa diretamente o idioma associado à sua turma principal no MVP.
- Pode visualizar múltiplos idiomas e Bloos associados quando tiver mais de uma matrícula ativa.
- Realiza treinamentos.
- Consulta progresso, conquistas e histórico permitido.

Permissões devem ser verificadas no backend. Ocultar um botão no frontend não é controle de acesso.

## 6. Modelo conceitual de dados

### Entidades escolares

- **School:** organização proprietária dos dados.
- **User:** identidade usada para autenticação.
- **StudentProfile:** informações do aluno associadas ao usuário.
- **TeacherProfile:** entidade futura para informações do professor.
- **Language:** idioma oferecido pela escola.
- **Class:** turma, período, identificação de nível usada pela escola e idioma.
- **Enrollment:** associação entre aluno e turma.

Um aluno poderá possuir várias matrículas. O vínculo do Bloo será com aluno e idioma, não apenas com a turma. Assim, uma troca de turma não apaga a evolução conquistada naquele idioma.

### Entidades pedagógicas

- **Skill:** habilidade específica dentro de um idioma e nível.
- **Question:** identidade estável da questão.
- **QuestionVersion:** conteúdo editorial imutável depois de publicado.
- **QuestionOption:** alternativas ligadas à versão.
- **QuestionAsset:** áudio, imagem ou outro material.
- **Theme:** tema ou missão pedagógica criada pelo administrador no MVP.
- **ThemeClass:** associação do tema com turmas e datas de liberação.
- **ThemeQuestion:** associação entre tema e perguntas.
- **TrainingSession:** início, fim, objetivo e estado de um treino.
- **TrainingAnswer:** resposta, resultado, tempo e feedback apresentado.
- **SkillMastery:** progresso do aluno em determinada habilidade, apresentado na experiência como aprendizado do Bloo.
- **StudentThemeProgress:** conclusão do tema e dificuldade atual.
- **StudentThemeDifficultyProgress:** desbloqueio, sessões e melhor resultado por dificuldade.

### Entidades de progressão

- **Bloo:** avatar do aluno em um idioma.
- **BlooStage:** estágio visual e requisitos de evolução.
- **ProgressEvent:** registro de XP ou progresso, sua origem e data.
- **Achievement:** definição de uma conquista.
- **StudentAchievement:** conquista recebida pelo aluno.
- **Title:** título que pode ser exibido no perfil.

O histórico de progresso deve registrar a origem de cada alteração. Isso permite auditoria e evita valores de XP impossíveis de explicar.

## 7. Assets do Bloo e acessórios

Os assets do Bloo devem ser organizados para permitir evolução visual e personalização sem gerar uma imagem final para cada combinação possível. A direção técnica recomendada é tratar o personagem como uma composição em camadas:

1. Base do Bloo.
2. Roupa ou variação corporal.
3. Acessórios, como óculos, chapéus e medalhas.
4. Efeitos visuais temporários, como brilho de conquista.

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

Cada fase do Bloo deve ter poses nomeadas de forma consistente, por exemplo `idle`, `happy`, `thinking`, `celebrate`, `run`, `victory` e `defeat`. Os acessórios devem ter fundo transparente e, quando necessário, variações por ângulo, como `front`, `right-3q` e `left-3q`.

Para que óculos e outros acessórios encaixem corretamente em cada fase, o app deve manter metadados de pontos de encaixe. Esses dados podem ficar em JSON ou no banco, dependendo do volume e da necessidade de edição administrativa:

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

No MVP, ainda é aceitável usar imagens fixas para Egg, rachaduras e Hatchling. Mesmo assim, os nomes de arquivos, dimensões e enquadramentos já devem ser definidos pensando na futura composição em camadas. Isso evita retrabalho quando a personalização cosmética entrar no produto.

## 8. Banco de questões

Cada questão deve registrar, no mínimo:

- Idioma.
- Habilidade e categoria.
- Tipo de questão.
- Dificuldade.
- Enunciado.
- Resposta correta ou critérios de correção.
- Explicação pedagógica.
- Estado editorial: rascunho, em revisão, publicada ou arquivada.
- Autor e número da versão.
- Data de criação e alteração.

Tipos iniciais recomendados:

- Múltipla escolha.
- Completar lacuna com opções.
- Associação simples e compreensão de áudio ficam para depois do MVP.

Respostas abertas, pronúncia avaliada automaticamente e correção por inteligência artificial devem vir depois. Elas exigem critérios de avaliação, tratamento de incerteza, custo e revisão de privacidade.

Questões já respondidas podem reaparecer em variações e revisões espaçadas. O sistema não deve considerar domínio a partir de uma única resposta.

## 9. Motor de treinamento do MVP

O motor inicial pode usar regras determinísticas e compreensíveis:

1. Selecionar o idioma e o objetivo da sessão.
2. Usar questões do tema associado pela escola, progredindo pela dificuldade interna do tema.
3. Misturar conteúdo novo com revisão.
4. Evitar repetição imediata da mesma questão.
5. Registrar respostas e apresentar feedback.
6. Atualizar progresso ao concluir a sessão.

No treinamento de nascimento, a sequência pode ser predefinida por nível e idioma. A evolução para Hatchling ocorre pela conclusão. O desempenho é armazenado para orientar treinos seguintes e alimentar a narrativa do que o Bloo está aprendendo, mas não bloqueia o nascimento.

Depois do nascimento, o motor usa missões liberadas pelo administrador para a turma. A associação declara que o conteúdo já foi trabalhado em sala. O aluno pode revisar temas liberados, sem acessar conteúdos não associados.

Uma adaptação mais sofisticada deve ser introduzida apenas depois de haver volume de respostas suficiente para avaliar suas decisões.

## 10. Progressão e consistência

Regras de XP e evolução devem residir no backend. O cliente apenas apresenta o resultado.

Todo evento de progresso deve ser:

- Identificável por origem.
- Idempotente, para evitar pontuação duplicada em reenvios.
- Registrado com data e aluno.
- Limitado conforme as regras da atividade.

Para o MVP:

- A sessão concluída concede progresso base.
- Acertos podem conceder um bônus pequeno.
- O estágio Egg evolui para Hatchling ao concluir o primeiro treino.
- O aluno visualiza o progresso para o próximo objetivo, ainda que a próxima evolução não esteja implementada.
- A interface apresenta habilidades praticadas como aprendizados do Bloo, sem duplicar a regra pedagógica no banco.

## 11. Interface administrativa

O portal será desenhado para uso em desktop e tablet, com navegação lateral.

### Painel inicial

- Quantidade de alunos ativos.
- Turmas ativas.
- Participação nos últimos dias.
- Alunos que ainda não iniciaram.
- Atalhos para criar turma e cadastrar alunos.

### Idiomas

- Listagem de idiomas oferecidos.
- Ativação e desativação.
- Configuração de níveis disponíveis.

### Turmas

- Criar e editar turma.
- Definir idioma, identificação de nível e período.
- Matricular ou remover alunos.
- Visualizar progresso agregado.

### Alunos

- Cadastro individual.
- Importação por planilha em fase posterior ou ainda no MVP se o volume exigir.
- Associação a múltiplas turmas.
- Geração e redefinição de senha temporária.
- Estado do primeiro acesso.
- Visão resumida de Bloos e progresso.

### Banco de questões

- Filtros por idioma, nível, tema, habilidade e estado.
- Criação e edição de questões.
- Pré-visualização como aluno.
- Fluxo simples de revisão e publicação.
- Arquivamento sem apagar o histórico de respostas.
- Criação de nova versão ao editar uma pergunta publicada.

### Temas

- Criar e editar tema.
- Definir idioma, habilidades, categorias e dificuldades internas.
- Associar tema a uma ou mais turmas.
- Liberar imediatamente ou agendar data de liberação.
- Associar perguntas publicadas a cada dificuldade.
- Associar perguntas existentes.
- Pré-visualizar e publicar quando cada dificuldade tiver conteúdo suficiente.

### Configurações de IA — pós-MVP

- Provedor, inicialmente DeepInfra.
- Chave da API armazenada como segredo.
- Modelo.
- Temperatura.
- Limite de tokens.
- Status ativo/inativo.
- Versão do prompt de geração de perguntas.

### Relatórios — pós-MVP

- Participação por turma.
- Conclusão do tutorial e primeiro treino.
- Acertos por habilidade.
- Alunos que podem precisar de acompanhamento.

Relatórios não devem rotular alunos como fracos. A linguagem deve destacar comportamentos observáveis, como “não realizou treinamento nos últimos sete dias”.

## 12. Interface do aluno

A interface será mobile-first, com botões grandes, textos curtos e foco em uma ação principal por tela.

### Login

- Identificação e senha temporária fornecidas pela escola.
- Troca de senha no primeiro acesso quando apropriado à faixa etária.
- Recuperação ou redefinição mediada pela escola no MVP.

### Entrada no idioma da turma

- Após o login, o sistema identifica a matrícula ativa do aluno.
- No MVP, abre diretamente a home do idioma associado à turma principal.
- Se houver mais de uma matrícula ativa em idiomas diferentes, uma seleção de idioma pode ser exibida.
- Cada idioma mantém Bloo, estágio e progresso próprios.

### Home do idioma

- Bloo em destaque.
- Nome e estágio.
- Progresso para o próximo objetivo.
- Botão principal de treinamento.
- Missão ou orientação atual.
- Temas liberados pelo administrador para a turma.
- Revisões de temas já liberados.
- Resumo curto de sequência e habilidades.

### Treinamento

- Uma pergunta por tela.
- Indicação clara de progresso da sessão.
- Controles acessíveis para áudio.
- Feedback imediato após responder.
- Explicação simples para resposta incorreta.
- Reação breve do Bloo ao acerto, erro ou conclusão da etapa.
- Possibilidade de continuar sem telas intermediárias excessivas.

### Nascimento do Bloo

- Rachaduras no ovo ao longo da sessão.
- Cena de nascimento ao concluir.
- Escolha do nome do Bloo.
- Exibição do título New Hatchling.
- Resumo do que o Bloo aprendeu no primeiro treino.
- Convite claro para o próximo treinamento.

### Perfil e progresso

- Bloos por idioma.
- Estágio atual.
- Habilidades em desenvolvimento, apresentadas como aprendizados do Bloo.
- Títulos e conquistas.
- Histórico resumido, sem excesso de métricas escolares.

## 13. Autenticação e segurança

- Senhas armazenadas apenas por hash seguro.
- Senhas temporárias expiram ou exigem troca quando adequado.
- Tokens curtos com renovação segura.
- Revogação de sessões em redefinição de senha.
- Limitação de tentativas de login.
- Auditoria de ações administrativas sensíveis.
- Separação dos dados por escola desde o início.
- Validação de autorização em todas as consultas.
- Backups automáticos e restauração testada.
- Criptografia em trânsito e, quando disponível, em repouso.

Como o sistema pode tratar dados de menores, a escola precisará definir bases legais, termos, consentimentos aplicáveis, retenção e atendimento à LGPD antes do uso em produção.

O MVP não deve incluir chat livre entre alunos. Nomes públicos podem ser substituídos por apelidos controlados quando houver rankings ou batalhas.

## 14. Acessibilidade e experiência

- Contraste e tamanho de fonte adequados.
- Navegação por teclado no portal web.
- Textos alternativos para imagens informativas.
- Não depender apenas de cor para indicar acerto ou erro.
- Legendas ou transcrições quando pedagogicamente apropriado.
- Redução de animações para usuários que solicitarem.
- Tempo suficiente para leitura; velocidade não será requisito no MVP.
- Testes em aparelhos móveis de entrada e conexões lentas.

## 15. Observabilidade e métricas

O sistema deve registrar eventos de produto sem armazenar conteúdo sensível desnecessário:

- Primeiro acesso concluído.
- Tutorial iniciado e concluído.
- Treinamento iniciado, concluído ou abandonado.
- Bloo desbloqueado.
- Retorno em dias posteriores.
- Erros técnicos por tela e endpoint.

Logs não devem conter senhas, tokens ou respostas pessoais sensíveis. Métricas pedagógicas e métricas técnicas devem ser distinguíveis.

## 16. Testes

### Backend

- Regras de matrículas e múltiplos idiomas.
- Autorização e isolamento entre escolas.
- Seleção e conclusão do treinamento.
- Idempotência da progressão.
- Evolução Egg para Hatchling.

### Frontend

- Formulários administrativos.
- Estados de carregamento e erro.
- Fluxo de login.
- Entrada direta no idioma da turma.
- Seleção de idioma apenas quando houver múltiplas matrículas ativas em idiomas diferentes.
- Resposta e feedback.

### Ponta a ponta

O fluxo crítico automatizado será:

1. Administrador cria idioma, turma e aluno.
2. Aluno entra com a credencial.
3. Sistema abre o idioma associado à turma do aluno.
4. Aluno conclui tutorial e treinamento.
5. O ovo se transforma em Hatchling.
6. Administrador visualiza a conclusão.

## 17. Preparação para funcionalidades futuras

### Tempo real

WebSocket Gateways do NestJS poderão suportar presença, estado de partida e eventos de batalha. Isso só deve ser introduzido com regras de jogo maduras e protótipos validados.

### Eventos e filas

Boss raids e guerras entre turmas podem exigir processamento assíncrono e agregação de pontuação. Uma fila será adotada quando tarefas em segundo plano começarem a competir com requisições de usuário.

### Conteúdo adaptativo

O histórico de respostas já será armazenado de forma estruturada. Isso permitirá revisar algoritmos sem perder dados, mas decisões automáticas relevantes deverão permanecer explicáveis para professores.

### Escala

O monólito modular poderá ter múltiplas instâncias. Cache, filas e serviços especializados serão adicionados com base em gargalos medidos, não antecipados.

## 18. Decisões pendentes antes da implementação

As decisões necessárias para iniciar foram consolidadas em [Escopo de Codificação do MVP](ESCOPO_DE_CODIFICACAO_MVP.md). A lista abaixo passa a representar decisões para homologação, piloto ou evolução quando já estiver fechada naquele documento.

- Provedor de hospedagem e orçamento mensal.
- Faixa etária inicial e regras de credencial.
- Primeiro idioma e níveis atendidos.
- Origem, autoria e volume inicial das questões.
- Necessidade de importação de alunos por planilha no MVP.
- Identidade visual e arquivos dos estágios Egg e Hatchling.
- Regras exatas de XP.
- Política de privacidade e retenção.
- Requisitos de acessibilidade definidos pela escola.
