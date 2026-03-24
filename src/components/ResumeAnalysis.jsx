import { CheckCircle, AlertCircle, Sparkles } from "lucide-react";

export default function ResumeAnalysis({ analysis }) {


/* We are just displaying the result of the lexer analysis here... */
    if (!analysis) return null;

    const { score, skills_found, missing_keywords } = analysis;

    const getScoreColor = (s) => {
        if (s >= 75) return "text-green-500 border-green-500 bg-green-50";
        if (s >= 50) return "text-yellow-500 border-yellow-500 bg-yellow-50";
        return "text-red-500 border-red-500 bg-red-50";
    };

    return (
        <div className="space-y-8 font-sans animate-fade-in-up">
            <div className="bg-white border border-neutral-100 p-8 md:p-12 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className={`relative w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center shadow-sm ${getScoreColor(score)}`}>
                        <span className="text-display-lg tracking-tighter leading-none">{score}</span>
                        <span className="text-xs font-bold uppercase tracking-widest mt-1">
                            Score
                        </span>
                    </div>

                    <div className="text-center md:text-left space-y-4">
                        <h3 className="text-3xl font-bold text-neutral-900 flex items-center justify-center md:justify-start gap-3">
                            Analysis Complete <Sparkles size={24} className="text-primary-400" />
                        </h3>
                        <p className="max-w-lg leading-relaxed">
                            {score >= 75 ? "Excellent! Your resume is highly optimized for current ATS algorithms." :
                                score >= 50 ? "Good foundation, but integrating additional specific keywords will boost visibility." :
                                    "Your resume is currently underoptimized. Incorporate the suggested skills below."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white border border-neutral-100 p-8 md:p-10">
                    <h4 className="flex items-center gap-3 text-sm font-bold text-neutral-900 uppercase tracking-widest mb-8 border-b border-neutral-100 pb-5">
                        <CheckCircle size={20} className="text-green-500" /> Detected Skills
                    </h4>
                    {skills_found && skills_found.length > 0 ? (
                        <div className="flex flex-wrap gap-2.5">
                            {skills_found.map((skill) => (
                                <span key={skill} className="px-4 py-2 border border-neutral-200 font-bold">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 font-bold border border-dashed border-neutral-200 text-center">
                            No technical skills detected yet.
                        </div>
                    )}
                </div>

                <div className="bg-white border border-neutral-100 p-8 md:p-10">
                    <h4 className="flex items-center gap-3 text-sm font-bold text-neutral-900 uppercase tracking-widest mb-8 border-b border-neutral-100 pb-5">
                        <AlertCircle size={20} className="text-amber-500" /> Recommended Additions
                    </h4>
                    {missing_keywords && missing_keywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2.5">
                            {missing_keywords.map((kw) => (
                                <span key={kw} className="px-4 py-2 bg-neutral-900 text-white font-bold">
                                    + {kw}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 font-bold border border-dashed border-neutral-200 text-center">
                            Great coverage! No major keywords missing.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
