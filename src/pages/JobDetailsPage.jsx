import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Building, Clock, Briefcase, Share2, ExternalLink } from "lucide-react";
import PageLayout from "../components/PageLayout";

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
                        onClick={() => navigate("/jobs")}
                        className="px-8 py-4 bg-primary-400 hover:bg-primary-500 text-white rounded-2xl font-bold shadow-sm transition-transform active:scale-95"
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
            <div className="relative pt-6 pb-12">
                <div className="relative z-10 animate-fade-in-down">
{/*Go Back to Jobs Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-900 mb-8 md:mb-12 transition-colors font-bold text-xs uppercase tracking-widest group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Jobs
                    </button>

                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
{/* All detaials of the job*/}
                        <div className="w-20 h-20 md:w-28 md:h-28 rounded-3xl bg-neutral-50/50 border border-[#b3eefb] flex items-center justify-center shrink-0">
                            <span className="text-[3rem] font-extrabold text-neutral-800 tracking-[-1.5px]">
                                {job.company.display_name.charAt(0)}
                            </span>
                        </div>

                        <div className="flex-1 mt-2">
                            <p className="text-xs font-bold text-primary-400 tracking-widest uppercase mb-3">
                                {job.company.display_name}
                            </p>
                            
                            <h1 className="text-[2.5rem] md:text-[3rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-neutral-900 mb-6">
                                {job.title}
                            </h1>

                            <div className="flex flex-wrap gap-y-4 gap-x-8">
                                <div className="flex items-center gap-2">
                                    <Building size={18} className="text-neutral-300" />
                                    {job.company.display_name}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} className="text-neutral-300" />
                                    {job.location.display_name}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={18} className="text-neutral-300" />
                                    {new Date(job.created).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Briefcase size={18} className="text-neutral-300" />
                                    {job.contract_time ? job.contract_time.replace('_', ' ') : 'Full Time'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 pt-12 border-t border-[#b3eefb]">

{/* LeftSide: Job Description */}
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-8 border-b border-[#b3eefb] pb-5">
                            About the Role
                        </h2>
                        <div
                            className="prose prose-lg prose-neutral max-w-none prose-p:mb-6 prose-strong:text-neutral-900 prose-strong:font-bold prose-ul:my-6 prose-li:my-2"
                            dangerouslySetInnerHTML={{ __html: job.description }}
                        />
                    </div>

{/* Rightside: Sidebar */}
                    <div className="space-y-8 md:sticky md:top-32">
                        <div>
                            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-6">
                                ROLE OVERVIEW
                            </h3>

                            <div className="space-y-4">
                                <div className="flex flex-col gap-1 pb-4 border-b border-[#b3eefb]">
                                    <p className="text-[12px] text-neutral-400 font-semibold uppercase tracking-[0.5px]">Base Salary</p>
                                    <p className="text-neutral-900 font-bold text-xl">
                                        {job.salary_min ? `£${job.salary_min.toLocaleString()}` : "Competitive"}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-1 pb-4 border-b border-[#b3eefb]">
                                    <p className="text-[12px] text-neutral-400 font-semibold uppercase tracking-[0.5px]">Job Type</p>
                                    <p className="text-neutral-900 font-bold text-xl capitalize">
                                        {job.contract_type || "Permanent"}
                                    </p>
                                </div>
                            </div>


{/* Button to share the job */}
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
                                className="w-full mt-8 py-4 border-2 border-[#b3eefb] rounded-2xl text-neutral-800 text-sm font-bold hover:bg-neutral-50 flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.98]"
                            >
{/* this button takes you to the source of the job
from where it is taken */}
                                <Share2 size={16} /> Share Opportunity
                            </button>
                            
                            <button
                                onClick={handleApply}
                                className="w-full mt-4 py-4 bg-primary-400 rounded-2xl text-white font-bold text-base shadow-[0_4px_20px_rgb(2,188,240,0.3)] hover:bg-primary-500 flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
                            >
                                Apply Externally <ExternalLink size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
