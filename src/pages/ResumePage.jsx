import { useState } from "react";
import {
    Upload, FileText, CheckCircle, XCircle,
    Sparkles, AlertCircle, ChevronRight,
    Target, Zap, Shield, BarChart2, RefreshCw
} from "lucide-react";
import Navbar from "../components/Navbar";
import { uploadResume } from "../api";

// ─── score color helper ──────────────────────────────────────
function scoreStyle(s) {
    if (s >= 75) return { ring: "#22c55e", bg: "#f0fdf4", text: "#15803d" };
    if (s >= 50) return { ring: "#f59e0b", bg: "#fffbeb", text: "#b45309" };
    return { ring: "#ef4444", bg: "#fef2f2", text: "#b91c1c" };
}

function scoreLabel(s) {
    if (s >= 75) return "Excellent — ATS ready";
    if (s >= 50) return "Good — needs improvement";
    return "Weak — major gaps found";
}

// ─── tips shown before analysis ─────────────────────────────
const TIPS = [
    {
        icon: Target,
        title: "Use job-specific keywords",
        desc: "Mirror the exact language from the job description. ATS scans for keyword density.",
    },
    {
        icon: Zap,
        title: "Quantify your impact",
        desc: "Replace vague phrases with numbers. 'Increased sales by 30%' beats 'improved sales'.",
    },
    {
        icon: Shield,
        title: "Keep formatting clean",
        desc: "Avoid tables, images, and headers/footers. Simple single-column layouts parse best.",
    },
    {
        icon: BarChart2,
        title: "One page for < 5 years exp",
        desc: "Recruiters spend ~7 seconds on a resume. Keep it tight and scannable.",
    },
];

// ─── main page ───────────────────────────────────────────────
export default function ResumePage() {
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
            setError("Please upload a valid PDF file.");
            setFile(null);
            return;
        }
        setFile(f);
        setError("");
        setAnalysis(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFileChange({ target: { files: [f] } });
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError("");
        try {
            const res = await uploadResume(file);
            setAnalysis(res.analysis || res);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => { setAnalysis(null); setFile(null); setError(""); };

    const skills = analysis?.skills_found || [];
    const missing = analysis?.missing_keywords || [];
    const score = analysis?.score ?? 0;
    const ss = scoreStyle(score);

    return (
        <div className="min-h-screen bg-neutral-50 font-sans">
            <Navbar />

            <main className="max-w-[900px] mx-auto px-7 pt-10 pb-24">

                {/* ── Header ── */}
                <div className="mb-10">
                    <p className="text-xs font-bold tracking-[1px] text-neutral-400 uppercase mb-3">
                        ATS checker
                    </p>
                    <h1 className="text-[2.5rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-neutral-900 mb-3">
                        Resume <span className="text-primary-400">Checker.</span>
                    </h1>
                    <p className="text-[1rem] leading-[1.7] text-neutral-500 max-w-[520px]">
                        Upload your PDF resume and get instant ATS feedback — keyword match, skill gaps, and readability score.
                    </p>
                </div>

                {!analysis ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* ── Left: Upload box ── */}
                        <div className="flex flex-col gap-4">

                            {/* Drop zone */}
                            <div
                                className={`relative bg-white border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${dragging
                                        ? "border-primary-400 bg-primary-50"
                                        : file
                                            ? "border-primary-300 bg-primary-50/40"
                                            : "border-neutral-200 hover:border-primary-300 hover:bg-neutral-50"
                                    }`}
                                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="pointer-events-none flex flex-col items-center gap-4">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${file ? "bg-primary-100" : "bg-neutral-100"
                                        }`}>
                                        {file
                                            ? <FileText size={28} className="text-primary-500" />
                                            : <Upload size={28} className="text-neutral-400" />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-[15px] font-extrabold text-neutral-900 mb-1">
                                            {file ? file.name : "Drag & drop your resume"}
                                        </p>
                                        <p className="text-[12px] text-neutral-400 font-medium">
                                            {file ? "PDF ready to analyze" : "PDF only · Max 5MB"}
                                        </p>
                                    </div>
                                    {file && (
                                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                                            <CheckCircle size={12} /> Ready
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                                    <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-[12px] text-red-600 font-semibold">{error}</p>
                                </div>
                            )}

                            {/* Analyze button */}
                            <button
                                onClick={handleUpload}
                                disabled={!file || loading}
                                className="w-full py-3.5 bg-neutral-900 text-white rounded-xl font-bold text-sm hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>Analyze Resume <ChevronRight size={16} /></>
                                )}
                            </button>

                            {/* Feature badges */}
                            <div className="grid grid-cols-3 gap-2 pt-2">
                                {["Keyword Match", "Skill Gaps", "ATS Score"].map((f) => (
                                    <div key={f} className="flex items-center gap-1.5 bg-white border border-neutral-100 rounded-xl px-3 py-2">
                                        <CheckCircle size={11} className="text-primary-400 shrink-0" />
                                        <span className="text-[10px] font-bold text-neutral-600">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Right: Tips cards ── */}
                        <div className="flex flex-col gap-3">
                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">
                                Tips to beat ATS
                            </p>
                            {TIPS.map(({ icon: Icon, title, desc }) => (
                                <div key={title} className="bg-white border border-neutral-100 rounded-2xl p-4 flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                                        <Icon size={15} className="text-primary-500" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-neutral-900 mb-0.5">{title}</p>
                                        <p className="text-[11px] text-neutral-400 leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                ) : (

                    /* ══════════════════════════════════════
                        ANALYSIS RESULTS
                    ══════════════════════════════════════ */
                    <div className="flex flex-col gap-4">

                        {/* Top bar */}
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                                Analysis results — {file?.name}
                            </p>
                            <button
                                onClick={reset}
                                className="flex items-center gap-1.5 text-[12px] font-bold text-neutral-500 hover:text-primary-500 transition-colors"
                            >
                                <RefreshCw size={13} /> Analyze another
                            </button>
                        </div>

                        {/* Score + headline row */}
                        <div className="grid grid-cols-3 gap-4">

                            {/* Score circle */}
                            <div
                                className="bg-white border border-neutral-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center"
                                style={{ borderTop: `3px solid ${ss.ring}` }}
                            >
                                <div
                                    className="w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center mb-3"
                                    style={{ borderColor: ss.ring, background: ss.bg }}
                                >
                                    <span className="text-2xl font-extrabold tracking-tight" style={{ color: ss.text }}>
                                        {score}
                                    </span>
                                    <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: ss.text }}>
                                        score
                                    </span>
                                </div>
                                <p className="text-[11px] font-bold text-neutral-500">{scoreLabel(score)}</p>
                            </div>

                            {/* Stats */}
                            <div className="bg-white border border-neutral-100 rounded-2xl p-6 flex flex-col justify-center">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Skills detected</p>
                                <p className="text-[2rem] font-extrabold text-neutral-900 tracking-tight leading-none mb-1">
                                    {skills.length}
                                </p>
                                <p className="text-[11px] text-neutral-400">keywords matched</p>
                            </div>

                            <div className="bg-white border border-neutral-100 rounded-2xl p-6 flex flex-col justify-center">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Gaps found</p>
                                <p
                                    className="text-[2rem] font-extrabold tracking-tight leading-none mb-1"
                                    style={{ color: missing.length > 0 ? "#f59e0b" : "#22c55e" }}
                                >
                                    {missing.length}
                                </p>
                                <p className="text-[11px] text-neutral-400">missing keywords</p>
                            </div>
                        </div>

                        {/* Feedback message */}
                        <div
                            className="bg-white border border-neutral-100 rounded-2xl p-5 flex items-start gap-4"
                            style={{ borderLeft: `3px solid ${ss.ring}` }}
                        >
                            <Sparkles size={18} className="text-primary-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[13px] font-bold text-neutral-900 mb-1">
                                    {score >= 75
                                        ? "Your resume is highly optimized for ATS."
                                        : score >= 50
                                            ? "Good foundation — a few improvements will boost your visibility."
                                            : "Your resume needs work — add the missing keywords below."}
                                </p>
                                <p className="text-[12px] text-neutral-400 leading-relaxed">
                                    {score >= 75
                                        ? "You have strong keyword coverage. Focus on tailoring this to each specific job posting."
                                        : score >= 50
                                            ? "Integrate the recommended keywords naturally into your experience and skills sections."
                                            : "Start by adding the missing keywords to your skills and experience sections, then re-analyze."}
                                </p>
                            </div>
                        </div>

                        {/* Skills + Missing grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Detected skills */}
                            <div className="bg-white border border-neutral-100 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle size={14} className="text-green-500" />
                                    <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                                        Detected skills ({skills.length})
                                    </p>
                                </div>
                                {skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((s) => (
                                            <span
                                                key={s}
                                                className="text-[11px] font-semibold px-3 py-1 rounded-full bg-green-50 text-green-700"
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[12px] text-neutral-400 text-center py-6">No skills detected.</p>
                                )}
                            </div>

                            {/* Missing keywords */}
                            <div className="bg-white border border-neutral-100 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <AlertCircle size={14} className="text-amber-500" />
                                    <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                                        Recommended additions ({missing.length})
                                    </p>
                                </div>
                                {missing.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {missing.map((k) => (
                                            <span
                                                key={k}
                                                className="text-[11px] font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700"
                                            >
                                                + {k}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[12px] text-neutral-400 text-center py-6">
                                        Great coverage — no major keywords missing!
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Tips row at bottom */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                            {TIPS.map(({ icon: Icon, title }) => (
                                <div key={title} className="bg-white border border-neutral-100 rounded-xl p-3 flex items-center gap-2">
                                    <Icon size={13} className="text-primary-400 shrink-0" />
                                    <p className="text-[11px] font-semibold text-neutral-600">{title}</p>
                                </div>
                            ))}
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}