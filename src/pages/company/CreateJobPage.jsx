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
    <div className="min-h-screen bg-app-bg font-sans flex flex-col">
      <Navbar />
      <main className="max-w-[960px] mx-auto px-7 pt-4 pb-10 flex-1 w-full">

        {/*added the herosection with matches the
            existing styles effectively*/}
        <section className="d-hero mb-8">
          <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "60px" }}>

            {/* Left Column: Text & Actions */}
            <div style={{ flex: 1 }}>

              <div className="mb-7">
                <p className="text-[13px] font-bold tracking-[0.5px] text-[#475569] uppercase mb-2">
                  New Posting
                </p>
                <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-5">
                  Post a new<br />
                  <span style={{ color: "#ef4444" }}>job opening.</span>
                </h1>
                <p className="text-[14px] leading-[1.6] text-[#64748b] font-medium max-w-[460px]">
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
            <div className="hidden lg:block slide-in" style={{ flexShrink: 0, width: "360px" }}>
              <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9" }}>
                <img
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80&auto=format&fit=crop"
                  alt="Post Job"
                  style={{ width: "100%", height: "280px", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/*Error Display*/}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-[14px] p-4 mb-6 text-red-600 font-bold text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-content flex flex-col gap-4">

          {/* SECTION: Essential Info */}
          <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
            <p className="text-[11px] font-bold text-black uppercase tracking-[0.6px] mb-5">Job Details</p>
            <div className="flex flex-col gap-5">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Job Title *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                  placeholder="e.g. Lead Software Engineer" />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Job Description *</label>
                <textarea required rows={7} name="description" value={formData.description} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all resize-none"
                  placeholder="Describe the role, responsibilities, team environment, and what success looks like in this position..." />
              </div>

              {/* Requirements */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Requirements</label>
                <textarea rows={4} name="requirements" value={formData.requirements} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all resize-none"
                  placeholder="Qualifications, experience level, must-have skills..." />
              </div>
            </div>
          </div>

          {/* SECTION: Meta */}
          <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
            <p className="text-[11px] font-bold text-black uppercase tracking-[0.6px] mb-5">Position Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px] flex items-center gap-1.5">
                  <MapPin size={11} className="text-black" /> Location *
                </label>
                <input required type="text" name="location" value={formData.location} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                  placeholder="Mumbai, India or Remote" />
              </div>

              {/* Job Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Employment Type</label>
                <select name="jobType" value={formData.jobType} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all cursor-pointer capitalize">
                  {JOB_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>

              {/* Skills */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px] flex items-center gap-1.5">
                  <Code size={11} className="text-black" /> Required Skills
                </label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                  placeholder="React, Node.js, PostgreSQL, Docker..." />
                <p className="text-[11px] text-black font-medium ml-1">Comma-separated list of skills</p>
              </div>

              {/* Salary Min */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px] flex items-center gap-1.5">
                  <DollarSign size={11} className="text-black" /> Min Salary (INR / yr)
                </label>
                <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                  placeholder="e.g. 600000" />
              </div>

              {/* Salary Max */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Max Salary (INR / yr)</label>
                <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                  placeholder="e.g. 1200000" />
              </div>

              {/* Deadline */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px] flex items-center gap-1.5">
                  <Calendar size={11} className="text-black" /> Application Deadline
                  <span className="text-black font-medium normal-case tracking-normal">(optional)</span>
                </label>
                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full sm:w-64 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all cursor-pointer" />
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
              className="px-6 py-3 bg-neutral-50 border border-neutral-200 text-black font-bold text-sm rounded-xl hover:bg-neutral-100 transition-colors">
              Discard Draft
            </button>
          </div>

        </form>
      </main>
      <Footer />
    </div>
  );
}



