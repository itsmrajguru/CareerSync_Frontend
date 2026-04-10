import { useEffect, useState } from "react";
import { getJobById, updateJob } from "../../services/jobsService";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Save, ArrowLeft, MapPin, Code, DollarSign, Calendar, CheckCircle2 } from "lucide-react";

// employment type options
const JOB_TYPES = ["full-time", "part-time", "internship", "contract", "freelance"];

export default function EditJobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "", description: "", requirements: "",
    jobType: "full-time", location: "", skills: "",
    salaryMin: "", salaryMax: "", deadline: "", status: "open",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    /* pre-populate form with existing job data */
    async function fetchJob() {
      try {
        const res = await getJobById(jobId);
        if (res.success && res.job) {
          const j = res.job;
          setFormData({
            title: j.title || "",
            description: j.description || "",
            requirements: j.requirements || "",
            jobType: j.jobType || "full-time",
            location: j.location || "",
            skills: Array.isArray(j.skills) ? j.skills.join(", ") : (j.skills || ""),
            salaryMin: j.salary?.min ? String(j.salary.min) : "",
            salaryMax: j.salary?.max ? String(j.salary.max) : "",
            deadline: j.deadline ? new Date(j.deadline).toISOString().split("T")[0] : "",
            status: j.status || "open",
          });
        }
      } catch (e) { console.error("Fetch Job Error:", e); }
      finally { setLoading(false); }
    }
    fetchJob();
  }, [jobId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (success) setSuccess(false);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setSuccess(false); setError("");
    try {
      // build the payload — convert skills string back to array
      const skillsArray = formData.skills.split(",").map(s => s.trim()).filter(Boolean);
      const payload = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        jobType: formData.jobType,
        location: formData.location,
        status: formData.status,
        skills: skillsArray,
        salary: {
          min: Number(formData.salaryMin) || 0,
          max: Number(formData.salaryMax) || 0,
          currency: "INR",
          isVisible: true,
        },
        deadline: formData.deadline || null,
      };
      const res = await updateJob(jobId, payload);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate("/company/jobs"), 1500);
      } else {
        setError(res.message || "Failed to update job.");
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Something went wrong.");
    } finally { setSaving(false); }
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
              <button onClick={() => navigate("/company/jobs")}
                className="flex items-center gap-2 text-[12px] font-bold text-[#64748b] hover:text-[#ef4444] transition-colors mb-6 group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to jobs
              </button>

              <div className="mb-7">
                <p className="text-[13px] font-bold tracking-[0.5px] text-[#475569] uppercase mb-2">
                  Edit Posting
                </p>
                <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-5">
                  Update your<br />
                  <span style={{ color: "#ef4444" }}>job posting.</span>
                </h1>
                <p className="text-[14px] leading-[1.6] text-[#64748b] font-medium max-w-[460px]">
                  Changes are published immediately and visible to all candidates browsing this role.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>
                <span className="flex items-center gap-1">✔ Instant Update</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span className="flex items-center gap-1">✔ Talent Reach</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span className="flex items-center gap-1">✔ Listing Refinement</span>
              </div>
            </div>

            {/* Right Column: High-Fidelity Image */}
            <div className="hidden lg:block slide-in" style={{ flexShrink: 0, width: "360px" }}>
              <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9" }}>
                <img
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80&auto=format&fit=crop"
                  alt="Edit Job"
                  style={{ width: "100%", height: "280px", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Banner */}
        {success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-[14px] p-4 mb-6 text-green-700 font-bold text-sm">
            <CheckCircle2 size={18} /> Job updated! Redirecting to your listings...
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-[14px] p-4 mb-6 text-red-600 font-bold text-sm text-center">
            {error}
          </div>
        )}

        {loading ? (
          /* skeleton state while job data loads */
          <div className="flex flex-col gap-4">
            {[160, 80, 200].map((h, i) => (
              <div key={i} style={{ height: h }} className="bg-neutral-50/80 rounded-[14px] border border-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="d-content flex flex-col gap-4">

            {/*Status Toggle*/}
            <div className="cs-card flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-black uppercase tracking-[0.6px] mb-1">Posting Status</p>
                <p className="text-sm font-medium text-black">
                  {formData.status === "open" ? "Actively accepting applications" : "This posting is closed to new applicants"}
                </p>
              </div>
              {/* Toggle switch */}
              <button type="button" onClick={() => handleChange({ target: { name: "status", value: formData.status === "open" ? "closed" : "open" } })}
                className={`relative w-14 h-7 rounded-full transition-colors ${formData.status === "open" ? "bg-primary-400" : "bg-neutral-200"}`}>
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${formData.status === "open" ? "translate-x-7" : "translate-x-0"}`} />
              </button>
            </div>

            {/*Job Details Section */}
            <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
              <p className="text-[11px] font-bold text-black uppercase tracking-[0.6px] mb-5">Job Details</p>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Job Title *</label>
                  <input required type="text" name="title" value={formData.title} onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                    placeholder="e.g. Lead Software Engineer" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Job Description *</label>
                  <textarea required rows={7} name="description" value={formData.description} onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all resize-none"
                    placeholder="Describe the role, responsibilities, team environment..." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Requirements</label>
                  <textarea rows={4} name="requirements" value={formData.requirements} onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all resize-none"
                    placeholder="Qualifications, years of experience, must-have skills..." />
                </div>
              </div>
            </div>

            {/* Details Section*/}
            <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
              <p className="text-[11px] font-bold text-black uppercase tracking-[0.6px] mb-5">Position Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px] flex items-center gap-1.5">
                    <MapPin size={11} className="text-black" /> Location *
                  </label>
                  <input required type="text" name="location" value={formData.location} onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                    placeholder="Mumbai, India or Remote" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Employment Type</label>
                  <select name="jobType" value={formData.jobType} onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all cursor-pointer">
                    {JOB_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px] flex items-center gap-1.5">
                    <Code size={11} className="text-black" /> Required Skills
                  </label>
                  <input type="text" name="skills" value={formData.skills} onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                    placeholder="React, Node.js, PostgreSQL..." />
                  <p className="text-[11px] text-black font-medium ml-1">Comma-separated list</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px] flex items-center gap-1.5">
                    <DollarSign size={11} className="text-black" /> Min Salary (INR / yr)
                  </label>
                  <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                    placeholder="e.g. 600000" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Max Salary (INR / yr)</label>
                  <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                    placeholder="e.g. 1200000" />
                </div>
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

            {/* Actions*/}
            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={saving || success}
                className="flex items-center gap-2 px-6 py-3 bg-primary-400 text-white font-bold text-sm rounded-xl hover:bg-primary-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {success ? <CheckCircle2 size={16} /> : <Save size={16} />}
                {saving ? "Saving..." : success ? "Saved!" : "Save Changes"}
              </button>
              <button type="button" onClick={() => navigate("/company/jobs")}
                className="px-6 py-3 bg-neutral-50 border border-neutral-200 text-black font-bold text-sm rounded-xl hover:bg-neutral-100 transition-colors">
                Cancel
              </button>
            </div>

          </form>
        )}

      </main>
      <Footer />
    </div>
  );
}




