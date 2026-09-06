import { Difficulty, QuestionType } from "@prisma/client";

export type ThemeQuestionSeed = {
  code: string;
  difficulty: Difficulty;
  skill: string;
  type: QuestionType;
  prompt: string;
  options: [string, string, string, string];
  correct: number;
  explanation: string;
};

type Row = [string, Difficulty, string, QuestionType, string, [string, string, string, string], number, string];
const rows = (items: Row[]): ThemeQuestionSeed[] => items.map(([code, difficulty, skill, type, prompt, options, correct, explanation]) => {
  // Rotação determinística evita que a posição correta seja previsível sem perder a auditabilidade do conteúdo.
  const rotation = Number(code.slice(-3)) % options.length;
  const rotated = options.map((_, index) => options[(index + rotation) % options.length]) as [string, string, string, string];
  return { code, difficulty, skill, type, prompt, options: rotated, correct: (correct - rotation + options.length) % options.length, explanation };
});
const MC = QuestionType.MultipleChoice;
const FB = QuestionType.FillBlankWithOptions;

export const dailyRoutinesQuestions = rows([
  // Easy — verbo base com I/you/we/they.
  ["BL-EN-101", Difficulty.Easy, "SIMPLE_PRESENT_FORM", FB, "I ___ breakfast at 7 a.m.", ["have", "has", "having", "am have"], 0, "Use the base verb 'have' with I."],
  ["BL-EN-102", Difficulty.Easy, "SIMPLE_PRESENT_FORM", FB, "We ___ to school every weekday.", ["walk", "walks", "walking", "are walk"], 0, "Use the base verb with we: 'walk'."],
  ["BL-EN-103", Difficulty.Easy, "SIMPLE_PRESENT_FORM", FB, "They ___ homework after class.", ["do", "does", "doing", "is do"], 0, "Use 'do' with they in the simple present."],
  ["BL-EN-104", Difficulty.Easy, "ROUTINE_COMPREHENSION", MC, "Leo gets up, brushes his teeth, and eats breakfast. What is this text about?", ["His morning routine", "His birthday party", "A trip yesterday", "A school test"], 0, "The actions describe Leo's usual morning routine."],
  ["BL-EN-105", Difficulty.Easy, "FREQUENCY_EXPRESSIONS", MC, "Which expression means every day?", ["Daily", "Tomorrow", "Last night", "Right now"], 0, "'Daily' means every day."],
  ["BL-EN-106", Difficulty.Easy, "SIMPLE_PRESENT_FORM", FB, "You ___ your bag before school.", ["pack", "packs", "packing", "is pack"], 0, "Use the base form 'pack' with you."],
  ["BL-EN-107", Difficulty.Easy, "ROUTINE_COMPREHENSION", MC, "Mia studies from Monday to Friday. When does she study?", ["On weekdays", "Only on Sunday", "Once a year", "At this exact moment only"], 0, "Monday to Friday are weekdays."],
  ["BL-EN-108", Difficulty.Easy, "FREQUENCY_EXPRESSIONS", FB, "I ___ go to bed at 10 p.m. It is my normal routine.", ["usually", "yesterday", "now", "next year"], 0, "'Usually' describes a normal or frequent habit."],
  ["BL-EN-109", Difficulty.Easy, "SIMPLE_PRESENT_FORM", FB, "My friends and I ___ lunch at school.", ["eat", "eats", "eating", "is eat"], 0, "The plural subject takes the base verb 'eat'."],
  ["BL-EN-110", Difficulty.Easy, "ROUTINE_COMPREHENSION", MC, "Which sentence describes a routine?", ["I read before bed every night.", "I am reading this page now.", "I read that book yesterday.", "I will read it tomorrow."], 0, "'Every night' marks a repeated routine."],

  // Medium — terceira pessoa e regras de -s/-es/-ies.
  ["BL-EN-111", Difficulty.Medium, "SIMPLE_PRESENT_FORM", FB, "She ___ English every afternoon.", ["studies", "study", "studying", "studys"], 0, "With she, 'study' changes to 'studies'."],
  ["BL-EN-112", Difficulty.Medium, "SIMPLE_PRESENT_FORM", FB, "Ben ___ his face in the morning.", ["washes", "wash", "washs", "washing"], 0, "Verbs ending in -sh add -es with he, she, or it."],
  ["BL-EN-113", Difficulty.Medium, "SIMPLE_PRESENT_FORM", FB, "My father ___ to work by bus.", ["goes", "go", "gos", "going"], 0, "With a singular third-person subject, 'go' becomes 'goes'."],
  ["BL-EN-114", Difficulty.Medium, "ROUTINE_COMPREHENSION", MC, "Nina starts class at 8 and finishes at noon. How long is she in class?", ["Four hours", "Two hours", "Eight hours", "Twelve hours"], 0, "From 8 a.m. to noon is four hours."],
  ["BL-EN-115", Difficulty.Medium, "FREQUENCY_EXPRESSIONS", FB, "Tom is never late. He ___ arrives on time.", ["always", "rarely", "never", "yesterday"], 0, "If Tom is never late, he always arrives on time."],
  ["BL-EN-116", Difficulty.Medium, "SIMPLE_PRESENT_FORM", FB, "The school bus ___ at 7:15.", ["leaves", "leave", "leavies", "leaving"], 0, "The singular subject 'bus' takes 'leaves'."],
  ["BL-EN-117", Difficulty.Medium, "FREQUENCY_EXPRESSIONS", MC, "Which sentence has the adverb in the usual position?", ["She often reads after dinner.", "She reads after often dinner.", "Often she after dinner reads.", "She reads often after dinner always."], 0, "Frequency adverbs normally come before the main verb."],
  ["BL-EN-118", Difficulty.Medium, "ROUTINE_COMPREHENSION", MC, "Kai practices soccer on Tuesdays and Thursdays. How often does he practice?", ["Twice a week", "Every day", "Once a month", "Never"], 0, "Two named days each week means twice a week."],
  ["BL-EN-119", Difficulty.Medium, "SIMPLE_PRESENT_FORM", FB, "Ana ___ her room every Saturday.", ["tidies", "tidy", "tidys", "tidying"], 0, "A consonant before final y changes 'tidy' to 'tidies'."],
  ["BL-EN-120", Difficulty.Medium, "FREQUENCY_EXPRESSIONS", FB, "We visit our grandparents two times a month. We visit them ___ a month.", ["twice", "once", "daily", "never"], 0, "'Twice' means two times."],

  // Hard — negativas, perguntas e compreensão contextual.
  ["BL-EN-121", Difficulty.Hard, "SIMPLE_PRESENT_FORM", FB, "He ___ play video games before homework.", ["doesn't", "don't", "isn't", "not"], 0, "Use 'doesn't' with he, followed by the base verb."],
  ["BL-EN-122", Difficulty.Hard, "SIMPLE_PRESENT_FORM", FB, "___ your sister walk to school?", ["Does", "Do", "Is", "Has"], 0, "Use 'Does' to form a simple-present question with a singular third-person subject."],
  ["BL-EN-123", Difficulty.Hard, "SIMPLE_PRESENT_FORM", MC, "Choose the correct question.", ["What time does Maya wake up?", "What time Maya wakes up?", "What time does Maya wakes up?", "What time do Maya wake up?"], 0, "After 'does', use the base form 'wake'."],
  ["BL-EN-124", Difficulty.Hard, "ROUTINE_COMPREHENSION", MC, "Omar doesn't eat at home in the morning. He buys a sandwich near school. Where does he have breakfast?", ["Near school", "At home", "At the gym", "On the bus every night"], 0, "The text says he buys his breakfast near school."],
  ["BL-EN-125", Difficulty.Hard, "FREQUENCY_EXPRESSIONS", FB, "Lia goes swimming on most days, but not every day. She ___ goes swimming.", ["usually", "never", "rarely", "once a year"], 0, "'Usually' fits an activity done on most days."],
  ["BL-EN-126", Difficulty.Hard, "SIMPLE_PRESENT_FORM", FB, "My parents ___ work on Sundays.", ["don't", "doesn't", "aren't", "not"], 0, "Use 'don't' with the plural subject 'my parents'."],
  ["BL-EN-127", Difficulty.Hard, "ROUTINE_COMPREHENSION", MC, "Eva checks her calendar every morning because her schedule changes. Why does she check it?", ["To know the day's activities", "To remember yesterday's weather", "To choose a birthday gift", "To finish dinner"], 0, "She checks the calendar to see the changing schedule for that day."],
  ["BL-EN-128", Difficulty.Hard, "SIMPLE_PRESENT_FORM", FB, "Where ___ your friends study after class?", ["do", "does", "are", "is"], 0, "Use 'do' with the plural subject 'your friends'."],
  ["BL-EN-129", Difficulty.Hard, "FREQUENCY_EXPRESSIONS", MC, "Which option goes from most frequent to least frequent?", ["always, usually, sometimes, never", "never, always, sometimes, usually", "sometimes, never, always, usually", "usually, never, always, sometimes"], 0, "Always is most frequent and never is least frequent."],
  ["BL-EN-130", Difficulty.Hard, "ROUTINE_COMPREHENSION", MC, "Priya studies before dinner unless she has basketball practice. What can we infer?", ["Her study time sometimes changes.", "She never studies.", "She always studies after midnight.", "Basketball happens every evening."], 0, "Basketball practice can change her normal study time."],

  // VeryHard — frequência, posição, nuances e textos curtos.
  ["BL-EN-131", Difficulty.VeryHard, "FREQUENCY_EXPRESSIONS", MC, "Choose the sentence that means Nora almost never misses the bus.", ["Nora rarely misses the bus.", "Nora frequently misses the bus.", "Nora always misses the bus.", "Nora misses the bus every day."], 0, "'Rarely' means almost never."],
  ["BL-EN-132", Difficulty.VeryHard, "SIMPLE_PRESENT_FORM", MC, "Which sentence is grammatically correct?", ["Neither of my brothers walks to school.", "Neither of my brothers walk to school.", "Neither of my brothers don't walk to school.", "Neither my brothers walks school."], 0, "'Neither' is treated as singular here, so the verb is 'walks'."],
  ["BL-EN-133", Difficulty.VeryHard, "FREQUENCY_EXPRESSIONS", FB, "Our teacher is ___ late; she arrives on time nearly every day.", ["hardly ever", "almost always", "frequently", "usually"], 0, "'Hardly ever late' matches arriving on time nearly every day."],
  ["BL-EN-134", Difficulty.VeryHard, "ROUTINE_COMPREHENSION", MC, "On school days, Max cooks only when his parents work late. Otherwise, his father cooks. Who usually prepares dinner?", ["His father", "Max", "His teacher", "Nobody"], 0, "Max cooks only in one special situation; otherwise his father cooks."],
  ["BL-EN-135", Difficulty.VeryHard, "SIMPLE_PRESENT_FORM", FB, "How often ___ the library close early?", ["does", "do", "is", "has"], 0, "Use 'does' with the singular subject 'the library'."],
  ["BL-EN-136", Difficulty.VeryHard, "FREQUENCY_EXPRESSIONS", MC, "Which sentence places the frequency expression correctly?", ["We go hiking once or twice a month.", "We once or twice go hiking a month.", "Once we go or twice hiking month.", "We go once hiking twice a month."], 0, "Multi-word frequency expressions commonly appear at the end of the clause."],
  ["BL-EN-137", Difficulty.VeryHard, "ROUTINE_COMPREHENSION", MC, "Sara normally cycles to work, but she takes the train whenever it rains. Today is dry. How does she probably travel?", ["By bicycle", "By train", "By plane", "On a school bus"], 0, "Her normal choice is cycling, and the rainy-day exception does not apply."],
  ["BL-EN-138", Difficulty.VeryHard, "SIMPLE_PRESENT_FORM", MC, "Choose the correct short answer: 'Does Theo practice before class?'", ["Yes, he does.", "Yes, he practices.", "Yes, he do.", "Yes, he is."], 0, "A short answer to a question with 'does' uses 'does'."],
  ["BL-EN-139", Difficulty.VeryHard, "FREQUENCY_EXPRESSIONS", FB, "I ___ forget my keys, perhaps once or twice a year.", ["seldom", "usually", "always", "daily"], 0, "'Seldom' describes something that happens very infrequently."],
  ["BL-EN-140", Difficulty.VeryHard, "ROUTINE_COMPREHENSION", MC, "A notice says, 'The club meets every other Friday.' What does it mean?", ["The club meets once every two weeks.", "The club meets twice every Friday.", "The club meets every day except Friday.", "The club never meets on Friday."], 0, "'Every other Friday' means alternating Fridays, or once every two weeks."],
]);

export const presentContinuousQuestions = rows([
  // Easy — am/is/are + -ing.
  ["BL-EN-141", Difficulty.Easy, "PRESENT_CONTINUOUS_FORM", FB, "I ___ reading a comic now.", ["am", "is", "are", "be"], 0, "Use 'am' with I before the -ing form."],
  ["BL-EN-142", Difficulty.Easy, "PRESENT_CONTINUOUS_FORM", FB, "She is ___ to music.", ["listening", "listen", "listens", "listenn"], 0, "The present continuous uses 'is' plus the -ing form 'listening'."],
  ["BL-EN-143", Difficulty.Easy, "PRESENT_CONTINUOUS_FORM", FB, "They ___ playing basketball.", ["are", "is", "am", "do"], 0, "Use 'are' with they."],
  ["BL-EN-144", Difficulty.Easy, "ACTION_IN_PROGRESS", MC, "Look! The dog is running after a ball. What is happening?", ["The dog is running.", "The dog runs every Sunday.", "The dog ran yesterday.", "The dog will sleep."], 0, "The action is happening now, so present continuous is appropriate."],
  ["BL-EN-145", Difficulty.Easy, "PRESENT_CONTINUOUS_FORM", FB, "We are ___ dinner.", ["making", "make", "makes", "made"], 0, "After 'are', use the -ing form 'making'."],
  ["BL-EN-146", Difficulty.Easy, "ACTION_IN_PROGRESS", MC, "Which sentence describes an action happening now?", ["Leo is drawing a bird.", "Leo draws every day.", "Leo drew last night.", "Leo will draw tomorrow."], 0, "'Is drawing' describes an action in progress now."],
  ["BL-EN-147", Difficulty.Easy, "PRESENT_CONTINUOUS_FORM", FB, "The teacher ___ speaking.", ["is", "are", "am", "does"], 0, "Use 'is' with the singular subject 'the teacher'."],
  ["BL-EN-148", Difficulty.Easy, "PRESENT_CONTINUOUS_FORM", FB, "You are ___ very fast.", ["walking", "walk", "walks", "walked"], 0, "Present continuous uses 'are walking'."],
  ["BL-EN-149", Difficulty.Easy, "ACTION_IN_PROGRESS", MC, "It is raining. What should you take?", ["An umbrella", "A swimsuit", "A candle", "A tennis racket"], 0, "An umbrella is useful while it is raining."],
  ["BL-EN-150", Difficulty.Easy, "PRESENT_CONTINUOUS_FORM", FB, "My friends are ___ in the library.", ["studying", "study", "studies", "studied"], 0, "Use the -ing form 'studying' after 'are'."],

  // Medium — negativas, perguntas e ortografia.
  ["BL-EN-151", Difficulty.Medium, "PRESENT_CONTINUOUS_FORM", FB, "He ___ sleeping; he is doing homework.", ["isn't", "aren't", "doesn't", "not"], 0, "Use 'isn't' to make the present continuous negative with he."],
  ["BL-EN-152", Difficulty.Medium, "PRESENT_CONTINUOUS_FORM", FB, "___ they waiting for the bus?", ["Are", "Is", "Do", "Does"], 0, "Move 'are' before 'they' to form the question."],
  ["BL-EN-153", Difficulty.Medium, "PRESENT_CONTINUOUS_FORM", MC, "What is the correct -ing form of 'write'?", ["writing", "writeing", "writting", "writes"], 0, "Drop the final silent e before adding -ing: writing."],
  ["BL-EN-154", Difficulty.Medium, "PRESENT_CONTINUOUS_FORM", MC, "What is the correct -ing form of 'run'?", ["running", "runing", "runnning", "runs"], 0, "Double the final consonant in 'run': running."],
  ["BL-EN-155", Difficulty.Medium, "ACTION_IN_PROGRESS", MC, "Maya is wearing a coat and carrying skis. What is she probably doing?", ["Going skiing", "Going swimming", "Baking a cake", "Sleeping"], 0, "A coat and skis suggest that she is going skiing."],
  ["BL-EN-156", Difficulty.Medium, "PRESENT_CONTINUOUS_FORM", FB, "I am not ___ television right now.", ["watching", "watch", "watches", "watched"], 0, "After 'am not', use the -ing form 'watching'."],
  ["BL-EN-157", Difficulty.Medium, "PRESENT_CONTINUOUS_FORM", MC, "Choose the correct question.", ["What is Nina cooking?", "What Nina is cooking?", "What does Nina cooking?", "What are Nina cook?"], 0, "In a present-continuous question, 'is' comes before the subject."],
  ["BL-EN-158", Difficulty.Medium, "ACTION_IN_PROGRESS", MC, "The students are whispering because a presentation is happening. Why are they quiet?", ["A presentation is in progress.", "School is closed every day.", "They finished yesterday.", "They are outside playing drums."], 0, "They are quiet because a presentation is happening now."],
  ["BL-EN-159", Difficulty.Medium, "PRESENT_CONTINUOUS_FORM", FB, "The baby is ___ on the sofa.", ["lying", "lieing", "laying", "lies"], 0, "The -ing form of 'lie' is 'lying'."],
  ["BL-EN-160", Difficulty.Medium, "ACTION_IN_PROGRESS", MC, "Which reply answers 'What are you doing?'", ["I'm finishing my project.", "I finish at five every day.", "I finished yesterday.", "I like projects."], 0, "The question asks about the action in progress now."],

  // Hard — contraste entre rotina e ação atual.
  ["BL-EN-161", Difficulty.Hard, "SIMPLE_PRESENT_VS_CONTINUOUS", FB, "Luca usually walks, but today he ___ the bus.", ["is taking", "takes", "take", "taking"], 0, "'Today' contrasts a temporary current action with the usual routine."],
  ["BL-EN-162", Difficulty.Hard, "SIMPLE_PRESENT_VS_CONTINUOUS", FB, "My mother ___ at a hospital, but this week she is working from home.", ["works", "is working", "work", "working"], 0, "The permanent job uses simple present; the temporary change uses present continuous."],
  ["BL-EN-163", Difficulty.Hard, "SIMPLE_PRESENT_VS_CONTINUOUS", MC, "Choose the sentence that contrasts a habit with now.", ["I play tennis on Saturdays, but I am studying now.", "I am play tennis and study now.", "I played tennis every Saturday now.", "I playing tennis on Saturdays."], 0, "Simple present expresses the habit; present continuous expresses what is happening now."],
  ["BL-EN-164", Difficulty.Hard, "ACTION_IN_PROGRESS", MC, "A sign says, 'Quiet, students are taking an exam.' What should visitors do?", ["Avoid making noise", "Start a loud conversation", "Enter and play music", "Ask everyone to leave school"], 0, "The exam is in progress, so visitors should be quiet."],
  ["BL-EN-165", Difficulty.Hard, "PRESENT_CONTINUOUS_FORM", FB, "Why ___ you laughing?", ["are", "do", "is", "does"], 0, "Use 'are' before 'you' in a present-continuous question."],
  ["BL-EN-166", Difficulty.Hard, "SIMPLE_PRESENT_VS_CONTINUOUS", FB, "Water normally freezes at 0°C, but this water ___ yet.", ["isn't freezing", "doesn't freeze", "not freezes", "isn't freeze"], 0, "The first clause states a fact; the second describes the current situation."],
  ["BL-EN-167", Difficulty.Hard, "ACTION_IN_PROGRESS", MC, "Nora keeps looking at the clock and packing her books. What is she probably preparing to do?", ["Leave soon", "Start sleeping", "Cook breakfast", "Paint the classroom"], 0, "Looking at the clock and packing suggest she is preparing to leave."],
  ["BL-EN-168", Difficulty.Hard, "SIMPLE_PRESENT_VS_CONTINUOUS", FB, "We ___ with our aunt this month while our house is repaired.", ["are staying", "stay always", "stays", "are stay"], 0, "'This month' describes a temporary situation, so use present continuous."],
  ["BL-EN-169", Difficulty.Hard, "PRESENT_CONTINUOUS_FORM", MC, "Choose the correct negative question.", ["Isn't he coming with us?", "Doesn't he coming with us?", "Is he not comes with us?", "Not is he coming with us?"], 0, "'Isn't he coming...?' is the correct negative present-continuous question."],
  ["BL-EN-170", Difficulty.Hard, "SIMPLE_PRESENT_VS_CONTINUOUS", MC, "Which sentence describes a repeated annoying behavior?", ["You are always leaving the door open!", "You always leave the door open at 8:00 as planned.", "You left the door open yesterday.", "You will open the door later."], 0, "Present continuous with 'always' can express annoyance about repeated behavior."],

  // VeryHard — situações temporárias, planos e verbos de estado.
  ["BL-EN-171", Difficulty.VeryHard, "SIMPLE_PRESENT_VS_CONTINUOUS", MC, "Choose the natural sentence.", ["I understand the question now.", "I am understanding the question now.", "I understanding the question now.", "I do understanding the question."], 0, "'Understand' is normally a stative verb and is not used in the continuous here."],
  ["BL-EN-172", Difficulty.VeryHard, "SIMPLE_PRESENT_VS_CONTINUOUS", FB, "This soup ___ delicious, but the chef is still adding spices.", ["tastes", "is tasting", "taste", "is taste"], 0, "'Taste' describes the soup's state here, so simple present is natural."],
  ["BL-EN-173", Difficulty.VeryHard, "ACTION_IN_PROGRESS", MC, "'I'm meeting the principal at three.' What does this most likely express?", ["A future arrangement", "A daily habit", "A completed past action", "A scientific fact"], 0, "Present continuous can describe a definite future arrangement."],
  ["BL-EN-174", Difficulty.VeryHard, "SIMPLE_PRESENT_VS_CONTINUOUS", FB, "I ___ about your suggestion; I haven't decided yet.", ["am thinking", "think always", "thinks", "am think"], 0, "'Am thinking about' describes an active, temporary mental process."],
  ["BL-EN-175", Difficulty.VeryHard, "SIMPLE_PRESENT_VS_CONTINUOUS", MC, "Which pair uses 'have' correctly?", ["I have a bike. I am having lunch.", "I am having a bike. I have lunch right now.", "I having a bike. I am have lunch.", "I has a bike. I having lunch."], 0, "Possession uses simple present; an activity such as lunch can use present continuous."],
  ["BL-EN-176", Difficulty.VeryHard, "ACTION_IN_PROGRESS", MC, "A message says, 'We're flying to Recife on Friday; the tickets are booked.' What is communicated?", ["A confirmed future plan", "A timeless fact", "A past trip", "An activity happening every Friday"], 0, "The booked tickets support a definite future arrangement."],
  ["BL-EN-177", Difficulty.VeryHard, "SIMPLE_PRESENT_VS_CONTINUOUS", FB, "More students ___ online courses these days.", ["are taking", "take now always", "takes", "are take"], 0, "'These days' can describe a developing temporary trend, so present continuous fits."],
  ["BL-EN-178", Difficulty.VeryHard, "PRESENT_CONTINUOUS_FORM", MC, "Choose the correctly punctuated question.", ["Why are you wearing a coat indoors?", "Why you are wearing a coat indoors?", "Why do you wearing a coat indoors?", "Why are wearing you a coat indoors?"], 0, "The correct order is question word + be + subject + verb-ing."],
  ["BL-EN-179", Difficulty.VeryHard, "SIMPLE_PRESENT_VS_CONTINUOUS", MC, "Which sentence implies a temporary situation?", ["Ella is teaching at our school this semester.", "Ella teaches mathematics as a profession.", "Ella knows the head teacher.", "Ella owns two dictionaries."], 0, "'This semester' marks the teaching situation as temporary."],
  ["BL-EN-180", Difficulty.VeryHard, "ACTION_IN_PROGRESS", MC, "During a video call, Amir says, 'The screen keeps freezing, so I'm reconnecting.' What is he doing?", ["Trying to restore the call now", "Describing his usual morning", "Remembering a call from last year", "Scheduling a call for next month"], 0, "'I'm reconnecting' describes his current attempt to restore the call."],
]);
