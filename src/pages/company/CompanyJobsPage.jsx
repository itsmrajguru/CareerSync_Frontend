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
  open: { label: "Active", bg: "#f0fdf4", color: "#0d1117" },
  closed: { label: "Closed", bg: "#fef2f2", color: "#0d1117" },
};

// job type pill colors
const TYPE_CFG = {
  "full-time": { bg: "#e6f9fd", color: "#0d1117" },
  "part-time": { bg: "#ede9fe", color: "#0d1117" },
  "internship": { bg: "#fef3c7", color: "#0d1117" },
  "contract": { bg: "#fce7f3", color: "#0d1117" },
  "freelance": { bg: "#f0fdf4", color: "#0d1117" },
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

  /* toggle open ↔ closed without opening edit page */
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
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px);} to { opacity:1; transform:translateY(0);} }
        .d-hero    { animation: fadeUp .5s ease both; }
        .d-stats   { animation: fadeUp .5s .1s ease both; }
        .d-content { animation: fadeUp .5s .2s ease both; }
      `}</style>

      <div className="min-h-screen bg-app-bg font-sans flex flex-col">
        <Navbar />
        <main className="max-w-[900px] mx-auto px-7 pt-10 pb-10 flex-1 w-full">

          {/*Hero Section*/}
          <div className="d-hero mb-10">
            <p className="text-xs font-bold tracking-[1px] text-black uppercase mb-3">
              Job Management
            </p>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-black mb-3">
              Your postings,<br />
              <span className="text-black">all in one place.</span>
            </h1>
            <p className="text-base text-black max-w-[480px] leading-relaxed font-medium">
              Manage your active and closed job listings. Edit details, review applicants, or post something new.
            </p>
          </div>

          {/*Stat Cards */}
          <div className="d-stats grid grid-cols-3 gap-4 mb-10">
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
                    className="cs-card hover:shadow-md hover:border-primary-100 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                      {/* Left: info */}
                      <div className="flex items-start gap-4">
                        {/* Job icon tile */}
                        <div style={{ background: tc.bg, color: tc.color }}
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Briefcase size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-[15px] font-bold text-black">{job.title}</h3>
                            {/* Status pill */}
                            <span style={{ background: sc.bg, color: sc.color }}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                              {sc.label}
                            </span>
                            {/* Type pill */}
                            <span style={{ background: tc.bg, color: tc.color }}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                              {job.jobType}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="text-[12px] text-black font-medium flex items-center gap-1">
                              <MapPin size={11} /> {job.location}
                            </span>
                            <span className="text-[12px] text-black font-medium flex items-center gap-1">
                              <Users size={11} /> {job.applicationsCount || 0} applicants
                            </span>
                            {job.deadline && (
                              <span className="text-[12px] text-black font-medium flex items-center gap-1">
                                <Calendar size={11} /> Closes {new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: actions */}
                      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                        <button onClick={() => navigate(`/company/jobs/${job._id}/applicants`)}
                          className="flex items-center gap-1 text-[12px] font-bold text-black bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-all whitespace-nowrap">
                          <Users size={12} /> Applicants <ChevronRight size={12} />
                        </button>
                        <button onClick={() => navigate(`/company/jobs/${job._id}/edit`)}
                          className="flex items-center gap-1 text-[12px] font-bold text-black bg-primary-50 border border-primary-100 px-3 py-2 rounded-lg hover:bg-primary-100 transition-all">
                          <Pencil size={12} /> Edit
                        </button>
                        <button onClick={() => handleToggleStatus(job)}
                          className="flex items-center gap-1 text-[12px] font-bold text-black bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-all whitespace-nowrap">
                          {job.status === "open" ? <><XCircle size={12} /> Close</> : <><CheckCircle2 size={12} /> Reopen</>}
                        </button>
                        <button onClick={() => handleDelete(job._id)}
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-red-400 bg-red-50 border border-red-100 hover:bg-red-100 transition-all">
                          <Trash2 size={14} />
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
    </>
  );
}





