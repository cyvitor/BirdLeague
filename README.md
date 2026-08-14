# BirdLeague

BirdLeague é uma plataforma gamificada de aprendizagem de idiomas criada para a escola Bluebird. Cada aluno ensina e treina seu Bloo, um companheiro que nasce, aprende e evolui conforme o estudante pratica e demonstra domínio do idioma.

O propósito do projeto é transformar o estudo frequente em uma jornada de cuidado, evolução, coleção e cooperação. No futuro, o conhecimento que o aluno ensina ao Bloo também poderá ser convertido em poderes usados em desafios, batalhas individuais, guerras entre turmas e eventos cooperativos.

## Estado do projeto

O MVP navegável está implementado em um monorepo com frontend Next.js, API NestJS e schema MySQL/Prisma. A demonstração cobre a landing do aluno, os dois perfis de acesso, o ciclo `Egg → FirstHatch → Hatchling`, a missão `Greetings`, progresso, conquistas e acompanhamento administrativo.

O frontend possui um modo de demonstração local persistente para validação imediata da experiência. A API expõe o contrato do ciclo principal e uma implementação em memória para testes; o schema e o seed Prisma preparam a persistência MySQL da implantação.

## Executar localmente

Requisitos: Node.js 22+ (24 LTS recomendado), pnpm 10+ e Docker para o MySQL.

```bash
pnpm install
pnpm dev:web
```

Acesse `http://localhost:3000`. No modo demonstração:

- aluno: qualquer login e senha;
- administrador: login `vh` e qualquer senha.

Para executar também a API e o MySQL:

```bash
docker compose up -d mysql
cp .env.example .env
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

- Web: `http://localhost:3000`
- API: `http://localhost:3001/api/v1`
- OpenAPI: `http://localhost:3001/api/docs`

## Verificação

```bash
pnpm build
pnpm test
```

Os testes da API validam que o nascimento depende da conclusão, não dos acertos, e que repetir uma conclusão não duplica XP.

## Documentação

- [Visão geral do produto](docs/VISAO_DO_PRODUTO.md) — propósito, público, princípios, experiência, progressão, competições e visão de longo prazo.
- [Documentação técnica](docs/ARQUITETURA_TECNICA.md) — tecnologias, arquitetura, dados, segurança e interfaces administrativa e do aluno.
- [Roadmap](docs/ROADMAP.md) — etapas do MVP, critérios de conclusão e evoluções posteriores.
- [Fluxos do MVP](docs/FLUXOS_MVP.md) — telas e caminhos principais para administrador e aluno.
- [Planejamento de telas do MVP](docs/PLANEJAMENTO_DE_TELAS_MVP.md) — inventário, estados, APIs, acessibilidade e critérios de aceite das interfaces.
- [Regras do treinamento inicial](docs/REGRAS_DO_TREINAMENTO_INICIAL.md) — quantidade de perguntas, XP, rachaduras, feedback e nascimento do Bloo.
- [Modelo de dados do MVP](docs/MODELO_DE_DADOS_MVP.md) — entidades, campos mínimos e regras de domínio.
- [Conteúdo pedagógico inicial](docs/CONTEUDO_PEDAGOGICO_INICIAL.md) — classificação das perguntas, habilidades, níveis e banco mínimo.
- [Banco de perguntas inicial](docs/BANCO_DE_PERGUNTAS_INICIAL.md) — 100 perguntas de Inglês, incluindo o primeiro treino e a missão `Greetings`.
- [Tom de voz e UI](docs/TOM_DE_VOZ_E_UI.md) — linguagem, mensagens, paleta e política visual mínima.
- [Escopo de codificação do MVP](docs/ESCOPO_DE_CODIFICACAO_MVP.md) — decisões fechadas, seeds, telas, regras e ordem de implementação.
- [Especificação visual dos assets](docs/ESPECIFICACAO_VISUAL_ASSETS_MVP.md) — posições, âncoras, encaixes e exportação de Egg e Hatchling.
- [Guia de uso dos assets do MVP](docs/GUIA_DE_USO_ASSETS_MVP.md) — arquivos gerados, gatilhos e colocação de cada imagem nas telas.
- [Guia de óculos e encaixes](docs/GUIA_OCULOS_E_ENCAIXES.md) — modelos cosméticos, âncoras, camadas e transforms por pose.
- [Conquistas do MVP](docs/CONQUISTAS_MVP.md) — condições, progressão e idempotência dos desbloqueios.
- [Ambientes de desenvolvimento e produção](docs/AMBIENTES_DESENVOLVIMENTO_E_PRODUCAO.md) — preparação para Windows e Linux.
- [Autenticação e segurança](docs/AUTENTICACAO_E_SEGURANCA_MVP.md) — senhas, tokens, cookies, bootstrap e Cloudflare.
- [Contrato da API](docs/CONTRATO_API_MVP.md) — rotas, erros, paginação, concorrência e idempotência.
- [Landing page dos alunos](docs/LANDINGPAGE_ALUNOS.md) — página de incentivo para alunos acessarem o BirdLeague e iniciarem o primeiro treino.
- [Landing page da escola](docs/LANDINGPAGE_ESCOLA.md) — página institucional/comercial para apresentar proposta, funcionamento e diferenciais do BirdLeague.
- [BlueVerse](docs/BLUEVERSE.md) — visão futura de mundo compartilhado seguro para Bloos, eventos e conquistas coletivas.

## Primeiro objetivo do produto

Validar se a evolução visual do Bloo cria no aluno a vontade de voltar e realizar mais um treinamento.

O primeiro ciclo jogável será:

> Entrar → conhecer o ovo → treinar ensinando o Bloo → receber feedback → quebrar o ovo → conhecer o Bloo filhote → desejar continuar ensinando e evoluindo junto.

## Princípios

- O aprendizado vem antes da competição.
- O esforço e a constância também são recompensados.
- Errar faz parte do treinamento e nunca deve impedir a primeira conquista.
- O conhecimento gera vantagens, mas não deve criar partidas injustas.
- Rankings devem motivar sem expor ou humilhar alunos.
- A experiência precisa funcionar bem no celular e na web.

## Nome e identidade

- **Escola:** Bluebird
- **Comunidade de alunos:** Birds
- **Jogo:** BirdLeague
- **Avatar/personagem:** Bloo, com pronúncia sugerida "blú"
