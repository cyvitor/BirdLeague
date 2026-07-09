# Roadmap â€” BirdLeague

## 1. Como usar este roadmap

O roadmap estÃ¡ organizado por resultados, nÃ£o apenas por funcionalidades. Cada fase deve ser validada antes da prÃ³xima. Datas serÃ£o adicionadas depois que equipe, disponibilidade e volume de conteÃºdo forem conhecidos.

O MVP termina quando a escola consegue cadastrar uma turma e um aluno consegue transformar seu ovo em Hatchling em um fluxo utilizÃ¡vel, mensurÃ¡vel e seguro.

## 2. Fase 0 â€” Descoberta e decisÃµes fundamentais

### Objetivo

Eliminar dÃºvidas que mudariam significativamente o produto ou a implementaÃ§Ã£o.

### Atividades

- Definir a faixa etÃ¡ria do primeiro grupo piloto.
- Escolher o primeiro idioma e os nÃ­veis atendidos.
- Entrevistar professores e observar o processo atual de exercÃ­cios.
- Conversar com alunos sobre avatares, recompensas e linguagem.
- Definir quem cria e quem revisa questÃµes.
- Definir critÃ©rios pedagÃ³gicos de dificuldade e domÃ­nio.
- Mapear requisitos de LGPD para dados de menores.
- Confirmar orÃ§amento, equipe e ambiente de hospedagem.
- Reunir a imagem original do Bloo da Bluebird como referÃªncia visual.
- Definir a direÃ§Ã£o de arte do Bloo: estilo, proporÃ§Ã£o, enquadramento, paleta e nÃ­vel de detalhe.
- Produzir os primeiros conceitos visuais de Egg, ovo rachando e Hatchling.

### CritÃ©rios de conclusÃ£o

- PÃºblico piloto e primeiro idioma definidos.
- ResponsÃ¡vel pedagÃ³gico identificado.
- Fluxo do primeiro acesso aprovado por professores.
- PolÃ­tica inicial de dados e acesso definida.
- Escopo do MVP aceito pela escola.

## 3. Fase 1 â€” ProtÃ³tipo da experiÃªncia

### Objetivo

Validar a clareza e o apelo do ciclo Egg â†’ treinamento â†’ Hatchling antes da construÃ§Ã£o completa.

### Atividades

- Criar protÃ³tipo navegÃ¡vel da interface do aluno.
- Criar protÃ³tipo do cadastro de turma e aluno.
- Testar o uso do Bloo original como referÃªncia para um pequeno asset pack inicial.
- Validar se Egg, rachaduras e Hatchling mantÃªm a identidade visual da Bluebird.
- Testar o tutorial com um pequeno grupo.
- Testar quantidade e duraÃ§Ã£o das perguntas iniciais.
- Avaliar a cena de quebra do ovo.
- Ajustar linguagem, contraste, tamanho de controles e feedback.

### CritÃ©rios de conclusÃ£o

- Alunos entendem que estudar faz o Bloo evoluir.
- Alunos reconhecem o Bloo como parte do universo Bluebird.
- Alunos conseguem completar o fluxo sem explicaÃ§Ã£o externa constante.
- Professores entendem como criar e acompanhar uma turma.
- Principais problemas de usabilidade estÃ£o registrados e corrigidos no protÃ³tipo.

## 4. Fase 2 â€” FundaÃ§Ã£o tÃ©cnica

### Objetivo

Criar a base segura e testÃ¡vel do produto.

### Entregas

- Estrutura do backend e frontend.
- Banco MySQL e migraÃ§Ãµes.
- Ambientes de desenvolvimento e homologaÃ§Ã£o.
- IntegraÃ§Ã£o contÃ­nua com testes e build.
- AutenticaÃ§Ã£o e papÃ©is iniciais.
- SeparaÃ§Ã£o de dados por escola.
- Logs, monitoramento de erros e backups.
- Contrato OpenAPI e cliente do frontend.

### CritÃ©rios de conclusÃ£o

- AplicaÃ§Ãµes podem ser implantadas automaticamente em homologaÃ§Ã£o.
- Login funciona para administrador, professor e aluno.
- Testes confirmam isolamento bÃ¡sico de permissÃµes.
- Erros crÃ­ticos podem ser identificados nos registros.

## 5. Fase 3 â€” AdministraÃ§Ã£o escolar

### Objetivo

Permitir que a Bluebird prepare o primeiro grupo sem intervenÃ§Ã£o tÃ©cnica.

### Entregas

- Cadastro e ediÃ§Ã£o de idiomas.
- Cadastro de turmas, nÃ­veis, perÃ­odos e professores.
- Cadastro individual de alunos.
- AssociaÃ§Ã£o de aluno a mÃºltiplas turmas e idiomas.
- GeraÃ§Ã£o e redefiniÃ§Ã£o de credenciais temporÃ¡rias.
- Listagem, busca e filtros.
- Registro de aÃ§Ãµes administrativas relevantes.

### PossÃ­vel ampliaÃ§Ã£o do MVP

- ImportaÃ§Ã£o de alunos por planilha, caso o piloto torne o cadastro individual inviÃ¡vel.

### CritÃ©rios de conclusÃ£o

- Um administrador cria sozinho idioma, turma e alunos.
- Um aluno pode estar em mais de uma turma sem duplicaÃ§Ã£o de perfil.
- Professores veem somente as turmas autorizadas.
- Credenciais podem ser redefinidas com seguranÃ§a.

## 6. Fase 4 â€” ConteÃºdo pedagÃ³gico

### Objetivo

Disponibilizar questÃµes revisadas e organizadas para o treinamento inicial.

### Entregas

- Cadastro e ediÃ§Ã£o de questÃµes.
- ClassificaÃ§Ã£o por idioma, nÃ­vel, tema, habilidade e dificuldade.
- QuestÃµes de mÃºltipla escolha e completar com opÃ§Ãµes.
- ExplicaÃ§Ãµes para respostas.
- Estados de rascunho, revisÃ£o, publicaÃ§Ã£o e arquivamento.
- PrÃ©-visualizaÃ§Ã£o como aluno.
- Conjunto inicial de questÃµes revisado pedagogicamente.

### CritÃ©rios de conclusÃ£o

- Nenhuma questÃ£o chega ao aluno sem estar publicada.
- QuestÃµes arquivadas permanecem no histÃ³rico.
- O conjunto inicial cobre todos os caminhos do primeiro treinamento.
- ExplicaÃ§Ãµes sÃ£o compreensÃ­veis pela faixa etÃ¡ria piloto.

## 7. Fase 5 â€” Jornada do aluno e nascimento do Bloo

### Objetivo

Entregar o primeiro ciclo completo e emocionalmente satisfatÃ³rio.

### Entregas

- Login e primeiro acesso.
- Entrada direta no idioma associado Ã  turma do aluno.
- SeleÃ§Ã£o entre idiomas matriculados apenas quando houver mÃºltiplas matrÃ­culas ativas em idiomas diferentes.
- CriaÃ§Ã£o automÃ¡tica de um Bloo por aluno e idioma.
- Tutorial interativo.
- Home do idioma com Egg.
- Assets finais do MVP para Egg, rachaduras e Hatchling.
- Treinamento inicial.
- Feedback de acerto e erro.
- Progresso visual das rachaduras.
- EvoluÃ§Ã£o Egg â†’ Hatchling pela conclusÃ£o.
- Escolha do nome do Bloo.
- TÃ­tulo New Hatchling.
- PrÃ³ximo objetivo visÃ­vel.

### CritÃ©rios de conclusÃ£o

- O fluxo funciona bem em celular e desktop.
- Erros de resposta nÃ£o impedem o nascimento.
- Recarregar ou reenviar uma aÃ§Ã£o nÃ£o duplica XP ou evoluÃ§Ã£o.
- Um Bloo de um idioma nÃ£o interfere em outro.
- O aluno entende o que fazer depois do nascimento.

## 8. Fase 6 â€” Progresso e acompanhamento

### Objetivo

Dar significado ao uso para aluno e professor e medir o piloto.

### Entregas

- Perfil do aluno com seus Bloos.
- EstÃ¡gio e progresso atual.
- HistÃ³rico resumido de treinamentos.
- Painel do professor por turma.
- Indicadores de primeiro acesso e conclusÃ£o.
- ParticipaÃ§Ã£o recente.
- Desempenho inicial por habilidade.
- Eventos analÃ­ticos do funil principal.

### CritÃ©rios de conclusÃ£o

- Professor identifica quem iniciou e quem concluiu.
- Aluno visualiza claramente seu progresso.
- A equipe mede inÃ­cio, abandono, conclusÃ£o e retorno.
- RelatÃ³rios respeitam as permissÃµes e nÃ£o expÃµem dados indevidos.

## 9. Fase 7 â€” Piloto do MVP

### Objetivo

Validar o produto com uso real antes de ampliar o escopo.

### PreparaÃ§Ã£o

- Selecionar uma ou poucas turmas.
- Treinar professores e preparar suporte.
- Confirmar conteÃºdo e contas.
- Realizar teste de carga proporcional ao piloto.
- Preparar canal de feedback e plano de incidentes.

### Indicadores principais

- Taxa de conclusÃ£o do primeiro treinamento.
- Taxa de nascimento do Bloo.
- Retorno no dia seguinte e em sete dias.
- Treinamentos por aluno por semana.
- Tempo e abandono por etapa.
- Dificuldades relatadas por professores.
- Interesse declarado em continuar evoluindo o Bloo.

### DecisÃ£o ao final

O MVP serÃ¡ considerado validado se o fluxo for utilizÃ¡vel, os professores conseguirem operÃ¡-lo e houver evidÃªncia de que uma parcela relevante dos alunos retorna voluntariamente para continuar a jornada.

Os nÃºmeros-alvo devem ser definidos antes do piloto, depois que tamanho da amostra, idade e rotina escolar forem conhecidos.

## 10. PÃ³s-MVP 1 â€” Rotina de treinamento

### Objetivo

Transformar a primeira experiÃªncia em hÃ¡bito de estudo.

- Novas sessÃµes de treinamento.
- Mistura de conteÃºdo novo e revisÃ£o espaÃ§ada.
- Mais estÃ¡gios de evoluÃ§Ã£o do Bloo.
- MissÃµes diÃ¡rias e semanais.
- Metas flexÃ­veis de constÃ¢ncia.
- Conquistas e tÃ­tulos.
- PersonalizaÃ§Ãµes cosmÃ©ticas simples, comeÃ§ando por acessÃ³rios separados com fundo transparente.
- Primeira coleÃ§Ã£o de itens: Ã³culos, chapÃ©us, medalhas, fones, livros ou capas.
- NotificaÃ§Ãµes controladas e apropriadas Ã  idade.
- ImportaÃ§Ã£o de alunos e questÃµes em lote.

## 11. PÃ³s-MVP 2 â€” DomÃ­nio, raridade e poderes

### Objetivo

Transformar conhecimento demonstrado em coleÃ§Ã£o estratÃ©gica.

- Progresso de domÃ­nio por habilidade.
- VariaÃ§Ãµes de questÃµes para comprovar domÃ­nio.
- Desafios comuns, raros, Ã©picos e lendÃ¡rios.
- Primeiras cartas ou poderes.
- Deck simples e limites de uso.
- Tela de coleÃ§Ã£o.
- Testes de compreensÃ£o e balanceamento.

Antes de criar batalhas, os poderes podem ser usados em desafios individuais. Isso permite validar se sÃ£o compreensÃ­veis e desejados.

## 12. PÃ³s-MVP 3 â€” CompetiÃ§Ãµes entre turmas

### Objetivo

Criar pertencimento e cooperaÃ§Ã£o com menor complexidade que o PvP em tempo real.

- Temporadas semanais.
- PontuaÃ§Ã£o normalizada pelo tamanho da turma.
- Limite de contribuiÃ§Ã£o diÃ¡ria.
- Pontos por participaÃ§Ã£o, constÃ¢ncia, domÃ­nio e atividades validadas.
- Painel de andamento.
- TrofÃ©us e banners coletivos.
- Ferramentas de configuraÃ§Ã£o e moderaÃ§Ã£o para professores.
- AvaliaÃ§Ã£o do impacto sobre alunos menos ativos.

## 13. PÃ³s-MVP 4 â€” Boss raids e eventos

### Objetivo

Criar eventos cooperativos que envolvam turmas ou toda a escola.

- Primeiro boss temÃ¡tico.
- Energia coletiva e fases.
- Perguntas ligadas Ã s fraquezas do boss.
- Recompensas coletivas e cosmÃ©ticas.
- CalendÃ¡rio de eventos.
- MÃ©tricas de participaÃ§Ã£o e equilÃ­brio.
- Ferramentas para professores acompanharem habilidades com maior dificuldade.

## 14. PÃ³s-MVP 5 â€” Batalhas assÃ­ncronas

### Objetivo

Validar regras competitivas sem exigir que dois alunos estejam conectados simultaneamente.

- Desafios entre alunos de nÃ­vel semelhante.
- SequÃªncias equivalentes, mas nÃ£o necessariamente idÃªnticas.
- Uso limitado de poderes.
- Resultado e replay resumido.
- Matchmaking por idioma, nÃ­vel e histÃ³rico.
- DenÃºncia, abandono e regras de conduta.
- Ligas e temporadas curtas.

## 15. PÃ³s-MVP 6 â€” PvP em tempo real

### Objetivo

Entregar batalhas 1x1 justas, estÃ¡veis e pedagogicamente Ãºteis.

- Infraestrutura em tempo real.
- Matchmaking e presenÃ§a.
- ReconexÃ£o e tratamento de abandono.
- SincronizaÃ§Ã£o segura da partida.
- Poderes como Shield, Freeze, Reverse e Hard Mode balanceados.
- ProteÃ§Ãµes contra trapaÃ§a.
- ModeraÃ§Ã£o e apelidos seguros.
- Testes de acessibilidade e impacto da pressÃ£o de tempo.

O PvP somente deve avanÃ§ar se as batalhas assÃ­ncronas mostrarem que a competiÃ§Ã£o aumenta estudo sem aumentar ansiedade, conflito ou desistÃªncia.

## 16. PÃ³s-MVP 7 â€” ExpansÃ£o da plataforma

- PWA instalÃ¡vel e suporte limitado a conexÃ£o instÃ¡vel.
- Aplicativo mÃ³vel, se os dados justificarem.
- Listening avanÃ§ado.
- Speaking e pronÃºncia com critÃ©rios transparentes.
- Atividades de escrita.
- Portal resumido para responsÃ¡veis.
- Novos idiomas.
- Campanhas narrativas e eventos sazonais.
- Ferramentas avanÃ§adas de autoria e revisÃ£o pedagÃ³gica.

## 17. Prioridades permanentes

Em todas as fases:

- Testar com alunos e professores.
- Revisar acessibilidade.
- Proteger dados pessoais e de menores.
- Medir aprendizado e retorno, nÃ£o apenas tempo de tela.
- Evitar rankings humilhantes.
- Manter regras de progresso explicÃ¡veis.
- NÃ£o permitir compra de vantagem pedagÃ³gica ou competitiva.
- Registrar decisÃµes importantes na documentaÃ§Ã£o.

## 18. Fora de escopo atÃ© validaÃ§Ã£o

As ideias abaixo nÃ£o devem desviar o MVP:

- Mundo aberto ou exploraÃ§Ã£o 3D.
- Chat livre entre alunos.
- Mercado de troca de itens.
- Criptomoedas ou NFTs.
- Loja de poderes.
- PvP em tempo real antes das etapas anteriores.
- CorreÃ§Ã£o automÃ¡tica de fala sem validaÃ§Ã£o pedagÃ³gica.
- Algoritmos complexos de adaptaÃ§Ã£o sem dados suficientes.

O BirdLeague pode crescer bastante. A disciplina do roadmap Ã© garantir que ele cresÃ§a a partir de um ciclo pequeno que os alunos realmente amem usar.
