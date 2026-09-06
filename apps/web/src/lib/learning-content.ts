export type Difficulty = "Easy" | "Medium" | "Hard" | "VeryHard";
export type Question = {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: Difficulty;
  skill: string;
};

export const firstHatchQuestions: Question[] = [
  { id: "fh-1", prompt: "Como você diz “Olá” em Inglês?", options: ["Hello", "Good night", "Thanks", "Please"], correct: 0, explanation: "“Hello” é uma forma comum de dizer “Olá”.”", difficulty: "Easy", skill: "Basic Greetings" },
  { id: "fh-2", prompt: "Complete: I ___ a student.", options: ["is", "are", "am", "be"], correct: 2, explanation: "Usamos “am” com o pronome “I”.”", difficulty: "Easy", skill: "Verb To Be" },
  { id: "fh-3", prompt: "Qual palavra significa “azul”?", options: ["Bird", "Blue", "Book", "Ball"], correct: 1, explanation: "“Blue” significa “azul”.”", difficulty: "Easy", skill: "Vocabulary" },
  { id: "fh-4", prompt: "Ana says: “Hi, I'm Ana.” What is her name?", options: ["Hi", "Ana", "Name", "Bird"], correct: 1, explanation: "Na frase, Ana se apresenta dizendo “I'm Ana”.”", difficulty: "Easy", skill: "Reading" },
  { id: "fh-5", prompt: "Complete: They ___ my friends.", options: ["am", "is", "are", "be"], correct: 2, explanation: "Usamos “are” com “they”.”", difficulty: "Medium", skill: "Verb To Be" },
  { id: "fh-6", prompt: "Someone asks “How are you?”. Choose the best answer.", options: ["I'm fine, thanks!", "My name blue.", "At school.", "Twelve years."], correct: 0, explanation: "“I'm fine, thanks!” responde como você está.", difficulty: "Medium", skill: "Basic Greetings" },
];

export const greetingQuestions: Record<Difficulty, Question[]> = {
  Easy: [
    { id: "ge-1", prompt: "Which expression means “Bom dia”?", options: ["Good morning", "Good evening", "Goodbye", "Good night"], correct: 0, explanation: "Use “Good morning” no período da manhã.", difficulty: "Easy", skill: "Basic Greetings" },
    { id: "ge-2", prompt: "Choose a friendly way to say hello.", options: ["Hi!", "Later", "Sorry", "Night"], correct: 0, explanation: "“Hi!” é uma saudação amigável e informal.", difficulty: "Easy", skill: "Basic Greetings" },
    { id: "ge-3", prompt: "What do you say when leaving?", options: ["Welcome", "Goodbye", "Hello", "Please"], correct: 1, explanation: "“Goodbye” é usado ao se despedir.", difficulty: "Easy", skill: "Basic Greetings" },
    { id: "ge-4", prompt: "Complete: Nice to ___ you.", options: ["meet", "morning", "fine", "hello"], correct: 0, explanation: "A expressão é “Nice to meet you”.”", difficulty: "Easy", skill: "Basic Greetings" },
    { id: "ge-5", prompt: "Choose the answer to “How are you?”.", options: ["Good night", "I'm great!", "See you", "Hello, name"], correct: 1, explanation: "“I'm great!” conta como você está.", difficulty: "Easy", skill: "Greeting Comprehension" },
  ],
  Medium: [
    { id: "gm-1", prompt: "It's 8:00 p.m. How do you greet someone?", options: ["Good morning", "Good afternoon", "Good evening", "Goodbye"], correct: 2, explanation: "No começo da noite, usamos “Good evening”.”", difficulty: "Medium", skill: "Greeting Comprehension" },
    { id: "gm-2", prompt: "Your friend says “What's up?”. Choose a natural reply.", options: ["Not much!", "Good morning, teacher.", "My blue.", "At eight."], correct: 0, explanation: "“Not much!” é uma resposta informal e natural.", difficulty: "Medium", skill: "Greeting Comprehension" },
    { id: "gm-3", prompt: "Complete: How ___ you doing?", options: ["is", "am", "are", "be"], correct: 2, explanation: "A pergunta correta é “How are you doing?”.”", difficulty: "Medium", skill: "Basic Greetings" },
    { id: "gm-4", prompt: "Which greeting fits a teacher best?", options: ["Yo!", "Hey dude!", "Good morning, Ms. Silva.", "What's up, Silva?"], correct: 2, explanation: "Em contexto escolar, essa forma é educada e adequada.", difficulty: "Medium", skill: "Greeting Comprehension" },
    { id: "gm-5", prompt: "“See you later” means…", options: ["Até mais", "Bom dia", "Com licença", "Obrigado"], correct: 0, explanation: "É uma despedida indicando que vocês se verão depois.", difficulty: "Medium", skill: "Basic Greetings" },
  ],
  Hard: [
    { id: "gh-1", prompt: "A: Good morning. How may I help you? This greeting is…", options: ["formal and helpful", "angry", "very informal", "a goodbye"], correct: 0, explanation: "A frase usa registro formal e oferece ajuda.", difficulty: "Hard", skill: "Greeting Comprehension" },
    { id: "gh-2", prompt: "Which sentence politely introduces a colleague?", options: ["This is my colleague, Marta.", "Marta is here, okay?", "Hey, that Marta.", "You know Marta."], correct: 0, explanation: "“This is…” é uma forma clara e educada de apresentar alguém.", difficulty: "Hard", skill: "Greeting Comprehension" },
    { id: "gh-3", prompt: "A: It was lovely meeting you. B: ___", options: ["Likewise!", "Good morning.", "I'm twelve.", "Never."], correct: 0, explanation: "“Likewise” significa que o sentimento é recíproco.", difficulty: "Hard", skill: "Greeting Comprehension" },
    { id: "gh-4", prompt: "Choose the most formal opening.", options: ["Hey there!", "Dear Mr. Adams,", "Hi buddy!", "What's up?"], correct: 1, explanation: "“Dear Mr. Adams” é adequado a uma comunicação formal.", difficulty: "Hard", skill: "Greeting Comprehension" },
    { id: "gh-5", prompt: "“How have you been?” is used when…", options: ["meeting after some time", "asking a name", "saying good night", "ordering food"], correct: 0, explanation: "A expressão pergunta como a pessoa tem estado desde o último encontro.", difficulty: "Hard", skill: "Greeting Comprehension" },
  ],
  VeryHard: [
    { id: "gv-1", prompt: "At a first business meeting, choose the best greeting.", options: ["Yo, what's new?", "It's a pleasure to meet you.", "Long time no see!", "Hey buddy!"], correct: 1, explanation: "É cordial, formal e adequada a um primeiro encontro profissional.", difficulty: "VeryHard", skill: "Greeting Comprehension" },
    { id: "gv-2", prompt: "“Do give my regards to your family” expresses…", options: ["a complaint", "a polite good wish", "an invitation", "a warning"], correct: 1, explanation: "“Give my regards” envia cumprimentos de forma educada.", difficulty: "VeryHard", skill: "Greeting Comprehension" },
    { id: "gv-3", prompt: "Which response politely closes a conversation?", options: ["Enough.", "I won't talk.", "It was great catching up with you.", "Why are you here?"], correct: 2, explanation: "A frase reconhece positivamente a conversa e sinaliza o encerramento.", difficulty: "VeryHard", skill: "Greeting Comprehension" },
    { id: "gv-4", prompt: "“Pleased to make your acquaintance” is closest to…", options: ["Nice to meet you", "See you tomorrow", "How old are you?", "You're welcome"], correct: 0, explanation: "É uma versão mais formal de “Nice to meet you”.”", difficulty: "VeryHard", skill: "Greeting Comprehension" },
    { id: "gv-5", prompt: "Your manager introduces you to a client. You say…", options: ["What's up?", "Pleased to meet you, Ms. Lee.", "Okay, bye.", "You can call later."], correct: 1, explanation: "A resposta é respeitosa e apropriada ao contexto profissional.", difficulty: "VeryHard", skill: "Greeting Comprehension" },
  ],
};

export const achievements = [
  ["NEW_HATCHLING", "New Hatchling", "Novo Filhote", "Seu Bloo nasceu e a jornada de vocês começou."],
  ["FIRST_LESSON", "First Lesson", "Primeira Lição", "Você concluiu o primeiro treino do seu Bloo."],
  ["FIRST_THEME", "First Theme", "Primeiro Tema", "Você começou sua primeira missão de aprendizado."],
  ["THEME_EXPLORER", "Theme Explorer", "Explorador de Temas", "Você concluiu a primeira etapa de um tema."],
  ["BLOO_IS_LEARNING", "Bloo Is Learning", "Bloo Está Aprendendo", "Vocês praticaram a mesma habilidade em mais de um treino."],
  ["SKILL_LEARNED", "Skill Learned", "Habilidade Aprendida", "Seu Bloo demonstrou domínio em uma habilidade."],
  ["GREETINGS_CLIMBER", "Greetings Climber", "Escalando Greetings", "Você avançou de Easy até Hard em Greetings."],
  ["GREETINGS_MASTER", "Greetings Master", "Mestre de Greetings", "Você concluiu todos os desafios de Greetings."],
  ["VOCABULARY_EXPLORER", "Vocabulary Explorer", "Explorador de Vocabulário", "Seu Bloo dominou seus primeiros cumprimentos."],
  ["ROUTINE_STARTER", "Routine Starter", "Começando a Rotina", "Você concluiu os primeiros passos de uma rotina em inglês."],
  ["HABIT_BUILDER", "Habit Builder", "Criador de Hábitos", "Você avançou de Easy até Hard em Daily Routines."],
  ["ROUTINE_MASTER", "Routine Master", "Mestre das Rotinas", "Você concluiu todos os desafios de Daily Routines."],
  ["CONSISTENCY_EXPERT", "Consistency Expert", "Especialista em Consistência", "Seu Bloo dominou formas, frequência e compreensão de rotinas."],
  ["ACTION_SPOTTER", "Action Spotter", "Observador de Ações", "Você reconheceu suas primeiras ações acontecendo agora."],
  ["ING_CLIMBER", "-ing Climber", "Escalando o -ing", "Você avançou de Easy até Hard em What’s Happening Now?."],
  ["ACTION_MASTER", "Action Master", "Mestre das Ações", "Você concluiu todos os desafios de What’s Happening Now?."],
  ["NOW_EXPERT", "Now Expert", "Especialista no Agora", "Seu Bloo dominou forma, contexto e contraste das ações em progresso."],
] as const;
