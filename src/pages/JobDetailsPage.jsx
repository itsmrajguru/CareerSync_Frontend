import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Building, Clock, Briefcase, Share2, Linkedin, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";

export default function JobDetailsPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    // Handle direct URL access without history state
    const job = state?.job;

    if (!job) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center font-sans">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Job details not found</h2>
                    <button
                        onClick={() => navigate("/jobs")}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-sm"
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
        <div className="min-h-screen bg-slate-50 text-slate-600 pb-24 font-sans">
            <Navbar />

            <div className="relative pt-8 pb-12 px-6">
                <div className="max-w-5xl mx-auto relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors font-medium text-sm group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Jobs
                    </button>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-10 relative overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                <span className="text-2xl font-bold text-slate-700">
                                    {job.company.display_name.charAt(0)}
                                </span>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                                    {job.title}
                                </h1>

                                <div className="flex flex-wrap gap-y-2 gap-x-6 text-slate-500 text-sm mb-2 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Building size={16} className="text-slate-400" />
                                        {job.company.display_name}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={16} className="text-slate-400" />
                                        {job.location.display_name}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={16} className="text-slate-400" />
                                        {new Date(job.created).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Briefcase size={16} className="text-slate-400" />
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
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                                About the Role
                            </h2>
                            <div
                                className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: job.description }}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                                Overview
                            </h3>

                            <div className="space-y-3">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1 font-medium">Salary</p>
                                    <p className="text-slate-900 font-bold">
                                        {job.salary_min ? `£${job.salary_min}` : "Competitive"}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1 font-medium">Job Type</p>
                                    <p className="text-slate-900 font-bold capitalize">
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
                                className="w-full mt-6 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold hover:bg-slate-50 flex items-center justify-center gap-2 transition-all shadow-sm"
                            >
                                <Share2 size={16} /> Share Job
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-4 z-50 shadow-lg">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="hidden sm:block">
                        <h3 className="text-slate-900 font-bold">{job.title}</h3>
                        <p className="text-slate-500 text-xs font-medium">{job.company.display_name}</p>
                    </div>

                    <div className="flex w-full sm:w-auto gap-3">
                        <button
                            onClick={handleApply}
                            className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 rounded-xl text-white font-bold text-sm shadow-sm hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors"
                        >
                            Apply at {job.company.display_name} <ExternalLink size={16} />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
