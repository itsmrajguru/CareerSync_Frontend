import { useState } from "react";
import PageLayout from "../../components/PageLayout";
import ResumeCard from "../../components/ResumeCard";
import ResumeAnalysis from "../../components/ResumeAnalysis";
import { uploadResume } from "../../services/studentProfileService";

export default function ResumePage() {
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        // extracting file from e.target
        const f = e.target.files?.[0];

        // If no file , return
        if (!f) return;

        /* If file exists, check its type
       does it ends with the .pdf */
        if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
            setError("Please upload a valid PDF file.");
            setFile(null);
            return;
        }
        setFile(f);
        setError("");
        setAnalysis(null);
    };
    /*if the user drops the pdf directly, then the file
    is sent to the handleFileChange function */

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFileChange({ target: { files: [f] } });
    };


    //finally send the file to the resumeService
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

    return (
        <PageLayout>
            <div className="pb-20 animate-fade-in">
                {/*Hero section*/}
                <section aria-label="Page header" className="mb-8 p-0 pt-4">
                    <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px]">
 
                        {/* Left Column: Text & Actions */}
                        <div style={{ flex: 1 }}>
                            <div className="mb-8">
                                <p className="cs-section-label">
                                    ATS Friendly
                                </p>
                                <h1 className="cs-page-title">
                                    Resume <span className="text-[#ef4444]">Checker.</span>
                                </h1>
                                <p className="cs-subtext max-w-[460px]">
                                    Upload your PDF resume and get instant ATS feedback — keyword match, skill gaps, and readability score.
                                </p>
                            </div>
 
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>
                                <span className="flex items-center gap-1">✔ ATS Optimization</span>
                                <span style={{ opacity: 0.3 }}>·</span>
                                <span className="flex items-center gap-1">✔ Skill Gap Analysis</span>
                                <span style={{ opacity: 0.3 }}>·</span>
                                <span className="flex items-center gap-1">✔ PDF Support</span>
                            </div>
                        </div>
 
                        {/* Right Column: Fixed-Position Image — Platform Standard */}
                        <div className="hidden lg:block animate-fade-in" style={{ flexShrink: 0, width: "360px" }}>
                            <div className="rounded-xl overflow-hidden border border-neutral-200 shadow-sm">
                                <img
                                    src="https://images.unsplash.com/photo-1586282023692-6bfbd629e85d?w=800&q=80&auto=format&fit=crop"
                                    alt="Resume Analysis"
                                    style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
                                />
                            </div>
                        </div>
                    </div>
                </section>
 
                {/* Here resumeCard and resume Analysis are toggled... */}
                {!analysis ? (
                    <ResumeCard
                        file={file}
                        dragging={dragging}
                        loading={loading}
                        error={error}
                        onFileChange={handleFileChange}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onUpload={handleUpload}
                    />
                ) : (
                    <ResumeAnalysis
                        analysis={analysis}
                        fileName={file?.name}
                        onReset={reset}
                    />
                )}
            </div>
        </PageLayout>
    );
}
