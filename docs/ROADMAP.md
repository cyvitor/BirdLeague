# Roadmap — BirdLeague

## 1. Como usar este roadmap

O roadmap está organizado por resultados, não apenas por funcionalidades. Cada fase deve ser validada antes da próxima. Datas serão adicionadas depois que equipe, disponibilidade e volume de conteúdo forem conhecidos.

O MVP termina quando a escola consegue cadastrar uma turma e um aluno consegue transformar seu ovo em Hatchling em um fluxo utilizável, mensurável e seguro.

No recorte atual, apenas administradores e alunos são operacionais. Professor e geração por IA permanecem no projeto, mas entram após o MVP.

## 2. Fase 0 — Descoberta e decisões fundamentais

### Objetivo

Eliminar dúvidas que mudariam significativamente o produto ou a implementação.

### Atividades

- Definir a faixa etária do primeiro grupo piloto.
- Escolher o primeiro idioma e os níveis atendidos.
- Entrevistar professores e observar o processo atual de exercícios.
- Conversar com alunos sobre avatares, recompensas e linguagem.
- Definir quem cria e quem revisa questões.
- Definir critérios pedagógicos de dificuldade e domínio.
- Mapear requisitos de LGPD para dados de menores.
- Confirmar orçamento, equipe e ambiente de hospedagem.
- Reunir a imagem original do Bloo da Bluebird como referência visual.
- Definir a direção de arte do Bloo: estilo, proporção, enquadramento, paleta e nível de detalhe.
- Produzir os primeiros conceitos visuais de Egg, ovo rachando e Hatchling.

### Critérios de conclusão

- Público piloto e primeiro idioma definidos.
- Responsável pedagógico identificado.
- Fluxo do primeiro acesso aprovado por professores.
- Política inicial de dados e acesso definida.
- Escopo do MVP aceito pela escola.

## 3. Fase 1 — Protótipo da experiência

### Objetivo

Validar a clareza e o apelo do ciclo Egg → treinamento → Hatchling antes da construção completa.

### Atividades

- Criar protótipo navegável da interface do aluno.
- Criar protótipo do cadastro de turma e aluno.
- Testar o uso do Bloo original como referência para um pequeno asset pack inicial.
- Validar se Egg, rachaduras e Hatchling mantêm a identidade visual da Bluebird.
- Testar o tutorial com um pequeno grupo.
- Testar quantidade e duração das perguntas iniciais.
- Avaliar a cena de quebra do ovo.
- Ajustar linguagem, contraste, tamanho de controles e feedback.

### Critérios de conclusão

- Alunos entendem que estudar ensina o Bloo e faz o Bloo evoluir.
- Alunos reconhecem o Bloo como parte do universo Bluebird.
- Alunos conseguem completar o fluxo sem explicação externa constante.
- Administradores entendem como criar e acompanhar uma turma.
- Principais problemas de usabilidade estão registrados e corrigidos no protótipo.

## 4. Fase 2 — Fundação técnica

### Objetivo

Criar a base segura e testável do produto.

### Entregas

- Estrutura do backend e frontend.
- Banco MySQL e migrações.
- Ambientes de desenvolvimento e homologação.
- Integração contínua com testes e build.
- Autenticação e papéis iniciais.
- Separação de dados por escola.
- Logs, monitoramento de erros e backups.
- Contrato OpenAPI e cliente do frontend.

### Critérios de conclusão

- Aplicações podem ser implantadas automaticamente em homologação.
- Login funciona para administrador e aluno.
- Testes confirmam isolamento básico de permissões.
- Erros críticos podem ser identificados nos registros.

## 5. Fase 3 — Administração escolar

### Objetivo

Permitir que a Bluebird prepare o primeiro grupo sem intervenção técnica.

### Entregas

- Idioma Inglês criado por seed.
- Cadastro de turmas, identificação de nível usada pela escola e períodos.
- Cadastro individual de alunos.
- Associação de aluno a múltiplas turmas e idiomas.
- Geração e redefinição de credenciais temporárias.
- Listagem, busca e filtros.
- Registro de ações administrativas relevantes.

### Possível ampliação do MVP

- Importação de alunos por planilha, caso o piloto torne o cadastro individual inviável.

### Critérios de conclusão

- Um administrador cria sozinho idioma, turma e alunos.
- Um aluno pode estar em mais de uma turma sem duplicação de perfil.
- Administradores veem somente os dados da própria escola.
- Credenciais podem ser redefinidas com segurança.

## 6. Fase 4 — Conteúdo pedagógico

### Objetivo

Disponibilizar questões revisadas e organizadas para o treinamento inicial.

### Entregas

- Cadastro e edição de questões.
- Classificação por idioma, nível, tema, habilidade e dificuldade.
- Questões de múltipla escolha e completar com opções.
- Explicações para respostas.
- Estados de rascunho, revisão, publicação e arquivamento.
- Pré-visualização como aluno.
- Conjunto inicial de questões revisado pedagogicamente.
- Criação de temas pedagógicos e associação com perguntas.
- Versionamento de perguntas publicadas com preservação do histórico.

### Critérios de conclusão

- Nenhuma questão chega ao aluno sem estar publicada.
- Questões arquivadas permanecem no histórico.
- O conjunto inicial cobre todos os caminhos do primeiro treinamento.
- Os temas iniciais possuem perguntas de `Easy` até `VeryHard`, mesmo que a turma piloto use apenas parte dessas dificuldades.
- Explicações são compreensíveis pela faixa etária piloto.

## 7. Fase 5 — Jornada do aluno e nascimento do Bloo

### Objetivo

Entregar o primeiro ciclo completo e emocionalmente satisfatório.

### Entregas

- Login e primeiro acesso.
- Entrada direta no idioma associado à turma do aluno.
- Seleção entre idiomas matriculados apenas quando houver múltiplas matrículas ativas em idiomas diferentes.
- Criação automática de um Bloo por aluno e idioma.
- Tutorial interativo.
- Home do idioma com Egg.
- Assets finais do MVP para Egg, rachaduras e Hatchling.
- Treinamento inicial.
- Feedback de acerto e erro.
- Reações leves do Bloo durante o treino.
- Progresso visual das rachaduras.
- Evolução Egg → Hatchling pela conclusão.
- Escolha do nome do Bloo.
- Resumo do que o Bloo aprendeu no primeiro treino.
- Título New Hatchling.
- Próximo objetivo visível.

### Critérios de conclusão

- O fluxo funciona bem em celular e desktop.
- Erros de resposta não impedem o nascimento.
- Recarregar ou reenviar uma ação não duplica XP ou evolução.
- Um Bloo de um idioma não interfere em outro.
- O aluno entende o que fazer depois do nascimento.

## 8. Fase 6 — Progresso e acompanhamento

### Objetivo

Dar significado ao uso para aluno e administrador e medir o piloto.

### Entregas

- Perfil do aluno com seus Bloos.
- Estágio e progresso atual.
- Histórico resumido de treinamentos.
- Habilidades em desenvolvimento apresentadas como aprendizados do Bloo.
- Painel do administrador por turma.
- Indicadores de primeiro acesso e conclusão.
- Participação recente.
- Desempenho inicial por habilidade.
- Eventos analíticos do funil principal.

### Critérios de conclusão

- Administrador identifica quem iniciou e quem concluiu.
- Aluno visualiza claramente seu progresso.
- A equipe mede início, abandono, conclusão e retorno.
- Relatórios respeitam as permissões e não expõem dados indevidos.

### Último passo antes do piloto

Antes de iniciar o piloto, o MVP deve receber seeds revisadas de temas, perguntas e conquistas.

Tema jogável obrigatório no MVP:

- `Greetings`

`Greetings` deve ter dez perguntas de cada dificuldade. Os demais temas podem existir como catálogo futuro, mas não bloqueiam o MVP.

Conquistas iniciais:

- `New Hatchling`
- `First Lesson`
- `First Theme`
- `Theme Explorer`
- `Bloo Is Learning`
- `Skill Learned`
- `Grammar Guardian`
- `Vocabulary Explorer`
- `Greetings Climber`
- `Greetings Master`

## 9. Fase 7 — Piloto do MVP

### Objetivo

Validar o produto com uso real antes de ampliar o escopo.

### Preparação

- Selecionar uma ou poucas turmas.
- Treinar professores e preparar suporte.
- Confirmar conteúdo e contas.
- Realizar teste de carga proporcional ao piloto.
- Preparar canal de feedback e plano de incidentes.

### Indicadores principais

- Taxa de conclusão do primeiro treinamento.
- Taxa de nascimento do Bloo.
- Retorno no dia seguinte e em sete dias.
- Treinamentos por aluno por semana.
- Tempo e abandono por etapa.
- Dificuldades relatadas por professores.
- Interesse declarado em continuar evoluindo o Bloo.

### Decisão ao final

O MVP será considerado validado se o fluxo for utilizável, os administradores conseguirem operá-lo e houver evidência de que uma parcela relevante dos alunos retorna voluntariamente para continuar a jornada.

Os números-alvo devem ser definidos antes do piloto, depois que tamanho da amostra, idade e rotina escolar forem conhecidos.

## 10. Pós-MVP 1 — Rotina de treinamento

### Objetivo

Transformar a primeira experiência em hábito de estudo.

- Novas sessões de treinamento.
- Mistura de conteúdo novo e revisão espaçada.
- Mais estágios de evolução do Bloo.
- Missões diárias e semanais.
- Metas flexíveis de constância.
- Conquistas e títulos.
- Personalizações cosméticas simples, começando por acessórios separados com fundo transparente.
- Primeira coleção de itens: óculos, chapéus, medalhas, fones, livros ou capas.
- Notificações controladas e apropriadas à idade.
- Importação de alunos e questões em lote.

## 11. Pós-MVP 2 — Domínio, raridade e poderes

### Objetivo

Transformar conhecimento demonstrado em coleção estratégica.

- Progresso de domínio por habilidade.
- Aprendizados do Bloo derivados do domínio por habilidade.
- Variações de questões para comprovar domínio.
- Desafios comuns, raros, épicos e lendários.
- Primeiras cartas ou poderes desbloqueados por habilidades ensinadas ao Bloo.
- Deck simples e limites de uso.
- Tela de coleção.
- Testes de compreensão e balanceamento.

Antes de criar batalhas, os poderes podem ser usados em desafios individuais. Isso permite validar se são compreensíveis e desejados.

## 12. Pós-MVP 3 — Competições entre turmas

### Objetivo

Criar pertencimento e cooperação com menor complexidade que o PvP em tempo real.

- Temporadas semanais.
- Pontuação normalizada pelo tamanho da turma.
- Limite de contribuição diária.
- Pontos por participação, constância, domínio e atividades validadas.
- Painel de andamento.
- Troféus e banners coletivos.
- Ferramentas de configuração e moderação para professores.
- Avaliação do impacto sobre alunos menos ativos.

## 13. Pós-MVP 4 — Boss raids e eventos

### Objetivo

Criar eventos cooperativos que envolvam turmas ou toda a escola.

- Primeiro boss temático.
- Energia coletiva e fases.
- Perguntas ligadas às fraquezas do boss.
- Recompensas coletivas e cosméticas.
- Calendário de eventos.
- Métricas de participação e equilíbrio.
- Ferramentas para professores acompanharem habilidades com maior dificuldade.

## 14. Pós-MVP 5 — Batalhas assíncronas

### Objetivo

Validar regras competitivas sem exigir que dois alunos estejam conectados simultaneamente.

- Desafios entre alunos de nível semelhante.
- Sequências equivalentes, mas não necessariamente idênticas.
- Uso limitado de poderes.
- Resultado e replay resumido.
- Matchmaking por idioma, nível e histórico.
- Denúncia, abandono e regras de conduta.
- Ligas e temporadas curtas.

## 15. Pós-MVP 6 — PvP em tempo real

### Objetivo

Entregar batalhas 1x1 justas, estáveis e pedagogicamente úteis.

- Infraestrutura em tempo real.
- Matchmaking e presença.
- Reconexão e tratamento de abandono.
- Sincronização segura da partida.
- Poderes como Shield, Freeze, Reverse e Hard Mode balanceados.
- Proteções contra trapaça.
- Moderação e apelidos seguros.
- Testes de acessibilidade e impacto da pressão de tempo.

O PvP somente deve avançar se as batalhas assíncronas mostrarem que a competição aumenta estudo sem aumentar ansiedade, conflito ou desistência.

## 16. Pós-MVP 7 — Expansão da plataforma

- PWA instalável e suporte limitado a conexão instável.
- Aplicativo móvel, se os dados justificarem.
- Listening avançado.
- Speaking e pronúncia com critérios transparentes.
- Atividades de escrita.
- Portal resumido para responsáveis.
- Novos idiomas.
- Campanhas narrativas e eventos sazonais.
- Ferramentas avançadas de autoria e revisão pedagógica.

## 17. Prioridades permanentes

Em todas as fases:

- Testar com alunos e professores.
- Revisar acessibilidade.
- Proteger dados pessoais e de menores.
- Medir aprendizado e retorno, não apenas tempo de tela.
- Evitar rankings humilhantes.
- Manter regras de progresso explicáveis.
- Não permitir compra de vantagem pedagógica ou competitiva.
- Registrar decisões importantes na documentação.

## 18. Fora de escopo até validação

As ideias abaixo não devem desviar o MVP:

- Mundo aberto ou exploração 3D.
- Chat livre entre alunos.
- Mercado de troca de itens.
- Criptomoedas ou NFTs.
- Loja de poderes.
- PvP em tempo real antes das etapas anteriores.
- Correção automática de fala sem validação pedagógica.
- Algoritmos complexos de adaptação sem dados suficientes.

O BirdLeague pode crescer bastante. A disciplina do roadmap é garantir que ele cresça a partir de um ciclo pequeno que os alunos realmente amem usar.
