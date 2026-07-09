# Regras do Treinamento Inicial â€” BirdLeague

Este documento define a primeira versÃ£o das regras do treino que transforma o Egg em Hatchling.

## 1. Objetivo

O treinamento inicial deve apresentar a proposta do BirdLeague, observar o nÃ­vel inicial do aluno e criar uma primeira conquista emocional. Ele nÃ£o Ã© uma prova.

O aluno deve conseguir fazer o Bloo nascer mesmo errando todas as respostas, desde que conclua o treino.

## 2. Idioma inicial

O primeiro idioma do MVP serÃ¡ **InglÃªs**, por ser o idioma com mais alunos na escola.

## 3. Quantidade de perguntas

O primeiro treino terÃ¡ **6 perguntas**.

Motivos:

- Ã‰ curto o bastante para celular.
- Permite mostrar progresso visÃ­vel no ovo.
- DÃ¡ sinais iniciais de nÃ­vel sem parecer prova longa.
- Funciona bem para alunos novos ou ansiosos.

Se os testes mostrarem que o fluxo ficou longo, reduzir para 5. Se ficar raso demais, aumentar para 8.

## 4. DuraÃ§Ã£o esperada

Meta de duraÃ§Ã£o:

- Aluno rÃ¡pido: 3 a 4 minutos.
- Aluno mÃ©dio: 5 a 7 minutos.
- Limite desejado: atÃ© 10 minutos.

O MVP nÃ£o deve ter contagem regressiva. Tempo pode ser registrado para anÃ¡lise, mas nÃ£o deve pressionar o aluno.

## 5. Tipos de pergunta no treino inicial

Tipos permitidos no MVP:

- MÃºltipla escolha.
- Completar lacuna com opÃ§Ãµes.
- AssociaÃ§Ã£o simples.

Listening pode entrar depois do primeiro teste se a escola tiver Ã¡udio pronto. Speaking e escrita aberta ficam fora do MVP.

## 6. ComposiÃ§Ã£o recomendada

Para o primeiro treino de InglÃªs:

1. VocabulÃ¡rio simples.
2. GramÃ¡tica simples.
3. Leitura curta.
4. VocabulÃ¡rio em contexto.
5. GramÃ¡tica em contexto.
6. RevisÃ£o ou pergunta de confianÃ§a.

Essa composiÃ§Ã£o permite observar diferentes habilidades sem transformar a experiÃªncia em avaliaÃ§Ã£o formal.

## 7. Dificuldade

O treino inicial deve usar dificuldade baixa a mÃ©dia:

- 4 perguntas fÃ¡ceis.
- 2 perguntas mÃ©dias.
- 0 perguntas difÃ­ceis.

Perguntas difÃ­ceis nÃ£o devem aparecer antes de o aluno entender a dinÃ¢mica do produto.

## 8. Rachaduras do ovo

Cada pergunta concluÃ­da avanÃ§a o ovo, independentemente de acerto ou erro.

Progresso visual sugerido:

1. Ovo inteiro.
2. Primeira rachadura.
3. Segunda rachadura.
4. Rachadura maior.
5. Ovo tremendo ou brilhando.
6. Ovo quase abrindo.
7. Nascimento do Hatchling.

Se o app tiver apenas imagens fixas no MVP, usar 4 estados jÃ¡ Ã© suficiente:

- Egg.
- Cracking 1.
- Cracking 2.
- Cracking 3.
- Hatchling.

## 9. Feedback de resposta

### Acerto

O feedback deve ser curto e positivo:

- "Boa! VocÃª acertou."
- "Isso mesmo."
- "Mandou bem."

Depois mostrar uma explicaÃ§Ã£o curta quando fizer sentido.

### Erro

O erro deve orientar sem punir:

- "Quase! A resposta correta Ã©..."
- "Boa tentativa. Repara nesta dica..."
- "Essa pegadinha aparece bastante em InglÃªs."

Sempre mostrar a resposta correta e uma explicaÃ§Ã£o simples.

## 10. XP e progresso

Regra inicial:

- Concluir o treino: 60 XP.
- Cada acerto: 5 XP extras.
- XP mÃ¡ximo do primeiro treino: 90 XP.

O nascimento do Hatchling depende apenas da conclusÃ£o, nÃ£o do XP.

Essa regra valoriza acertos, mas nÃ£o faz o aluno sentir que fracassou se errar.

## 11. RepetiÃ§Ã£o do treino inicial

Depois que o Bloo nasce:

- O treino inicial nÃ£o deve gerar novo nascimento.
- Pode ser repetido como revisÃ£o se necessÃ¡rio.
- RepetiÃ§Ãµes nÃ£o devem conceder novamente o XP de nascimento.
- Acertos em repetiÃ§Ã£o podem gerar XP reduzido ou nenhum XP no MVP.

## 12. Abandono

Se o aluno sair no meio:

- A sessÃ£o registra status `abandoned` se passar muito tempo sem retorno.
- Ao voltar no mesmo dia, pode continuar de onde parou.
- Se a implementaÃ§Ã£o ficar mais simples, pode reiniciar a sessÃ£o sem prejuÃ­zo.

O sistema deve evitar duplicar XP ao reenviar respostas ou recarregar a tela.

## 13. CritÃ©rio de nascimento

O Bloo nasce quando:

- O aluno conclui todas as 6 perguntas.
- A sessÃ£o Ã© marcada como concluÃ­da.
- O Bloo ainda estÃ¡ em estÃ¡gio Egg.

Resultado:

- Bloo muda para Hatchling.
- Aluno recebe o tÃ­tulo `New Hatchling`.
- Sistema registra um evento de progresso `FirstTrainingCompleted`.

## 14. PrÃ³ximo objetivo apÃ³s o nascimento

ApÃ³s o nascimento, a home deve mostrar:

- "Seu Bloo nasceu."
- "PrÃ³ximo objetivo: ajudar seu Bloo a crescer."
- BotÃ£o para novo treino, mesmo que no MVP ele leve a uma tela simples de "em breve" ou a outro treino bÃ¡sico.

Se possÃ­vel, o MVP deve ter pelo menos um treino repetÃ­vel simples depois do nascimento para testar retorno.

