import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Building, Clock, Briefcase, Share2, ExternalLink } from "lucide-react";
import PageLayout from "../../components/PageLayout";

export default function JobDetailsPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const job = state?.job;

    /* This page opens a window sized popup to show the job
    description of an indivisual job  */
    if (!job) {
        return (
            <PageLayout>
                <div className="py-20 text-center">
                    <h2 className="text-2xl font-bold mb-4">Job details not found</h2>
                    <button
                        onClick={() => navigate("/student/jobs")}
                        className="btn-primary px-8 py-4"
                    >
                        Back to Jobs
                    </button>
                </div>
            </PageLayout>
        );
    }

    const handleApply = () => {
        window.open(job.redirect_url, "_blank");
    };

    return (
        <PageLayout>

            {/* This page inicludes the data that we are showing 
inside the job card */}
            <div className="relative pt-8 pb-12">
                <div className="relative z-10 fade-up">
                    {/* Back Navigation */}
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#0f172a] mb-10 transition-all font-bold text-[13px] uppercase tracking-[0.5px] group"
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Jobs
                    </button>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                        {/* Company Visual Branding */}
                        <div style={{
                            width: 90, height: 90, borderRadius: "24px",
                            background: "#0f172a",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
                            border: "1px solid #f1f5f9"
                        }}>
                            <span style={{ fontSize: 36, fontStyle: "normal", fontWeight: "800", color: "#fff", letterSpacing: -2 }}>
                                {job.company.display_name.charAt(0)}
                            </span>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} className="pulse-dot" />
                                <span className="text-[13px] font-bold tracking-[0.5px] text-[#475569] uppercase">
                                    {job.company.display_name}
                                </span>
                            </div>

                            <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-5">
                                {job.title}
                            </h1>

                            <div className="flex flex-wrap gap-x-8 gap-y-3">
                                {[
                                    { icon: <Building size={16} />, label: job.company.display_name },
                                    { icon: <MapPin size={16} />, label: job.location.display_name },
                                    { icon: <Clock size={16} />, label: new Date(job.created).toLocaleDateString() },
                                    { icon: <Briefcase size={16} />, label: job.contract_time ? job.contract_time.replace('_', ' ') : 'Full Time' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[14px] leading-[1.6] text-[#64748b] font-medium">
                                        <div style={{ color: "#94a3b8" }}>{item.icon}</div>
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 fade-up" style={{ animationDelay: '150ms' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-12" style={{ borderTop: "2px solid #f1f5f9" }}>

                    {/* LeftSide: Job Description */}
                    <div className="md:col-span-2">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-[#0f172a] tracking-tight mb-2">
                                About the Role
                            </h2>
                            <div style={{ width: 32, height: 3, background: "#ef4444", borderRadius: 2 }} />
                        </div>

                        <div
                            className="prose prose-lg prose-neutral max-w-none"
                            style={{
                                fontSize: "14px",
                                lineHeight: "1.6",
                                color: "#64748b",
                                fontWeight: "500"
                            }}
                            dangerouslySetInnerHTML={{ __html: job.description }}
                        />
                    </div>

                    {/* Rightside: Sidebar Summary */}
                    <div className="space-y-12 md:sticky md:top-32">
                        <div style={{ background: "#fafafa", padding: "32px", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
                            <h3 className="text-[10px] font-bold text-[#94a3b8] mb-8 uppercase tracking-wider">
                                ROLE OVERVIEW
                            </h3>

                            <div className="space-y-6">
                                <div className="flex flex-col gap-1 pb-5" style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Base Salary</p>
                                    <p className="text-xl font-bold text-[#0f172a]">
                                        {job.salary_min ? `£${job.salary_min.toLocaleString()}` : "Competitive"}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-1 pb-5" style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Job Type</p>
                                    <p className="text-xl font-bold text-[#0f172a] capitalize">
                                        {job.contract_type || "Permanent"}
                                    </p>
                                </div>
                            </div>

                            <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
                                <button
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: job.title,
                                                text: `Check out this ${job.title} role at ${job.company.display_name}`,
                                                url: job.redirect_url
                                            }).catch(console.error);
                                        } else {
                                            navigator.clipboard.writeText(job.redirect_url);
                                            alert("Link copied to clipboard!");
                                        }
                                    }}
                                    className="btn-outline !px-10 !py-3.5 !text-xs !font-bold"
                                >
                                    <Share2 size={15} /> Share Opportunity
                                </button>

                                <button
                                    onClick={handleApply}
                                    className="btn-primary !px-10 !py-3.5 !text-xs !shadow-xl !shadow-primary-400/20"
                                >
                                    Apply Externally <ExternalLink size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}


