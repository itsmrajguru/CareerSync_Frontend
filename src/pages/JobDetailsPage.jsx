import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Building, Clock, Briefcase, Share2, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";

export default function JobDetailsPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const job = state?.job;

    if (!job) {
        return (
            <div className="min-h-screen bg-neutral-50 text-neutral-700 flex items-center justify-center font-sans">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Job details not found</h2>
                    <button
                        onClick={() => navigate("/jobs")}
                        className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-colors shadow-sm"
                    >
                        Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    const handleApply = () => {
        window.open(job.redirect_url, "_blank");
    };

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-500 pb-24 font-sans">
            <Navbar />

            <div className="relative pt-8 pb-12 px-6">
                <div className="max-w-5xl mx-auto relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-neutral-400 hover:text-neutral-700 mb-6 transition-colors font-medium text-sm group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Jobs
                    </button>

                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 md:p-10 relative overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-16 h-16 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0">
                                <span className="text-2xl font-bold text-neutral-600">
                                    {job.company.display_name.charAt(0)}
                                </span>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-neutral-700 mb-3 tracking-tight">
                                    {job.title}
                                </h1>

                                <div className="flex flex-wrap gap-y-2 gap-x-6 text-neutral-400 text-sm mb-2 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Building size={16} className="text-neutral-400" />
                                        {job.company.display_name}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={16} className="text-neutral-400" />
                                        {job.location.display_name}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={16} className="text-neutral-400" />
                                        {new Date(job.created).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Briefcase size={16} className="text-neutral-400" />
                                        {job.contract_time ? job.contract_time.replace('_', ' ') : 'Full Time'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
                            <h2 className="text-xl font-bold text-neutral-700 mb-6 border-b border-neutral-200 pb-4">
                                About the Role
                            </h2>
                            <div
                                className="prose prose-neutral prose-sm max-w-none text-neutral-500 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: job.description }}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm sticky top-24">
                            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">
                                Overview
                            </h3>

                            <div className="space-y-3">
                                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                                    <p className="text-xs text-neutral-400 mb-1 font-medium">Salary</p>
                                    <p className="text-neutral-700 font-bold">
                                        {job.salary_min ? `£${job.salary_min}` : "Competitive"}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                                    <p className="text-xs text-neutral-400 mb-1 font-medium">Job Type</p>
                                    <p className="text-neutral-700 font-bold capitalize">
                                        {job.contract_type || "Permanent"}
                                    </p>
                                </div>
                            </div>

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
                                className="w-full mt-6 py-2.5 border border-neutral-200 rounded-xl text-neutral-600 text-sm font-semibold hover:bg-neutral-50 flex items-center justify-center gap-2 transition-all shadow-sm"
                            >
                                <Share2 size={16} /> Share Job
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Apply Bar */}
            <div className="fixed bottom-0 inset-x-0 bg-white border-t border-neutral-200 p-4 z-50 shadow-lg">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="hidden sm:block">
                        <h3 className="text-neutral-700 font-bold">{job.title}</h3>
                        <p className="text-neutral-400 text-xs font-medium">{job.company.display_name}</p>
                    </div>

                    <div className="flex w-full sm:w-auto gap-3">
                        <button
                            onClick={handleApply}
                            className="flex-1 sm:flex-none px-8 py-3 bg-primary-500 rounded-xl text-white font-bold text-sm shadow-sm hover:bg-primary-600 flex items-center justify-center gap-2 transition-colors"
                        >
                            Apply at {job.company.display_name} <ExternalLink size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
