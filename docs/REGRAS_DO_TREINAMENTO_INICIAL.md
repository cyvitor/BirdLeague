# Regras do Treinamento Inicial — BirdLeague

Este documento define a primeira versão das regras do treino que transforma o Egg em Hatchling.

## 1. Objetivo

O treinamento inicial deve apresentar a proposta do BirdLeague, observar o nível inicial do aluno e criar uma primeira conquista emocional. Ele não é uma prova.

O aluno deve conseguir fazer o Bloo nascer mesmo errando todas as respostas, desde que conclua o treino.

## 2. Idioma inicial

O primeiro idioma do MVP será **Inglês**, por ser o idioma com mais alunos na escola.

## 3. Quantidade de perguntas

O primeiro treino terá **6 perguntas**.

Motivos:

- É curto o bastante para celular.
- Permite mostrar progresso visível no ovo.
- Dá sinais iniciais de nível sem parecer prova longa.
- Funciona bem para alunos novos ou ansiosos.

Se os testes mostrarem que o fluxo ficou longo, reduzir para 5. Se ficar raso demais, aumentar para 8.

## 4. Duração esperada

Meta de duração:

- Aluno rápido: 3 a 4 minutos.
- Aluno médio: 5 a 7 minutos.
- Limite desejado: até 10 minutos.

O MVP não deve ter contagem regressiva. Tempo pode ser registrado para análise, mas não deve pressionar o aluno.

## 5. Tipos de pergunta no treino inicial

Tipos permitidos no MVP:

- Múltipla escolha.
- Completar lacuna com opções.
- Associação simples.

Listening pode entrar depois do primeiro teste se a escola tiver áudio pronto. Speaking e escrita aberta ficam fora do MVP.

## 6. Composição recomendada

Para o primeiro treino de Inglês:

1. Vocabulário simples.
2. Gramática simples.
3. Leitura curta.
4. Vocabulário em contexto.
5. Gramática em contexto.
6. Revisão ou pergunta de confiança.

Essa composição permite observar diferentes habilidades sem transformar a experiência em avaliação formal.

## 7. Dificuldade

O treino inicial deve usar dificuldade baixa a média:

- 4 perguntas fáceis.
- 2 perguntas médias.
- 0 perguntas difíceis.

Perguntas difíceis não devem aparecer antes de o aluno entender a dinâmica do produto.

## 8. Rachaduras do ovo

Cada pergunta concluída avança o ovo, independentemente de acerto ou erro.

Progresso visual sugerido:

1. Ovo inteiro.
2. Primeira rachadura.
3. Segunda rachadura.
4. Rachadura maior.
5. Ovo tremendo ou brilhando.
6. Ovo quase abrindo.
7. Nascimento do Hatchling.

Se o app tiver apenas imagens fixas no MVP, usar 4 estados já é suficiente:

- Egg.
- Cracking 1.
- Cracking 2.
- Cracking 3.
- Hatchling.

## 9. Feedback de resposta

### Acerto

O feedback deve ser curto e positivo:

- "Boa! Você acertou."
- "Isso mesmo."
- "Mandou bem."

Depois mostrar uma explicação curta quando fizer sentido.

### Erro

O erro deve orientar sem punir:

- "Quase! A resposta correta é..."
- "Boa tentativa. Repara nesta dica..."
- "Essa pegadinha aparece bastante em Inglês."

Sempre mostrar a resposta correta e uma explicação simples.

## 10. XP e progresso

Regra inicial:

- Concluir o treino: 60 XP.
- Cada acerto: 5 XP extras.
- XP máximo do primeiro treino: 90 XP.

O nascimento do Hatchling depende apenas da conclusão, não do XP.

Essa regra valoriza acertos, mas não faz o aluno sentir que fracassou se errar.

## 11. Repetição do treino inicial

Depois que o Bloo nasce:

- O treino inicial não deve gerar novo nascimento.
- Pode ser repetido como revisão se necessário.
- Repetições não devem conceder novamente o XP de nascimento.
- Acertos em repetição podem gerar XP reduzido ou nenhum XP no MVP.

## 12. Abandono

Se o aluno sair no meio:

- A sessão registra status `abandoned` se passar muito tempo sem retorno.
- Ao voltar no mesmo dia, pode continuar de onde parou.
- Se a implementação ficar mais simples, pode reiniciar a sessão sem prejuízo.

O sistema deve evitar duplicar XP ao reenviar respostas ou recarregar a tela.

## 13. Critério de nascimento

O Bloo nasce quando:

- O aluno conclui todas as 6 perguntas.
- A sessão é marcada como concluída.
- O Bloo ainda está em estágio Egg.

Resultado:

- Bloo muda para Hatchling.
- Aluno recebe o título `New Hatchling`.
- Sistema registra um evento de progresso `FirstTrainingCompleted`.

## 14. Próximo objetivo após o nascimento

Após o nascimento, a home deve mostrar:

- "Seu Bloo nasceu."
- "Próximo objetivo: ajudar seu Bloo a crescer."
- Botão para novo treino, mesmo que no MVP ele leve a uma tela simples de "em breve" ou a outro treino básico.

Se possível, o MVP deve ter pelo menos um treino repetível simples depois do nascimento para testar retorno.

