// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Search } from "lucide-react";
// import { getJobs } from "../api";
// import Navbar from "../components/Navbar";
// import JobCard from "../components/JobCard";

// export default function DashboardPage() {
//   const [jobs, setJobs] = useState([]);
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     fetchJobs("");
//   }, []);

//   async function fetchJobs(q) {
//     setLoading(true);
//     setError("");
//     try {
//       const data = await getJobs(q, 1, 4);
//       setJobs(data.jobs || []);
//     } catch {
//       setError("Unable to reach the career server.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-app-bg text-black font-sans selection:bg-primary-100 selection:text-black pb-24">
//       <Navbar />

//       <main className="max-w-[900px] mx-auto px-7 pt-14">

//         {/* this is the hero section */}
//         <p className="text-xs font-bold tracking-[1px] text-black uppercase mb-4">
//           Hello {user.username || "User"}!
//         </p>
//         <h1 className="text-[3rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-black mb-4">
//           Find work that<br />
//           actually <span className="text-black">fits you.</span>
//         </h1>
//         <p className="text-[1.125rem] leading-[1.7] text-black max-w-[560px] font-normal mb-10">
//           Browse thousands of verified jobs and internships. Upload your resume, track
//           your applications, and land your next role — all in one place.
//         </p>

//         {/* the dummy cards we added manually */}
//         <div className="grid grid-cols-3 gap-4 mb-16">
//           <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
//             <p className="text-[12px] font-semibold text-black uppercase tracking-[0.5px] mb-2">Jobs available</p>
//             <p className="text-[28px] font-extrabold tracking-[-0.5px] text-black">12,400</p>
//             <p className="text-[13px] text-black mt-1">Updated today</p>
//           </div>
//           <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
//             <p className="text-[12px] font-semibold text-black uppercase tracking-[0.5px] mb-2">Applications</p>
//             <p className="text-[28px] font-extrabold tracking-[-0.5px] text-black">3</p>
//             <p className="text-[13px] text-black mt-1">2 active, 1 saved</p>
//           </div>
//           <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
//             <p className="text-[12px] font-semibold text-black uppercase tracking-[0.5px] mb-2">Resume score</p>
//             <p className="text-[28px] font-extrabold tracking-[-0.5px] text-black">74%</p>
//             <p className="text-[13px] text-black mt-1">Good — room to improve</p>
//           </div>
//         </div>

//         {/* This rest block is calling the  jobcards one by one */}

//         {/* search Bar for jobs */}
//         <div className="cs-card-divider pt-16">
//           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
//             <div>
//               <h2 className="text-display-sm text-black mb-2">
//                 Latest Opportunities
//               </h2>
//               <p className="text-black font-medium text-base">Hand-picked roles matching your skillset.</p>
//             </div>

//             {/* Search bar form submit */}
//             <form
//               onSubmit={(e) => { e.preventDefault(); fetchJobs(query); }}
//               className="relative w-full md:w-96"
//             >
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={18} />
//               <input
//                 className="w-full pl-12 pr-24 py-3 rounded-2xl bg-white border border-neutral-200 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 text-sm text-black font-medium transition-all shadow-sm"
//                 placeholder="Search jobs..."
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//               />
//               <button className="absolute right-1.5 top-1.5 bottom-1.5 px-6 rounded-full bg-primary-400 text-white text-sm font-bold active:scale-95 transition-all hover:bg-primary-500">
//                 Search
//               </button>
//             </form>
//           </div>

//           {error ? (
//             <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
//               {error}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {loading ? (
//                 [1, 2, 3, 4].map((n) => (
//                   <div key={n} className="h-64 bg-neutral-50/50 rounded-2xl border border-neutral-100 animate-pulse" />
//                 ))
//               ) : (
//                 <>
//                   {jobs.map((job, idx) => (
//                     <JobCard key={job.id || idx} job={job} />
//                   ))}

//                   {/* View All Jobs Circular Button */}
//                   <div className="flex items-center justify-center">
//                     <button
//                       onClick={() => navigate(`/jobs?q=${encodeURIComponent(query)}`)}
//                       className="inline-flex items-center gap-2 px-10 py-3 bg-neutral-900 text-white font-bold text-sm rounded-full hover:bg-black transition-all active:scale-95"
//                     >
//                       View all jobs &rarr;
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//         </div>

//       </main>
//     </div>
//   );
// }


































// import { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   Search, ChevronRight, RefreshCw, Sparkles, ArrowUpRight,
//   TrendingUp, Briefcase, ArrowRight 
// } from "lucide-react";
// import { getJobs } from "../../services/externalJobsService";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import JobCard from "../../components/JobCard";

// // ── SKILL UNIVERSE ─────────────────────────────────────────────────────────
// const SKILL_UNIVERSE = {
//   Frontend: ["React", "Vue", "TypeScript", "Next.js", "Tailwind", "GraphQL", "WebGL", "Svelte"],
//   Backend: ["Node.js", "Python", "Django", "FastAPI", "Go", "Rust", "Java", "Spring"],
//   Data: ["SQL", "Pandas", "PyTorch", "TensorFlow", "Spark", "dbt", "Airflow", "Kafka"],
//   Cloud: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux"],
//   Design: ["Figma", "UX Research", "Prototyping", "CSS", "Motion", "A/B Testing", "Design Systems", "Accessibility"],
//   Soft: ["Leadership", "Communication", "Agile", "Product Thinking", "System Design", "Mentorship", "Cross-functional", "Ownership"],
// };

// function seedRandom(str) {
//   let h = 0;
//   for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
//   return ((h >>> 0) / 0xFFFFFFFF);
// }
// function getMarketScore(skill, seed = "") {
//   const base = seedRandom(skill + seed);
//   const drift = Math.sin(Date.now() / 80000 + base * 99) * 0.07;
//   return Math.min(1, Math.max(0.1, base * 0.75 + 0.2 + drift));
// }

// // ── RADAR CHART ────────────────────────────────────────────────────────────
// function RadarChart({ categories, userScores, marketScores, size = 170 }) {
//   const cx = size / 2, cy = size / 2, r = size * 0.36;
//   const n = categories.length;
//   const ang = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
//   const pt = (i, v) => ({ x: cx + Math.cos(ang(i)) * r * v, y: cy + Math.sin(ang(i)) * r * v });
//   const toPath = (scores) =>
//     scores.map((v, i) => { const p = pt(i, v); return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(" ") + " Z";

//   return (
//     <svg width={size} height={size} style={{ overflow: "visible" }}>
//       {[0.25, 0.5, 0.75, 1].map(ring => (
//         <polygon key={ring} points={categories.map((_, i) => { const p = pt(i, ring); return `${p.x},${p.y}`; }).join(" ")}
//           fill="none" stroke="#b3eefb" strokeWidth="0.8" opacity={ring === 1 ? 0.6 : 0.3} />
//       ))}
//       {categories.map((_, i) => { const p = pt(i, 1); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#b3eefb" strokeWidth="0.8" opacity="0.5" />; })}
//       <path d={toPath(marketScores)} fill="#02bcf0" fillOpacity="0.1" stroke="#02bcf0" strokeWidth="1.2" strokeDasharray="4 3" />
//       <path d={toPath(userScores)} fill="#02bcf0" fillOpacity="0.25" stroke="#02bcf0" strokeWidth="2" strokeLinejoin="round" />
//       {userScores.map((v, i) => { const p = pt(i, v); return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#02bcf0" stroke="white" strokeWidth="1.5" />; })}
//       {categories.map((cat, i) => {
//         const p = pt(i, 1.25);
//         return <text key={cat} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
//           style={{ fontSize: "8.5px", fontWeight: 700, fill: "#9ca3af", fontFamily: "inherit", textTransform: "uppercase", letterSpacing: "0.05em" }}>{cat}</text>;
//       })}
//     </svg>
//   );
// }

// // ── HEAT CELL ──────────────────────────────────────────────────────────────
// function HeatCell({ skill, marketScore, userHas, onClick, animDelay }) {
//   const pct = Math.round(marketScore * 100);
//   let bg, textColor, borderColor;
//   if (userHas && marketScore > 0.6) {
//     bg = `rgba(2,188,240,${0.12 + marketScore * 0.22})`; borderColor = `rgba(2,188,240,${0.35 + marketScore * 0.3})`; textColor = "#0179a0";
//   } else if (!userHas && marketScore > 0.65) {
//     bg = `rgba(245,158,11,${0.08 + marketScore * 0.18})`; borderColor = `rgba(245,158,11,${0.35 + marketScore * 0.3})`; textColor = "#92400e";
//   } else if (userHas) {
//     bg = "rgba(2,188,240,0.07)"; borderColor = "rgba(2,188,240,0.22)"; textColor = "#0179a0";
//   } else {
//     bg = "rgba(156,163,175,0.06)"; borderColor = "rgba(156,163,175,0.18)"; textColor = "#9ca3af";
//   }
//   return (
//     <button onClick={() => onClick(skill)}
//       style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: "10px", padding: "8px 10px", cursor: "pointer", textAlign: "left", position: "relative", overflow: "hidden", animation: "pulseIn 0.4s ease both", animationDelay: `${animDelay}ms`, transition: "transform 0.15s, box-shadow 0.15s" }}
//       onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
//       onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
//       title={`${pct}% market demand${userHas ? " — you have this" : " — not in your profile"}`}
//     >
//       <div style={{ position: "absolute", bottom: 0, left: 0, height: "2.5px", width: `${pct}%`, background: userHas ? "#02bcf0" : (marketScore > 0.65 ? "#f59e0b" : "#d1d5db"), borderRadius: "0 0 0 10px", transition: "width 1s ease" }} />
//       <div style={{ fontSize: "11px", fontWeight: 700, color: textColor, marginBottom: "3px", lineHeight: 1.2 }}>{skill}</div>
//       <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
//         <span style={{ fontSize: "10px", color: textColor, opacity: 0.75, fontWeight: 600 }}>{pct}%</span>
//         {userHas && <span style={{ fontSize: "9px", background: "rgba(2,188,240,0.15)", color: "#0d1117", borderRadius: "4px", padding: "1px 5px", fontWeight: 700 }}>✓</span>}
//         {!userHas && marketScore > 0.65 && <span style={{ fontSize: "9px", background: "rgba(245,158,11,0.15)", color: "#0d1117", borderRadius: "4px", padding: "1px 5px", fontWeight: 700 }}>gap</span>}
//       </div>
//     </button>
//   );
// }

// // ── CAREER PULSE ──────────────────────────────────────────────────────────
// function CareerPulse({ userSkills, onSearchSkill }) {
//   const [activeCat, setActiveCat] = useState("Frontend");
//   const [seed, setSeed] = useState("");
//   const [spinning, setSpinning] = useState(false);
//   const categories = Object.keys(SKILL_UNIVERSE);
//   const skills = SKILL_UNIVERSE[activeCat];

//   const userSet = new Set((userSkills || "").toLowerCase().split(",").map(s => s.trim()).filter(Boolean));
//   const hasSkill = (s) => userSet.has(s.toLowerCase()) || (userSkills || "").toLowerCase().includes(s.toLowerCase());

//   const radarUser = categories.map(cat => {
//     const matched = SKILL_UNIVERSE[cat].filter(s => hasSkill(s)).length;
//     return Math.max(0.05, matched / SKILL_UNIVERSE[cat].length);
//   });
//   const radarMarket = categories.map(cat => {
//     const avg = SKILL_UNIVERSE[cat].reduce((a, s) => a + getMarketScore(s, seed), 0) / SKILL_UNIVERSE[cat].length;
//     return Math.max(0.1, avg);
//   });

//   const topGaps = Object.values(SKILL_UNIVERSE).flat()
//     .filter(s => !hasSkill(s))
//     .map(s => ({ skill: s, score: getMarketScore(s, seed) }))
//     .sort((a, b) => b.score - a.score).slice(0, 4);

//   const totalSkills = Object.values(SKILL_UNIVERSE).flat();
//   const matchPct = Math.round(totalSkills.filter(s => hasSkill(s)).length / totalSkills.length * 100);

//   const handleRefresh = () => {
//     setSpinning(true);
//     setTimeout(() => { setSeed(String(Date.now())); setSpinning(false); }, 700);
//   };

//   return (
//     <div className="cs-card !p-0 overflow-hidden mb-12">
//       {/* Panel header */}
//       <div style={{ padding: "18px 22px 0", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
//         <div>
//           <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
//             <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", animation: "livePulse 2s ease-in-out infinite" }} />
//             <span style={{ fontSize: "10px", fontWeight: 700, color: "#0d1117", textTransform: "uppercase", letterSpacing: "0.08em" }}>Career Pulse — Live Market Intelligence</span>
//           </div>
//           <h2 style={{ fontSize: "19px", fontWeight: 800, color: "#0d1117", letterSpacing: "-0.5px", margin: "0 0 4px" }}>Dynamic Market Intelligence</h2>
//           <p style={{ fontSize: "12px", color: "#0d1117", marginBottom: "14px", fontWeight: 600, opacity: 0.7 }}>Real-time demand heatmap — click any skill to filter relevant roles</p>
//         </div>
//         <button onClick={handleRefresh}
//           style={{ marginTop: "4px", background: "transparent", border: "1px solid #e5e7eb", borderRadius: "9px", padding: "6px 11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, color: "#0d1117", transition: "all 0.15s" }}
//           onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
//           onMouseLeave={e => e.currentTarget.style.background = "transparent"}
//         >
//           <RefreshCw size={12} style={{ animation: spinning ? "spin 0.7s linear infinite" : "none" }} />
//           Refresh
//         </button>
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: "1fr 190px" }}>
//         {/* Heatmap side */}
//         <div style={{ padding: "18px 22px" }}>
//           <div style={{ display: "flex", gap: "5px", marginBottom: "14px", flexWrap: "wrap" }}>
//             {categories.map(cat => (
//               <button key={cat} onClick={() => setActiveCat(cat)}
//                 style={{ padding: "4px 11px", borderRadius: "999px", border: "1px solid", borderColor: activeCat === cat ? "#02bcf0" : "#e5e7eb", background: activeCat === cat ? "#e6f9fe" : "transparent", color: activeCat === cat ? "#0179a0" : "#9ca3af", fontSize: "10px", fontWeight: 700, cursor: "pointer", transition: "all 0.12s", textTransform: "uppercase", letterSpacing: "0.04em" }}>
//                 {cat}
//               </button>
//             ))}
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "7px" }}>
//             {skills.map((skill, i) => (
//               <HeatCell key={skill + seed} skill={skill} marketScore={getMarketScore(skill, seed)} userHas={hasSkill(skill)} onClick={onSearchSkill} animDelay={i * 35} />
//             ))}
//           </div>
//           <div style={{ display: "flex", gap: "14px", marginTop: "12px" }}>
//             {[["#02bcf0", "You have this"], ["#f59e0b", "High demand gap"], ["#d1d5db", "Lower demand"]].map(([color, label]) => (
//               <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
//                 <div style={{ width: "18px", height: "2.5px", background: color, borderRadius: "2px" }} />
//                 <span style={{ fontSize: "10px", color: "#0d1117", fontWeight: 600 }}>{label}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Radar side */}
//         <div style={{ borderLeft: "1px solid #f3f4f6", padding: "18px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", background: "#fafafa" }}>
//           <span style={{ fontSize: "9px", fontWeight: 700, color: "#0d1117", textTransform: "uppercase", letterSpacing: "0.06em" }}>Readiness Radar</span>
//           <RadarChart categories={categories.map(c => c.slice(0, 4))} userScores={radarUser} marketScores={radarMarket} size={162} />
//           <div style={{ textAlign: "center" }}>
//             <div style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1, color: matchPct >= 30 ? "#02bcf0" : "#f59e0b" }}>{matchPct}%</div>
//             <div style={{ fontSize: "9px", fontWeight: 700, color: "#0d1117", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px" }}>market match</div>
//           </div>
//           <div style={{ display: "flex", gap: "8px", fontSize: "9px", color: "#0d1117", fontWeight: 600, alignItems: "center" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: "3px" }}><div style={{ width: "12px", height: "2px", background: "#02bcf0", borderRadius: "1px" }} />You</div>
//             <div style={{ display: "flex", alignItems: "center", gap: "3px" }}><div style={{ width: "12px", height: "2px", background: "#02bcf0", opacity: 0.4, borderRadius: "1px", borderBottom: "1px dashed #02bcf0" }} />Market</div>
//           </div>
//           {topGaps.length > 0 && (
//             <div style={{ width: "100%", borderTop: "1px solid #f3f4f6", paddingTop: "10px" }}>
//               <div style={{ fontSize: "9px", fontWeight: 700, color: "#0d1117", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "7px" }}>Learn next</div>
//               {topGaps.map(({ skill, score }) => (
//                 <button key={skill} onClick={() => onSearchSkill(skill)}
//                   style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "transparent", border: "none", padding: "3.5px 0", cursor: "pointer" }}>
//                   <span style={{ fontSize: "11px", fontWeight: 700, color: "#0d1117" }}>{skill}</span>
//                   <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
//                     <div style={{ width: `${Math.round(score * 30)}px`, height: "3px", background: "#f59e0b", borderRadius: "2px" }} />
//                     <ArrowUpRight size={10} color="#f59e0b" />
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── DASHBOARD PAGE ─────────────────────────────────────────────────────────
// export default function DashboardPage() {
//   const [jobs, setJobs] = useState([]);
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [userSkills, setUserSkills] = useState("");
//   const [userDomain, setUserDomain] = useState("");
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) { navigate("/login"); return; }
//     try {
//       const cached = localStorage.getItem("userProfile");
//       if (cached) { const p = JSON.parse(cached); setUserSkills(p.skills || ""); setUserDomain(p.domain || ""); }
//     } catch { }
//     fetchJobs("");
//   }, []);

//   async function fetchJobs(q) {
//     setLoading(true); setError("");
//     try { const data = await getJobs(q, 1, 4); setJobs(data.jobs || []); }
//     catch { setError("Unable to reach the career server."); }
//     finally { setLoading(false); }
//   }

//   const handleSkillSearch = useCallback((skill) => navigate(`/student/jobs?q=${encodeURIComponent(skill)}`), [navigate]);

//   const totalSkills = Object.values(SKILL_UNIVERSE).flat();
//   const matchPct = Math.round(totalSkills.filter(s => (userSkills || "").toLowerCase().includes(s.toLowerCase())).length / totalSkills.length * 100);

//   return (
//     <>
//       <style>{`
//         @keyframes livePulse { 0%,100%{box-shadow:0 0 0 3px rgba(34,197,94,.2)} 50%{box-shadow:0 0 0 7px rgba(34,197,94,.06)} }
//         @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
//         @keyframes pulseIn { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
//         @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
//         @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 30px rgba(79, 70, 229, 0.2); } 50% { box-shadow: 0 0 50px rgba(79, 70, 229, 0.4); } }
//         .d-hero{animation:fadeUp .5s ease both}
//         .d-stats{animation:fadeUp .5s .1s ease both}
//         .slide-in{animation:slideIn .6s .2s ease both}
//         .image-glow{animation:glowPulse 3s ease-in-out infinite}
//       `}</style>

//       <div className="min-h-screen bg-app-bg font-sans flex flex-col">
//         <Navbar />
//         <main className="max-w-[900px] mx-auto px-7 pt-10 pb-10 flex-1 w-full">

//           {/* ── HERO SECTION ─────────────────────────────────────────────── */}
// <section className="d-hero mb-12" style={{ background: "#eef1f8", borderRadius: "24px", padding: "64px 56px" }}>
//   <div className="flex flex-col lg:flex-row items-center gap-16">
    
//     {/* Left Column */}
//     <div className="flex-1 flex flex-col items-start gap-6">
      
//       {/* Badge */}
//       <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
//         <TrendingUp size={14} className="text-indigo-600" />
//         <span className="text-[13px] font-bold text-slate-600">#1 Job Platform in India</span>
//       </div>

//       {/* Heading */}
//       <h1 className="text-5xl lg:text-[3.8rem] font-bold leading-[1.08] tracking-[-2px] text-slate-900">
//         Find your dream job<br />
//         at <span style={{ color: "#4f46e5" }}>Career</span><span style={{ color: "#ef4444" }}>Sync</span>
//       </h1>

//       {/* Subtitle */}
//       <p className="text-[1.1rem] leading-relaxed text-slate-500 font-medium max-w-lg">
//         Connect with top employers and discover opportunities that match your skills.
//         Whether you're a job seeker or recruiter, we've got you covered with powerful
//         tools and seamless experience.
//       </p>

//       {/* Stats */}
//       <div className="flex gap-10 pt-2">
//         {[
//           { val: "10k+", lbl: "Active Jobs" },
//           { val: "5k+",  lbl: "Companies"  },
//           { val: "50k+", lbl: "Job Seekers" },
//         ].map(({ val, lbl }) => (
//           <div key={lbl} className="flex flex-col">
//             <p className="text-[2rem] font-black leading-none text-indigo-600 tracking-tighter">{val}</p>
//             <p className="text-[12px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{lbl}</p>
//           </div>
//         ))}
//       </div>

//       {/* Buttons */}
//       <div className="flex gap-4 pt-2">
//         <button
//           onClick={() => navigate("/student/jobs")}
//           className="flex items-center gap-2 bg-[#0f172a] text-white px-8 py-4 rounded-[14px] font-bold text-[15px] hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
//         >
//           <Search size={16} /> Browse Jobs <ArrowRight size={16} />
//         </button>
//         <button
//           onClick={() => navigate("/student/resume")}
//           className="flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-[14px] font-bold text-[15px] hover:bg-slate-50 transition-all active:scale-95"
//         >
//           <Briefcase size={16} /> Learn More
//         </button>
//       </div>

//       {/* Trust line */}
//       <div className="flex items-center gap-4 text-[13px] font-semibold text-slate-400 pt-2 flex-wrap">
//         <span>✔ Free to use</span>
//         <span className="opacity-30">·</span>
//         <span>✔ Verified Employers</span>
//         <span className="opacity-30">·</span>
//         <span>✔ Secure Platform</span>
//       </div>
//     </div>

//     {/* Right Column — Image */}
//     <div className="flex-shrink-0 w-full lg:w-[480px] slide-in">
//       <div style={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
//         <img
//           src="/recruitment_hero_woman_1775692951185.png"
//           alt="CareerSync"
//           className="w-full h-auto block object-cover"
//           style={{ aspectRatio: "4/3", objectPosition: "center top" }}
//         />
//       </div>
//     </div>

//   </div>
// </section>
//           {/* ── INTERACTIVE STATS GRID ───────────────────────────────────── */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 d-stats">
//             {[
//               { label: "Market Match", value: userSkills ? `${matchPct}%` : "—", sub: "Live skill alignment", color: "from-indigo-600 to-blue-500", accent: "#4f46e5" },
//               { label: "Resume Grade", value: "Platinum", sub: "Verified analysis", color: "from-slate-700 to-slate-900", accent: "#0f172a", link: "/student/resume" },
//               { label: "Reach", value: "Global+", sub: "Expanded visibility", color: "from-red-500 to-rose-400", accent: "#ef4444", link: "/student/profile" },
//             ].map(({ label, value, sub, color, accent, link }) => (
//               <div key={label} onClick={link ? () => navigate(link) : undefined}
//                 className="cs-card group relative !p-8 flex flex-col justify-between overflow-hidden cursor-pointer backdrop-blur-lg">
//                 <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-[0.04] group-hover:opacity-[0.1] transition-opacity blur-2xl rounded-full -mr-16 -mt-16`} />
//                 <div>
//                   <div className="flex items-center justify-between mb-6">
//                     <p className="text-[11px] font-black uppercase tracking-widest text-[#0d1117]/40">{label}</p>
//                     <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />
//                   </div>
//                   <p className="text-3xl font-black text-black leading-none mb-1">{value}</p>
//                 </div>
//                 <p className="text-xs font-bold text-[#0d1117]/60 flex items-center gap-1 group-hover:text-black transition-colors mt-4">
//                   {sub} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Career Pulse */}
//           <div className="d-pulse">
//             {!userSkills && (
//               <div style={{ background: "#e6f9fe", border: "1px solid #b3eefb", borderRadius: "14px", padding: "14px 18px", marginBottom: "14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
//                   <Sparkles size={15} color="#02bcf0" />
//                   <div>
//                     <p style={{ fontSize: "13px", fontWeight: 700, color: "#0d1117", margin: 0 }}>Add your skills to unlock personal insights</p>
//                     <p style={{ fontSize: "11px", color: "#0d1117", margin: 0, fontWeight: 500 }}>CareerPulse will highlight your exact gaps vs. live market demand</p>
//                   </div>
//                 </div>
//                 <button onClick={() => navigate("/student/profile")}
//                   className="flex items-center gap-1.5 px-4 py-2 bg-primary-400 text-white text-xs font-bold rounded-xl hover:bg-primary-500 transition-colors">
//                   Add Skills <ChevronRight size={12} />
//                 </button>
//               </div>
//             )}
//             <CareerPulse userSkills={userSkills} onSearchSkill={handleSkillSearch} />
//           </div>

//           {/* Latest Jobs */}
//           <div className="d-jobs cs-card-divider pt-14">
//             <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
//               <div>
//                 <h2 className="text-xl font-bold text-black tracking-tight mb-1">Latest Opportunities</h2>
//                 <p className="text-black text-sm font-medium">Click any skill above to filter instantly</p>
//               </div>
//               <form onSubmit={(e) => { e.preventDefault(); fetchJobs(query); }} className="relative w-full md:w-80">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={15} />
//                 <input
//                   className="cs-input !pl-11"
//                   placeholder="Search jobs..." value={query} onChange={(e) => setQuery(e.target.value)}
//                 />
//                 <button className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-primary-400 text-white text-xs font-bold hover:bg-primary-500 active:scale-95 transition-all">Go</button>
//               </form>
//             </div>
//             {error ? (
//               <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">{error}</div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//                 {loading ? [1, 2, 3, 4].map(n => <div key={n} className="h-56 bg-neutral-50/50 rounded-2xl border border-neutral-100 animate-pulse" />)
//                   : (<>{jobs.map((job, idx) => <JobCard key={job.id || idx} job={job} />)}
//                     <div className="flex items-center justify-center">
//                       <button onClick={() => navigate(`/student/jobs?q=${encodeURIComponent(query)}`)}
//                         className="inline-flex items-center gap-2 px-8 py-2.5 bg-neutral-900 text-white font-bold text-sm rounded-full hover:bg-black transition-all active:scale-95">
//                         View all jobs →
//                       </button>
//                     </div></>)
//                 }
//               </div>
//             )}
//           </div>
//         </main>
//         <Footer />
//       </div>
//     </>
//   );
// }




import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, ChevronRight, RefreshCw, Sparkles, ArrowUpRight,
  TrendingUp, Briefcase, ArrowRight 
} from "lucide-react";
import { getJobs } from "../../services/externalJobsService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import JobCard from "../../components/JobCard";

// ── SKILL UNIVERSE ─────────────────────────────────────────────────────────
const SKILL_UNIVERSE = {
  Frontend: ["React", "Vue", "TypeScript", "Next.js", "Tailwind", "GraphQL", "WebGL", "Svelte"],
  Backend: ["Node.js", "Python", "Django", "FastAPI", "Go", "Rust", "Java", "Spring"],
  Data: ["SQL", "Pandas", "PyTorch", "TensorFlow", "Spark", "dbt", "Airflow", "Kafka"],
  Cloud: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux"],
  Design: ["Figma", "UX Research", "Prototyping", "CSS", "Motion", "A/B Testing", "Design Systems", "Accessibility"],
  Soft: ["Leadership", "Communication", "Agile", "Product Thinking", "System Design", "Mentorship", "Cross-functional", "Ownership"],
};

function seedRandom(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return ((h >>> 0) / 0xFFFFFFFF);
}
function getMarketScore(skill, seed = "") {
  const base = seedRandom(skill + seed);
  const drift = Math.sin(Date.now() / 80000 + base * 99) * 0.07;
  return Math.min(1, Math.max(0.1, base * 0.75 + 0.2 + drift));
}

// ── RADAR CHART ────────────────────────────────────────────────────────────
function RadarChart({ categories, userScores, marketScores, size = 170 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.36;
  const n = categories.length;
  const ang = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i, v) => ({ x: cx + Math.cos(ang(i)) * r * v, y: cy + Math.sin(ang(i)) * r * v });
  const toPath = (scores) =>
    scores.map((v, i) => { const p = pt(i, v); return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(" ") + " Z";

  return (
    <svg width={size} height={size} style={{ overflow: "visible" }}>
      {[0.25, 0.5, 0.75, 1].map(ring => (
        <polygon key={ring} points={categories.map((_, i) => { const p = pt(i, ring); return `${p.x},${p.y}`; }).join(" ")}
          fill="none" stroke="#b3eefb" strokeWidth="0.8" opacity={ring === 1 ? 0.6 : 0.3} />
      ))}
      {categories.map((_, i) => { const p = pt(i, 1); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#b3eefb" strokeWidth="0.8" opacity="0.5" />; })}
      <path d={toPath(marketScores)} fill="#02bcf0" fillOpacity="0.1" stroke="#02bcf0" strokeWidth="1.2" strokeDasharray="4 3" />
      <path d={toPath(userScores)} fill="#02bcf0" fillOpacity="0.25" stroke="#02bcf0" strokeWidth="2" strokeLinejoin="round" />
      {userScores.map((v, i) => { const p = pt(i, v); return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#02bcf0" stroke="white" strokeWidth="1.5" />; })}
      {categories.map((cat, i) => {
        const p = pt(i, 1.25);
        return <text key={cat} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
          style={{ fontSize: "8.5px", fontWeight: 700, fill: "#9ca3af", fontFamily: "inherit", textTransform: "uppercase", letterSpacing: "0.05em" }}>{cat}</text>;
      })}
    </svg>
  );
}

// ── HEAT CELL ──────────────────────────────────────────────────────────────
function HeatCell({ skill, marketScore, userHas, onClick, animDelay }) {
  const pct = Math.round(marketScore * 100);
  let bg, textColor, borderColor;
  if (userHas && marketScore > 0.6) {
    bg = `rgba(2,188,240,${0.12 + marketScore * 0.22})`; borderColor = `rgba(2,188,240,${0.35 + marketScore * 0.3})`; textColor = "#0179a0";
  } else if (!userHas && marketScore > 0.65) {
    bg = `rgba(245,158,11,${0.08 + marketScore * 0.18})`; borderColor = `rgba(245,158,11,${0.35 + marketScore * 0.3})`; textColor = "#92400e";
  } else if (userHas) {
    bg = "rgba(2,188,240,0.07)"; borderColor = "rgba(2,188,240,0.22)"; textColor = "#0179a0";
  } else {
    bg = "rgba(156,163,175,0.06)"; borderColor = "rgba(156,163,175,0.18)"; textColor = "#9ca3af";
  }
  return (
    <button onClick={() => onClick(skill)}
      style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: "10px", padding: "8px 10px", cursor: "pointer", textAlign: "left", position: "relative", overflow: "hidden", animation: "pulseIn 0.4s ease both", animationDelay: `${animDelay}ms`, transition: "transform 0.15s, box-shadow 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
      title={`${pct}% market demand${userHas ? " — you have this" : " — not in your profile"}`}
    >
      <div style={{ position: "absolute", bottom: 0, left: 0, height: "2.5px", width: `${pct}%`, background: userHas ? "#02bcf0" : (marketScore > 0.65 ? "#f59e0b" : "#d1d5db"), borderRadius: "0 0 0 10px", transition: "width 1s ease" }} />
      <div style={{ fontSize: "11px", fontWeight: 700, color: textColor, marginBottom: "3px", lineHeight: 1.2 }}>{skill}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <span style={{ fontSize: "10px", color: textColor, opacity: 0.75, fontWeight: 600 }}>{pct}%</span>
        {userHas && <span style={{ fontSize: "9px", background: "rgba(2,188,240,0.15)", color: "#0d1117", borderRadius: "4px", padding: "1px 5px", fontWeight: 700 }}>✓</span>}
        {!userHas && marketScore > 0.65 && <span style={{ fontSize: "9px", background: "rgba(245,158,11,0.15)", color: "#0d1117", borderRadius: "4px", padding: "1px 5px", fontWeight: 700 }}>gap</span>}
      </div>
    </button>
  );
}

// ── CAREER PULSE ──────────────────────────────────────────────────────────
function CareerPulse({ userSkills, onSearchSkill }) {
  const [activeCat, setActiveCat] = useState("Frontend");
  const [seed, setSeed] = useState("");
  const [spinning, setSpinning] = useState(false);
  const categories = Object.keys(SKILL_UNIVERSE);
  const skills = SKILL_UNIVERSE[activeCat];

  const userSet = new Set((userSkills || "").toLowerCase().split(",").map(s => s.trim()).filter(Boolean));
  const hasSkill = (s) => userSet.has(s.toLowerCase()) || (userSkills || "").toLowerCase().includes(s.toLowerCase());

  const radarUser = categories.map(cat => {
    const matched = SKILL_UNIVERSE[cat].filter(s => hasSkill(s)).length;
    return Math.max(0.05, matched / SKILL_UNIVERSE[cat].length);
  });
  const radarMarket = categories.map(cat => {
    const avg = SKILL_UNIVERSE[cat].reduce((a, s) => a + getMarketScore(s, seed), 0) / SKILL_UNIVERSE[cat].length;
    return Math.max(0.1, avg);
  });

  const topGaps = Object.values(SKILL_UNIVERSE).flat()
    .filter(s => !hasSkill(s))
    .map(s => ({ skill: s, score: getMarketScore(s, seed) }))
    .sort((a, b) => b.score - a.score).slice(0, 4);

  const totalSkills = Object.values(SKILL_UNIVERSE).flat();
  const matchPct = Math.round(totalSkills.filter(s => hasSkill(s)).length / totalSkills.length * 100);

  const handleRefresh = () => {
    setSpinning(true);
    setTimeout(() => { setSeed(String(Date.now())); setSpinning(false); }, 700);
  };

  return (
    <div className="cs-card !p-0 overflow-hidden mb-12">
      {/* Panel header */}
      <div style={{ padding: "18px 22px 0", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", animation: "livePulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#0d1117", textTransform: "uppercase", letterSpacing: "0.08em" }}>Career Pulse — Live Market Intelligence</span>
          </div>
          <h2 style={{ fontSize: "19px", fontWeight: 800, color: "#0d1117", letterSpacing: "-0.5px", margin: "0 0 4px" }}>Dynamic Market Intelligence</h2>
          <p style={{ fontSize: "12px", color: "#0d1117", marginBottom: "14px", fontWeight: 600, opacity: 0.7 }}>Real-time demand heatmap — click any skill to filter relevant roles</p>
        </div>
        <button onClick={handleRefresh}
          style={{ marginTop: "4px", background: "transparent", border: "1px solid #e5e7eb", borderRadius: "9px", padding: "6px 11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, color: "#0d1117", transition: "all 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <RefreshCw size={12} style={{ animation: spinning ? "spin 0.7s linear infinite" : "none" }} />
          Refresh
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 190px" }}>
        {/* Heatmap side */}
        <div style={{ padding: "18px 22px" }}>
          <div style={{ display: "flex", gap: "5px", marginBottom: "14px", flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)}
                style={{ padding: "4px 11px", borderRadius: "999px", border: "1px solid", borderColor: activeCat === cat ? "#02bcf0" : "#e5e7eb", background: activeCat === cat ? "#e6f9fe" : "transparent", color: activeCat === cat ? "#0179a0" : "#9ca3af", fontSize: "10px", fontWeight: 700, cursor: "pointer", transition: "all 0.12s", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {cat}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "7px" }}>
            {skills.map((skill, i) => (
              <HeatCell key={skill + seed} skill={skill} marketScore={getMarketScore(skill, seed)} userHas={hasSkill(skill)} onClick={onSearchSkill} animDelay={i * 35} />
            ))}
          </div>
          <div style={{ display: "flex", gap: "14px", marginTop: "12px" }}>
            {[["#02bcf0", "You have this"], ["#f59e0b", "High demand gap"], ["#d1d5db", "Lower demand"]].map(([color, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "18px", height: "2.5px", background: color, borderRadius: "2px" }} />
                <span style={{ fontSize: "10px", color: "#0d1117", fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Radar side */}
        <div style={{ borderLeft: "1px solid #f3f4f6", padding: "18px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", background: "#fafafa" }}>
          <span style={{ fontSize: "9px", fontWeight: 700, color: "#0d1117", textTransform: "uppercase", letterSpacing: "0.06em" }}>Readiness Radar</span>
          <RadarChart categories={categories.map(c => c.slice(0, 4))} userScores={radarUser} marketScores={radarMarket} size={162} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1, color: matchPct >= 30 ? "#02bcf0" : "#f59e0b" }}>{matchPct}%</div>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "#0d1117", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px" }}>market match</div>
          </div>
          <div style={{ display: "flex", gap: "8px", fontSize: "9px", color: "#0d1117", fontWeight: 600, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}><div style={{ width: "12px", height: "2px", background: "#02bcf0", borderRadius: "1px" }} />You</div>
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}><div style={{ width: "12px", height: "2px", background: "#02bcf0", opacity: 0.4, borderRadius: "1px", borderBottom: "1px dashed #02bcf0" }} />Market</div>
          </div>
          {topGaps.length > 0 && (
            <div style={{ width: "100%", borderTop: "1px solid #f3f4f6", paddingTop: "10px" }}>
              <div style={{ fontSize: "9px", fontWeight: 700, color: "#0d1117", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "7px" }}>Learn next</div>
              {topGaps.map(({ skill, score }) => (
                <button key={skill} onClick={() => onSearchSkill(skill)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "transparent", border: "none", padding: "3.5px 0", cursor: "pointer" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#0d1117" }}>{skill}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    <div style={{ width: `${Math.round(score * 30)}px`, height: "3px", background: "#f59e0b", borderRadius: "2px" }} />
                    <ArrowUpRight size={10} color="#f59e0b" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD PAGE ─────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userSkills, setUserSkills] = useState("");
  const [userDomain, setUserDomain] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    try {
      const cached = localStorage.getItem("userProfile");
      if (cached) { const p = JSON.parse(cached); setUserSkills(p.skills || ""); setUserDomain(p.domain || ""); }
    } catch { }
    fetchJobs("");
  }, []);

  async function fetchJobs(q) {
    setLoading(true); setError("");
    try { const data = await getJobs(q, 1, 4); setJobs(data.jobs || []); }
    catch { setError("Unable to reach the career server."); }
    finally { setLoading(false); }
  }

  const handleSkillSearch = useCallback((skill) => navigate(`/student/jobs?q=${encodeURIComponent(skill)}`), [navigate]);

  const totalSkills = Object.values(SKILL_UNIVERSE).flat();
  const matchPct = Math.round(totalSkills.filter(s => (userSkills || "").toLowerCase().includes(s.toLowerCase())).length / totalSkills.length * 100);

  return (
    <>
      <style>{`
        @keyframes livePulse { 0%,100%{box-shadow:0 0 0 3px rgba(34,197,94,.2)} 50%{box-shadow:0 0 0 7px rgba(34,197,94,.06)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulseIn { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        .d-hero { animation: fadeUp .5s ease both; }
        .slide-in { animation: slideIn .6s .2s ease both; }
        .d-stats { animation: fadeUp .5s .1s ease both; }
      `}</style>

      <div className="min-h-screen bg-app-bg font-sans flex flex-col">
        <Navbar />
        <main className="max-w-[960px] mx-auto px-7 pt-10 pb-10 flex-1 w-full">

          {/* ── HERO SECTION ──────────────────────────────────────────────── */}
          <section
            className="d-hero mb-12"
            style={{
              background: "#eef1f8",
              borderRadius: "28px",
              padding: "60px 52px",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "56px" }}>

              {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "24px", minWidth: 0 }}>

                {/* Badge */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "999px", background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <TrendingUp size={14} color="#4f46e5" />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>#1 Job Platform in India</span>
                </div>

                {/* Heading */}
                <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.6rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-2px", color: "#0f172a", margin: 0 }}>
                  Find your dream job<br />
                  at{" "}
                  <span style={{ color: "#4f46e5" }}>Career</span>
                  <span style={{ color: "#ef4444" }}>Sync</span>
                </h1>

                {/* Subtitle */}
                <p style={{ fontSize: "1.05rem", lineHeight: 1.65, color: "#64748b", fontWeight: 500, margin: 0, maxWidth: "440px" }}>
                  Connect with top employers and discover opportunities that match your skills.
                  Whether you're a job seeker or recruiter, we've got you covered with powerful tools
                  and seamless experience.
                </p>

                {/* Stats row */}
                <div style={{ display: "flex", gap: "40px" }}>
                  {[
                    { val: "10k+", lbl: "Active Jobs" },
                    { val: "5k+",  lbl: "Companies"  },
                    { val: "50k+", lbl: "Job Seekers" },
                  ].map(({ val, lbl }) => (
                    <div key={lbl} style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "2rem", fontWeight: 900, color: "#4f46e5", lineHeight: 1, letterSpacing: "-1px" }}>{val}</span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{lbl}</span>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => navigate("/student/jobs")}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#0f172a", color: "#fff", padding: "14px 28px", borderRadius: "14px", fontWeight: 700, fontSize: "15px", border: "none", cursor: "pointer", transition: "background 0.15s", boxShadow: "0 4px 14px rgba(15,23,42,0.2)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1e293b"}
                    onMouseLeave={e => e.currentTarget.style.background = "#0f172a"}
                  >
                    <Search size={16} /> Browse Jobs <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => navigate("/student/resume")}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#fff", color: "#0f172a", padding: "14px 28px", borderRadius: "14px", fontWeight: 700, fontSize: "15px", border: "2px solid #e2e8f0", cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                  >
                    <Briefcase size={16} /> Learn More
                  </button>
                </div>

                {/* Trust line */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", fontSize: "13px", fontWeight: 600, color: "#94a3b8" }}>
                  <span>✔ Free to use</span>
                  <span style={{ opacity: 0.3 }}>·</span>
                  <span>✔ Verified Employers</span>
                  <span style={{ opacity: 0.3 }}>·</span>
                  <span>✔ Secure Platform</span>
                </div>
              </div>

              {/* ── RIGHT COLUMN — Image ─────────────────────────────────── */}
              <div
                className="slide-in"
                style={{ flexShrink: 0, width: "400px", minWidth: "400px" }}
              >
                <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.12)" }}>
                  <img
                    src="/recruitment_hero_woman_1775692951185.png"
                    alt="CareerSync Hero"
                    style={{ width: "100%", height: "auto", display: "block", objectFit: "cover", aspectRatio: "4/3", objectPosition: "center top" }}
                    onError={e => {
                      // fallback placeholder if image missing
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement.style.background = "linear-gradient(135deg,#4f46e5 0%,#818cf8 100%)";
                      e.currentTarget.parentElement.style.minHeight = "300px";
                      e.currentTarget.parentElement.style.display = "flex";
                      e.currentTarget.parentElement.style.alignItems = "center";
                      e.currentTarget.parentElement.style.justifyContent = "center";
                      const fallback = document.createElement("span");
                      fallback.textContent = "CareerSync";
                      fallback.style.cssText = "color:#fff;font-size:1.5rem;font-weight:800;letter-spacing:-1px;";
                      e.currentTarget.parentElement.appendChild(fallback);
                    }}
                  />
                </div>
              </div>

            </div>
          </section>

          {/* ── INTERACTIVE STATS GRID ───────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 d-stats">
            {[
              { label: "Market Match", value: userSkills ? `${matchPct}%` : "—", sub: "Live skill alignment", color: "from-indigo-600 to-blue-500", accent: "#4f46e5" },
              { label: "Resume Grade", value: "Platinum", sub: "Verified analysis", color: "from-slate-700 to-slate-900", accent: "#0f172a", link: "/student/resume" },
              { label: "Reach", value: "Global+", sub: "Expanded visibility", color: "from-red-500 to-rose-400", accent: "#ef4444", link: "/student/profile" },
            ].map(({ label, value, sub, color, accent, link }) => (
              <div key={label} onClick={link ? () => navigate(link) : undefined}
                className="cs-card group relative !p-8 flex flex-col justify-between overflow-hidden cursor-pointer backdrop-blur-lg">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-[0.04] group-hover:opacity-[0.1] transition-opacity blur-2xl rounded-full -mr-16 -mt-16`} />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#0d1117]/40">{label}</p>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />
                  </div>
                  <p className="text-3xl font-black text-black leading-none mb-1">{value}</p>
                </div>
                <p className="text-xs font-bold text-[#0d1117]/60 flex items-center gap-1 group-hover:text-black transition-colors mt-4">
                  {sub} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
                </p>
              </div>
            ))}
          </div>

          {/* Career Pulse */}
          <div className="d-pulse">
            {!userSkills && (
              <div style={{ background: "#e6f9fe", border: "1px solid #b3eefb", borderRadius: "14px", padding: "14px 18px", marginBottom: "14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  <Sparkles size={15} color="#02bcf0" />
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#0d1117", margin: 0 }}>Add your skills to unlock personal insights</p>
                    <p style={{ fontSize: "11px", color: "#0d1117", margin: 0, fontWeight: 500 }}>CareerPulse will highlight your exact gaps vs. live market demand</p>
                  </div>
                </div>
                <button onClick={() => navigate("/student/profile")}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary-400 text-white text-xs font-bold rounded-xl hover:bg-primary-500 transition-colors">
                  Add Skills <ChevronRight size={12} />
                </button>
              </div>
            )}
            <CareerPulse userSkills={userSkills} onSearchSkill={handleSkillSearch} />
          </div>

          {/* Latest Jobs */}
          <div className="d-jobs cs-card-divider pt-14">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
              <div>
                <h2 className="text-xl font-bold text-black tracking-tight mb-1">Latest Opportunities</h2>
                <p className="text-black text-sm font-medium">Click any skill above to filter instantly</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); fetchJobs(query); }} className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={15} />
                <input
                  className="cs-input !pl-11"
                  placeholder="Search jobs..." value={query} onChange={(e) => setQuery(e.target.value)}
                />
                <button className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-primary-400 text-white text-xs font-bold hover:bg-primary-500 active:scale-95 transition-all">Go</button>
              </form>
            </div>
            {error ? (
              <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading ? [1, 2, 3, 4].map(n => <div key={n} className="h-56 bg-neutral-50/50 rounded-2xl border border-neutral-100 animate-pulse" />)
                  : (<>{jobs.map((job, idx) => <JobCard key={job.id || idx} job={job} />)}
                    <div className="flex items-center justify-center">
                      <button onClick={() => navigate(`/student/jobs?q=${encodeURIComponent(query)}`)}
                        className="inline-flex items-center gap-2 px-8 py-2.5 bg-neutral-900 text-white font-bold text-sm rounded-full hover:bg-black transition-all active:scale-95">
                        View all jobs →
                      </button>
                    </div></>)
                }
              </div>
            )}
          </div>

        </main>
        <Footer />
      </div>
    </>
  );
}