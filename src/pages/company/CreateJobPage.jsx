import { useState } from "react";
import { createJob } from "../../services/jobsService";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { Plus, MapPin, Code, DollarSign, Calendar } from "lucide-react";

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
    <PageLayout>
      <div className="pb-10 animate-fade-in">

        {/*added the herosection with matches the
            existing styles effectively*/}
        <section aria-label="Page header" className="mb-8 p-0 pt-4">
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px]">

            {/* Left Column: Text & Actions */}
            <div style={{ flex: 1 }}>

              <div className="mb-7">
                <p className="cs-section-label">
                  New Posting
                </p>
                <h1 className="cs-page-title">
                  Post a new<br />
                  <span className="text-[#ef4444]">job opening.</span>
                </h1>
                <p className="cs-subtext max-w-[460px]">
                  Fill in the details below. A clear, detailed description gets you significantly more qualified applicants.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>
                <span className="flex items-center gap-1">✔ High Visibility</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span className="flex items-center gap-1">✔ Precision Matching</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span className="flex items-center gap-1">✔ Talent Connection</span>
              </div>
            </div>

            {/* Right Column: High-Fidelity Image */}
            <div className="hidden lg:block animate-fade-in" style={{ flexShrink: 0, width: "360px" }}>
              <div className="rounded-xl overflow-hidden border border-neutral-200 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80&auto=format&fit=crop"
                  alt="Post Job"
                  style={{ width: "100%", height: "240px", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/*Error Display section */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-600 font-bold text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-content flex flex-col gap-4">

          {/* SECTION: Essential Info logic and display */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <p className="cs-section-label">Job Details</p>
            <div className="flex flex-col gap-5">
              {/* Title input field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Job Title *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all font-bold"
                  placeholder="e.g. Lead Software Engineer" />
              </div>

              {/* Description textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Job Description *</label>
                <textarea required rows={7} name="description" value={formData.description} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all resize-none font-bold"
                  placeholder="Describe the role, responsibilities, team environment, and what success looks like in this position..." />
              </div>

              {/* Requirements textarea section */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Requirements</label>
                <textarea rows={4} name="requirements" value={formData.requirements} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all resize-none font-bold"
                  placeholder="Qualifications, experience level, must-have skills..." />
              </div>
            </div>
          </div>

          {/* SECTION: Meta details display */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <p className="cs-section-label">Position Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Location field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px] flex items-center gap-1.5">
                  <MapPin size={11} className="text-black" /> Location *
                </label>
                <input required type="text" name="location" value={formData.location} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all font-bold"
                  placeholder="Mumbai, India or Remote" />
              </div>

              {/* Job Type select field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Employment Type</label>
                <select name="jobType" value={formData.jobType} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all cursor-pointer capitalize font-bold">
                  {JOB_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>

              {/* Skills input list */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px] flex items-center gap-1.5">
                  <Code size={11} className="text-black" /> Required Skills
                </label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all font-bold"
                  placeholder="React, Node.js, PostgreSQL, Docker..." />
                <p className="text-[11px] text-black font-medium ml-1">Comma-separated list of skills</p>
              </div>

              {/* Salary Min input field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px] flex items-center gap-1.5">
                  <DollarSign size={11} className="text-black" /> Min Salary (INR / yr)
                </label>
                <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all font-bold"
                  placeholder="e.g. 600000" />
              </div>

              {/* Salary Max input field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Max Salary (INR / yr)</label>
                <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all font-bold"
                  placeholder="e.g. 1200000" />
              </div>

              {/* Deadline date input field */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px] flex items-center gap-1.5">
                  <Calendar size={11} className="text-black" /> Application Deadline
                  <span className="text-black font-medium normal-case tracking-normal">(optional)</span>
                </label>
                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full sm:w-64 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all cursor-pointer font-bold" />
              </div>
            </div>
          </div>

          {/* Actions section with primary theme buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-black text-white font-bold text-[12px] rounded-xl hover:bg-neutral-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider">
              <Plus size={16} /> {loading ? "Publishing..." : "Publish Job"}
            </button>
            <button type="button" onClick={() => navigate("/company/jobs")}
              className="px-8 py-3 bg-white border border-neutral-200 text-black font-bold text-[12px] rounded-xl hover:bg-neutral-50 transition-all uppercase tracking-wider">
              Discard Draft
            </button>
          </div>

        </form>
      </div>
    </PageLayout>
  );
}
