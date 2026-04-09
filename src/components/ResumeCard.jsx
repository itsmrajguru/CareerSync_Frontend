import {
    Upload, FileText, CheckCircle, XCircle,
    ChevronRight, Target, Zap, Shield, BarChart2
} from "lucide-react";

// content to display beside the upload Resume Functionlaity
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

export { TIPS };

export default function ResumeCard({
    file,
    dragging,
    loading,
    error,
    onFileChange,
    onDragOver,
    onDragLeave,
    onDrop,
    onUpload,
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/*here,the user uploads the resume :this is the
            the ui card with css
            actual logic lies in the resumePage , and parently it comes
            from backend resumeService*/}
            <div className="flex flex-col gap-4">
                <div
                    className={`relative bg-white border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${dragging
                            ? "border-primary-400 bg-primary-50"
                            : file
                                ? "border-primary-300 bg-primary-50/40"
                                : "border-[#b3eefb] hover:border-primary-300 hover:bg-neutral-50"
                        }`}
                    /* These functionalities worls when user tries to directly 
                    drops the resumes over the box */
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}>
                        
                    {/* Accept only the files with .pdf extension */}
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={onFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="pointer-events-none flex flex-col items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${file ? "bg-primary-100" : "bg-neutral-100"
                            }`}>
                            {file
                                ? <FileText size={28} className="text-black" />
                                : <Upload size={28} className="text-black" />
                            }
                        </div>
                        <div>
                            <p className="text-[15px] font-extrabold text-black mb-1">
                                {file ? file.name : "Drag & drop your resume"}
                            </p>
                            <p className="text-[12px] text-black font-medium">
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

                {/* Handling Error */}
                {error && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                        <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[12px] text-red-600 font-semibold">{error}</p>
                    </div>
                )}

                {/* Analyze resume button :This button will trigger the onUpload 
                functionality to analyze the resume */}
                <button
                    onClick={onUpload}
                    disabled={!file || loading}
                    className="btn-primary w-full py-3.5 text-sm"
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

                {/* Displaying the feature cards */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                    {["Keyword Match", "Skill Gaps", "ATS Score"].map((f) => (
                        <div key={f} className="flex items-center gap-1.5 bg-white border border-[#b3eefb] rounded-xl px-3 py-2">
                            <CheckCircle size={11} className="text-black shrink-0" />
                            <span className="text-[10px] font-bold text-black">{f}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* displaying the tips card in the right side */}
            <div className="flex flex-col gap-3">
                <p className="text-xs font-bold text-black uppercase tracking-widest mb-1">
                    Tips to beat ATS
                </p>
                {TIPS.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="cs-card p-4 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                            <Icon size={15} className="text-black" />
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-black mb-0.5">{title}</p>
                            <p className="text-[11px] text-black leading-relaxed">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}


