import { useState } from "react";
import Navbar from "../../components/Navbar";
import ResumeCard from "../../components/ResumeCard";
import ResumeAnalysis from "../../components/ResumeAnalysis";
import { uploadResume } from "../../services/studentProfileService";
import Footer from "../../components/Footer";

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
        <div className="min-h-screen bg-app-bg font-sans flex flex-col">
            <Navbar />

            <main className="max-w-[900px] mx-auto px-7 pt-10 pb-10 flex-1 w-full">

                {/* Resume Page Header */}
                <div className="mb-10">
                    <p className="text-xs font-bold tracking-[1px] text-black uppercase mb-3">
                        ATS Friendly
                    </p>
                    <h1 className="text-[2.5rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-black mb-3">
                        Resume <span style={{ color: "#ef4444" }}>Checker.</span>
                    </h1>
                    <p className="text-[1rem] leading-[1.7] text-black max-w-[520px]">
                        Upload your PDF resume and get instant ATS feedback — keyword match, skill gaps, and readability score.
                    </p>
                </div>

                {/* Here resumeCard and resume Analysis are toggled, in the basis of analysis 
        of analysis present then obviosuly displat analysis page , otherwise Resume Card Page */}
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

            </main>
            <Footer />
        </div>
    );
}


