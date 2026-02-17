import { useState, useEffect, useMemo } from "react";

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
const SUBJECTS = [
  "Computer Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "BBA",
  "Law",
];

const INITIAL_USERS = [
  { id: "u1", name: "Aryan Sharma", role: "student", email: "aryan@uni.edu", avatar: "AS", points: 87, verifiedAnswers: 5 },
  { id: "u2", name: "Priya Nair", role: "student", email: "priya@uni.edu", avatar: "PN", points: 74, verifiedAnswers: 4 },
  { id: "u3", name: "Rahul Gupta", role: "student", email: "rahul@uni.edu", avatar: "RG", points: 62, verifiedAnswers: 3 },
  { id: "u4", name: "Sneha Patel", role: "student", email: "sneha@uni.edu", avatar: "SP", points: 55, verifiedAnswers: 3 },
  { id: "u5", name: "Mihir Desai", role: "student", email: "mihir@uni.edu", avatar: "MD", points: 48, verifiedAnswers: 2 },
  { id: "u6", name: "Kavya Reddy", role: "student", email: "kavya@uni.edu", avatar: "KR", points: 39, verifiedAnswers: 2 },
  { id: "u7", name: "Rohan Mehta", role: "student", email: "rohan@uni.edu", avatar: "RM", points: 31, verifiedAnswers: 1 },
  { id: "u8", name: "Ananya Singh", role: "student", email: "ananya@uni.edu", avatar: "AS2", points: 22, verifiedAnswers: 1 },
  { id: "f1", name: "Dr. Vikram Iyer", role: "faculty", email: "vikram@uni.edu", avatar: "VI", subject: "Computer Engineering", points: 0 },
  { id: "f2", name: "Prof. Sunita Rao", role: "faculty", email: "sunita@uni.edu", avatar: "SR", subject: "Mechanical Engineering", points: 0 },
  { id: "f3", name: "Dr. Alok Bansal", role: "faculty", email: "alok@uni.edu", avatar: "AB", subject: "Electrical Engineering", points: 0 },
];

const now = Date.now();
const day = 86400000;

const INITIAL_DOUBTS = [
  { id: "d1", title: "What is the difference between TCP and UDP?", description: "I am confused about when to use TCP vs UDP in network programming. Can someone explain with examples?", subject: "Computer Engineering", tags: ["networking", "protocols"], authorId: "u1", createdAt: now - 1 * day, answerCount: 3, upvotes: 7 },
  { id: "d2", title: "How does garbage collection work in Java?", description: "Can someone explain how the JVM handles memory and garbage collection? When does GC get triggered?", subject: "Computer Engineering", tags: ["java", "memory"], authorId: "u3", createdAt: now - 2 * day, answerCount: 2, upvotes: 5 },
  { id: "d3", title: "Explain Bernoulli's principle with real-life applications", description: "I understand the formula but can't connect it to real-world scenarios. Please help!", subject: "Mechanical Engineering", tags: ["fluid mechanics", "bernoulli"], authorId: "u2", createdAt: now - 3 * day, answerCount: 1, upvotes: 4 },
  { id: "d4", title: "What is the difference between stress and strain?", description: "Both seem similar to me. How are they different and how are they measured?", subject: "Mechanical Engineering", tags: ["mechanics", "materials"], authorId: "u5", createdAt: now - 1 * day, answerCount: 0, upvotes: 2 },
  { id: "d5", title: "How do transformers step up voltage?", description: "I understand that transformers change voltage, but the underlying physics is unclear. Please explain.", subject: "Electrical Engineering", tags: ["transformers", "EMF"], authorId: "u4", createdAt: now - 4 * day, answerCount: 2, upvotes: 6 },
  { id: "d6", title: "What is the purpose of a capacitor in AC circuits?", description: "In DC it stores charge. What role does it play in AC circuits specifically?", subject: "Electrical Engineering", tags: ["capacitor", "AC"], authorId: "u6", createdAt: now - 2 * day, answerCount: 1, upvotes: 3 },
  { id: "d7", title: "What are the different types of foundations?", description: "Can someone explain shallow vs deep foundations and when each is used in construction?", subject: "Civil Engineering", tags: ["foundations", "construction"], authorId: "u7", createdAt: now - 5 * day, answerCount: 1, upvotes: 4 },
  { id: "d8", title: "Explain Porter's Five Forces model", description: "I need to apply this model to a case study. Can someone break down each force clearly?", subject: "BBA", tags: ["strategy", "porter"], authorId: "u8", createdAt: now - 3 * day, answerCount: 2, upvotes: 5 },
  { id: "d9", title: "What is the doctrine of promissory estoppel?", description: "How is it different from a regular contract? Is it enforceable in all jurisdictions?", subject: "Law", tags: ["contract law", "estoppel"], authorId: "u1", createdAt: now - 6 * day, answerCount: 1, upvotes: 3 },
  { id: "d10", title: "Difference between null pointer and dangling pointer?", description: "I keep mixing these up. Can someone give a clear explanation with code examples?", subject: "Computer Engineering", tags: ["c++", "pointers"], authorId: "u2", createdAt: now - 1 * day, answerCount: 0, upvotes: 1 },
];

const INITIAL_ANSWERS = [
  // d1 - TCP vs UDP
  { id: "a1", doubtId: "d1", authorId: "u2", content: "TCP (Transmission Control Protocol) is connection-oriented — it ensures all packets arrive in order and retransmits lost ones. UDP (User Datagram Protocol) is connectionless — it sends data without guaranteeing delivery. Use TCP for emails, file transfers. Use UDP for live video streaming, gaming where speed matters more than accuracy.", createdAt: now - 1 * day + 3600000, upvotes: 4, verified: true, rejected: false, correctionComment: "" },
  { id: "a2", doubtId: "d1", authorId: "f1", content: "Great question! TCP uses a 3-way handshake (SYN, SYN-ACK, ACK) to establish a reliable connection. It includes flow control and congestion control mechanisms. UDP has minimal overhead making it ~10x faster for low-latency needs. Key insight: TCP guarantees order; UDP sacrifices reliability for speed. Both operate at the Transport Layer (Layer 4) of OSI model.", createdAt: now - 1 * day + 7200000, upvotes: 8, verified: false, rejected: false, isFaculty: true, correctionComment: "" },
  { id: "a3", doubtId: "d1", authorId: "u5", content: "TCP is like sending a registered letter — you get confirmation. UDP is like shouting across a room — faster but no guarantee they heard you.", createdAt: now - 1 * day + 10800000, upvotes: 2, verified: false, rejected: true, correctionComment: "This analogy is oversimplified. TCP and UDP have specific technical properties — please elaborate on the actual mechanisms like handshakes and packet ordering." },
  // d2 - Java GC
  { id: "a4", doubtId: "d2", authorId: "u3", content: "Java GC automatically reclaims heap memory occupied by objects no longer referenced. The JVM uses generational collection: Young Gen (Eden + Survivor spaces) for short-lived objects, and Old Gen for long-lived ones. GC triggers when heap is nearly full or can be called explicitly via System.gc() (not recommended).", createdAt: now - 2 * day + 3600000, upvotes: 5, verified: true, rejected: false, correctionComment: "" },
  { id: "a5", doubtId: "d2", authorId: "u7", content: "GC in Java removes unused objects automatically so you don't get memory leaks.", createdAt: now - 2 * day + 7200000, upvotes: 1, verified: false, rejected: true, correctionComment: "Partially correct but incomplete. Please mention the generational model, stop-the-world pauses, and different GC algorithms like G1GC or ZGC." },
  // d3 - Bernoulli
  { id: "a6", doubtId: "d3", authorId: "f2", content: "Bernoulli's principle states that as fluid speed increases, pressure decreases. Real-world applications: (1) Aircraft lift — faster airflow over curved wings creates lower pressure on top, lifting the plane. (2) Venturi meter — used to measure flow rate in pipes. (3) Carburetors — use pressure drop to pull fuel into airstream. (4) Baseball curveball — spin creates pressure differential.", createdAt: now - 3 * day + 3600000, upvotes: 7, verified: false, rejected: false, isFaculty: true, correctionComment: "" },
  // d5 - Transformers
  { id: "a7", doubtId: "d5", authorId: "u4", content: "A transformer has two coils: primary and secondary. When AC flows through the primary, it creates a changing magnetic flux in the iron core. This flux induces an EMF in the secondary coil. The voltage ratio equals the turns ratio: V1/V2 = N1/N2. Step-up means N2 > N1.", createdAt: now - 4 * day + 3600000, upvotes: 6, verified: true, rejected: false, correctionComment: "" },
  { id: "a8", doubtId: "d5", authorId: "u6", content: "Transformers use Faraday's law of electromagnetic induction to transfer energy between circuits.", createdAt: now - 4 * day + 7200000, upvotes: 2, verified: false, rejected: false, correctionComment: "" },
  // d6 - Capacitor AC
  { id: "a9", doubtId: "d6", authorId: "f3", content: "In AC circuits, a capacitor acts as a frequency-dependent impedance: Xc = 1/(2πfC). At high frequencies, it acts like a short circuit (low impedance); at low frequencies, it acts like an open circuit. This makes capacitors ideal for: filtering (blocking DC, passing AC), coupling between stages, power factor correction, and timing circuits.", createdAt: now - 2 * day + 3600000, upvotes: 5, verified: false, rejected: false, isFaculty: true, correctionComment: "" },
  // d7 - Foundations
  { id: "a10", doubtId: "d7", authorId: "u1", content: "Shallow foundations (like strip, raft, pad footings) are used when strong soil is near the surface (within 3m). Deep foundations (piles, caissons) transfer load to deeper, stronger strata. Key decision factors: soil bearing capacity, load magnitude, water table depth, and cost. Pile foundations are essential for skyscrapers or weak surface soils.", createdAt: now - 5 * day + 3600000, upvotes: 4, verified: true, rejected: false, correctionComment: "" },
  // d8 - Porter's Five Forces
  { id: "a11", doubtId: "d8", authorId: "u2", content: "Porter's Five Forces: (1) Competitive Rivalry — intensity among existing competitors. (2) Threat of New Entrants — how easy it is for new companies to enter. (3) Bargaining Power of Suppliers — fewer suppliers = more power. (4) Bargaining Power of Buyers — more choices = stronger buyers. (5) Threat of Substitutes — alternative products that can replace yours.", createdAt: now - 3 * day + 3600000, upvotes: 5, verified: true, rejected: false, correctionComment: "" },
  { id: "a12", doubtId: "d8", authorId: "u8", content: "It's a framework that looks at competition from 5 angles to determine industry profitability.", createdAt: now - 3 * day + 7200000, upvotes: 1, verified: false, rejected: false, correctionComment: "" },
  // d9 - Estoppel
  { id: "a13", doubtId: "d9", authorId: "u3", content: "Promissory estoppel prevents a party from going back on a clear promise if the other party relied on it to their detriment, even without formal consideration. Unlike contracts, it doesn't require mutual agreement or offer/acceptance. It's recognized in most common law jurisdictions including India, UK, and USA. Key case: Central London Property Trust v High Trees House Ltd (1947).", createdAt: now - 6 * day + 3600000, upvotes: 4, verified: true, rejected: false, correctionComment: "" },
];

// Simple cosine similarity for doubt detection
function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(Boolean);
}
function cosineSimilarity(a, b) {
  const tokensA = tokenize(a), tokensB = tokenize(b);
  const allTokens = [...new Set([...tokensA, ...tokensB])];
  const vecA = allTokens.map(t => tokensA.filter(x => x === t).length);
  const vecB = allTokens.map(t => tokensB.filter(x => x === t).length);
  const dot = vecA.reduce((s, v, i) => s + v * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(vecB.reduce((s, v) => s + v * v, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("login");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [doubts, setDoubts] = useState(INITIAL_DOUBTS);
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [notification, setNotification] = useState(null);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const login = (role, name, email) => {
    const demoUser = role === "faculty"
      ? { id: "demo-faculty", name: name || "Demo Faculty", role: "faculty", email, avatar: "DF", points: 0 }
      : { id: "demo-student", name: name || "Demo Student", role: "student", email, avatar: "DS", points: 20, verifiedAnswers: 1 };
    localStorage.setItem("unisolve_role", role);
    localStorage.setItem("unisolve_user", JSON.stringify(demoUser));
    setCurrentUser(demoUser);
    setPage("home");
  };

  const logout = () => {
    localStorage.removeItem("unisolve_role");
    localStorage.removeItem("unisolve_user");
    setCurrentUser(null);
    setPage("login");
    setSelectedDoubt(null);
  };

  useEffect(() => {
    const stored = localStorage.getItem("unisolve_user");
    if (stored) { setCurrentUser(JSON.parse(stored)); setPage("home"); }
  }, []);

  const getUserById = (id) => users.find(u => u.id === id) || { name: "Unknown", avatar: "?", role: "student" };
  const getAnswersForDoubt = (doubtId) => answers.filter(a => a.doubtId === doubtId);

  const addDoubt = (doubt) => {
    const newDoubt = { ...doubt, id: `d${Date.now()}`, authorId: currentUser.id, createdAt: Date.now(), answerCount: 0, upvotes: 0 };
    setDoubts(prev => [newDoubt, ...prev]);
    notify("Doubt posted successfully!");
    setPage("doubts");
  };

  const addAnswer = (doubtId, content) => {
    const newAnswer = { id: `a${Date.now()}`, doubtId, authorId: currentUser.id, content, createdAt: Date.now(), upvotes: 0, verified: false, rejected: false, isFaculty: currentUser.role === "faculty", correctionComment: "" };
    setAnswers(prev => [...prev, newAnswer]);
    setDoubts(prev => prev.map(d => d.id === doubtId ? { ...d, answerCount: d.answerCount + 1 } : d));
    if (currentUser.role === "student") {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, points: (u.points || 0) + 5 } : u));
    }
    notify("Answer posted!");
  };

  const verifyAnswer = (answerId) => {
    setAnswers(prev => prev.map(a => a.id === answerId ? { ...a, verified: true, rejected: false, correctionComment: "" } : a));
    const ans = answers.find(a => a.id === answerId);
    if (ans) setUsers(prev => prev.map(u => u.id === ans.authorId ? { ...u, points: (u.points || 0) + 10, verifiedAnswers: (u.verifiedAnswers || 0) + 1 } : u));
    notify("Answer verified!");
  };

  const rejectAnswer = (answerId, comment) => {
    setAnswers(prev => prev.map(a => a.id === answerId ? { ...a, verified: false, rejected: true, correctionComment: comment } : a));
    notify("Answer rejected with feedback.");
  };

  const upvoteAnswer = (answerId) => {
    setAnswers(prev => prev.map(a => a.id === answerId ? { ...a, upvotes: a.upvotes + 1 } : a));
    const ans = answers.find(a => a.id === answerId);
    if (ans) setUsers(prev => prev.map(u => u.id === ans.authorId ? { ...u, points: (u.points || 0) + 1 } : u));
  };

  const weeklyStats = useMemo(() => {
    const weekAgo = Date.now() - 7 * day;
    const weekDoubts = doubts.filter(d => d.createdAt > weekAgo);
    const weekAnswers = answers.filter(a => a.createdAt > weekAgo);
    const subjectCounts = {};
    weekDoubts.forEach(d => { subjectCounts[d.subject] = (subjectCounts[d.subject] || 0) + 1; });
    const mostActive = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Computer Engineering";
    const verifiedCount = answers.filter(a => a.verified).length;
    return { doubts: weekDoubts.length || 17, answers: weekAnswers.length || 38, mostActive, verified: verifiedCount };
  }, [doubts, answers]);

  const leaderboard = useMemo(() => {
    return [...users].filter(u => u.role === "student").sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 10);
  }, [users]);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", minHeight: "100vh", background: "#0a0f1e", color: "#e8eaf0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0a0f1e; } ::-webkit-scrollbar-thumb { background: #2a3a6e; border-radius: 3px; }
        .btn-primary { background: linear-gradient(135deg, #4f7cff, #7c3aed); color: #fff; border: none; padding: 10px 22px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(79,124,255,0.4); }
        .btn-secondary { background: transparent; color: #a0aec0; border: 1px solid #2a3a6e; padding: 9px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.2s; }
        .btn-secondary:hover { border-color: #4f7cff; color: #fff; }
        .btn-verify { background: linear-gradient(135deg, #10b981, #059669); color: #fff; border: none; padding: 7px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
        .btn-verify:hover { transform: translateY(-1px); box-shadow: 0 3px 12px rgba(16,185,129,0.4); }
        .btn-reject { background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; border: none; padding: 7px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
        .btn-reject:hover { transform: translateY(-1px); box-shadow: 0 3px 12px rgba(239,68,68,0.4); }
        .card { background: #111827; border: 1px solid #1e2d4a; border-radius: 14px; padding: 20px; transition: border-color 0.2s; }
        .card:hover { border-color: #2a3a6e; }
        .input-field { background: #0d1426; border: 1px solid #1e2d4a; color: #e8eaf0; padding: 10px 14px; border-radius: 8px; width: 100%; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .input-field:focus { border-color: #4f7cff; }
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; }
        .badge-verified { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }
        .badge-faculty { background: rgba(124,58,237,0.15); color: #a78bfa; border: 1px solid rgba(124,58,237,0.3); }
        .badge-rejected { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
        .badge-subject { background: rgba(79,124,255,0.12); color: #93b4ff; border: 1px solid rgba(79,124,255,0.25); }
        .nav-link { color: #94a3b8; cursor: pointer; font-weight: 500; font-size: 14px; padding: 6px 12px; border-radius: 6px; transition: all 0.2s; text-decoration: none; background: none; border: none; }
        .nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .nav-link.active { color: #7eb3ff; background: rgba(79,124,255,0.12); }
        .avatar { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 700; font-size: 12px; flex-shrink: 0; }
        .stat-card { background: linear-gradient(135deg, #111827, #0d1426); border: 1px solid #1e2d4a; border-radius: 16px; padding: 24px; }
        .verified-answer { border-left: 3px solid #10b981 !important; background: linear-gradient(135deg, #111827, #0b2018) !important; }
        .rejected-answer { border-left: 3px solid #ef4444 !important; }
        textarea.input-field { resize: vertical; min-height: 100px; }
        select.input-field { cursor: pointer; }
        .search-bar { background: #0d1426; border: 1px solid #1e2d4a; color: #e8eaf0; padding: 10px 14px 10px 40px; border-radius: 10px; width: 100%; font-size: 14px; outline: none; }
        .search-bar:focus { border-color: #4f7cff; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        .notification { position: fixed; top: 20px; right: 20px; z-index: 1000; padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; animation: fadeIn 0.3s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
        .notif-success { background: linear-gradient(135deg, #064e3b, #065f46); border: 1px solid #10b981; color: #6ee7b7; }
        .notif-error { background: linear-gradient(135deg, #7f1d1d, #991b1b); border: 1px solid #ef4444; color: #fca5a5; }
      `}</style>

      {notification && (
        <div className={`notification ${notification.type === "error" ? "notif-error" : "notif-success"}`}>
          {notification.type === "success" ? "✓ " : "✕ "}{notification.msg}
        </div>
      )}

      {page === "login" && <LoginPage onLogin={login} />}
      {page !== "login" && (
        <>
          <Navbar currentUser={currentUser} page={page} setPage={setPage} onLogout={logout} />
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
            {page === "home" && <HomePage currentUser={currentUser} weeklyStats={weeklyStats} leaderboard={leaderboard} setPage={setPage} setSelectedDoubt={setSelectedDoubt} doubts={doubts} getUserById={getUserById} />}
            {page === "doubts" && <DoubtsPage doubts={doubts} currentUser={currentUser} setPage={setPage} setSelectedDoubt={setSelectedDoubt} getUserById={getUserById} answers={answers} />}
            {page === "doubt-detail" && selectedDoubt && <DoubtDetailPage doubt={selectedDoubt} currentUser={currentUser} answers={answers} getUserById={getUserById} addAnswer={addAnswer} verifyAnswer={verifyAnswer} rejectAnswer={rejectAnswer} upvoteAnswer={upvoteAnswer} notify={notify} />}
            {page === "post-doubt" && currentUser?.role === "student" && <PostDoubtPage onSubmit={addDoubt} doubts={doubts} currentUser={currentUser} setPage={setPage} />}
            {page === "leaderboard" && <LeaderboardPage leaderboard={leaderboard} />}
          </div>
        </>
      )}
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 30% 50%, rgba(79,124,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(124,58,237,0.08) 0%, transparent 60%), #0a0f1e" }}>
      <div style={{ width: "100%", maxWidth: 440, padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 42, fontFamily: "'Syne', sans-serif", fontWeight: 800, background: "linear-gradient(135deg, #4f7cff, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -1 }}>UniSolve</div>
          <div style={{ color: "#64748b", fontSize: 15, marginTop: 6 }}>University Doubt Solving Platform</div>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "#0d1426", borderRadius: 10, padding: 4 }}>
            {["student", "faculty"].map(r => (
              <button key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: "9px 0", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14, transition: "all 0.2s", background: role === r ? "linear-gradient(135deg, #4f7cff, #7c3aed)" : "transparent", color: role === r ? "#fff" : "#64748b" }}>
                {r === "student" ? "👨‍🎓 Student" : "👨‍🏫 Faculty"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Your Name</label>
              <input className="input-field" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Email</label>
              <input className="input-field" type="email" placeholder="any@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Password</label>
              <input className="input-field" type="password" placeholder="any password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button className="btn-primary" style={{ width: "100%", padding: 13, fontSize: 15, marginTop: 4 }} onClick={() => onLogin(role, name, email)}>
              Sign In as {role === "student" ? "Student" : "Faculty"} →
            </button>
          </div>
          <div style={{ marginTop: 16, padding: 12, background: "rgba(79,124,255,0.08)", borderRadius: 8, fontSize: 12, color: "#64748b", textAlign: "center" }}>
            Prototype mode — any email & password accepted
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ currentUser, page, setPage, onLogout }) {
  return (
    <nav style={{ background: "rgba(10,15,30,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e2d4a", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div onClick={() => setPage("home")} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, background: "linear-gradient(135deg, #4f7cff, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", cursor: "pointer", letterSpacing: -0.5 }}>UniSolve</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button className={`nav-link ${page === "home" ? "active" : ""}`} onClick={() => setPage("home")}>Home</button>
          <button className={`nav-link ${page === "doubts" ? "active" : ""}`} onClick={() => setPage("doubts")}>Doubts</button>
          <button className={`nav-link ${page === "leaderboard" ? "active" : ""}`} onClick={() => setPage("leaderboard")}>Leaderboard</button>
          {currentUser?.role === "student" && <button className={`nav-link`} onClick={() => setPage("post-doubt")} style={{ background: "linear-gradient(135deg, rgba(79,124,255,0.15), rgba(124,58,237,0.15))", color: "#7eb3ff", border: "1px solid rgba(79,124,255,0.3)" }}>+ Post Doubt</button>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="avatar" style={{ width: 32, height: 32, background: currentUser?.role === "faculty" ? "linear-gradient(135deg,#7c3aed,#a78bfa)" : "linear-gradient(135deg,#4f7cff,#7eb3ff)", fontSize: 11, color: "#fff" }}>{currentUser?.avatar?.slice(0, 2)}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{currentUser?.name}</div>
              <div style={{ fontSize: 11, color: currentUser?.role === "faculty" ? "#a78bfa" : "#7eb3ff" }}>{currentUser?.role}</div>
            </div>
          </div>
          <button className="btn-secondary" style={{ padding: "6px 14px", fontSize: 13 }} onClick={onLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ currentUser, weeklyStats, leaderboard, setPage, setSelectedDoubt, doubts, getUserById }) {
  const recentDoubts = [...doubts].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);

  return (
    <div className="fade-in">
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "60px 0 40px", background: "radial-gradient(ellipse at 50% 100%, rgba(79,124,255,0.1) 0%, transparent 70%)" }}>
        <div style={{ fontSize: 48, fontFamily: "'Syne', sans-serif", fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
          <span style={{ background: "linear-gradient(135deg, #4f7cff, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>UniSolve</span>
        </div>
        <div style={{ fontSize: 18, color: "#94a3b8", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.6 }}>
          {currentUser?.role === "faculty" ? `Welcome, ${currentUser.name}. Help students by verifying and answering doubts.` : `Welcome, ${currentUser?.name}! Ask doubts, get verified answers, earn points.`}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn-primary" style={{ padding: "12px 28px", fontSize: 15 }} onClick={() => setPage("doubts")}>Browse Doubts</button>
          {currentUser?.role === "student" && <button className="btn-secondary" style={{ padding: "12px 28px", fontSize: 15 }} onClick={() => setPage("post-doubt")}>Post a Doubt</button>}
        </div>
      </div>

      {/* Weekly Stats */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#64748b", fontWeight: 600, marginBottom: 16 }}>📊 This Week's Activity</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          {[
            { label: "Doubts Posted", value: weeklyStats.doubts, icon: "❓", color: "#4f7cff" },
            { label: "Answers Given", value: weeklyStats.answers, icon: "💬", color: "#a78bfa" },
            { label: "Verified Answers", value: weeklyStats.verified, icon: "✅", color: "#10b981" },
            { label: "Most Active", value: weeklyStats.mostActive.split(" ")[0], icon: "🔥", color: "#f59e0b" },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Subjects + Top Contributors */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#64748b", fontWeight: 600, marginBottom: 16 }}>📚 Subject Categories</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {SUBJECTS.map(s => {
              const count = doubts.filter(d => d.subject === s).length;
              const icons = { "Computer Engineering": "💻", "Mechanical Engineering": "⚙️", "Electrical Engineering": "⚡", "Civil Engineering": "🏗️", "BBA": "📊", "Law": "⚖️" };
              return (
                <div key={s} className="card" style={{ cursor: "pointer", padding: 16 }} onClick={() => { setPage("doubts"); }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{icons[s]}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{s}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{count} doubts</div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#64748b", fontWeight: 600, marginBottom: 16 }}>🏆 Top Contributors</div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {leaderboard.slice(0, 5).map((u, i) => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: i < 4 ? "1px solid #1e2d4a" : "" }}>
                <div style={{ width: 24, fontSize: 16, textAlign: "center" }}>{["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][i]}</div>
                <div className="avatar" style={{ width: 34, height: 34, background: "linear-gradient(135deg,#4f7cff,#7c3aed)", color: "#fff" }}>{u.avatar.slice(0, 2)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{u.verifiedAnswers || 0} verified</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#4f7cff" }}>{u.points}</div>
              </div>
            ))}
          </div>
          <button className="btn-secondary" style={{ width: "100%", marginTop: 10 }} onClick={() => setPage("leaderboard")}>View Full Leaderboard</button>
        </div>
      </div>

      {/* Recent Doubts */}
      <div>
        <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#64748b", fontWeight: 600, marginBottom: 16 }}>🕐 Recent Doubts</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {recentDoubts.map(d => (
            <DoubtCard key={d.id} doubt={d} getUserById={getUserById} onClick={() => { setSelectedDoubt(d); setPage("doubt-detail"); }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DOUBTS PAGE ──────────────────────────────────────────────────────────────
function DoubtsPage({ doubts, currentUser, setPage, setSelectedDoubt, getUserById, answers }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [subject, setSubject] = useState("all");
  const [sort, setSort] = useState("latest");

  const filtered = useMemo(() => {
    let list = [...doubts];
    if (search) list = list.filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase()));
    if (subject !== "all") list = list.filter(d => d.subject === subject);
    if (filter === "answered") list = list.filter(d => d.answerCount > 0);
    if (filter === "unanswered") list = list.filter(d => d.answerCount === 0);
    if (filter === "verified") list = list.filter(d => answers.some(a => a.doubtId === d.id && a.verified));
    if (currentUser?.role === "faculty" && filter === "unverified") list = list.filter(d => answers.some(a => a.doubtId === d.id && !a.verified && !a.isFaculty));
    if (sort === "latest") list.sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "most-answered") list.sort((a, b) => b.answerCount - a.answerCount);
    if (sort === "most-upvoted") list.sort((a, b) => b.upvotes - a.upvotes);
    return list;
  }, [doubts, search, filter, subject, sort, answers, currentUser]);

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>All Doubts</div>
        {currentUser?.role === "student" && <button className="btn-primary" onClick={() => setPage("post-doubt")}>+ Post Doubt</button>}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>🔍</div>
          <input className="search-bar" placeholder="Search doubts..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field" style={{ flex: "0 0 160px" }} value={subject} onChange={e => setSubject(e.target.value)}>
          <option value="all">All Subjects</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input-field" style={{ flex: "0 0 160px" }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="answered">Answered</option>
          <option value="unanswered">Unanswered</option>
          <option value="verified">Has Verified</option>
          {currentUser?.role === "faculty" && <option value="unverified">Needs Review</option>}
        </select>
        <select className="input-field" style={{ flex: "0 0 160px" }} value={sort} onChange={e => setSort(e.target.value)}>
          <option value="latest">Latest</option>
          <option value="most-answered">Most Answered</option>
          <option value="most-upvoted">Most Upvoted</option>
        </select>
      </div>

      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>{filtered.length} doubts found</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(d => (
          <DoubtCard key={d.id} doubt={d} getUserById={getUserById} onClick={() => { setSelectedDoubt(d); setPage("doubt-detail"); }} answers={answers} />
        ))}
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>No doubts found matching your filters.</div>}
      </div>
    </div>
  );
}

function DoubtCard({ doubt, getUserById, onClick, answers }) {
  const author = getUserById(doubt.authorId);
  const hasVerified = answers?.some(a => a.doubtId === doubt.id && a.verified);

  return (
    <div className="card" style={{ cursor: "pointer" }} onClick={onClick}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8, alignItems: "center" }}>
            <span className="badge badge-subject">{doubt.subject}</span>
            {hasVerified && <span className="badge badge-verified">✓ Verified Answer</span>}
            {doubt.answerCount === 0 && <span className="badge" style={{ background: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.25)" }}>Unanswered</span>}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>{doubt.title}</div>
          <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{doubt.description}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, fontSize: 12, color: "#64748b" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: doubt.answerCount > 0 ? "#4f7cff" : "#475569" }}>{doubt.answerCount}</div>
          <div>answers</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px solid #1e2d4a" }}>
        <div className="avatar" style={{ width: 22, height: 22, background: "linear-gradient(135deg,#4f7cff,#7c3aed)", color: "#fff", fontSize: 9 }}>{author.avatar?.slice(0, 2)}</div>
        <span style={{ fontSize: 12, color: "#64748b" }}>{author.name}</span>
        <span style={{ fontSize: 12, color: "#475569", marginLeft: "auto" }}>{timeAgo(doubt.createdAt)}</span>
        {doubt.tags?.map(t => <span key={t} style={{ fontSize: 11, color: "#475569", background: "#0d1426", padding: "2px 7px", borderRadius: 4 }}>#{t}</span>)}
      </div>
    </div>
  );
}

// ─── DOUBT DETAIL PAGE ────────────────────────────────────────────────────────
function DoubtDetailPage({ doubt, currentUser, answers, getUserById, addAnswer, verifyAnswer, rejectAnswer, upvoteAnswer, notify }) {
  const [newAnswer, setNewAnswer] = useState("");
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const doubtAnswers = answers.filter(a => a.doubtId === doubt.id);
  const author = getUserById(doubt.authorId);

  const handleVerify = (answerId) => {
    const ans = answers.find(a => a.id === answerId);
    if (ans?.isFaculty) { notify("Faculty answers don't need verification.", "error"); return; }
    verifyAnswer(answerId);
  };

  return (
    <div className="fade-in">
      {/* Doubt */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          <span className="badge badge-subject">{doubt.subject}</span>
          {doubt.tags?.map(t => <span key={t} style={{ fontSize: 11, color: "#475569", background: "#0d1426", padding: "2px 7px", borderRadius: 4 }}>#{t}</span>)}
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Syne', sans-serif", marginBottom: 12, lineHeight: 1.3 }}>{doubt.title}</div>
        <div style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.7 }}>{doubt.description}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid #1e2d4a", fontSize: 13, color: "#64748b" }}>
          <div className="avatar" style={{ width: 26, height: 26, background: "linear-gradient(135deg,#4f7cff,#7c3aed)", color: "#fff", fontSize: 10 }}>{author.avatar?.slice(0, 2)}</div>
          <span>Asked by <strong style={{ color: "#e8eaf0" }}>{author.name}</strong></span>
          <span style={{ marginLeft: "auto" }}>{timeAgo(doubt.createdAt)}</span>
          <span>⬆ {doubt.upvotes}</span>
        </div>
      </div>

      {/* Answers */}
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{doubtAnswers.length} {doubtAnswers.length === 1 ? "Answer" : "Answers"}</div>

      {doubtAnswers.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "#64748b", background: "#111827", borderRadius: 14, marginBottom: 24 }}>
          No answers yet. Be the first to help!
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
        {doubtAnswers.map(ans => {
          const ansAuthor = getUserById(ans.authorId);
          return (
            <div key={ans.id} className={`card ${ans.verified ? "verified-answer" : ans.rejected ? "rejected-answer" : ""}`}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div className="avatar" style={{ width: 36, height: 36, background: ans.isFaculty ? "linear-gradient(135deg,#7c3aed,#a78bfa)" : "linear-gradient(135deg,#4f7cff,#7eb3ff)", color: "#fff", flexShrink: 0 }}>{ansAuthor.avatar?.slice(0, 2)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                    <span style={{ fontWeight: 600 }}>{ansAuthor.name}</span>
                    {ans.isFaculty && <span className="badge badge-faculty">👨‍🏫 Faculty Answer</span>}
                    {ans.verified && <span className="badge badge-verified">✓ Verified by Faculty</span>}
                    {ans.rejected && <span className="badge badge-rejected">✕ Needs Improvement</span>}
                    <span style={{ fontSize: 12, color: "#64748b", marginLeft: "auto" }}>{timeAgo(ans.createdAt)}</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7 }}>{ans.content}</div>

                  {ans.rejected && ans.correctionComment && (
                    <div style={{ marginTop: 12, padding: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#f87171", marginBottom: 4 }}>📝 Faculty Correction:</div>
                      <div style={{ fontSize: 13, color: "#fca5a5", lineHeight: 1.6 }}>{ans.correctionComment}</div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    {currentUser?.role === "student" && (
                      <button onClick={() => upvoteAnswer(ans.id)} style={{ background: "rgba(79,124,255,0.1)", border: "1px solid rgba(79,124,255,0.2)", color: "#7eb3ff", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
                        ⬆ {ans.upvotes}
                      </button>
                    )}
                    {currentUser?.role === "faculty" && !ans.isFaculty && !ans.verified && (
                      <>
                        <button className="btn-verify" onClick={() => handleVerify(ans.id)}>✓ Verify</button>
                        <button className="btn-reject" onClick={() => { setRejectModal(ans.id); setRejectComment(""); }}>✕ Reject</button>
                      </>
                    )}
                    {currentUser?.role === "faculty" && ans.verified && <span style={{ fontSize: 12, color: "#10b981" }}>✓ You verified this</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="card" style={{ maxWidth: 440, width: "90%", padding: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Add Correction Comment</div>
            <textarea className="input-field" style={{ minHeight: 120, marginBottom: 16 }} placeholder="Explain what's incorrect and guide the student..." value={rejectComment} onChange={e => setRejectComment(e.target.value)} />
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-reject" style={{ flex: 1 }} onClick={() => { if (!rejectComment.trim()) { return; } rejectAnswer(rejectModal, rejectComment); setRejectModal(null); }}>Submit Rejection</button>
              <button className="btn-secondary" onClick={() => setRejectModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Post Answer */}
      <div className="card">
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Post Your Answer</div>
        <textarea className="input-field" style={{ minHeight: 130, marginBottom: 14 }} placeholder="Write a detailed answer..." value={newAnswer} onChange={e => setNewAnswer(e.target.value)} />
        <button className="btn-primary" onClick={() => { if (!newAnswer.trim()) return; addAnswer(doubt.id, newAnswer); setNewAnswer(""); }}>
          Post Answer
        </button>
      </div>
    </div>
  );
}

// ─── POST DOUBT PAGE ──────────────────────────────────────────────────────────
function PostDoubtPage({ onSubmit, doubts, currentUser, setPage }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [subject, setSubject] = useState("");
  const [tags, setTags] = useState("");
  const [similar, setSimilar] = useState([]);
  const [showSimilar, setShowSimilar] = useState(false);

  const checkSimilarity = () => {
    if (!title.trim() || !subject) return;
    const sims = doubts.filter(d => {
      const score = cosineSimilarity(title + " " + desc, d.title + " " + d.description);
      return score > 0.25;
    }).slice(0, 3);
    if (sims.length > 0) { setSimilar(sims); setShowSimilar(true); } else { doSubmit(); }
  };

  const doSubmit = () => {
    onSubmit({ title, description: desc, subject, tags: tags.split(",").map(t => t.trim()).filter(Boolean) });
    setShowSimilar(false);
  };

  return (
    <div className="fade-in" style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Syne', sans-serif", marginBottom: 24 }}>Post a Doubt</div>

      {showSimilar && (
        <div style={{ marginBottom: 24, padding: 20, background: "#111827", borderRadius: 14, border: "1px solid rgba(245,158,11,0.3)" }}>
          <div style={{ color: "#fbbf24", fontWeight: 600, marginBottom: 12 }}>⚠ Similar doubts already exist:</div>
          {similar.map(d => <div key={d.id} style={{ fontSize: 14, color: "#94a3b8", padding: "6px 0", borderBottom: "1px solid #1e2d4a" }}>{d.title}</div>)}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button className="btn-primary" onClick={doSubmit}>Post Anyway</button>
            <button className="btn-secondary" onClick={() => setShowSimilar(false)}>Review & Cancel</button>
          </div>
        </div>
      )}

      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Title *</label>
          <input className="input-field" placeholder="What's your doubt?" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Description *</label>
          <textarea className="input-field" style={{ minHeight: 140 }} placeholder="Describe your doubt in detail..." value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Subject *</label>
          <select className="input-field" value={subject} onChange={e => setSubject(e.target.value)}>
            <option value="">Select subject</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Tags</label>
          <input className="input-field" placeholder="e.g. networking, java, pointers (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-primary" onClick={checkSimilarity} disabled={!title.trim() || !desc.trim() || !subject}>Post Doubt</button>
          <button className="btn-secondary" onClick={() => setPage("doubts")}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────
function LeaderboardPage({ leaderboard }) {
  const medals = ["🥇", "🥈", "🥉"];
  const colors = ["#f59e0b", "#94a3b8", "#cd7c2f"];

  return (
    <div className="fade-in" style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 28, fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 6 }}>🏆 Leaderboard</div>
        <div style={{ color: "#64748b" }}>Top contributors ranked by total points</div>
      </div>

      {/* Top 3 podium */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 16, marginBottom: 32 }}>
        {[leaderboard[1], leaderboard[0], leaderboard[2]].map((u, i) => {
          if (!u) return null;
          const rank = i === 1 ? 0 : i === 0 ? 1 : 2;
          const heights = [180, 220, 160];
          return (
            <div key={u.id} style={{ textAlign: "center", width: 120 }}>
              <div className="avatar" style={{ width: 48, height: 48, background: `linear-gradient(135deg, ${rank === 0 ? "#f59e0b, #d97706" : rank === 1 ? "#94a3b8, #475569" : "#cd7c2f, #92400e"})`, color: "#fff", fontSize: 16, margin: "0 auto 8px" }}>{u.avatar.slice(0, 2)}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{u.name.split(" ")[0]}</div>
              <div style={{ fontSize: 20 }}>{medals[rank]}</div>
              <div style={{ background: `rgba(${rank === 0 ? "245,158,11" : rank === 1 ? "148,163,184" : "205,124,47"},0.15)`, border: `1px solid rgba(${rank === 0 ? "245,158,11" : rank === 1 ? "148,163,184" : "205,124,47"},0.3)`, borderRadius: "10px 10px 0 0", marginTop: 8, height: heights[i], display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 12, fontSize: 18, fontWeight: 800, color: colors[rank] }}>
                {u.points}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full list */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {leaderboard.map((u, i) => (
          <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderBottom: i < leaderboard.length - 1 ? "1px solid #1e2d4a" : "", background: i < 3 ? `rgba(${i === 0 ? "245,158,11" : i === 1 ? "148,163,184" : "205,124,47"},0.04)` : "" }}>
            <div style={{ width: 28, fontSize: 20, textAlign: "center" }}>{i < 3 ? medals[i] : <span style={{ fontSize: 14, color: "#64748b", fontWeight: 700 }}>{i + 1}</span>}</div>
            <div className="avatar" style={{ width: 40, height: 40, background: "linear-gradient(135deg,#4f7cff,#7c3aed)", color: "#fff" }}>{u.avatar.slice(0, 2)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{u.name}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{u.verifiedAnswers || 0} verified answers</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7c2f" : "#4f7cff" }}>{u.points}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>points</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: 16, background: "#111827", borderRadius: 12, border: "1px solid #1e2d4a", fontSize: 13, color: "#64748b" }}>
        <strong style={{ color: "#e8eaf0" }}>Scoring System:</strong> +5 per answer · +10 per verified answer · +1 per upvote received
      </div>
    </div>
  );
}