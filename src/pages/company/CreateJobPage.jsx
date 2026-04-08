import { useState } from "react";
import { createJob } from "../../services/jobsService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Plus, MapPin, Code, DollarSign, Calendar, ArrowLeft } from "lucide-react";

//employment type options shown in the select
const JOB_TYPES = ["full-time", "part-time", "internship", "contract", "freelance"];

export default function CreateJobPage() {
  const [formData, setFormData] = useState({
    title: "", description: "", requirements: "",
    jobType: "full-time", location: "", skills: "",
    salaryMin: "", salaryMax: "", deadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      //convert comma-separated skills string into a clean array
      const skillsArray = formData.skills.split(",").map(s => s.trim()).filter(Boolean);
      const payload = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        jobType: formData.jobType,
        location: formData.location,
        skills: skillsArray,
        salary: {
          min: Number(formData.salaryMin) || 0,
          max: Number(formData.salaryMax) || 0,
          currency: "INR",
          isVisible: true,
        },
        deadline: formData.deadline || undefined,
      };
      const res = await createJob(payload);
      if (res.success) navigate("/company/jobs");
      else setError(res.message || "Failed to create job posting.");
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Something went wrong.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px);} to { opacity:1; transform:translateY(0);} }
        .d-hero    { animation: fadeUp .5s ease both; }
        .d-content { animation: fadeUp .5s .15s ease both; }
      `}</style>

      <div className="min-h-screen bg-[#f0fbfe] font-sans flex flex-col">
        <Navbar />
        <main className="max-w-[900px] mx-auto px-7 pt-10 pb-10 flex-1 w-full">

          {/*Hero Section*/}
          <div className="d-hero mb-10">
            <button onClick={() => navigate("/company/jobs")}
              className="flex items-center gap-2 text-[12px] font-bold text-neutral-400 hover:text-primary-400 transition-colors mb-6">
              <ArrowLeft size={14} /> Back to jobs
            </button>
            <p className="text-xs font-bold tracking-[1px] text-neutral-400 uppercase mb-3">
              New Posting
            </p>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-neutral-900 mb-3">
              Post a new<br />
              <span className="text-primary-400">job opening.</span>
            </h1>
            <p className="text-base text-neutral-500 max-w-[480px] leading-relaxed font-medium">
              Fill in the details below. A clear, detailed description gets you significantly
              more qualified applicants.
            </p>
          </div>

          {/*Error Display*/}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-[14px] p-4 mb-6 text-red-600 font-bold text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="d-content flex flex-col gap-4">

            {/* SECTION: Essential Info */}
            <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px] mb-5">Job Details</p>
              <div className="flex flex-col gap-5">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px]">Job Title *</label>
                  <input required type="text" name="title" value={formData.title} onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                    placeholder="e.g. Lead Software Engineer" />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px]">Job Description *</label>
                  <textarea required rows={7} name="description" value={formData.description} onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all resize-none"
                    placeholder="Describe the role, responsibilities, team environment, and what success looks like in this position..." />
                </div>

                {/* Requirements */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px]">Requirements</label>
                  <textarea rows={4} name="requirements" value={formData.requirements} onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all resize-none"
                    placeholder="Qualifications, experience level, must-have skills..." />
                </div>
              </div>
            </div>

            {/* SECTION: Meta */}
            <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px] mb-5">Position Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px] flex items-center gap-1.5">
                    <MapPin size={11} className="text-primary-400" /> Location *
                  </label>
                  <input required type="text" name="location" value={formData.location} onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                    placeholder="Mumbai, India or Remote" />
                </div>

                {/* Job Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px]">Employment Type</label>
                  <select name="jobType" value={formData.jobType} onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all cursor-pointer capitalize">
                    {JOB_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>

                {/* Skills */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px] flex items-center gap-1.5">
                    <Code size={11} className="text-primary-400" /> Required Skills
                  </label>
                  <input type="text" name="skills" value={formData.skills} onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                    placeholder="React, Node.js, PostgreSQL, Docker..." />
                  <p className="text-[11px] text-neutral-400 font-medium ml-1">Comma-separated list of skills</p>
                </div>

                {/* Salary Min */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px] flex items-center gap-1.5">
                    <DollarSign size={11} className="text-primary-400" /> Min Salary (INR / yr)
                  </label>
                  <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                    placeholder="e.g. 600000" />
                </div>

                {/* Salary Max */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px]">Max Salary (INR / yr)</label>
                  <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                    placeholder="e.g. 1200000" />
                </div>

                {/* Deadline */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px] flex items-center gap-1.5">
                    <Calendar size={11} className="text-primary-400" /> Application Deadline
                    <span className="text-neutral-300 font-medium normal-case tracking-normal">(optional)</span>
                  </label>
                  <input type="date" name="deadline" value={formData.deadline} onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full sm:w-64 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-primary-400 text-white font-bold text-sm rounded-xl hover:bg-primary-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                <Plus size={16} /> {loading ? "Publishing..." : "Publish Job"}
              </button>
              <button type="button" onClick={() => navigate("/company/jobs")}
                className="px-6 py-3 bg-neutral-50 border border-neutral-200 text-neutral-600 font-bold text-sm rounded-xl hover:bg-neutral-100 transition-colors">
                Discard Draft
              </button>
            </div>

          </form>
        </main>
        <Footer />
      </div>
    </>
  );
}
