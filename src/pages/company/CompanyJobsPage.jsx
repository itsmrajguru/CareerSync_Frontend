import { useEffect, useState } from "react";
import { getMyJobs, updateJob, deleteJob } from "../../services/jobsService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Plus, Search, Briefcase, MapPin, Users,
  Pencil, Trash2, ChevronRight, CheckCircle2, XCircle,
  Calendar,
} from "lucide-react";

// status pill config
const STATUS_CFG = {
  open: { label: "Active", bg: "#f0fdf4", color: "#166534" },
  closed: { label: "Closed", bg: "#fef2f2", color: "#991b1b" },
};

// job type pill colors
const TYPE_CFG = {
  "full-time": { bg: "var(--color-primary-50)", color: "var(--color-primary-700)" },
  "part-time": { bg: "#f5f3ff", color: "#6d28d9" },
  "internship": { bg: "#fffbeb", color: "#92400e" },
  "contract": { bg: "#fdf2f8", color: "#9d174d" },
  "freelance": { bg: "#f0fdf4", color: "#166534" },
};

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => { fetchJobs(); }, []);

  async function fetchJobs() {
    setLoading(true);
    try {
      const res = await getMyJobs();
      if (res.success) setJobs(res.jobs || []);
    } catch (e) {
      console.error("Fetch Jobs Error:", e);
    } finally {
      setLoading(false);
    }
  }

  /* toggle open and closed without opening edit page */
  const handleToggleStatus = async (job) => {
    const newStatus = job.status === "open" ? "closed" : "open";
    try {
      const res = await updateJob(job._id, { status: newStatus });
      if (res.success) fetchJobs();
    } catch (e) { console.error("Toggle Status Error:", e); }
  };

  /* delete with confirmation guard */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job posting? This cannot be undone.")) return;
    try {
      const res = await deleteJob(id);
      if (res.success) fetchJobs();
    } catch (e) { console.error("Delete Job Error:", e); }
  };

  // client-side search across title and location
  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(query.toLowerCase()) ||
    j.location.toLowerCase().includes(query.toLowerCase())
  );

  // derived stat values
  const activeJobs = jobs.filter(j => j.status === "open").length;
  const closedJobs = jobs.filter(j => j.status !== "open").length;
  const totalApps = jobs.reduce((s, j) => s + (j.applicationsCount || 0), 0);

  const statCards = [
    { label: "Active Jobs", value: loading ? "—" : activeJobs, accent: "#02bcf0" },
    { label: "Closed Postings", value: loading ? "—" : closedJobs, accent: "#8b5cf6" },
    { label: "Total Applications", value: loading ? "—" : totalApps, accent: "#22c55e" },
  ];

  return (
    <div className="min-h-screen bg-app-bg font-sans flex flex-col">
      <Navbar />
      <main className="max-w-[960px] mx-auto px-7 pt-4 pb-10 flex-1 w-full">

        {/* added updated herosection for company jobs page */}
        <section className="d-hero mb-8">
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px]">

            {/* Left Column: Text & Actions */}
            <div style={{ flex: 1 }}>
              <div className="mb-7">
                <p className="text-[13px] font-bold tracking-[0.5px] text-[#475569] uppercase mb-2">
                  Job Management
                </p>
                <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-5">
                  Your postings,<br />
                  <span style={{ color: "#ef4444" }}>all in one place.</span>
                </h1>
                <p className="text-[14px] leading-[1.6] text-[#64748b] font-medium max-w-[460px]">
                  Manage your active and closed job listings. Edit details, review applicants, or post something new.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>
                <span className="flex items-center gap-1">✔ High Visibility</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span className="flex items-center gap-1">✔ Active Pipelines</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span className="flex items-center gap-1">✔ Talent Discovery</span>
              </div>
            </div>

            {/* Right Column: High-Fidelity Image */}
            <div className="hidden lg:block slide-in" style={{ flexShrink: 0, width: "360px" }}>
              <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9" }}>
                <img
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80&auto=format&fit=crop"
                  alt="Jobs Management"
                  style={{ width: "100%", height: "280px", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/*Stat Cards */}
        <div className="d-stats grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {statCards.map(({ label, value, accent }) => (
            <div key={label} style={{ borderTop: `3px solid ${accent}` }}
              className="cs-card">
              <p className="text-[11px] font-bold text-black uppercase tracking-[0.6px] mb-2">{label}</p>
              <p className="text-[26px] font-extrabold tracking-[-0.5px] leading-none" style={{ color: accent }}>{value}</p>
            </div>
          ))}
        </div>

        {/*Search post */}
        <div className="d-content flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-black tracking-tight mb-1">All Job Listings</h2>
            <p className="text-black text-sm font-medium">{filtered.length} posting{filtered.length !== 1 ? "s" : ""} found</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search bar — same style as student dashboard */}
            <form onSubmit={e => e.preventDefault()} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={14} />
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search jobs..."
                className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 text-sm font-medium transition-all shadow-sm w-52"
              />
            </form>
            <button onClick={() => navigate("/company/jobs/create")}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-400 text-white text-sm font-bold rounded-xl hover:bg-primary-500 transition-colors shadow-sm whitespace-nowrap">
              <Plus size={14} /> Post Job
            </button>
          </div>
        </div>

        {/* Job List */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(n => <div key={n} className="h-28 bg-neutral-50/50 rounded-[14px] border border-neutral-100 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          /* empty state */
          <div className="text-center py-20 bg-white rounded-[14px] border border-neutral-200">
            <Briefcase size={36} className="text-black mx-auto mb-4" />
            <p className="font-bold text-black mb-2">{query ? "No matching jobs" : "No jobs posted yet"}</p>
            <p className="text-sm text-black mb-6">{query ? "Try a different search term" : "Create your first job posting to start hiring"}</p>
            {!query && (
              <button onClick={() => navigate("/company/jobs/create")}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white font-bold text-sm rounded-full hover:bg-black transition-all">
                <Plus size={14} /> Post a Job
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(job => {
              const sc = STATUS_CFG[job.status] || STATUS_CFG.closed;
              const tc = TYPE_CFG[job.jobType] || TYPE_CFG["full-time"];
              return (
                <div key={job._id}
                  className="cs-card hover:scale-[1.005] transition-all group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    {/* Left: info */}
                    <div className="flex items-start gap-4">
                      {/* Job icon tile */}
                      <div style={{ background: tc.bg, color: tc.color }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm border border-black/5">
                        <Briefcase size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <h3 className="text-[17px] font-extrabold text-[#0f172a] tracking-tight">{job.title}</h3>
                          {/* Status pill */}
                          <span style={{ background: sc.bg, color: sc.color }}
                            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {sc.label}
                          </span>
                          {/* Type pill */}
                          <span style={{ background: tc.bg, color: tc.color }}
                            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize">
                            {job.jobType}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
                          <span className="text-[13px] text-[#64748b] font-medium flex items-center gap-1.5">
                            <MapPin size={13} className="text-[#94a3b8]" /> {job.location}
                          </span>
                          <span className="text-[13px] text-[#64748b] font-medium flex items-center gap-1.5">
                            <Users size={13} className="text-[#94a3b8]" /> {job.applicationsCount || 0} applicants
                          </span>
                          {job.deadline && (
                            <span className="text-[13px] text-[#64748b] font-medium flex items-center gap-1.5">
                              <Calendar size={13} className="text-[#94a3b8]" /> Closes {new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      <button onClick={() => navigate(`/company/jobs/${job._id}/applicants`)}
                        className="flex items-center gap-1.5 text-[12px] font-bold text-[#0f172a] bg-[#f8fafc] border border-[#f1f5f9] px-4 py-2.5 rounded-xl hover:bg-[#f1f5f9] transition-all whitespace-nowrap">
                        <Users size={14} /> Applicants
                      </button>
                      <button onClick={() => navigate(`/company/jobs/${job._id}/edit`)}
                        className="flex items-center gap-1.5 text-[12px] font-bold text-[#0f172a] bg-white border border-[#f1f5f9] px-4 py-2.5 rounded-xl hover:bg-[#f8fafc] transition-all">
                        <Pencil size={14} /> Edit
                      </button>
                      <button onClick={() => handleToggleStatus(job)}
                        className="flex items-center gap-1.5 text-[12px] font-bold text-[#475569] bg-white border border-[#f1f5f9] px-4 py-2.5 rounded-xl hover:bg-[#f8fafc] transition-all whitespace-nowrap">
                        {job.status === "open" ? <><XCircle size={14} /> Close</> : <><CheckCircle2 size={14} /> Reopen</>}
                      </button>
                      <button onClick={() => handleDelete(job._id)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-red-500 bg-red-50/50 border border-red-100 hover:bg-red-100/50 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* View-all pill — same pattern as student dashboard */}
            <div className="flex items-center justify-center mt-4">
              <button onClick={() => navigate("/company/jobs/create")}
                className="inline-flex items-center gap-2 px-8 py-2.5 bg-neutral-900 text-white font-bold text-sm rounded-full hover:bg-black transition-all active:scale-95">
                <Plus size={14} /> Post another job →
              </button>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}





