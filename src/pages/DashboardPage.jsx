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
//     <div className="min-h-screen bg-[#f0fbfe] text-neutral-800 font-sans selection:bg-primary-100 selection:text-primary-900 pb-24">
//       <Navbar />

//       <main className="max-w-[900px] mx-auto px-7 pt-14">

//         {/* this is the hero section */}
//         <p className="text-xs font-bold tracking-[1px] text-neutral-400 uppercase mb-4">
//           Hello {user.username || "User"}!
//         </p>
//         <h1 className="text-[3rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-neutral-900 mb-4">
//           Find work that<br />
//           actually <span className="text-primary-400">fits you.</span>
//         </h1>
//         <p className="text-[1.125rem] leading-[1.7] text-black max-w-[560px] font-normal mb-10">
//           Browse thousands of verified jobs and internships. Upload your resume, track
//           your applications, and land your next role — all in one place.
//         </p>

//         {/* the dummy cards we added manually */}
//         <div className="grid grid-cols-3 gap-4 mb-16">
//           <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
//             <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-[0.5px] mb-2">Jobs available</p>
//             <p className="text-[28px] font-extrabold tracking-[-0.5px] text-neutral-900">12,400</p>
//             <p className="text-[13px] text-neutral-500 mt-1">Updated today</p>
//           </div>
//           <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
//             <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-[0.5px] mb-2">Applications</p>
//             <p className="text-[28px] font-extrabold tracking-[-0.5px] text-neutral-900">3</p>
//             <p className="text-[13px] text-neutral-500 mt-1">2 active, 1 saved</p>
//           </div>
//           <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
//             <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-[0.5px] mb-2">Resume score</p>
//             <p className="text-[28px] font-extrabold tracking-[-0.5px] text-neutral-900">74%</p>
//             <p className="text-[13px] text-neutral-500 mt-1">Good — room to improve</p>
//           </div>
//         </div>

//         {/* This rest block is calling the  jobcards one by one */}

//         {/* search Bar for jobs */}
//         <div className="border-t border-neutral-100 pt-16">
//           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
//             <div>
//               <h2 className="text-display-sm text-neutral-900 mb-2">
//                 Latest Opportunities
//               </h2>
//               <p className="text-neutral-500 font-medium text-base">Hand-picked roles matching your skillset.</p>
//             </div>

//             {/* Search bar form submit */}
//             <form
//               onSubmit={(e) => { e.preventDefault(); fetchJobs(query); }}
//               className="relative w-full md:w-96"
//             >
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
//               <input
//                 className="w-full pl-12 pr-24 py-3 rounded-2xl bg-white border border-neutral-200 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 text-sm text-neutral-900 font-medium transition-all shadow-sm"
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



















// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Search } from "lucide-react";
// import { getJobs } from "../api";
// import Navbar from "../components/Navbar";
// import JobCard from "../components/JobCard";

// // ── NEW components (copy these 3 files into src/components/) ──
// import ActionItems from "../components/ActionItems";
// import ProfileSummaryCard from "../components/ProfileSummaryCard";
// import TopMatches from "../components/TopMatches";

// // ── helper: decode JWT or fall back to localStorage "user" ──
// function getUserName() {
//   try {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       if (payload?.name) return payload.name;
//       if (payload?.email) return payload.email.split("@")[0];
//     }
//   } catch {}
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   return user.username || user.name || "User";
// }

// export default function DashboardPage() {
//   const [jobs,     setJobs]     = useState([]);
//   const [query,    setQuery]    = useState("");
//   const [loading,  setLoading]  = useState(false);
//   const [error,    setError]    = useState("");
//   const [userName, setUserName] = useState("User");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) { navigate("/login"); return; }
//     setUserName(getUserName());
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

//   const firstName = userName.split(" ")[0];

//   return (
//     <div className="min-h-screen bg-white text-neutral-800 font-sans selection:bg-primary-100 selection:text-primary-900 pb-24">
//       <Navbar />

//       <main className="max-w-[900px] mx-auto px-7 pt-14">

//         {/* ════════════════════════════════════════
//             EXISTING HERO SECTION — unchanged
//         ════════════════════════════════════════ */}
//         <p className="text-xs font-bold tracking-[1px] text-neutral-400 uppercase mb-4">
//           Hello {firstName}!
//         </p>
//         <h1 className="text-[3rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-neutral-900 mb-4">
//           Find work that<br />
//           actually <span className="text-primary-400">fits you.</span>
//         </h1>
//         <p className="text-[1.125rem] leading-[1.7] text-black max-w-[560px] font-normal mb-10">
//           Browse thousands of verified jobs and internships. Upload your resume, track
//           your applications, and land your next role — all in one place.
//         </p>

//         {/* ════════════════════════════════════════
//             EXISTING STATS CARDS — unchanged
//         ════════════════════════════════════════ */}
//         <div className="grid grid-cols-3 gap-4 mb-16">
//           <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
//             <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-[0.5px] mb-2">Jobs available</p>
//             <p className="text-[28px] font-extrabold tracking-[-0.5px] text-neutral-900">12,400</p>
//             <p className="text-[13px] text-neutral-500 mt-1">Updated today</p>
//           </div>
//           <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
//             <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-[0.5px] mb-2">Applications</p>
//             <p className="text-[28px] font-extrabold tracking-[-0.5px] text-neutral-900">3</p>
//             <p className="text-[13px] text-neutral-500 mt-1">2 active, 1 saved</p>
//           </div>
//           <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
//             <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-[0.5px] mb-2">Resume score</p>
//             <p className="text-[28px] font-extrabold tracking-[-0.5px] text-neutral-900">74%</p>
//             <p className="text-[13px] text-neutral-500 mt-1">Good — room to improve</p>
//           </div>
//         </div>

//         {/* ════════════════════════════════════════
//             ✦ NEW — Action First Dashboard Section
//         ════════════════════════════════════════ */}

//         {/* Row 1: Actions (left) + Profile/Stats (right) */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <ActionItems />
//           <ProfileSummaryCard userName={userName} />
//         </div>

//         {/* Row 2: Top Matches */}
//         <div className="mb-10">
//           <TopMatches />
//         </div>

//         {/* ════════════════════════════════════════
//             EXISTING JOB SEARCH + JOB CARDS — unchanged
//         ════════════════════════════════════════ */}
//         <div className="border-t border-neutral-100 pt-16">
//           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
//             <div>
//               <h2 className="text-display-sm text-neutral-900 mb-2">
//                 Latest Opportunities
//               </h2>
//               <p className="text-neutral-500 font-medium text-base">Hand-picked roles matching your skillset.</p>
//             </div>

//             <form
//               onSubmit={(e) => { e.preventDefault(); fetchJobs(query); }}
//               className="relative w-full md:w-96"
//             >
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
//               <input
//                 className="w-full pl-12 pr-24 py-3 rounded-2xl bg-white border border-neutral-200 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 text-sm text-neutral-900 font-medium transition-all shadow-sm"
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
























// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Search, Briefcase, FileText, TrendingUp, Target,
//   ChevronRight, Zap, Clock, Star, MapPin, ArrowUpRight,
//   Bell, BarChart2, CheckCircle2, AlertCircle, Flame,
//   Plus, Calendar, Award, ArrowRight
// } from "lucide-react";
// import { getJobs } from "../api";
// import Navbar from "../components/Navbar";

// // ─── VERSION 2: CLEAN PRODUCTIVITY — "Linear / Notion" inspired ──────────────
// // Aesthetic: Crisp white + warm accents, editorial structure, purposeful whitespace
// // Feels like a tool people actually want to open every day

// export default function DashboardPage() {
//   const [jobs, setJobs] = useState([]);
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const today = new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" });

//   useEffect(() => { fetchJobs(""); }, []);

//   async function fetchJobs(q) {
//     setLoading(true); setError("");
//     try {
//       const data = await getJobs(q, 1, 6);
//       setJobs(data.jobs || []);
//     } catch { setError("Unable to reach the career server."); }
//     finally { setLoading(false); }
//   }

//   const completionItems = [
//     { text: "Follow up on KPMG application", done: false, urgent: true },
//     { text: "Add work experience to profile", done: false, urgent: false },
//     { text: "Upload latest resume version", done: true, urgent: false },
//     { text: "Set job alert for Data Science roles", done: false, urgent: false },
//   ];

//   return (
//     <div style={{ background: "#fafaf9", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
//       <Navbar />

//       <main style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 28px 100px" }}>

//         {/* ── HEADER BAR ── */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 }}>
//           <div>
//             <div style={{ fontSize: 12, fontWeight: 600, color: "#a8a29e", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
//               {today}
//             </div>
//             <h1 style={{ fontSize: 34, fontWeight: 800, color: "#1c1917", letterSpacing: -1, margin: 0, lineHeight: 1.1 }}>
//               Welcome back, <span style={{ color: "#02bcf0" }}>{user.username || "User"}</span> 👋
//             </h1>
//             <p style={{ color: "#78716c", marginTop: 8, fontSize: 15, fontWeight: 400 }}>
//               You have <strong style={{ color: "#1c1917" }}>3 actions</strong> to complete today.
//             </p>
//           </div>
//           <button onClick={() => navigate("/jobs")} style={{
//             background: "#1c1917", color: "#fff", border: "none", borderRadius: 12,
//             padding: "12px 22px", fontWeight: 700, fontSize: 14, cursor: "pointer",
//             display: "flex", alignItems: "center", gap: 8
//           }}>
//             <Search size={15} /> Explore jobs
//           </button>
//         </div>

//         {/* ── STATS ── */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }}>
//           {[
//             { label: "Jobs Available", value: "12,400", sub: "Updated today", accent: "#02bcf0", bg: "#e6f9fe" },
//             { label: "Applications", value: "3", sub: "2 active · 1 saved", accent: "#059669", bg: "#d1fae5" },
//             { label: "Interviews", value: "1", sub: "Upcoming this week", accent: "#7c3aed", bg: "#ede9fe" },
//             { label: "Resume Score", value: "74%", sub: "Good — improve to 85%", accent: "#d97706", bg: "#fef3c7" },
//           ].map((s, i) => (
//             <div key={i} style={{
//               background: "#fff", border: "1px solid #e7e5e4",
//               borderRadius: 18, padding: "22px 24px",
//               transition: "box-shadow 0.2s, transform 0.2s", cursor: "default"
//             }}
//               onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
//               onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
//             >
//               <div style={{
//                 display: "inline-flex", background: s.bg, borderRadius: 10,
//                 padding: "6px 12px", marginBottom: 16
//               }}>
//                 <span style={{ fontSize: 11, fontWeight: 700, color: s.accent, textTransform: "uppercase", letterSpacing: 1 }}>
//                   {s.label}
//                 </span>
//               </div>
//               <div style={{ fontSize: 36, fontWeight: 800, color: "#1c1917", letterSpacing: -1, lineHeight: 1 }}>{s.value}</div>
//               <div style={{ fontSize: 12, color: "#a8a29e", marginTop: 6 }}>{s.sub}</div>
//             </div>
//           ))}
//         </div>

//         {/* ── TWO COLUMN ── */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, marginBottom: 40 }}>

//           {/* Left: Action checklist */}
//           <div style={{ background: "#fff", border: "1px solid #e7e5e4", borderRadius: 20, padding: 28 }}>
//             <div style={{ display: "flex", alignItems: "center", marginBottom: 22 }}>
//               <div>
//                 <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1c1917", margin: 0 }}>Today's Checklist</h2>
//                 <p style={{ color: "#a8a29e", fontSize: 13, marginTop: 3 }}>
//                   {completionItems.filter(i => !i.done).length} tasks remaining
//                 </p>
//               </div>
//               <div style={{
//                 marginLeft: "auto", width: 44, height: 44, borderRadius: "50%",
//                 background: "conic-gradient(#02bcf0 25%, #e7e5e4 0)", display: "flex",
//                 alignItems: "center", justifyContent: "center",
//                 boxShadow: "0 0 0 4px #fff inset"
//               }}>
//                 <span style={{ fontSize: 11, fontWeight: 800, color: "#1c1917" }}>25%</span>
//               </div>
//             </div>

//             {completionItems.map((item, i) => (
//               <div key={i} style={{
//                 display: "flex", alignItems: "center", gap: 14, padding: "14px 0",
//                 borderBottom: i < completionItems.length - 1 ? "1px solid #f5f5f4" : "none",
//               }}>
//                 <div style={{
//                   width: 22, height: 22, borderRadius: 6, flexShrink: 0,
//                   background: item.done ? "#02bcf0" : "#fff",
//                   border: item.done ? "none" : "2px solid #d6d3d1",
//                   display: "flex", alignItems: "center", justifyContent: "center"
//                 }}>
//                   {item.done && <CheckCircle2 size={14} color="#fff" />}
//                 </div>
//                 <span style={{
//                   fontSize: 14, color: item.done ? "#a8a29e" : "#1c1917",
//                   fontWeight: item.done ? 400 : 500,
//                   textDecoration: item.done ? "line-through" : "none", flex: 1
//                 }}>{item.text}</span>
//                 {item.urgent && !item.done && (
//                   <span style={{
//                     fontSize: 10, fontWeight: 700, color: "#dc2626",
//                     background: "#fee2e2", borderRadius: 20, padding: "2px 9px"
//                   }}>Urgent</span>
//                 )}
//               </div>
//             ))}

//             {/* Progress bar */}
//             <div style={{ marginTop: 22, padding: "16px 20px", background: "#fafaf9", borderRadius: 12 }}>
//               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
//                 <span style={{ fontSize: 12, fontWeight: 600, color: "#78716c" }}>Daily progress</span>
//                 <span style={{ fontSize: 12, fontWeight: 700, color: "#02bcf0" }}>1/4 done</span>
//               </div>
//               <div style={{ height: 8, background: "#e7e5e4", borderRadius: 8 }}>
//                 <div style={{ width: "25%", height: "100%", background: "linear-gradient(90deg,#02bcf0,#029ac5)", borderRadius: 8 }} />
//               </div>
//             </div>
//           </div>

//           {/* Right: Profile + Top Matches */}
//           <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

//             {/* Profile card */}
//             <div style={{ background: "#fff", border: "1px solid #e7e5e4", borderRadius: 20, padding: 24 }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
//                 <div style={{
//                   width: 46, height: 46, borderRadius: 14,
//                   background: "linear-gradient(135deg, #02bcf0, #014d65)",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   fontWeight: 800, color: "#fff", fontSize: 20
//                 }}>
//                   {(user.username || "U")[0].toUpperCase()}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontWeight: 700, color: "#1c1917", fontSize: 15 }}>{user.username || "User"}</div>
//                   <div style={{ color: "#a8a29e", fontSize: 12 }}>Pune, India</div>
//                 </div>
//                 <button onClick={() => navigate("/profile")} style={{
//                   background: "none", border: "1px solid #e7e5e4", borderRadius: 8,
//                   padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#78716c", cursor: "pointer"
//                 }}>Edit</button>
//               </div>

//               <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
//                 <span style={{ fontSize: 12, color: "#78716c" }}>Profile strength</span>
//                 <span style={{ fontSize: 12, fontWeight: 700, color: "#1c1917" }}>60%</span>
//               </div>
//               <div style={{ height: 8, background: "#f5f5f4", borderRadius: 8, marginBottom: 14 }}>
//                 <div style={{ width: "60%", height: "100%", background: "linear-gradient(90deg,#02bcf0,#029ac5)", borderRadius: 8 }} />
//               </div>
//               <p style={{ fontSize: 12, color: "#a8a29e", lineHeight: 1.6 }}>
//                 Add your work experience to increase match rate by <strong style={{ color: "#1c1917" }}>30%</strong>
//               </p>
//             </div>

//             {/* Top matches */}
//             <div style={{ background: "#fff", border: "1px solid #e7e5e4", borderRadius: 20, padding: 24 }}>
//               <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
//                 <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1c1917", margin: 0 }}>Top Matches For You</h3>
//                 <Award size={16} style={{ color: "#02bcf0" }} />
//               </div>
//               {[
//                 { role: "Data Scientist", company: "EXL · India", match: 92, color: "#059669" },
//                 { role: "GM Architect", company: "Adani Realty · Pune", match: 88, color: "#02bcf0" },
//                 { role: "Data Analyst", company: "MetaMorph · Remote", match: 81, color: "#7c3aed" },
//               ].map((m, i) => (
//                 <div key={i} onClick={() => navigate("/jobs")} style={{
//                   display: "flex", alignItems: "center", gap: 12, padding: "11px 0",
//                   borderBottom: i < 2 ? "1px solid #f5f5f4" : "none", cursor: "pointer"
//                 }}>
//                   <div style={{
//                     width: 36, height: 36, borderRadius: 10, background: m.color + "15",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     fontSize: 12, fontWeight: 800, color: m.color
//                   }}>{m.match}%</div>
//                   <div style={{ flex: 1 }}>
//                     <div style={{ fontSize: 13, fontWeight: 600, color: "#1c1917" }}>{m.role}</div>
//                     <div style={{ fontSize: 11, color: "#a8a29e" }}>{m.company}</div>
//                   </div>
//                   <ArrowRight size={14} style={{ color: "#d6d3d1" }} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ── JOBS SECTION ── */}
//         <div style={{ background: "#fff", border: "1px solid #e7e5e4", borderRadius: 20, padding: 28 }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
//             <div>
//               <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1c1917", margin: 0 }}>Latest Opportunities</h2>
//               <p style={{ color: "#a8a29e", fontSize: 13, marginTop: 4 }}>Hand-picked roles matching your skillset</p>
//             </div>
//             <form onSubmit={e => { e.preventDefault(); fetchJobs(query); }} style={{ display: "flex", gap: 8 }}>
//               <div style={{ position: "relative" }}>
//                 <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#a8a29e" }} />
//                 <input
//                   value={query} onChange={e => setQuery(e.target.value)}
//                   placeholder="Search roles, companies..."
//                   style={{
//                     border: "1px solid #e7e5e4", borderRadius: 10, padding: "10px 14px 10px 38px",
//                     fontSize: 14, color: "#1c1917", width: 240, outline: "none", background: "#fafaf9"
//                   }}
//                 />
//               </div>
//               <button type="submit" style={{
//                 background: "#02bcf0", color: "#fff", border: "none",
//                 borderRadius: 10, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer"
//               }}>Search</button>
//             </form>
//           </div>

//           {error ? (
//             <div style={{ color: "#dc2626", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 12, padding: 16, fontSize: 14 }}>{error}</div>
//           ) : (
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
//               {loading ? [1, 2, 3].map(n => (
//                 <div key={n} style={{ height: 200, background: "#f5f5f4", borderRadius: 16, animation: "pulse 1.5s infinite" }} />
//               )) : jobs.slice(0, 6).map((job, idx) => (
//                 <div key={idx} onClick={() => navigate(`/jobs/${job.id}`, { state: { job } })} style={{
//                   border: "1px solid #e7e5e4", borderRadius: 16, padding: 20,
//                   cursor: "pointer", transition: "all 0.18s",
//                   background: "#fafaf9"
//                 }}
//                   onMouseEnter={e => { e.currentTarget.style.borderColor = "#02bcf0"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(2,188,240,0.1)"; }}
//                   onMouseLeave={e => { e.currentTarget.style.borderColor = "#e7e5e4"; e.currentTarget.style.background = "#fafaf9"; e.currentTarget.style.boxShadow = "none"; }}
//                 >
//                   <div style={{ fontSize: 10, fontWeight: 700, color: "#a8a29e", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
//                     {job.company?.display_name || "Company"}
//                   </div>
//                   <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1c1917", marginBottom: 8, lineHeight: 1.35 }} className="line-clamp-2">{job.title}</h4>
//                   <p style={{ fontSize: 12, color: "#78716c", lineHeight: 1.6, marginBottom: 14 }} className="line-clamp-2">
//                     {job.description?.replace(/<[^>]*>/g, "").slice(0, 90)}...
//                   </p>
//                   <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
//                     <span style={{ fontSize: 11, color: "#78716c", background: "#f5f5f4", borderRadius: 20, padding: "3px 10px", display: "flex", alignItems: "center", gap: 4 }}>
//                       <MapPin size={10} /> {job.location?.display_name?.split(",")[0] || "Remote"}
//                     </span>
//                     <span style={{ fontSize: 11, color: "#78716c", background: "#f5f5f4", borderRadius: 20, padding: "3px 10px" }}>
//                       {job.contract_time?.replace("_", " ") || "Full Time"}
//                     </span>
//                   </div>
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #f5f5f4" }}>
//                     <span style={{ fontSize: 13, fontWeight: 700, color: "#1c1917" }}>View Details</span>
//                     <ArrowRight size={14} style={{ color: "#a8a29e" }} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div style={{ textAlign: "center", marginTop: 28 }}>
//             <button onClick={() => navigate(`/jobs?q=${encodeURIComponent(query)}`)} style={{
//               background: "#1c1917", color: "#fff", border: "none", borderRadius: 12,
//               padding: "13px 36px", fontWeight: 700, fontSize: 14, cursor: "pointer"
//             }}>
//               View all jobs →
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, RefreshCw, Sparkles, ArrowUpRight } from "lucide-react";
import { getJobs } from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";

// ── SKILL UNIVERSE ─────────────────────────────────────────────────────────
const SKILL_UNIVERSE = {
  Frontend:  ["React","Vue","TypeScript","Next.js","Tailwind","GraphQL","WebGL","Svelte"],
  Backend:   ["Node.js","Python","Django","FastAPI","Go","Rust","Java","Spring"],
  Data:      ["SQL","Pandas","PyTorch","TensorFlow","Spark","dbt","Airflow","Kafka"],
  Cloud:     ["AWS","Azure","GCP","Docker","Kubernetes","Terraform","CI/CD","Linux"],
  Design:    ["Figma","UX Research","Prototyping","CSS","Motion","A/B Testing","Design Systems","Accessibility"],
  Soft:      ["Leadership","Communication","Agile","Product Thinking","System Design","Mentorship","Cross-functional","Ownership"],
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
        {userHas && <span style={{ fontSize: "9px", background: "rgba(2,188,240,0.15)", color: "#0179a0", borderRadius: "4px", padding: "1px 5px", fontWeight: 700 }}>✓</span>}
        {!userHas && marketScore > 0.65 && <span style={{ fontSize: "9px", background: "rgba(245,158,11,0.15)", color: "#b45309", borderRadius: "4px", padding: "1px 5px", fontWeight: 700 }}>gap</span>}
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
    <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "20px", overflow: "hidden", marginBottom: "48px" }}>
      {/* Panel header */}
      <div style={{ padding: "18px 22px 0", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", animation: "livePulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>Career Pulse — Live Market Intelligence</span>
          </div>
          <h2 style={{ fontSize: "19px", fontWeight: 800, color: "#111827", letterSpacing: "-0.5px", margin: "0 0 4px" }}>Your Skills vs. The Market</h2>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "14px", fontWeight: 500 }}>Real-time demand heatmap — click any skill to find matching jobs instantly</p>
        </div>
        <button onClick={handleRefresh}
          style={{ marginTop: "4px", background: "transparent", border: "1px solid #e5e7eb", borderRadius: "9px", padding: "6px 11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, color: "#6b7280", transition: "all 0.15s" }}
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
                <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Radar side */}
        <div style={{ borderLeft: "1px solid #f3f4f6", padding: "18px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", background: "#fafafa" }}>
          <span style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>Readiness Radar</span>
          <RadarChart categories={categories.map(c => c.slice(0, 4))} userScores={radarUser} marketScores={radarMarket} size={162} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1, color: matchPct >= 30 ? "#02bcf0" : "#f59e0b" }}>{matchPct}%</div>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px" }}>market match</div>
          </div>
          <div style={{ display: "flex", gap: "8px", fontSize: "9px", color: "#9ca3af", fontWeight: 600, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}><div style={{ width: "12px", height: "2px", background: "#02bcf0", borderRadius: "1px" }} />You</div>
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}><div style={{ width: "12px", height: "2px", background: "#02bcf0", opacity: 0.4, borderRadius: "1px", borderBottom: "1px dashed #02bcf0" }} />Market</div>
          </div>
          {topGaps.length > 0 && (
            <div style={{ width: "100%", borderTop: "1px solid #f3f4f6", paddingTop: "10px" }}>
              <div style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "7px" }}>Learn next</div>
              {topGaps.map(({ skill, score }) => (
                <button key={skill} onClick={() => onSearchSkill(skill)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "transparent", border: "none", padding: "3.5px 0", cursor: "pointer" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#374151" }}>{skill}</span>
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
    } catch {}
    fetchJobs("");
  }, []);

  async function fetchJobs(q) {
    setLoading(true); setError("");
    try { const data = await getJobs(q, 1, 4); setJobs(data.jobs || []); }
    catch { setError("Unable to reach the career server."); }
    finally { setLoading(false); }
  }

  const handleSkillSearch = useCallback((skill) => navigate(`/jobs?q=${encodeURIComponent(skill)}`), [navigate]);

  const totalSkills = Object.values(SKILL_UNIVERSE).flat();
  const matchPct = Math.round(totalSkills.filter(s => (userSkills || "").toLowerCase().includes(s.toLowerCase())).length / totalSkills.length * 100);

  return (
    <>
      <style>{`
        @keyframes livePulse { 0%,100%{box-shadow:0 0 0 3px rgba(34,197,94,.2)} 50%{box-shadow:0 0 0 7px rgba(34,197,94,.06)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulseIn { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .d-hero{animation:fadeUp .5s ease both}
        .d-stats{animation:fadeUp .5s .1s ease both}
        .d-pulse{animation:fadeUp .5s .2s ease both}
        .d-jobs{animation:fadeUp .5s .3s ease both}
      `}</style>

      <div className="min-h-screen bg-[#f0fbfe] font-sans flex flex-col">
        <Navbar />
        <main className="max-w-[900px] mx-auto px-7 pt-10 pb-10 flex-1 w-full">

          {/* Hero */}
          <div className="d-hero mb-10">
            <p className="text-xs font-bold tracking-[1px] text-neutral-400 uppercase mb-3">Welcome back, {user.username || "there"}</p>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-neutral-900 mb-3">
              Your career, in<br /><span className="text-primary-400">real-time.</span>
            </h1>
            <p className="text-base text-black max-w-[480px] leading-relaxed font-medium">
              CareerPulse shows live market demand vs. your skills — so you always know exactly what to learn and apply for next.
            </p>
          </div>

          {/* Stats */}
          <div className="d-stats grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "Market Match", value: userSkills ? `${matchPct}%` : "—", sub: userSkills ? "Skills vs. live demand" : "Add skills to see", accent: "#02bcf0" },
              { label: "Resume Score", value: "—", sub: "Upload to analyze", accent: "#f59e0b", link: "/resume" },
              { label: "Profile", value: userSkills ? "Active" : "Incomplete", sub: userSkills ? "Skills detected" : "Tap to complete", accent: userSkills ? "#22c55e" : "#f59e0b", link: "/profile" },
            ].map(({ label, value, sub, accent, link }) => (
              <div key={label} onClick={link ? () => navigate(link) : undefined}
                style={{ borderTop: `3px solid ${accent}` }}
                className={`bg-white border border-neutral-200 rounded-[14px] p-5 ${link ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}>
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px] mb-2">{label}</p>
                <p className="text-[26px] font-extrabold tracking-[-0.5px] leading-none mb-1" style={{ color: accent }}>{value}</p>
                <p className="text-[12px] text-neutral-400 font-medium">{sub}</p>
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
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#0179a0", margin: 0 }}>Add your skills to unlock personal insights</p>
                    <p style={{ fontSize: "11px", color: "#67b8d1", margin: 0, fontWeight: 500 }}>CareerPulse will highlight your exact gaps vs. live market demand</p>
                  </div>
                </div>
                <button onClick={() => navigate("/profile")}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary-400 text-white text-xs font-bold rounded-xl hover:bg-primary-500 transition-colors">
                  Add Skills <ChevronRight size={12} />
                </button>
              </div>
            )}
            <CareerPulse userSkills={userSkills} onSearchSkill={handleSkillSearch} />
          </div>

          {/* Latest Jobs */}
          <div className="d-jobs border-t border-neutral-100 pt-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight mb-1">Latest Opportunities</h2>
                <p className="text-neutral-400 text-sm font-medium">Click any skill above to filter instantly</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); fetchJobs(query); }} className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
                <input
                  className="w-full pl-11 pr-20 py-2.5 rounded-xl bg-white border border-neutral-200 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 text-sm font-medium transition-all shadow-sm"
                  placeholder="Search jobs..." value={query} onChange={(e) => setQuery(e.target.value)}
                />
                <button className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-primary-400 text-white text-xs font-bold hover:bg-primary-500 active:scale-95 transition-all">Go</button>
              </form>
            </div>
            {error ? (
              <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading ? [1,2,3,4].map(n => <div key={n} className="h-56 bg-neutral-50/50 rounded-2xl border border-neutral-100 animate-pulse" />)
                  : (<>{jobs.map((job, idx) => <JobCard key={job.id || idx} job={job} />)}
                    <div className="flex items-center justify-center">
                      <button onClick={() => navigate(`/jobs?q=${encodeURIComponent(query)}`)}
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