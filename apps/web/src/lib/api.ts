export type AuthUser = {
  id: string;
  schoolId: string;
  displayName: string;
  login: string;
  role: "Admin" | "Student";
  mustChangePassword: boolean;
};

export type AuthSession = { accessToken: string; expiresIn: number; user: AuthUser };
export type StudentRecord = { id: string; fullName: string; login: string; isActive: boolean; lastLoginAt?: string | null; createdAt: string };
export type AdminRecord = StudentRecord & { mustChangePassword: boolean };
export type Difficulty = "Easy" | "Medium" | "Hard" | "VeryHard";
export type GreetingsState = {
  code: "GREETINGS"; title: string; description: string;
  bloo: { name: string; stage: "Egg" | "Hatchling"; xp: number };
  status: "NotStarted" | "InProgress" | "Completed"; currentDifficulty: Difficulty;
  levels: { difficulty: Difficulty; status: "Locked" | "Available" | "Completed"; sessionsCompleted: number; bestCorrectAnswers: number; bestAccuracy: number }[];
  achievements: string[];
  skills: { code?: string; attempts: number; accuracy: number; status: "NotStarted" | "Practicing" | "Mastered" }[];
};
export type GreetingsSession = {
  id: string; difficulty: Difficulty; newlyUnlocked: string[];
  questions: { id: string; code: string; prompt: string; explanation: string; skill: string; difficulty: Difficulty; options: { id: string; text: string }[]; correctOptionId: string }[];
};
export type GreetingsCompletion = { correctAnswers: number; totalQuestions: number; awardedXP: number; firstCompletion: boolean; newlyUnlocked: string[]; theme: GreetingsState };
export type JourneyState={bloo:{name:string;stage:"Egg"|"Hatchling";xp:number};classes:string[];achievements:string[];themes:{id:string;title:string;description:string;levels:{difficulty:Difficulty;status:"Locked"|"Available"|"Completed";sessionsCompleted:number;bestCorrectAnswers:number}[]}[];pending:{id:string;type:"FirstHatch"|"ThemeMission";themeId:string|null;difficulty:Difficulty|null}[]};
export type JourneySession={id:string;type:"FirstHatch"|"ThemeMission";title:string;difficulty:Difficulty|null;questions:{id:string;prompt:string;options:{id:string;text:string}[];feedback:{selectedOptionId:string;isCorrect:boolean;correctOptionId:string;explanation:string}|null}[]};
export type AnswerFeedback={selectedOptionId:string;isCorrect:boolean;correctOptionId:string;explanation:string};
export type TrainingResult={xp:number;correct:number;total:number;hatched:boolean;newlyUnlocked:string[]};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

export async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (!response.ok) {
    if(response.status===401 && token) window.dispatchEvent(new Event("birdleague-session-expired"));
    const body = await response.json().catch(() => ({}));
    throw new Error(typeof body.message === "string" ? body.message : "request_failed");
  }
  return response.json() as Promise<T>;
}

export const api = {
  login: (login: string, password: string) => request<AuthSession>("/auth/login", { method: "POST", body: JSON.stringify({ login, password }) }),
  me: (token: string) => request<AuthUser>("/auth/me", {}, token),
  changePassword: (token: string, currentPassword: string, newPassword: string) => request<{ changed: true }>("/auth/change-password", { method: "POST", body: JSON.stringify({ currentPassword, newPassword }) }, token),
  listStudents: (token: string) => request<{ items: StudentRecord[]; totalItems: number }>("/admin/students", {}, token),
  createStudent: (token: string, data: { fullName: string; login: string; password: string }) => request<StudentRecord>("/admin/students", { method: "POST", body: JSON.stringify(data) }, token),
  listAdmins: (token: string) => request<{ items: AdminRecord[]; totalItems: number }>("/admin/admins", {}, token),
  createAdmin: (token: string, data: { fullName: string; login: string; password: string }) => request<AdminRecord>("/admin/admins", { method: "POST", body: JSON.stringify(data) }, token),
  greetings: (token: string) => request<GreetingsState>("/student/greetings", {}, token),
  startGreetings: (token: string, difficulty: Difficulty) => request<GreetingsSession>("/student/greetings/sessions", { method: "POST", body: JSON.stringify({ difficulty }) }, token),
  completeGreetings: (token: string, sessionId: string, answers: { questionId: string; selectedOptionId: string }[]) => request<GreetingsCompletion>(`/student/greetings/sessions/${sessionId}/complete`, { method: "POST", body: JSON.stringify({ answers }) }, token),
  journey: (token:string)=>request<JourneyState>("/student/journey",{},token),
  startTraining:(token:string,data:{type:"FirstHatch"|"ThemeMission";themeId?:string;difficulty?:Difficulty})=>request<JourneySession>("/student/training",{method:"POST",body:JSON.stringify(data)},token),
  resumeTraining:(token:string,id:string)=>request<JourneySession>(`/student/training/${id}`,{},token),
  answerTraining:(token:string,id:string,data:{questionId:string;selectedOptionId:string})=>request<AnswerFeedback>(`/student/training/${id}/answers`,{method:"POST",body:JSON.stringify(data)},token),
  completeTraining:(token:string,id:string)=>request<TrainingResult>(`/student/training/${id}/complete`,{method:"POST",body:"{}"},token),
  nameBloo:(token:string,name:string)=>request<{saved:true}>("/student/bloo/name",{method:"PUT",body:JSON.stringify({name})},token),
};
