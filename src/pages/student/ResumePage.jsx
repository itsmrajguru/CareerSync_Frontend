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
                {/*Hero section*/}
                <section className="d-hero mb-8">
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "60px" }}>
 
                        {/* Left Column: Text & Actions */}
                        <div style={{ flex: 1 }}>
                            <div className="mb-17">
                                <p className="text-[13px] font-bold tracking-[0.5px] text-[#475569] uppercase mb-2">
                                    ATS Friendly
                                </p>
                                <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-5">
                                    Resume <span style={{ color: "#ef4444" }}>Checker.</span>
                                </h1>
                                <p className="text-[14px] leading-[1.6] text-[#64748b] font-medium max-w-[460px]">
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
                        <div className="hidden lg:block slide-in" style={{ flexShrink: 0, width: "360px" }}>
                            <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9" }}>
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
        </PageLayout>
    );
}


