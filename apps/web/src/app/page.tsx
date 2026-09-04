"use client";

import Image from "next/image";
import {
  ArrowLeft, ArrowRight, Bird, BookOpen, Check, CheckCircle2,
  ChevronRight, CircleHelp, Database, Egg, GraduationCap, Home, Layers3,
  LockKeyhole, LogOut, Plus, Sparkles, Trophy,
  UserRound, UsersRound, X, Zap,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { achievements, Difficulty, firstHatchQuestions, greetingQuestions } from "@/lib/learning-content";
import { api, AuthSession, GreetingsSession, GreetingsState } from "@/lib/api";
import SecureAdminApp from "@/components/admin-app";
import StudentPortal from "@/components/student-portal";

const blooPath = "/assets/bloo/";
const achievementPath = "/assets/achievements/";

type Screen = "landing" | "login" | "changePassword" | "tutorial" | "student" | "quiz" | "hatch" | "name" | "admin";
type StudentTab = "home" | "learning" | "achievements";
type AdminTab = "overview" | "classes" | "students" | "themes" | "questions";
type DemoProgress = {
  hatched: boolean;
  blooName: string;
  xp: number;
  firstCorrect: number;
  completed: Difficulty[];
  unlocked: string[];
};

const initialProgress: DemoProgress = { hatched: false, blooName: "Bloo", xp: 0, firstCorrect: 0, completed: [], unlocked: [] };

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="brand"><span className="brand-mark"><Bird size={24} strokeWidth={3} /></span>{!compact && <span>Bird<span className="brand-dot">League</span></span>}</div>;
}

export default function Page() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [progress, setProgress] = useState<DemoProgress>(initialProgress);
  const [quizType, setQuizType] = useState<"first" | "theme">("first");
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [themeSession, setThemeSession] = useState<GreetingsSession | null>(null);

  useEffect(() => {
    const expired=()=>logout();window.addEventListener("birdleague-session-expired",expired);return()=>window.removeEventListener("birdleague-session-expired",expired);
  }, []);

  useEffect(() => {
    const token = window.sessionStorage.getItem("birdleague-access-token");
    if (!token) return setReady(true);
    api.me(token).then(user => {
      const restored = { accessToken: token, expiresIn: 600, user };
      setSession(restored);
      if (user.role === "Student") {
        const saved = window.localStorage.getItem(`birdleague-progress:${user.id}`);
        const restoredProgress = saved ? JSON.parse(saved) as DemoProgress : initialProgress;
        setProgress(restoredProgress);
        api.greetings(token).then(theme => setProgress(fromTheme(theme, restoredProgress))).catch(() => undefined);
      }
      setScreen(user.mustChangePassword ? "changePassword" : user.role === "Admin" ? "admin" : "student");
    }).catch(() => window.sessionStorage.removeItem("birdleague-access-token")).finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready && session?.user.role === "Student") window.localStorage.setItem(`birdleague-progress:${session.user.id}`, JSON.stringify(progress));
  }, [progress, ready, session]);

  function authenticated(next: AuthSession) {
    setSession(next);
    window.sessionStorage.setItem("birdleague-access-token", next.accessToken);
    let nextProgress = initialProgress;
    if (next.user.role === "Student") {
      const saved = window.localStorage.getItem(`birdleague-progress:${next.user.id}`);
      nextProgress = saved ? JSON.parse(saved) : initialProgress;
      setProgress(nextProgress);
      api.greetings(next.accessToken).then(theme => setProgress(fromTheme(theme, nextProgress))).catch(() => undefined);
    }
    setScreen(next.user.mustChangePassword ? "changePassword" : next.user.role === "Admin" ? "admin" : (nextProgress.hatched ? "student" : "tutorial"));
  }

  function logout() { window.sessionStorage.removeItem("birdleague-access-token"); setSession(null); setProgress(initialProgress); setScreen("login"); }

  const startFirst = () => { setQuizType("first"); setScreen("quiz"); };
  const startTheme = async (level: Difficulty) => {
    if (!session) return;
    try {
      const training = await api.startGreetings(session.accessToken, level);
      setThemeSession(training); setDifficulty(level); setQuizType("theme"); setScreen("quiz");
    } catch (error) {
      window.alert(error instanceof Error && error.message === "difficulty_locked" ? "Conclua o nível anterior antes de continuar." : "Não foi possível iniciar o treino agora.");
    }
  };
  const reset = () => { setProgress(initialProgress); if (session) window.localStorage.removeItem(`birdleague-progress:${session.user.id}`); setScreen("student"); };

  if (!ready) return <div className="player-bg" />;
  if (screen === "landing") return <Landing onEnter={() => setScreen("login")} />;
  if (screen === "login") return <Login onBack={() => setScreen("landing")} onAuthenticated={authenticated} />;
  if (screen === "changePassword" && session) return <ChangePassword session={session} onChanged={logout} />;
  if (session?.user.role === "Student" && !session.user.mustChangePassword) return <StudentPortal token={session.accessToken} user={session.user} onLogout={logout} />;
  if (screen === "tutorial") return <Tutorial onDone={() => setScreen("student")} />;
  if (screen === "quiz") return <Quiz type={quizType} difficulty={difficulty} remoteSession={quizType === "theme" ? themeSession : null} onExit={() => setScreen("student")} onComplete={async (correct, answers) => {
    if (quizType === "first") {
      setProgress(p => ({ ...p, firstCorrect: correct, xp: 60 + correct * 5, unlocked: ["NEW_HATCHLING", "FIRST_LESSON"] }));
      setScreen("hatch");
    } else if (session && themeSession && answers) {
      const result = await api.completeGreetings(session.accessToken, themeSession.id, answers);
      setProgress(p => fromTheme(result.theme, p));
      setThemeSession(null); setScreen("student");
    }
  }} />;
  if (screen === "hatch") return <Hatch xp={60 + progress.firstCorrect * 5} onContinue={() => setScreen("name")} />;
  if (screen === "name") return <NameBloo onSave={(name) => { setProgress(p => ({ ...p, hatched: true, blooName: name || "Bloo" })); setScreen("student"); }} />;
  if (screen === "admin" && session) return <SecureAdminApp token={session.accessToken} user={session.user} onLogout={logout} />;
  return <StudentApp progress={progress} onStartFirst={startFirst} onStartTheme={startTheme} onLogout={logout} onReset={reset} />;
}

function fromTheme(theme: GreetingsState, current: DemoProgress): DemoProgress {
  const firstHatchXP = current.hatched ? 60 + current.firstCorrect * 5 : 0;
  return { ...current, xp: firstHatchXP + theme.bloo.xp, completed: theme.levels.filter(level => level.status === "Completed").map(level => level.difficulty), unlocked: [...new Set([...current.unlocked.filter(code => code === "NEW_HATCHLING" || code === "FIRST_LESSON"), ...theme.achievements])] };
}

function Landing({ onEnter }: { onEnter: () => void }) {
  return <main className="player-bg">
    <div className="shell">
      <header className="topbar"><Brand /><div style={{ display: "flex", gap: 10 }}><span className="pill"><GraduationCap size={16} /> Bluebird Idiomas</span><button className="btn btn-ghost btn-small" onClick={onEnter}>Entrar</button></div></header>
      <section className="hero">
        <div>
          <div className="eyebrow">Uma aventura Bluebird</div>
          <h1>Ensine. Evolua. <em>Voe.</em></h1>
          <p className="hero-copy">Aprenda Inglês cuidando de um companheiro que cresce com você. Cada resposta ensina algo novo ao seu Bloo — e essa jornada começa dentro deste ovo.</p>
          <div className="hero-actions"><button className="btn btn-primary" onClick={onEnter}>Conhecer meu Bloo <ArrowRight size={20} /></button><a className="btn btn-ghost" href="#como-funciona"><CircleHelp size={19} /> Como funciona</a></div>
          <div className="hero-proof"><span><CheckCircle2 size={17} color="var(--green)" /> Treinos de 5 minutos</span><span><CheckCircle2 size={17} color="var(--green)" /> Progresso sem punição</span><span><CheckCircle2 size={17} color="var(--green)" /> Aprenda no seu ritmo</span></div>
        </div>
        <div className="hero-visual" aria-label="Ovo do Bloo esperando para nascer">
          <div className="egg-stage"><Image src={`${blooPath}egg-idle.png`} alt="Ovo azul e laranja do Bloo, ainda inteiro" width={1024} height={1024} priority /></div>
          <div className="floating-note note-one"><Sparkles size={18} color="var(--gold)" /> Uma resposta por vez</div>
          <div className="floating-note note-two"><Zap size={18} color="var(--orange)" /> Seu progresso dá vida</div>
        </div>
      </section>
      <section id="como-funciona" style={{ padding: "50px 0 100px", textAlign: "center" }}>
        <div className="eyebrow">O primeiro voo</div><h2 className="section-title" style={{ fontSize: "2.3rem" }}>Você ensina. O Bloo aprende.</h2>
        <div className="stats-grid" style={{ marginTop: 30 }}>
          {[ [Egg, "Conheça seu Egg", "Um novo companheiro está esperando por suas primeiras palavras."], [BookOpen, "Complete o treino", "Seis perguntas curtas fazem o ovo ganhar vida, acerte ou erre."], [Bird, "Veja seu Bloo nascer", "Celebre a primeira conquista e continue aprendendo juntos."]].map(([Icon, title, body], i) => {
            const C = Icon as typeof Egg; return <article className="card stat" key={title as string} style={{ padding: 28 }}><div className="mission-icon" style={{ margin: "0 auto 14px" }}><C /></div><strong style={{ fontSize: "1.1rem" }}>{i + 1}. {title as string}</strong><p style={{ color: "var(--muted)", fontSize: ".9rem" }}>{body as string}</p></article>;
          })}
        </div>
      </section>
    </div>
  </main>;
}

function Login({ onBack, onAuthenticated }: { onBack: () => void; onAuthenticated: (session: AuthSession) => void }) {
  const [login, setLogin] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent) { e.preventDefault(); if (!login || !password) return setError("Preencha seu login e sua senha."); setLoading(true); setError(""); try { onAuthenticated(await api.login(login, password)); } catch { setError("Login ou senha inválidos."); } finally { setLoading(false); } }
  return <main className="login-wrap">
    <section className="login-scene"><Brand /><div className="login-copy"><div className="eyebrow" style={{ color: "#9edbfa" }}>Seu companheiro espera por você</div><h1>Vamos ensinar algo novo hoje?</h1><p>Cada treino fortalece suas habilidades e ajuda seu Bloo a descobrir um mundo maior.</p></div><Image src={`${blooPath}hatchling-happy.png`} alt="Bloo filhote feliz" width={1024} height={1024} /></section>
    <section className="login-panel"><form className="login-form" onSubmit={submit}><button type="button" onClick={onBack} className="btn btn-ghost btn-small" style={{ marginBottom: 32 }}><ArrowLeft size={17} /> Voltar</button><h2>Boas-vindas!</h2><p>Entre com os dados que você recebeu da escola.</p>
      <div className="field"><label htmlFor="login">Seu login</label><input className="input" id="login" autoComplete="username" value={login} onChange={e => setLogin(e.target.value)} placeholder="ex.: lia.martins" /></div>
      <div className="field"><label htmlFor="password">Sua senha</label><input className="input" id="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Digite sua senha" /></div>
      {error && <p role="alert" style={{ color: "var(--red)", fontSize: ".86rem" }}>{error}</p>}<button className="btn btn-blue" type="submit" disabled={loading}>{loading ? "Validando..." : "Entrar"} <ArrowRight size={19} /></button>
      <p className="login-help">Estudantes recebem suas credenciais diretamente da escola.</p>
    </form></section>
  </main>;
}

function ChangePassword({ session, onChanged }: { session: AuthSession; onChanged: () => void }) {
  const [currentPassword, setCurrentPassword] = useState(""); const [newPassword, setNewPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent) { e.preventDefault(); const minimum=session.user.role==="Admin"?12:8; if (newPassword !== confirm) return setError("A confirmação não corresponde à nova senha."); if (newPassword.length < minimum) return setError(`Use pelo menos ${minimum} caracteres.`); setLoading(true); setError(""); try { await api.changePassword(session.accessToken, currentPassword, newPassword); onChanged(); } catch { setError("Não foi possível alterar. Confira a senha atual e escolha uma senha mais forte."); } finally { setLoading(false); } }
  return <main className="login-wrap"><section className="login-scene"><Brand /><div className="login-copy"><div className="eyebrow" style={{ color: "#9edbfa" }}>Primeiro acesso</div><h1>Proteja sua conta.</h1><p>A senha provisória só pode ser usada até esta troca.</p></div><Image src={`${blooPath}hatchling-thinking.png`} alt="Bloo cuidando da segurança" width={1024} height={1024} /></section><section className="login-panel"><form className="login-form" onSubmit={submit}><h2>Crie sua nova senha</h2><p>Use pelo menos {session.user.role === "Admin" ? 12 : 8} caracteres. Evite seu login e senhas comuns.</p><div className="field"><label htmlFor="current-password">Senha provisória</label><input className="input" id="current-password" type="password" autoComplete="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} /></div><div className="field"><label htmlFor="new-password">Nova senha</label><input className="input" id="new-password" type="password" autoComplete="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} /></div><div className="field"><label htmlFor="confirm-password">Confirmar nova senha</label><input className="input" id="confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} /></div>{error && <p role="alert" style={{ color: "var(--red)", fontSize: ".86rem" }}>{error}</p>}<button className="btn btn-blue" disabled={loading}>{loading ? "Alterando..." : "Alterar senha"}</button></form></section></main>;
}

function Tutorial({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    ["egg-idle.png", "Este é seu Egg", "Dentro dele existe um Bloo pronto para aprender com você."],
    ["egg-crack-2.png", "Cada resposta ensina", "Acertos e erros fazem parte do treino. Seu progresso sempre conta."],
    ["hatchling-celebrate.png", "E vocês crescem juntos", "Complete missões, fortaleça habilidades e descubra novas conquistas."],
  ];
  return <main className="celebrate player-bg"><div className="celebrate-content card" style={{ padding: "25px 35px 36px" }}><div className="eyebrow">Passo {step + 1} de 3</div><Image src={`${blooPath}${steps[step][0]}`} alt="Bloo apresentando a jornada" width={1024} height={1024} /><h1 style={{ fontSize: "2.4rem" }}>{steps[step][1]}</h1><p>{steps[step][2]}</p><div className="progress-track" style={{ margin: "22px auto", maxWidth: 300 }}><span style={{ width: `${(step + 1) * 33.33}%` }} /></div><button className="btn btn-primary" onClick={() => step < 2 ? setStep(step + 1) : onDone()}>{step < 2 ? "Continuar" : "Conhecer meu Egg"} <ArrowRight size={19} /></button></div></main>;
}

function StudentApp({ progress, onStartFirst, onStartTheme, onLogout, onReset }: { progress: DemoProgress; onStartFirst: () => void; onStartTheme: (d: Difficulty) => void; onLogout: () => void; onReset: () => void }) {
  const [tab, setTab] = useState<StudentTab>("home");
  return <main className="student-shell player-bg"><div className="shell"><header className="student-head"><Brand /><div style={{ display: "flex", gap: 8 }}><span className="pill"><Zap size={16} color="var(--orange)" /> {progress.xp} XP</span><button className="btn btn-ghost btn-small" aria-label="Sair" onClick={onLogout}><LogOut size={17} /></button></div></header></div>
    <div className="student-main">{tab === "home" && <StudentHome progress={progress} onStartFirst={onStartFirst} onStartTheme={onStartTheme} />}{tab === "learning" && <Learning progress={progress} onStartTheme={onStartTheme} />}{tab === "achievements" && <Achievements unlocked={progress.unlocked} onReset={onReset} />}</div>
    <nav className="student-nav" aria-label="Navegação do aluno"><button className={`nav-item ${tab === "home" ? "active" : ""}`} onClick={() => setTab("home")}><Home size={19} /> Início</button><button className={`nav-item ${tab === "learning" ? "active" : ""}`} onClick={() => setTab("learning")}><BookOpen size={19} /> Aprendizado</button><button className={`nav-item ${tab === "achievements" ? "active" : ""}`} onClick={() => setTab("achievements")}><Trophy size={19} /> Conquistas</button></nav>
  </main>;
}

function StudentHome({ progress, onStartFirst, onStartTheme }: { progress: DemoProgress; onStartFirst: () => void; onStartTheme: (d: Difficulty) => void }) {
  const next = nextDifficulty(progress.completed);
  return <><section className="card bloo-home"><div><div className="eyebrow">{progress.hatched ? "Companheiro de Inglês" : "Sua jornada começa aqui"}</div><h1>{progress.hatched ? `Olá, eu sou ${progress.blooName}!` : "Seu Bloo está quase pronto."}</h1><p>{progress.hatched ? "Eu já aprendi minhas primeiras palavras. Que tal continuarmos nossa missão?" : "Ensine seis palavras e expressões para ajudar seu Egg a se abrir. Cada resposta conta."}</p><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22, fontSize: ".82rem", fontWeight: 900 }}><span>{progress.hatched ? "Energia de aprendizado" : "Progresso do nascimento"}</span><span>{progress.hatched ? `${progress.xp} XP` : "0 / 6"}</span></div><div className="progress-track" style={{ margin: "8px 0 23px" }}><span style={{ width: progress.hatched ? `${Math.min(progress.xp / 4, 100)}%` : "0%" }} /></div>{!progress.hatched && <button className="btn btn-primary" onClick={onStartFirst}>Começar primeiro treino <ArrowRight size={19} /></button>}</div><Image className="bloo-image" src={`${blooPath}${progress.hatched ? "hatchling-idle.png" : "egg-idle.png"}`} alt={progress.hatched ? `${progress.blooName}, seu Bloo filhote` : "Ovo azul e laranja do Bloo"} width={1024} height={1024} priority /></section>
    {progress.hatched && <><h2 className="section-title">Próxima missão</h2><section className="card mission-card"><div className="mission-icon"><BookOpen /></div><div><h3>Greetings · {next ?? "Concluído"}</h3><p>{next ? "Treine cumprimentos e ensine novas expressões ao seu Bloo." : "Você concluiu toda a trilha. Continue praticando para dominar a habilidade."}</p></div><button className="btn btn-primary btn-small" onClick={() => onStartTheme(next ?? "Easy")}>{next ? "Começar" : "Revisar"} <ChevronRight size={17} /></button></section>
    <h2 className="section-title">Seu voo até aqui</h2><div className="stats-grid"><div className="card stat"><strong>{progress.xp}</strong><span>XP conquistados</span></div><div className="card stat"><strong>{progress.completed.length}/4</strong><span>Etapas de Greetings</span></div><div className="card stat"><strong>{progress.unlocked.length}</strong><span>Conquistas</span></div></div></>}</>;
}

function nextDifficulty(completed: Difficulty[]): Difficulty | null { return (["Easy", "Medium", "Hard", "VeryHard"] as Difficulty[]).find(d => !completed.includes(d)) ?? null; }

function Learning({ progress, onStartTheme }: { progress: DemoProgress; onStartTheme: (d: Difficulty) => void }) {
  const next = nextDifficulty(progress.completed);
  return <><div className="eyebrow">Sua evolução</div><h1 style={{ fontSize: "2.5rem", margin: "8px 0" }}>Aprendizado</h1><p style={{ color: "var(--muted)" }}>A trilha mostra o caminho concluído. As habilidades crescem com prática em mais de um treino.</p><h2 className="section-title">Trilha do tema</h2><section className="card learning-card"><span className="pill"><BookOpen size={16} /> English</span><h3>Greetings</h3><p>Cumprimentos, apresentações e despedidas em diferentes situações.</p><div className="difficulty-row">{(["Easy", "Medium", "Hard", "VeryHard"] as Difficulty[]).map(d => <div key={d} className={`difficulty ${progress.completed.includes(d) ? "done" : d === next ? "available" : ""}`}>{progress.completed.includes(d) ? <Check size={14} style={{ display: "inline" }} /> : d !== next ? <LockKeyhole size={13} style={{ display: "inline" }} /> : null} {d}</div>)}</div>{next && <button style={{ marginTop: 18 }} className="btn btn-blue btn-small" onClick={() => onStartTheme(next)}>Treinar {next}</button>}</section>
    <h2 className="section-title">O que seu Bloo está aprendendo</h2><div className="learning-grid"><section className="card learning-card"><div className="eyebrow">Vocabulary</div><h3>Basic Greetings</h3><p>{progress.completed.length ? "Em prática · continue em mais um treino" : "Ainda não iniciado"}</p><div className="progress-track"><span style={{ width: `${Math.min(progress.completed.length * 25, 90)}%` }} /></div></section><section className="card learning-card"><div className="eyebrow">Reading</div><h3>Greeting Comprehension</h3><p>{progress.completed.length > 1 ? "Em prática · ficando mais confiante" : "Comece pela missão Greetings"}</p><div className="progress-track"><span style={{ width: `${Math.min(progress.completed.length * 21, 85)}%` }} /></div></section></div></>;
}

function Achievements({ unlocked, onReset }: { unlocked: string[]; onReset: () => void }) {
  return <><div className="eyebrow">Momentos especiais</div><h1 style={{ fontSize: "2.5rem", margin: "8px 0" }}>Conquistas</h1><p style={{ color: "var(--muted)" }}>{unlocked.length} de {achievements.length} desbloqueadas</p><div className="achievement-grid" style={{ marginTop: 24 }}>{achievements.map(([code, name, translation, desc]) => <article key={code} className={`card achievement ${unlocked.includes(code) ? "" : "locked"}`}><Image src={`${achievementPath}${code.toLowerCase().replaceAll("_", "-")}.svg`} alt={`Medalha ${translation}`} width={256} height={256} /><div><h3>{name}</h3><p><strong>{translation}</strong><br />{unlocked.includes(code) ? desc : "Continue treinando para descobrir."}</p></div></article>)}</div><button onClick={onReset} className="btn btn-ghost btn-small" style={{ marginTop: 30 }}>Reiniciar minha jornada</button></>;
}

function eggAsset(answered: number) { if (answered === 0) return "egg-idle.png"; if (answered <= 2) return "egg-crack-1.png"; if (answered <= 4) return "egg-crack-2.png"; return "egg-crack-3.png"; }

function Quiz({ type, difficulty, remoteSession, onExit, onComplete }: { type: "first" | "theme"; difficulty: Difficulty; remoteSession?: GreetingsSession | null; onExit: () => void; onComplete: (correct: number, answers?: { questionId: string; selectedOptionId: string }[]) => void | Promise<void> }) {
  const questions = type === "first" ? firstHatchQuestions : remoteSession ? remoteSession.questions.map(question => ({ id: question.id, prompt: question.prompt, options: question.options.map(option => option.text), correct: question.options.findIndex(option => option.id === question.correctOptionId), explanation: question.explanation, difficulty: question.difficulty, skill: question.skill })) : greetingQuestions[difficulty];
  const [index, setIndex] = useState(0), [selected, setSelected] = useState<number | null>(null), [answered, setAnswered] = useState(false), [correct, setCorrect] = useState(0), [answers, setAnswers] = useState<{ questionId: string; selectedOptionId: string }[]>([]), [finishing, setFinishing] = useState(false), [finishError, setFinishError] = useState("");
  const q = questions[index]; const isCorrect = selected === q.correct;
  function check() { if (selected === null) return; setAnswered(true); if (selected === q.correct) setCorrect(c => c + 1); if (remoteSession) setAnswers(current => [...current, { questionId: q.id, selectedOptionId: remoteSession.questions[index].options[selected].id }]); }
  async function next() { if (index === questions.length - 1) { setFinishing(true); setFinishError(""); try { await onComplete(correct, remoteSession ? answers : undefined); } catch { setFinishError("Não foi possível salvar o treino. Tente concluir novamente."); } finally { setFinishing(false); } } else { setIndex(i => i + 1); setSelected(null); setAnswered(false); } }
  return <main className="player-bg" style={{ minHeight: "100vh" }}><div className="quiz"><div className="quiz-head"><button className="btn btn-ghost btn-small" onClick={onExit} aria-label="Sair do treino"><X size={18} /></button><div className="progress-track"><span style={{ width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%` }} /></div><span className="pill">{index + 1} de {questions.length}</span></div><section className="card quiz-card">
    <span className="pill" style={{ display: "flex", width: "fit-content", margin: "0 auto" }}>{type === "first" ? "Nascimento" : `Greetings · ${difficulty}`}</span>
    <Image className="quiz-bloo" src={`${blooPath}${type === "first" ? eggAsset(index + (answered ? 1 : 0)) : answered ? (isCorrect ? "hatchling-happy.png" : "hatchling-thinking.png") : "hatchling-idle.png"}`} alt={type === "first" ? "Ovo do Bloo progredindo" : "Bloo acompanhando o treino"} width={1024} height={1024} />
    <div className="eyebrow" style={{ textAlign: "center" }}>{q.skill} · {q.difficulty}</div><h1>{q.prompt}</h1><div className="options">{q.options.map((option, i) => { let state = selected === i ? "selected" : ""; if (answered && i === q.correct) state = "correct"; if (answered && selected === i && i !== q.correct) state = "wrong"; return <button disabled={answered} key={option} className={`option ${state}`} onClick={() => setSelected(i)}><span className="option-key">{String.fromCharCode(65 + i)}</span>{option}{answered && i === q.correct && <CheckCircle2 style={{ marginLeft: "auto" }} size={20} />}</button>; })}</div>
    {answered && <div className={`feedback ${isCorrect ? "good" : "try"}`} role="status">{isCorrect ? <CheckCircle2 /> : <Sparkles />}<div><strong>{isCorrect ? "Boa! Você acertou." : "Quase! Vamos olhar a dica."}</strong><br />{q.explanation}</div></div>}
    {finishError && <p role="alert" style={{ color: "var(--red)", textAlign: "center" }}>{finishError}</p>}
    <div className="quiz-action">{!answered ? <button className="btn btn-blue" disabled={selected === null} style={{ opacity: selected === null ? .45 : 1 }} onClick={check}>Conferir resposta</button> : <button className="btn btn-primary" disabled={finishing} onClick={next}>{finishing ? "Salvando..." : index === questions.length - 1 ? "Concluir treino" : "Continuar"} {!finishing && <ArrowRight size={19} />}</button>}</div>
  </section></div></main>;
}

function Hatch({ xp, onContinue }: { xp: number; onContinue: () => void }) {
  return <main className="celebrate player-bg"><div className="celebrate-content"><div className="eyebrow">Uma nova jornada começou</div><Image src={`${blooPath}hatchling-celebrate.png`} alt="Bloo filhote celebrando seu nascimento" width={1024} height={1024} priority /><h1>Seu Bloo nasceu!</h1><p>Vocês conquistaram <strong>{xp} XP</strong>, New Hatchling e First Lesson.</p><button className="btn btn-primary" onClick={onContinue}>Conhecer meu Bloo <ArrowRight size={19} /></button></div></main>;
}

function NameBloo({ onSave }: { onSave: (name: string) => void }) {
  const [name, setName] = useState(""); const valid = !name || (/^(?!\d+$)[\p{L}\d][\p{L}\d '\-]{1,19}$/u.test(name.trim()));
  return <main className="celebrate player-bg"><div className="celebrate-content card" style={{ padding: "22px 38px 38px" }}><Image src={`${blooPath}hatchling-idle.png`} alt="Seu novo Bloo filhote" width={1024} height={1024} /><h1 style={{ fontSize: "2.5rem" }}>Como vamos chamá-lo?</h1><p>Você pode escolher agora ou continuar usando Bloo.</p><div className="field" style={{ textAlign: "left", margin: "22px auto", maxWidth: 370 }}><label htmlFor="bloo-name">Nome do seu Bloo</label><input autoFocus id="bloo-name" maxLength={20} className="input" placeholder="Bloo" value={name} onChange={e => setName(e.target.value)} />{!valid && <small style={{ color: "var(--red)" }}>Use de 2 a 20 caracteres, e não apenas números.</small>}</div><button disabled={!valid} className="btn btn-primary" onClick={() => onSave(name.trim())}>{name ? `Continuar com ${name}` : "Continuar com Bloo"} <ArrowRight size={19} /></button></div></main>;
}
