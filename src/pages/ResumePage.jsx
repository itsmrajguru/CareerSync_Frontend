import { useState } from "react";
import { Upload, FileText, CheckCircle, ChevronRight, XCircle } from "lucide-react";
import PageLayout from "../components/PageLayout";
import ResumeAnalysis from "../components/ResumeAnalysis";
import { uploadResume } from "../api";


//call the lexer analysis for the resume uploaded by the user
export default function ResumePage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError("");
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a valid PDF or DOCX file first.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const responseData = await uploadResume(file);
// Handling both plain response mapping or nested analysis payloads.
            setAnalysis(responseData.analysis || responseData);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || "Something went wrong comparing your resume. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout>
            <div className="relative z-10 animate-fade-in-up">
{/* Hero Section */}
                <div className="mb-16 md:mb-24">
                    <h1 className="text-[3rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-neutral-900 mb-6">
                        Resume <span className="text-primary-400">Checker.</span>
                    </h1>
                    <p className="max-w-2xl">
                        Upload your resume to see how it performs against current Applicant Tracking Systems (ATS). Get instant feedback on keywords and impact.
                    </p>
                </div>

{/* After analysis , we will show the card displaying the result */}
                {!analysis ? (
                    <div className="max-w-3xl animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                        <div className="bg-white border-2 border-dashed border-neutral-200 rounded-3xl p-10 md:p-16 text-center hover:border-primary-300 hover:bg-primary-50/30 transition-all group relative">
                            
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                title="Click to upload resume"
                            />

                            <div className="flex flex-col items-center justify-center space-y-6 pointer-events-none relative z-0">
                                <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-transform shadow-sm">
                                    {file ? <FileText size={32} className="text-primary-400" /> : <Upload size={32} className="text-neutral-400 group-hover:text-primary-400" />}
                                </div>
                                
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2">
                                        {file ? file.name : "Drag & drop your resume"}
                                    </h3>
                                    <p className="text-neutral-500 font-medium">
                                        {file ? "Ready to analyze" : "Supports PDF, DOC, DOCX (Max 5MB)"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4">
                                <XCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                                <p className="text-red-700 font-bold text-sm leading-relaxed">{error}</p>
                            </div>
                        )}

                        <div className="mt-12">
                            <button
                                onClick={handleUpload}
                                disabled={!file || loading}
                                className="w-full md:w-auto px-10 py-5 bg-neutral-900 text-white rounded-2xl font-bold text-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Analyzing Engine...
                                    </>
                                ) : (
                                    <>
                                        Analyze Resume <ChevronRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Feature mini list */}
                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-neutral-100">
                            {[
                                "Extensive Keyword Matching",
                                "Readability Scoring",
                                "Format Validation"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle size={18} className="text-primary-400" />
                                    <span className="text-sm font-bold text-neutral-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl">
                        <div className="flex justify-between items-center mb-10 pb-6 border-b border-neutral-100">
                            <h2 className="text-2xl font-bold text-neutral-900">Analysis Results</h2>
                            <button
                                onClick={() => {
                                    setAnalysis(null);
                                    setFile(null);
                                }}
                                className="text-sm font-bold text-neutral-500 hover:text-primary-500 transition-colors"
                            >
                                Analyze Another Resume
                            </button>
                        </div>
                        <ResumeAnalysis analysis={analysis} />
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
