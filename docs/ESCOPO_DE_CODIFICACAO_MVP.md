# Escopo de Codificação do MVP — BirdLeague

Este documento é a fonte de verdade para iniciar a implementação. Quando houver conflito com documentos anteriores, prevalecem as decisões registradas aqui para o MVP.

## 1. Objetivo executável

> Administrador entra → cria turma → cria aluno e matrícula → aluno entra → conhece o Egg → conclui seis perguntas → o ovo se abre → nomeia o Hatchling → realiza a missão `Greetings` → administrador acompanha o progresso.

## 2. Decisões fechadas

- Aplicação web responsiva, com portal administrativo e experiência mobile-first do aluno.
- Backend em Node.js 24 LTS, NestJS, TypeScript, Prisma ORM e MySQL.
- Frontend em Next.js, React, TypeScript e Tailwind CSS.
- Primeiro idioma: Inglês.
- O idioma e a identificação pedagógica são definidos pela turma. Ao associar um tema, a escola declara que o conteúdo já foi trabalhado; as dificuldades são etapas internas do tema e não níveis CEFR.
- Não é necessário definir uma faixa etária global para codificar. A UI seguirá linguagem simples, controles grandes e acessibilidade geral.
- Não é necessário conhecer previamente a quantidade de alunos ou professores. As listagens terão paginação e não presumirão volume fixo.
- Não é necessário indicar um validador pedagógico para iniciar. O conteúdo seed é considerado aprovado para o MVP.
- O MVP terá apenas os papéis operacionais `Admin` e `Student`. `Teacher` fica reservado para evolução posterior.
- Cadastro de turmas e alunos será manual. Importação por planilha fica fora do MVP.
- Temas e perguntas serão administrados por usuários `Admin`.
- O primeiro treino terá exatamente seis perguntas.
- O primeiro tema após o nascimento será `Greetings`, com perguntas de todas as dificuldades.
- Os assets Egg, rachaduras e Hatchling fazem parte da implementação do MVP.

## 3. Seed inicial de desenvolvimento

O seed deve criar escola `Bluebird`, idioma `English` (`en`), catálogo de níveis, habilidades, categorias, conquistas, perguntas do nascimento, tema `Greetings` e suas perguntas.

Também deve criar, em qualquer ambiente e somente quando nenhum administrador existir, o login bootstrap `vh` com senha inicial `123456`. A senha usa Argon2id e exige troca no primeiro acesso; até a troca, nenhuma função administrativa fica disponível. Em produção, a implantação não é considerada concluída enquanto a credencial inicial continuar válida.

O seed será idempotente e não duplicará registros ao ser executado novamente.

## 4. Administração do MVP

O administrador poderá:

- entrar com login e senha;
- listar, criar, editar, ativar e desativar turmas;
- definir nome, idioma, nível e período da turma;
- listar, criar, editar, ativar e desativar alunos;
- criar login e senha inicial do aluno;
- matricular um aluno em uma ou mais turmas;
- redefinir a senha do aluno;
- administrar temas e perguntas;
- associar um tema a turmas e liberá-lo imediatamente ou em data agendada;
- consultar o status operacional do aluno: acesso, nascimento e etapa atual do tema.

Não haverá cadastro ou fluxo de professor no MVP.

## 5. Primeiro treino: nascimento

- Tipo: `FirstHatch`.
- Total: seis perguntas, sendo quatro `Easy` e duas `Medium`.
- Pode misturar vocabulário, gramática e leitura conforme o banco inicial.
- Cada pergunta respondida avança o ovo, independentemente de acerto.
- Conclusão concede 60 XP; cada acerto concede 5 XP; máximo de 90 XP.
- O nascimento depende da conclusão, não da pontuação.
- As perguntas vêm do template seed `FIRST_HATCH_EN`, com 24 versões elegíveis e cotas de dificuldade.
- Ao concluir, o Bloo passa de `Egg` para `Hatchling`, recebe `New Hatchling` e `First Lesson` e mantém o nome padrão `Bloo` até o aluno decidir personalizá-lo.

## 6. Abandono e retomada

- Uma sessão `InProgress` é retomada da primeira pergunta ainda não respondida.
- O progresso respondido e o estado visual do ovo são preservados.
- Após 24 horas sem atividade, a sessão continua `InProgress`, mas aparece como inativa e retomável.
- Não será criada uma nova sessão `FirstHatch` enquanto existir outra retomável.
- Respostas, XP, nascimento e conquistas serão idempotentes.

## 7. Primeira missão: Greetings

Após o nascimento, o aluno verá `Greetings` como primeira missão. O tema terá `Easy`, `Medium`, `Hard` e `VeryHard`.

- `Easy`: reconhecimento direto de cumprimentos.
- `Medium`: escolha conforme horário ou situação.
- `Hard`: interpretação de diálogo curto e registro formal/informal.
- `VeryHard`: adequação contextual e intenção comunicativa.

O tema possui 40 perguntas, dez por dificuldade. Cada sessão seleciona cinco perguntas. O sistema começa em `Easy` e libera a próxima dificuldade após a conclusão da anterior. Erros não removem progresso; a etapa pode ser refeita e novas tentativas priorizam questões não vistas e respostas erradas.

Conquistas:

- `First Theme`: iniciar `Greetings`.
- `Theme Explorer`: concluir `Easy`.
- `Bloo Is Learning`: acumular cinco respostas na mesma habilidade em pelo menos duas sessões.
- `Skill Learned`: atingir a regra de domínio do modelo de dados.
- `Greetings Climber`: concluir `Easy`, `Medium` e `Hard`.
- `Greetings Master`: concluir todas as dificuldades e alcançar pelo menos 80% em uma sessão `Hard` ou `VeryHard`.
- `Vocabulary Explorer`: dominar `Greetings` e concluir todas as dificuldades.

As condições completas estão em [Conquistas do MVP](CONQUISTAS_MVP.md).

Na primeira conclusão de cada dificuldade, a missão concede 25 XP base + 5 por acerto, até 50 XP. Repetições não concedem XP no MVP.

## 8. Telas necessárias

### Administração

1. Login.
2. Lista e formulário de turmas com status operacional dos alunos.
3. Lista e formulário de alunos.
4. Matrículas do aluno.
5. Lista e formulário de temas.
6. Lista, formulário e pré-visualização de perguntas.

### Aluno

1. Login.
2. Tutorial de até três passos.
3. Home com Egg.
4. Pergunta, resposta e feedback.
5. Nascimento e nomeação opcional do Bloo.
6. Home com Hatchling e missão `Greetings`.
7. Etapa de dificuldade disponível.
8. Resumo da missão e conquistas.
9. Perfil e progresso básico.

## 9. Requisitos transversais

- Separação de dados por escola e autorização no backend.
- Senhas com hash; tokens e segredos fora de logs.
- Datas em UTC e exclusão lógica onde houver histórico.
- Paginação nas listagens administrativas.
- Progresso transacional e idempotente.
- OpenAPI como contrato do frontend.
- Testes unitários, de integração e do fluxo ponta a ponta principal.
- Layout utilizável a partir de 360 px e em desktop.
- Teclado, foco visível, contraste, texto alternativo e `prefers-reduced-motion`.

## 10. O que não bloqueia a codificação

Podem ser definidos com a escola antes do piloto real:

- faixa etária específica;
- quantidade real de usuários;
- responsável pela aprovação pedagógica;
- política final de privacidade, retenção e participação de responsáveis;
- hospedagem e orçamento;
- metas quantitativas do piloto.

Esses itens podem bloquear a operação real, mas não a construção com dados fictícios.

## 11. Fora do MVP

- Professor como papel operacional.
- Importação por planilha.
- Geração de perguntas por IA.
- Recuperação autônoma de senha por e-mail.
- Dashboard analítico e relatórios pedagógicos detalhados.
- Listening, speaking e respostas abertas.
- PWA, aplicativo nativo, rankings, PvP, guerras, bosses e loja.

## 12. Ordem recomendada

1. Solução, banco, migrations, CI e ambientes.
2. Identidade, seed e isolamento por escola.
3. Turmas, alunos e matrículas.
4. Temas e perguntas.
5. Treino idempotente e retomável.
6. Jornada Egg → Hatchling.
7. `Greetings`, dificuldades e conquistas.
8. Acompanhamento operacional mínimo nas listas administrativas.
9. Testes, acessibilidade, observabilidade e homologação.
