# Planejamento de Telas do MVP — BirdLeague

## 1. Objetivo

Este documento transforma o escopo, os fluxos e o contrato de API do MVP em um plano implementável de interface. O MVP possui apenas os perfis `Admin` e `Student`. Professor, IA, relatórios pedagógicos detalhados e importação por planilha ficam fora desta entrega.

Princípios:

- experiência do aluno lúdica, acolhedora e sem aparência de prova;
- administração direta, previsível e orientada a tarefas;
- uma ação principal evidente por tela;
- feedback imediato, linguagem simples e preservação do trabalho em falhas;
- responsividade desde o início: aluno prioriza celular/tablet; administração prioriza desktop, sem impedir tablet;
- componentes e contratos compartilhados entre carregamento, vazio, sucesso, validação, conflito e indisponibilidade.

## 2. Estrutura de navegação

### Administração

Menu lateral: `Início`, `Turmas`, `Alunos`, `Temas`, `Banco de questões` e `Sair`.

O cabeçalho mostra escola, administrador autenticado e aviso de troca obrigatória de senha. O acompanhamento operacional fica dentro da turma e não constitui um módulo de relatórios.

### Aluno

Antes do nascimento, a jornada é linear: `Login → Tutorial → Egg → FirstHatch → Nascimento → Nome opcional`.

Depois do nascimento, a navegação inferior contém `Início`, `Aprendizado` e `Conquistas`. No MVP, “Aprendizado” mostra trilha e domínio; não existe ranking, loja ou chat.

## 3. Inventário de telas administrativas

| ID | Tela | Objetivo e ação principal | Dados/API principais |
|---|---|---|---|
| A01 | Login | Autenticar com login e senha | `POST /auth/login`, `GET /auth/me` |
| A02 | Troca obrigatória de senha | Substituir a senha inicial antes de acessar dados | `POST /auth/change-password` |
| A03 | Início administrativo | Oferecer atalhos e pendências editoriais essenciais | contagens resumidas de turmas, alunos, temas e perguntas |
| A04 | Lista de turmas | Buscar, filtrar, criar e abrir turma | `/admin/classes` |
| A05 | Formulário de turma | Criar/editar nome, idioma, nível informativo, período e estado | `/admin/classes/{id}` |
| A06 | Detalhe da turma | Gerir alunos, temas liberados e status operacional mínimo | `/admin/classes/{id}/students-status`, temas da turma |
| A07 | Lista de alunos | Buscar, filtrar, cadastrar e abrir aluno | `/admin/students` |
| A08 | Formulário de aluno | Criar/editar perfil, login, senha inicial e primeira matrícula | `/admin/students` |
| A09 | Detalhe do aluno | Gerir matrículas, estado, senha e consultar progresso operacional | `/admin/students/{id}/enrollments`, reset de senha |
| A10 | Banco de questões | Filtrar por idioma, habilidade, dificuldade, tipo e estado | `/admin/questions` |
| A11 | Editor de pergunta | Criar rascunho, opções, explicação e pré-visualizar | `/admin/questions/{id}/versions` |
| A12 | Histórico da pergunta | Consultar versões e criar nova versão a partir da publicada | `/admin/questions/{id}/versions` |
| A13 | Lista de temas | Buscar por idioma/estado, criar tema e identificar revisão atual | `/admin/themes` |
| A14 | Editor da revisão do tema | Editar título, descrição, habilidades e categorias do `Draft` | `/admin/themes/{id}/versions/{versionId}` e `/skills` |
| A15 | Estrutura e questões do tema | Configurar dificuldades e selecionar versões publicadas de questões | `/difficulties`, `/questions` da revisão |
| A16 | Revisões e publicação | Validar, pré-visualizar, publicar e comparar revisão atual | `/admin/themes/{id}/versions`, ação `/publish` |
| A17 | Liberação para turmas | Fixar uma revisão por turma, liberar agora/agendar e informar prazo | `/admin/themes/{id}/classes` |
| A18 | Atualização de revisão | Mostrar turmas desatualizadas e aplicar revisão compatível explicitamente | ação `/upgrade-version` |

### Detalhamento administrativo essencial

#### A06 — Detalhe da turma

Abas: `Alunos` e `Temas`.

- Alunos: nome, login, estado da matrícula e um estado operacional entre `Não acessou`, `Acessou`, `Treino iniciado`, `Bloo nasceu`, `Greetings: Easy/Medium/Hard/VeryHard/Concluído`.
- Temas: revisão fixada, liberação, prazo informativo, estado e indicação de revisão mais recente disponível.
- Ações: adicionar matrícula, pausar/finalizar matrícula, associar tema e atualizar revisão.

#### A11 — Editor de pergunta

Campos: idioma, categoria, habilidade, dificuldade, tipo, enunciado, explicação e opções ordenáveis. `MultipleChoice` e `FillBlankWithOptions` exigem no mínimo duas opções e exatamente uma correta.

A tela mantém rascunho durante a sessão, avisa sobre saída com alterações não salvas e exibe a pergunta como o aluno a verá. Conteúdo publicado abre em modo somente leitura; a ação disponível é `Criar nova versão`.

#### A14–A18 — Tema versionado

O cabeçalho sempre mostra `Tema`, `Revisão`, `Estado` e `Revisão publicada atual`. A revisão `Draft` usa etapas:

1. Informações e habilidades.
2. Dificuldades.
3. Questões.
4. Revisão e publicação.
5. Liberação para turmas.

Uma revisão publicada é somente leitura. `Criar nova revisão` copia seu conteúdo. Publicar não altera turmas; a interface precisa comunicar: “A revisão foi publicada. Escolha as turmas que devem recebê-la.” Mudança estrutural incompatível após uso oferece `Duplicar como novo tema`, nunca uma atualização destrutiva.

## 4. Inventário de telas do aluno

| ID | Tela | Objetivo e ação principal | Dados/API principais |
|---|---|---|---|
| S01 | Login | Entrar com login e senha | `POST /auth/login`, `GET /auth/me` |
| S02 | Troca obrigatória de senha | Trocar credencial inicial com orientação simples | `POST /auth/change-password` |
| S03 | Tutorial | Explicar em até três passos que o aluno ensina o Bloo | estado local/servidor de tutorial visto |
| S04 | Home Egg | Apresentar Egg, progresso `0/6` e iniciar/retomar treinamento | `GET /student/home`, criar FirstHatch |
| S05 | Pergunta FirstHatch | Responder uma questão por vez | sessão e `POST .../answers` |
| S06 | Feedback FirstHatch | Mostrar acerto/erro, explicação e nova rachadura | resposta da API; pode ser estado da S05 |
| S07 | Nascimento | Celebrar o Hatchling após a transação de conclusão | `POST .../complete` |
| S08 | Nome opcional | Nomear com 2–20 caracteres ou manter `Bloo` | `PATCH /student/bloo/name` |
| S09 | Home Hatchling | Mostrar Bloo, tema disponível, trilha e conquistas recentes | `GET /student/home` |
| S10 | Detalhe do tema | Explicar missão, dificuldades e próxima etapa | `/student/themes/{id}/progress` |
| S11 | Pergunta temática | Responder uma das cinco questões fixadas | sessão e `/answers` |
| S12 | Feedback temático | Ensinar com resposta correta e explicação, sem punir erro | resposta da API; pode ser estado da S11 |
| S13 | Resumo da sessão | Mostrar XP da primeira conclusão, acertos, próxima etapa e revisões | `POST .../complete` |
| S14 | Celebração de conquista | Comunicar conquistas após resposta/resumo sem interromper pergunta | conquistas retornadas na conclusão |
| S15 | Aprendizado | Separar trilha concluída de domínio das habilidades | `GET /student/progress` |
| S16 | Conquistas | Mostrar desbloqueadas e bloqueadas com requisito compreensível | `GET /student/achievements` |

### Regras de experiência do aluno

- Erro usa linguagem de apoio: mostra a resposta correta e uma explicação curta; nunca retira rachadura, etapa ou XP já obtido.
- Botões e textos não usam “reprovado”, “nota mínima” ou comparação com colegas.
- A barra do Egg avança a cada resposta, independentemente de acerto.
- Nascimento e concessões são apresentados somente depois da confirmação do backend.
- Conquistas surgem no feedback final/resumo; não cobrem o enunciado nem interrompem a resposta.
- A trilha do tema mostra conclusão por dificuldade. O painel “O que seu Bloo está aprendendo” mostra domínio por habilidade e explica que ele cresce com prática e acertos em mais de uma sessão.
- Se nenhuma missão estiver liberada após o nascimento, a home mantém o Bloo visível e informa que uma nova missão chegará em breve.

## 5. Estados obrigatórios

Toda tela que busca dados deve especificar:

- `Loading`: esqueleto estável, sem deslocamento excessivo de layout;
- `Empty`: explica por que não há itens e oferece a ação cabível;
- `Success`: confirmação próxima da ação, sem depender apenas de cor;
- `ValidationError`: mensagem junto ao campo e resumo acessível quando necessário;
- `Unauthorized/Forbidden`: encerra sessão inválida ou oferece retorno seguro;
- `Conflict`: preserva os dados locais e permite recarregar/comparar;
- `Unavailable`: permite tentar novamente sem duplicar a operação;
- `Offline`: avisa antes do envio e mantém o que foi digitado localmente quando seguro.

Casos específicos:

- login: credenciais inválidas, usuário inativo, limite temporário e troca obrigatória;
- publicação: lista de pendências por etapa e conflito de versão;
- treino: retomar sessão, resposta já registrada, perda de conexão, tema fechado e matrícula inativa;
- conclusão: botão protegido contra duplo clique e reenvio com a mesma `Idempotency-Key`;
- atualização de tema: revisão incompatível retorna orientação para duplicar o tema.

## 6. Responsividade e acessibilidade mínima

- Aluno: referência inicial em 360 px, expansão para tablet e desktop; área de toque mínima de 44 × 44 px.
- Administração: referência inicial em 1280 px; em tablet, menu recolhível e tabelas convertidas em cartões/linhas roláveis sem esconder ações.
- Contraste compatível com WCAG 2.2 AA para texto e controles.
- Foco visível, ordem de teclado coerente, rótulos associados e mensagens anunciadas por leitores de tela.
- Cor nunca é o único indicador de estado, dificuldade, acerto ou erro.
- Animação de nascimento respeita `prefers-reduced-motion` e oferece continuação sem espera obrigatória.
- Imagens do Bloo e conquistas possuem texto alternativo contextual; decoração usa alternativa vazia.

## 7. Componentes compartilhados

- `AppShellAdmin`, `AppShellStudent`, cabeçalho e navegação;
- campos, seletor, senha, busca, filtros e paginação;
- tabela/cartão responsivo, badge de estado e menu de ações;
- diálogo de confirmação e aviso de alterações não salvas;
- editor/preview de pergunta e opção de resposta;
- indicador de dificuldade, trilha do tema e domínio de habilidade;
- cartão do Bloo, medidor de rachaduras, toast e painel de conquista;
- `ProblemDetails` para traduzir códigos estáveis da API em mensagens adequadas ao perfil.

## 8. Critérios de aceite por fluxo

### Administrador: turma e aluno

1. Admin autenticado cria uma turma com idioma e nível informativo.
2. Cria aluno, credencial e matrícula na mesma operação.
3. Falha parcial não deixa usuário ou matrícula órfãos.
4. O detalhe da turma passa a mostrar o aluno como `Não acessou`.
5. Redefinição de senha revoga sessões e exige troca no próximo acesso.

### Administrador: pergunta e tema

1. Admin cria e publica uma versão válida de pergunta.
2. Cria tema e revisão, configura as quatro dificuldades e associa versões publicadas.
3. Publicação é bloqueada se uma dificuldade habilitada tiver menos de cinco questões válidas.
4. Revisão publicada fica imutável.
5. Nova revisão não altera turmas até confirmação explícita.
6. Sessão em andamento termina com a revisão que fixou ao iniciar.

### Aluno: nascimento

1. Aluno entra, troca senha se necessário e vê Egg.
2. O sistema cria ou retoma uma única sessão FirstHatch.
3. Seis respostas, certas ou erradas, produzem seis avanços visuais.
4. Conclusão atômica concede XP, nascimento, título e conquistas uma única vez.
5. O aluno pode manter `Bloo` e chegar à home Hatchling.

### Aluno: Greetings

1. Tema aparece somente quando a associação com a turma estiver ativa e liberada.
2. `Easy` inicia com cinco versões fixadas; demais dificuldades permanecem bloqueadas.
3. Concluir libera a etapa seguinte independentemente da nota.
4. XP só é concedido na primeira conclusão da dificuldade.
5. Trilha e domínio aparecem como conceitos distintos.
6. Reenvio, recarga ou concorrência não duplicam resposta, XP ou conquista.

## 9. Ordem recomendada de design e implementação

1. Definir tokens visuais e componentes básicos.
2. Prototipar em baixa fidelidade os dois caminhos verticais: `Admin → Turma → Aluno` e `Aluno → Egg → Nascimento`.
3. Implementar autenticação e troca obrigatória de senha.
4. Implementar turmas, alunos e matrículas.
5. Implementar pergunta versionada e seu preview.
6. Implementar tema versionado, publicação, associação e atualização de revisão.
7. Implementar FirstHatch completo.
8. Implementar Greetings, progresso, domínio e conquistas.
9. Validar responsividade, teclado, contraste, erros e retomada.

Os protótipos devem usar textos e assets reais do MVP. Cada tela aprovada vira história de implementação com rota, contrato, estados e critérios deste documento; isso reduz decisões improvisadas durante a codificação.

## 10. Decisões que não bloqueiam a codificação

- ferramenta externa de prototipação;
- refinamento visual posterior dos ícones, desde que seus espaços e proporções respeitem a especificação de assets;
- métricas analíticas detalhadas;
- telas futuras de professor, IA, ranking e BlueVerse.

Com este planejamento, o desenho em baixa fidelidade pode começar sem novas decisões de produto. Antes de publicar o piloto, ainda será necessária validação visual em dispositivos reais e teste de usabilidade com representantes dos dois perfis.
