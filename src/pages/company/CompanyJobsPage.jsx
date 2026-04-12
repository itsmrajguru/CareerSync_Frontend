import { useEffect, useState } from "react";
import { getMyJobs, updateJob, deleteJob } from "../../services/jobsService";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import {
  Plus, Search, Briefcase, MapPin, Users,
  Pencil, Trash2, CheckCircle2, XCircle,
  Calendar,
} from "lucide-react";

// these are  the status pills to display as a dummy data 
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

/* the main function that show the jobs posted by the indivisual company */
export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => { fetchJobs(); }, []);


  /* this Function actually fetches all the saved jobs by the company
  and these fetched jobs are stored in the local state as setJobs*/
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

  /* this function toggles the status of the particular job post when 
  the company updates it 
  particulary for open and closed functionlaity*/
  const handleToggleStatus = async (job) => {
    const newStatus = job.status === "open" ? "closed" : "open";
    try {
      const res = await updateJob(job._id, { status: newStatus });
      if (res.success) fetchJobs();
    } catch (e) { console.error("Toggle Status Error:", e); }
  };

  /* This function is used to delete a particular job*/
  const handleDelete = async (id) => {
    /* confirming the user about the job details */
    if (!window.confirm("Delete this job posting? This cannot be undone.")) return;
    try {
      const res = await deleteJob(id);
      if (res.success) fetchJobs();
    } catch (e) { console.error("Delete Job Error:", e); }
  };

  // filter functionality by the user...to check any job based on its name
  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(query.toLowerCase()) ||
    j.location.toLowerCase().includes(query.toLowerCase())
  );

  /* real time updates to the the jobs... 
    These updates are totally based on the jobs we face to the state of jobs
  And applying the fil Directly gives That status */
  const activeJobs = jobs.filter(j => j.status === "open").length;
  const closedJobs = jobs.filter(j => j.status !== "open").length;
  const totalApps = jobs.reduce((s, j) => s + (j.applicationsCount || 0), 0);

  const statCards = [
    { label: "Active Jobs", value: loading ? "—" : activeJobs, accent: "#02bcf0" },
    { label: "Closed Postings", value: loading ? "—" : closedJobs, accent: "#8b5cf6" },
    { label: "Total Applications", value: loading ? "—" : totalApps, accent: "#22c55e" },
  ];

  return (
    <PageLayout>
      <div className="pb-20 animate-fade-in">

        {/* hero section matching refined styles... */}
        <section aria-label="Page header" className="mb-8 pt-4 p-0">
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px]">

            <div style={{ flex: 1 }}>
              <div className="mb-7">
                <p className="cs-section-label">
                  Job Management
                </p>
                <h1 className="cs-page-title">
                  Your postings,<br />
                  <span className="text-[#ef4444]">all in one place.</span>
                </h1>
                <p className="cs-subtext max-w-[460px]">
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

            {/* This is the right side section...
            Where we called And Just paste it */}
            <div className="hidden lg:block animate-fade-in" style={{ flexShrink: 0, width: "360px" }}>
              <div className="rounded-xl overflow-hidden border border-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80&auto=format&fit=crop"
                  alt="Jobs Management"
                  style={{ width: "100%", height: "240px", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/*Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {statCards.map(({ label, value, accent }) => (
            <div key={label} style={{ borderTop: `3px solid ${accent}` }}
              className="cs-card-modern">
              <p className="cs-section-label !mb-2 !text-black">{label}</p>
              <p className="text-[26px] font-extrabold tracking-[-0.5px] leading-none" style={{ color: accent }}>{value}</p>
            </div>
          ))}
        </div>

        {/* This is the search query option...
        so the user put  the query  in the search box...and it is sent 
        to the search functionlaity*/}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="leading-tight">
            <h2 className="text-[20px] font-bold text-black mb-0.5">All Job Listings</h2>
            <p className="cs-subtext !mb-0 text-[12px]">{filtered.length} posting{filtered.length !== 1 ? "s" : ""} found</p>
          </div>
          <div className="flex items-center gap-3 h-[44px]">
            {/* Search bar — standardized style */}
            <form onSubmit={e => e.preventDefault()} className="relative h-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search jobs..."
                className="cs-input !pl-10 !pr-4 h-full w-52 !rounded-xl"
              />
            </form>
            <button onClick={() => navigate("/company/jobs/create")}
              className="h-full flex items-center gap-1.5 px-6 bg-black text-white text-[12px] font-bold rounded-xl hover:bg-neutral-800 transition-all uppercase tracking-wider">
              <Plus size={14} /> Post Job
            </button>
          </div>
        </div>

        {/* Job List section...
this includes both the empty jobs display utility and the jobs cotainiing utility*/}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => <div key={n} className="h-64 bg-neutral-50/50 rounded-[14px] border border-neutral-100 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          /* empty state logic and display */
          <div className="text-center py-20 bg-white rounded-[14px] border border-neutral-200">
            <Briefcase size={36} className="text-black mx-auto mb-4" />
            <p className="font-bold text-black mb-2">{query ? "No matching jobs" : "No jobs posted yet"}</p>
            <p className="text-sm text-black mb-6">{query ? "Try a different search term" : "Create your first job posting to start hiring"}</p>
            {!query && (
              <button onClick={() => navigate("/company/jobs/create")}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white font-bold text-sm rounded-full hover:bg-black transition-all text-white">
                <Plus size={14} /> Post a Job
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(job => {
                const sc = STATUS_CFG[job.status] || STATUS_CFG.closed;
                const tc = TYPE_CFG[job.jobType] || TYPE_CFG["full-time"];
                return (
                  <div key={job._id}
                    className="cs-card flex flex-col group h-full">

                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <span style={{ background: tc.bg, color: tc.color }}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        {job.jobType || "Full-time"}
                      </span>
                      <span style={{ background: sc.bg, color: sc.color }}
                        className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-tight border border-current opacity-80">
                        {sc.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-black mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {job.title}
                    </h3>

                    {/* Meta Details */}
                    <div className="space-y-2 mb-6 flex-1">
                      <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
                        <MapPin size={14} className="text-neutral-400" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
                        <Users size={14} className="text-neutral-400" />
                        <span className="text-black font-bold">{job.applicationsCount || 0}</span> applicants
                      </div>
                      {job.deadline && (
                        <div className="flex items-center gap-2 text-[12px] text-neutral-400 font-medium">
                          <Calendar size={14} className="text-neutral-300" />
                          Closes {new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      )}
                    </div>

                    {/* Management Actions */}
                    <div className="pt-4 border-t border-neutral-100 mt-auto">
                      <button
                        onClick={() => navigate(`/company/jobs/${job._id}/applicants`)}
                        className="w-full h-11 mb-3 flex items-center justify-center gap-2 bg-black text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800 transition-all shadow-sm">
                        <Users size={14} /> Applicants
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/company/jobs/${job._id}/edit`)}
                          title="Edit Posting"
                          className="flex-1 h-10 flex items-center justify-center border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
                          <Pencil size={15} className="text-neutral-600" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(job)}
                          title={job.status === "open" ? "Close Posting" : "Reopen Posting"}
                          className="flex-1 h-10 flex items-center justify-center border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
                          {job.status === "open" ? <XCircle size={15} className="text-neutral-600" /> : <CheckCircle2 size={15} className="text-neutral-600" />}
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          title="Delete Permanently"
                          className="flex-1 h-10 flex items-center justify-center border border-red-100 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center mt-12">
              <button onClick={() => navigate("/company/jobs/create")}
                className="inline-flex items-center gap-2 px-10 py-3.5 bg-black text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-all active:scale-95 uppercase tracking-widest">
                <Plus size={16} /> Post New vacancy
              </button>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
