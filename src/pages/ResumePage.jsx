import { useState } from "react";
import { UploadCloud, FileText, Loader2, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import ResumeAnalysis from "../components/ResumeAnalysis";
import { uploadResume } from "../api";

export default function ResumePage() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
                setError("Please upload a valid PDF file.");
                setFile(null);
                setAnalysis(null);
                return;
            }
            setFile(selectedFile);
            setError("");
            setAnalysis(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError("");

        try {
            const data = await uploadResume(file);
            setAnalysis(data.analysis);
        } catch (err) {
            console.error(err);
            setError("Failed to parse resume. Please ensure it's a valid PDF.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-500 pb-20 font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-neutral-700">
                        ATS Resume <span className="text-primary-500">Checker</span>
                    </h1>
                    <p className="text-neutral-400 text-base max-w-2xl mx-auto leading-relaxed">
                        Upload your resume to evaluate your ATS score, discover missing skills, and receive actionable insights to boost your job application success rate.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-8 flex flex-col justify-center min-h-[400px]">
                            <input
                                type="file"
                                accept="application/pdf,.pdf"
                                onChange={handleFileChange}
                                id="resume-upload"
                                className="hidden"
                            />

                            <label
                                htmlFor="resume-upload"
                                className={`cursor-pointer flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-dashed transition-all duration-300 group
                                    ${file
                                        ? "border-primary-400 bg-primary-50/50"
                                        : "border-neutral-200 hover:border-primary-400 hover:bg-neutral-50"
                                    }`}
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
                                    ${file
                                        ? "bg-primary-100"
                                        : "bg-neutral-100 group-hover:scale-105"
                                    }`}>
                                    {file ? (
                                        <FileText size={28} className="text-primary-500" />
                                    ) : (
                                        <UploadCloud size={28} className="text-neutral-400 group-hover:text-primary-500" />
                                    )}
                                </div>

                                <div className="text-center space-y-1">
                                    <h3 className="text-base font-bold text-neutral-700">
                                        {file ? "Resume Selected" : "Upload Resume"}
                                    </h3>
                                    <p className="text-sm text-neutral-400">
                                        {file ? file.name : "Drag & drop or click to browse (PDF)"}
                                    </p>
                                </div>

                                {file && !analysis && (
                                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-200 mt-2">
                                        <CheckCircle2 size={14} className="text-green-600" /> Ready to analyze
                                    </div>
                                )}
                            </label>

                            {file && !analysis && (
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="w-full mt-6 bg-primary-500 text-white py-3.5 rounded-xl text-sm font-bold shadow-sm hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" /> Analyzing...
                                        </>
                                    ) : (
                                        "Run Smart Analysis"
                                    )}
                                </button>
                            )}

                            {error && (
                                <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2 flex flex-col h-full">
                        {!file && !analysis && (
                            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-12 flex flex-col items-center justify-center h-full min-h-[400px]">
                                <FileText size={48} className="text-neutral-200 mb-4" />
                                <p className="text-neutral-400 font-medium text-lg">Upload your resume to see the ATS analysis.</p>
                            </div>
                        )}

                        {file && !analysis && !uploading && (
                            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-12 flex flex-col items-center justify-center h-full min-h-[400px]">
                                <FileText size={48} className="text-primary-200 mb-4" />
                                <p className="text-neutral-500 font-medium text-lg">Click "Run Smart Analysis" to process your resume.</p>
                            </div>
                        )}

                        {file && uploading && (
                            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-12 flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
                                <Loader2 size={40} className="animate-spin text-primary-500" />
                                <p className="text-neutral-500 font-medium text-lg">Analyzing resume structure and extracting keywords...</p>
                            </div>
                        )}

                        {analysis && (
                            <div className="animate-fade-in-right h-full">
                                <ResumeAnalysis analysis={analysis} />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
