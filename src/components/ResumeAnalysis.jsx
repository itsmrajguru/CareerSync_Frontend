
import { CheckCircle, AlertCircle, Sparkles } from "lucide-react";

export default function ResumeAnalysis({ analysis }) {
    if (!analysis) return null;

    const { score, skills_found, missing_keywords } = analysis;

    const getScoreColor = (s) => {
        if (s >= 75) return "text-green-400 border-green-500";
        if (s >= 50) return "text-yellow-400 border-yellow-500";
        return "text-red-400 border-red-500";
    };

    return (
        <div className="space-y-6 font-sans">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className={`relative w-32 h-32 rounded-full border-4 flex items-center justify-center bg-white shadow-sm ${getScoreColor(score)}`}>
                        <span className="text-4xl font-black tracking-tighter">{score}</span>
                        <span className="absolute -bottom-3 text-[10px] font-bold uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-500 shadow-sm">
                            ATS Score
                        </span>
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
                            Overview <Sparkles size={18} className="text-blue-500" />
                        </h3>
                        <p className="text-slate-600 max-w-md leading-relaxed font-medium">
                            {score >= 75 ? "Excellent! Your resume is optimized for ATS systems." :
                                score >= 50 ? "Good foundation, but adding more specific keywords could boost your visibility." :
                                    "Your resume might be missed by automated systems. Try adding the suggested skills below."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
                        <CheckCircle size={16} className="text-green-500" /> Detected Skills
                    </h4>
                    {skills_found && skills_found.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {skills_found.map((skill) => (
                                <span key={skill} className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs font-bold">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500 text-sm italic border border-dashed border-slate-200 rounded-xl bg-slate-50">
                            No technical skills detected yet.
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
                        <AlertCircle size={16} className="text-amber-500" /> Recommended Additions
                    </h4>
                    {missing_keywords && missing_keywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {missing_keywords.map((kw) => (
                                <span key={kw} className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                                    + {kw}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500 text-sm italic border border-dashed border-slate-200 rounded-xl bg-slate-50">
                            Great coverage! No major keywords missing.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
