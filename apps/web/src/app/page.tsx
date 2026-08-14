"use client";

import Image from "next/image";
import {
  ArrowLeft, ArrowRight, Award, BarChart3, Bird, BookOpen, Check, CheckCircle2,
  ChevronRight, CircleHelp, Clock3, Database, Egg, GraduationCap, Home, Layers3,
  LockKeyhole, LogOut, Menu, Plus, Search, Settings2, Sparkles, Star, Trophy,
  UserRound, UsersRound, X, Zap,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { achievements, classes, Difficulty, firstHatchQuestions, greetingQuestions, Question, students } from "@/lib/demo-data";

const blooPath = "/assets/bloo/";
const achievementPath = "/assets/achievements/";

type Screen = "landing" | "login" | "tutorial" | "student" | "quiz" | "hatch" | "name" | "admin";
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

  useEffect(() => {
    const saved = window.localStorage.getItem("birdleague-demo");
    if (saved) setProgress(JSON.parse(saved));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem("birdleague-demo", JSON.stringify(progress));
  }, [progress, ready]);

  const startFirst = () => { setQuizType("first"); setScreen("quiz"); };
  const startTheme = (level: Difficulty) => { setDifficulty(level); setQuizType("theme"); setScreen("quiz"); };
  const reset = () => { setProgress(initialProgress); window.localStorage.removeItem("birdleague-demo"); setScreen("landing"); };

  if (!ready) return <div className="player-bg" />;
  if (screen === "landing") return <Landing onEnter={() => setScreen("login")} />;
  if (screen === "login") return <Login onBack={() => setScreen("landing")} onStudent={() => setScreen(progress.hatched ? "student" : "tutorial")} onAdmin={() => setScreen("admin")} />;
  if (screen === "tutorial") return <Tutorial onDone={() => setScreen("student")} />;
  if (screen === "quiz") return <Quiz type={quizType} difficulty={difficulty} onExit={() => setScreen("student")} onComplete={(correct) => {
    if (quizType === "first") {
      setProgress(p => ({ ...p, firstCorrect: correct, xp: 60 + correct * 5, unlocked: ["NEW_HATCHLING", "FIRST_LESSON"] }));
      setScreen("hatch");
    } else {
      setProgress(p => {
        const firstCompletion = !p.completed.includes(difficulty);
        const completed = firstCompletion ? [...p.completed, difficulty] : p.completed;
        const extra = firstCompletion ? 25 + correct * 5 : 0;
        const nextUnlocked = new Set(p.unlocked);
        nextUnlocked.add("FIRST_THEME");
        if (difficulty === "Easy") nextUnlocked.add("THEME_EXPLORER");
        if (difficulty === "Hard") nextUnlocked.add("GREETINGS_CLIMBER");
        if (difficulty === "VeryHard" && correct >= 4) nextUnlocked.add("GREETINGS_MASTER");
        return { ...p, xp: p.xp + extra, completed, unlocked: [...nextUnlocked] };
      });
      setScreen("student");
    }
  }} />;
  if (screen === "hatch") return <Hatch xp={60 + progress.firstCorrect * 5} onContinue={() => setScreen("name")} />;
  if (screen === "name") return <NameBloo onSave={(name) => { setProgress(p => ({ ...p, hatched: true, blooName: name || "Bloo" })); setScreen("student"); }} />;
  if (screen === "admin") return <AdminApp onLogout={() => setScreen("login")} />;
  return <StudentApp progress={progress} onStartFirst={startFirst} onStartTheme={startTheme} onLogout={() => setScreen("login")} onReset={reset} />;
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

function Login({ onBack, onStudent, onAdmin }: { onBack: () => void; onStudent: () => void; onAdmin: () => void }) {
  const [login, setLogin] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState("");
  function submit(e: FormEvent) { e.preventDefault(); if (!login || !password) return setError("Preencha seu login e sua senha."); login.toLowerCase() === "vh" ? onAdmin() : onStudent(); }
  return <main className="login-wrap">
    <section className="login-scene"><Brand /><div className="login-copy"><div className="eyebrow" style={{ color: "#9edbfa" }}>Seu companheiro espera por você</div><h1>Vamos ensinar algo novo hoje?</h1><p>Cada treino fortalece suas habilidades e ajuda seu Bloo a descobrir um mundo maior.</p></div><Image src={`${blooPath}hatchling-happy.png`} alt="Bloo filhote feliz" width={1024} height={1024} /></section>
    <section className="login-panel"><form className="login-form" onSubmit={submit}><button type="button" onClick={onBack} className="btn btn-ghost btn-small" style={{ marginBottom: 32 }}><ArrowLeft size={17} /> Voltar</button><h2>Boas-vindas!</h2><p>Entre com os dados que você recebeu da escola.</p>
      <div className="field"><label htmlFor="login">Seu login</label><input className="input" id="login" autoComplete="username" value={login} onChange={e => setLogin(e.target.value)} placeholder="ex.: lia.martins" /></div>
      <div className="field"><label htmlFor="password">Sua senha</label><input className="input" id="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Digite sua senha" /></div>
      {error && <p role="alert" style={{ color: "var(--red)", fontSize: ".86rem" }}>{error}</p>}<button className="btn btn-blue" type="submit">Entrar <ArrowRight size={19} /></button>
      <div className="demo-box"><strong>Modo demonstração</strong><br />Aluno: use qualquer login e senha.<br />Admin: use <strong>vh</strong> e qualquer senha.</div>
    </form></section>
  </main>;
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
  return <><div className="eyebrow">Momentos especiais</div><h1 style={{ fontSize: "2.5rem", margin: "8px 0" }}>Conquistas</h1><p style={{ color: "var(--muted)" }}>{unlocked.length} de {achievements.length} desbloqueadas</p><div className="achievement-grid" style={{ marginTop: 24 }}>{achievements.map(([code, name, translation, desc]) => <article key={code} className={`card achievement ${unlocked.includes(code) ? "" : "locked"}`}><Image src={`${achievementPath}${code.toLowerCase().replaceAll("_", "-")}.svg`} alt={`Medalha ${translation}`} width={256} height={256} /><div><h3>{name}</h3><p><strong>{translation}</strong><br />{unlocked.includes(code) ? desc : "Continue treinando para descobrir."}</p></div></article>)}</div><button onClick={onReset} className="btn btn-ghost btn-small" style={{ marginTop: 30 }}>Reiniciar demonstração</button></>;
}

function eggAsset(answered: number) { if (answered === 0) return "egg-idle.png"; if (answered <= 2) return "egg-crack-1.png"; if (answered <= 4) return "egg-crack-2.png"; return "egg-crack-3.png"; }

function Quiz({ type, difficulty, onExit, onComplete }: { type: "first" | "theme"; difficulty: Difficulty; onExit: () => void; onComplete: (correct: number) => void }) {
  const questions = type === "first" ? firstHatchQuestions : greetingQuestions[difficulty];
  const [index, setIndex] = useState(0), [selected, setSelected] = useState<number | null>(null), [answered, setAnswered] = useState(false), [correct, setCorrect] = useState(0);
  const q = questions[index]; const isCorrect = selected === q.correct;
  function check() { if (selected === null) return; setAnswered(true); if (selected === q.correct) setCorrect(c => c + 1); }
  function next() { if (index === questions.length - 1) onComplete(correct + (answered && isCorrect ? 0 : 0)); else { setIndex(i => i + 1); setSelected(null); setAnswered(false); } }
  return <main className="player-bg" style={{ minHeight: "100vh" }}><div className="quiz"><div className="quiz-head"><button className="btn btn-ghost btn-small" onClick={onExit} aria-label="Sair do treino"><X size={18} /></button><div className="progress-track"><span style={{ width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%` }} /></div><span className="pill">{index + 1} de {questions.length}</span></div><section className="card quiz-card">
    <span className="pill" style={{ display: "flex", width: "fit-content", margin: "0 auto" }}>{type === "first" ? "Nascimento" : `Greetings · ${difficulty}`}</span>
    <Image className="quiz-bloo" src={`${blooPath}${type === "first" ? eggAsset(index + (answered ? 1 : 0)) : answered ? (isCorrect ? "hatchling-happy.png" : "hatchling-thinking.png") : "hatchling-idle.png"}`} alt={type === "first" ? "Ovo do Bloo progredindo" : "Bloo acompanhando o treino"} width={1024} height={1024} />
    <div className="eyebrow" style={{ textAlign: "center" }}>{q.skill} · {q.difficulty}</div><h1>{q.prompt}</h1><div className="options">{q.options.map((option, i) => { let state = selected === i ? "selected" : ""; if (answered && i === q.correct) state = "correct"; if (answered && selected === i && i !== q.correct) state = "wrong"; return <button disabled={answered} key={option} className={`option ${state}`} onClick={() => setSelected(i)}><span className="option-key">{String.fromCharCode(65 + i)}</span>{option}{answered && i === q.correct && <CheckCircle2 style={{ marginLeft: "auto" }} size={20} />}</button>; })}</div>
    {answered && <div className={`feedback ${isCorrect ? "good" : "try"}`} role="status">{isCorrect ? <CheckCircle2 /> : <Sparkles />}<div><strong>{isCorrect ? "Boa! Você acertou." : "Quase! Vamos olhar a dica."}</strong><br />{q.explanation}</div></div>}
    <div className="quiz-action">{!answered ? <button className="btn btn-blue" disabled={selected === null} style={{ opacity: selected === null ? .45 : 1 }} onClick={check}>Conferir resposta</button> : <button className="btn btn-primary" onClick={next}>{index === questions.length - 1 ? "Concluir treino" : "Continuar"} <ArrowRight size={19} /></button>}</div>
  </section></div></main>;
}

function Hatch({ xp, onContinue }: { xp: number; onContinue: () => void }) {
  return <main className="celebrate player-bg"><div className="celebrate-content"><div className="eyebrow">Uma nova jornada começou</div><Image src={`${blooPath}hatchling-celebrate.png`} alt="Bloo filhote celebrando seu nascimento" width={1024} height={1024} priority /><h1>Seu Bloo nasceu!</h1><p>Vocês conquistaram <strong>{xp} XP</strong>, New Hatchling e First Lesson.</p><button className="btn btn-primary" onClick={onContinue}>Conhecer meu Bloo <ArrowRight size={19} /></button></div></main>;
}

function NameBloo({ onSave }: { onSave: (name: string) => void }) {
  const [name, setName] = useState(""); const valid = !name || (/^(?!\d+$)[\p{L}\d][\p{L}\d '\-]{1,19}$/u.test(name.trim()));
  return <main className="celebrate player-bg"><div className="celebrate-content card" style={{ padding: "22px 38px 38px" }}><Image src={`${blooPath}hatchling-idle.png`} alt="Seu novo Bloo filhote" width={1024} height={1024} /><h1 style={{ fontSize: "2.5rem" }}>Como vamos chamá-lo?</h1><p>Você pode escolher agora ou continuar usando Bloo.</p><div className="field" style={{ textAlign: "left", margin: "22px auto", maxWidth: 370 }}><label htmlFor="bloo-name">Nome do seu Bloo</label><input autoFocus id="bloo-name" maxLength={20} className="input" placeholder="Bloo" value={name} onChange={e => setName(e.target.value)} />{!valid && <small style={{ color: "var(--red)" }}>Use de 2 a 20 caracteres, e não apenas números.</small>}</div><button disabled={!valid} className="btn btn-primary" onClick={() => onSave(name.trim())}>{name ? `Continuar com ${name}` : "Continuar com Bloo"} <ArrowRight size={19} /></button></div></main>;
}

function AdminApp({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<AdminTab>("overview");
  const menu: [AdminTab, typeof Home, string][] = [["overview", Home, "Início"], ["classes", Layers3, "Turmas"], ["students", UsersRound, "Alunos"], ["themes", BookOpen, "Temas"], ["questions", Database, "Banco de questões"]];
  return <main className="admin"><aside className="sidebar"><Brand /> <nav className="side-nav">{menu.map(([id, Icon, label]) => <button key={id} className={`side-link ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}><Icon size={19} /><span>{label}</span></button>)}</nav><button className="side-link" style={{ position: "absolute", bottom: 25, left: 18, right: 18 }} onClick={onLogout}><LogOut size={19} /><span>Sair</span></button></aside><section className="admin-content"><header className="admin-head"><div><strong>Bluebird Idiomas</strong><small>Portal administrativo</small></div><span className="pill"><UserRound size={16} /> Vitor · Admin</span></header><div className="admin-main">{tab === "overview" ? <AdminOverview setTab={setTab} /> : <AdminList tab={tab} />}</div></section></main>;
}

function AdminOverview({ setTab }: { setTab: (tab: AdminTab) => void }) {
  return <><div className="admin-title"><div><h1>Bom dia, Vitor.</h1><p>Acompanhe o que está acontecendo na escola.</p></div><button className="btn btn-blue btn-small" onClick={() => setTab("students")}><Plus size={17} /> Novo aluno</button></div><div className="admin-stats">{[[UsersRound,"Alunos ativos","46","+8 neste período"],[Layers3,"Turmas","3","Todas ativas"],[Bird,"Bloos nascidos","31","67% dos alunos"],[BookOpen,"Temas publicados","1","Greetings · v1"]].map(([Icon,label,value,trend]) => { const C=Icon as typeof UsersRound; return <div className="admin-stat" key={label as string}><div className="admin-stat-top"><span>{label as string}</span><C size={18} /></div><strong>{value as string}</strong><span className="trend">{trend as string}</span></div>})}</div><div className="admin-two"><section className="admin-card"><div className="admin-card-head"><h2>Status dos alunos</h2><button className="btn btn-ghost btn-small" onClick={() => setTab("students")}>Ver todos</button></div><div className="table-wrap"><table><thead><tr><th>Aluno</th><th>Turma</th><th>Etapa atual</th></tr></thead><tbody>{students.slice(0,4).map(s=><tr key={s.login}><td><strong>{s.name}</strong><br/><span style={{color:"var(--muted)"}}>{s.login}</span></td><td>{s.className}</td><td><Status value={s.status}/></td></tr>)}</tbody></table></div></section><section className="admin-card"><div className="admin-card-head"><h2>Atividade recente</h2></div><div className="activity">{[[Bird,"Theo fez seu Bloo nascer","há 12 min"],[Award,"Lia concluiu Greetings · Easy","há 38 min"],[UsersRound,"Nina acessou pela primeira vez","há 1 h"],[BookOpen,"Greetings v1 foi liberado","ontem"]].map(([Icon,text,time])=>{const C=Icon as typeof Bird;return <div className="activity-item" key={text as string}><span className="activity-icon"><C size={17}/></span><div><p>{text as string}</p><time>{time as string}</time></div></div>})}</div></section></div></>;
}

function Status({ value }: { value: string }) { const cls = value === "Não acessou" ? "gray" : value === "Treino iniciado" ? "orange" : value.includes("Greetings") ? "blue" : ""; return <span className={`status ${cls}`}>{value}</span>; }

function AdminList({ tab }: { tab: Exclude<AdminTab, "overview"> }) {
  const config = {
    classes: ["Turmas", "Organize alunos, idiomas e temas liberados.", "Nova turma"],
    students: ["Alunos", "Gerencie acessos, matrículas e progresso operacional.", "Novo aluno"],
    themes: ["Temas", "Crie missões, publique revisões e libere para turmas.", "Novo tema"],
    questions: ["Banco de questões", "Edite, publique e reutilize questões pedagógicas.", "Nova questão"],
  }[tab];
  return <><div className="admin-title"><div><h1>{config[0]}</h1><p>{config[1]}</p></div><button className="btn btn-blue btn-small"><Plus size={17}/>{config[2]}</button></div><div className="searchbar"><div style={{position:"relative",width:"100%"}}><Search size={17} style={{position:"absolute",left:14,top:14,color:"var(--muted)"}}/><input className="input" style={{paddingLeft:42}} placeholder={`Buscar em ${config[0].toLowerCase()}...`}/></div><button className="btn btn-ghost btn-small"><Settings2 size={17}/> Filtros</button></div><section className="admin-card"><div className="table-wrap">{tab === "classes" && <table><thead><tr><th>Turma</th><th>Nível</th><th>Período</th><th>Alunos</th><th>Estado</th></tr></thead><tbody>{classes.map(c=><tr key={c.name}><td><strong>{c.name}</strong></td><td>{c.level}</td><td>{c.period}</td><td>{c.active} ativos de {c.students}</td><td><span className="status">Ativa</span></td></tr>)}</tbody></table>}{tab === "students" && <table><thead><tr><th>Aluno</th><th>Login</th><th>Turma</th><th>Progresso</th></tr></thead><tbody>{students.map(s=><tr key={s.login}><td><strong>{s.name}</strong></td><td>{s.login}</td><td>{s.className}</td><td><Status value={s.status}/></td></tr>)}</tbody></table>}{tab === "themes" && <table><thead><tr><th>Tema</th><th>Revisão</th><th>Idioma</th><th>Questões</th><th>Estado</th></tr></thead><tbody><tr><td><strong>Greetings</strong><br/><span style={{color:"var(--muted)"}}>Cumprimentos e apresentações</span></td><td>v1</td><td>English</td><td>40 · 4 dificuldades</td><td><span className="status">Publicado</span></td></tr></tbody></table>}{tab === "questions" && <table><thead><tr><th>Código</th><th>Enunciado</th><th>Habilidade</th><th>Dificuldade</th><th>Estado</th></tr></thead><tbody>{[...firstHatchQuestions,...greetingQuestions.Easy].map(q=><tr key={q.id}><td>{q.id.toUpperCase()}</td><td><strong>{q.prompt}</strong></td><td>{q.skill}</td><td>{q.difficulty}</td><td><span className="status">Publicado</span></td></tr>)}</tbody></table>}</div></section></>;
}
