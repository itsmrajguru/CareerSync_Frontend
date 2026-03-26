import {
    CheckCircle, AlertCircle, Sparkles, RefreshCw,
    Target, Zap, Shield, BarChart2
} from "lucide-react";



/* {Remainder}: We are going to replace regex with the GuruAI 
chatbot , that we will be implementing in the project 
for the anlysis of the resumes */


/* These are the tips , that we are showing at the botom of the analysis
of the page */
const TIPS = [
    { icon: Target, title: "Use job-specific keywords" },
    { icon: Zap, title: "Quantify your impact" },
    { icon: Shield, title: "Keep formatting clean" },
    { icon: BarChart2, title: "One page for < 5 years exp" },
];
/* So majaorly we are showing only 3 features like
1)Resume Score 
2)Skills Extracted
3)Gaps detected */

/* The Resume Color Measure :This function defines the color
of the ring,text based on the resume score*/
function scoreStyle(s) {
    if (s >= 75) return { ring: "#22c55e", bg: "#f0fdf4", text: "#15803d" };
    if (s >= 50) return { ring: "#f59e0b", bg: "#fffbeb", text: "#b45309" };
    return { ring: "#ef4444", bg: "#fef2f2", text: "#b91c1c" };
}

/*Resume Score display :This displayes text based on the scores...*/
function scoreLabel(s) {
    if (s >= 75) return "Excellent — ATS ready";
    if (s >= 50) return "Good — needs improvement";
    return "Weak — major gaps found";
}

export default function ResumeAnalysis({ analysis, fileName, onReset }) {
    /* Basicaly we are taking the resume Analysis from backend
    and displaying it here */
    if (!analysis) return null;

    const skills = analysis?.skills_found || [];
    const missing = analysis?.missing_keywords || [];
    const score = analysis?.score ?? 0;
    const ss = scoreStyle(score);

    return (
        <div className="flex flex-col gap-4">

            {/*Resume Analysis Header*/}
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    Analysis results — {fileName}
                </p>
                <button
                    onClick={onReset}
                    className="flex items-center gap-1.5 text-[12px] font-bold text-neutral-500 hover:text-primary-500 transition-colors"
                >
                    <RefreshCw size={13} /> Analyze another
                </button>
            </div>

            {/* Score Row*/}
            <div className="grid grid-cols-3 gap-4">

                {/* Score circle */}
                <div
                    className="bg-white border border-[#b3eefb] rounded-2xl p-6 flex flex-col items-center justify-center text-center"
                    style={{ borderTop: `3px solid ${ss.ring}` }}>
                    {/* Displaying the score ring  */}
                    <div
                        className="w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center mb-3"
                        style={{ borderColor: ss.ring, background: ss.bg }}>
                        <span className="text-2xl font-extrabold tracking-tight" style={{ color: ss.text }}>
                            {score}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: ss.text }}>
                            score
                        </span>
                    </div>
                    {/* displaying the scoreLabel */}
                    <p className="text-[11px] font-bold text-neutral-500">{scoreLabel(score)}</p>
                </div>

                {/*displyas the extracted skills from resume:
                its actually too simple, becuase whole logic is being written
                in the backedn, we are just calling and displaying it here.... */}

                <div className="bg-white border border-[#b3eefb] rounded-2xl p-6 flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Skills detected</p>
                    <p className="text-[2rem] font-extrabold text-neutral-900 tracking-tight leading-none mb-1">
                        {skills.length}
                    </p>
                    <p className="text-[11px] text-neutral-400">keywords matched</p>
                </div>

                {/* Dispalying the  number of missing keywords */}
                <div className="bg-white border border-[#b3eefb] rounded-2xl p-6 flex flex-col justify-center">
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

            {/* Feedback message shown exactly below the resume score
            and above the matched skills sections */}
            <div
                className="bg-white border border-[#b3eefb] rounded-2xl p-5 flex items-start gap-4"
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
                <div className="bg-white border border-[#b3eefb] rounded-2xl p-6">
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

                {/* Displaying actual Missing keywords */}
                <div className="bg-white border border-[#b3eefb] rounded-2xl p-6">
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
                                    className="text-[11px] font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700">
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
                    <div key={title} className="bg-white border border-[#b3eefb] rounded-xl p-3 flex items-center gap-2">
                        <Icon size={13} className="text-primary-400 shrink-0" />
                        <p className="text-[11px] font-semibold text-neutral-600">{title}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}
