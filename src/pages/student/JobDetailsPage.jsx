import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Building, Clock, Briefcase, Share2, CheckCircle } from "lucide-react";
import PageLayout from "../../components/PageLayout";
import { getJobById } from "../../services/jobsService";

export default function JobDetailsPage() {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [job, setJob] = useState(state?.job || null);
    const [loading, setLoading] = useState(!state?.job);

    useEffect(() => {
        if (!job && id) {
            fetchJob();
        }
    }, [id]);

    const fetchJob = async () => {
        try {
            const response = await getJobById(id);
            setJob(response.data.job);
        } catch (error) {
            console.error("Error fetching job:", error);
        } finally {
            setLoading(false);
        }
    };

    /* This page opens a window sized popup to show the job
    description of an indivisual job  */
    if (loading) {
        return (
            <PageLayout>
                <div className="py-20 text-center animate-pulse">
                    <div className="w-20 h-20 bg-neutral-100 rounded-2xl mx-auto mb-6" />
                    <div className="h-8 bg-neutral-100 w-64 mx-auto rounded-lg mb-4" />
                    <div className="h-4 bg-neutral-100 w-96 mx-auto rounded-lg" />
                </div>
            </PageLayout>
        );
    }

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
        // Redirect to application page or open modal
        navigate(`/student/apply/${job._id}`, { state: { job } });
    };

    return (
        <PageLayout>

            {/* This page includes the data that we are showing 
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
                            border: "1px solid #f1f5f9",
                            overflow: "hidden"
                        }}>
                            {job.company?.logo ? (
                                <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                            ) : (
                                <span style={{ fontSize: 36, fontStyle: "normal", fontWeight: "800", color: "#fff", letterSpacing: -2 }}>
                                    {job.company?.name?.charAt(0) || "J"}
                                </span>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} className="pulse-dot" />
                                <span className="text-[13px] font-bold tracking-[0.5px] text-[#475569] uppercase">
                                    {job.company?.name || "Confidential"}
                                </span>
                            </div>

                            <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-5">
                                {job.title}
                            </h1>

                            <div className="flex flex-wrap gap-x-8 gap-y-3">
                                {[
                                    { icon: <Building size={16} />, label: job.company?.name || "Confidential" },
                                    { icon: <MapPin size={16} />, label: job.location },
                                    { icon: <Clock size={16} />, label: new Date(job.createdAt).toLocaleDateString() },
                                    { icon: <Briefcase size={16} />, label: job.jobType ? job.jobType.replace('-', ' ') : 'Full Time' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[14px] leading-[1.6] text-[#64748b] font-medium">
                                        <div style={{ color: "#94a3b8" }}>{item.icon}</div>
                                        <span className="capitalize">{item.label}</span>
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

                        {job.requirements && (
                            <div className="mt-12">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-[#0f172a] tracking-tight mb-2">
                                        Requirements
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
                                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Rightside: Sidebar Summary */}
                    <div className="space-y-12 md:sticky md:top-32">
                        <div style={{ background: "#fafafa", padding: "32px", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
                            <h3 className="text-[10px] font-bold text-[#94a3b8] mb-8 uppercase tracking-wider">
                                ROLE OVERVIEW
                            </h3>

                            <div className="space-y-6">
                                <div className="flex flex-col gap-1 pb-5" style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Salary Range</p>
                                    <p className="text-xl font-bold text-[#0f172a]">
                                        {job.salary ? `$${job.salary.toLocaleString()}` : "Competitive"}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-1 pb-5" style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Job Type</p>
                                    <p className="text-xl font-bold text-[#0f172a] capitalize">
                                        {job.jobType ? job.jobType.replace('-', ' ') : "Full Time"}
                                    </p>
                                </div>

                                {job.skills && job.skills.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Skills Wanted</p>
                                        <div className="flex flex-wrap gap-2">
                                            {job.skills.map((skill, index) => (
                                                <span key={index} className="px-3 py-1 bg-neutral-100 text-[#0f172a] text-[11px] font-bold rounded-full uppercase tracking-wider">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
                                <button
                                    onClick={() => {
                                        const url = window.location.href;
                                        if (navigator.share) {
                                            navigator.share({
                                                title: job.title,
                                                text: `Check out this ${job.title} role at ${job.company?.name}`,
                                                url
                                            }).catch(console.error);
                                        } else {
                                            navigator.clipboard.writeText(url);
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
                                    Apply Directly <CheckCircle size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
