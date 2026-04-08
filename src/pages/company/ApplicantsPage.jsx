import { useEffect, useState } from "react";
import { getJobApplicants, getMyJobs } from "../../services/jobsService";
import { updateApplicationStatus } from "../../services/applicationService";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Mail, FileText, ArrowLeft, Calendar,
  Search, Users, CheckCircle2, XCircle, Clock, UserCheck, Download,
} from "lucide-react";

// status display config — colors + labels
const STATUS_CFG = {
  applied: { label: "Applied", bg: "#e6f9fd", color: "#0179a0", border: "#b3eefb" },
  shortlisted: { label: "Shortlisted", bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
  rejected: { label: "Rejected", bg: "#fef2f2", color: "#b91c1c", border: "#fca5a5" },
  hired: { label: "Hired", bg: "#f0fdf4", color: "#166534", border: "#86efac" },
};

export default function ApplicantsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsRes, jobsRes] = await Promise.all([
        getJobApplicants(jobId),
        getMyJobs(),
      ]);
      if (appsRes.success) setApplicants(appsRes.applications || []);
      // find this job's title from the list of all company jobs
      if (jobsRes.success) {
        const found = jobsRes.jobs.find(j => j._id === jobId);
        if (found) setJobTitle(found.title);
      }
    } catch (e) {
      console.error("Fetch Applicants Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [jobId]);

  /* update status with a confirm dialog so accidents don't happen */
  const handleStatusChange = async (id, status) => {
    if (!window.confirm(`Set this applicant to "${status.toUpperCase()}"?`)) return;
    try {
      const res = await updateApplicationStatus(id, status);
      if (res.success) fetchData();
    } catch (e) { console.error("Status Update Error:", e); }
  };

  // apply both search and status filter
  const filtered = applicants.filter(app => {
    const matchSearch =
      (app.student?.username || "").toLowerCase().includes(search.toLowerCase()) ||
      (app.student?.email || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || app.status === filter;
    return matchSearch && matchFilter;
  });

  // pipeline counts for the stat cards
  const counts = applicants.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  // export current filtered list to CSV natively
  const handleExportCSV = () => {
    const headers = ["Applicant Name", "Email", "Status", "Applied On", "Resume Link"];
    const rows = filtered.map(app => [
      `"${app.student?.username || "Unknown"}"`,
      `"${app.student?.email || "Unknown"}"`,
      `"${app.status}"`,
      `"${new Date(app.appliedAt).toLocaleDateString()}"`,
      `"${app.resumeUrl || "No Resume"}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `applicants_${jobTitle || "job"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statCards = [
    { label: "Applied", value: counts.applied || 0, accent: "#02bcf0" },
    { label: "Shortlisted", value: counts.shortlisted || 0, accent: "#f59e0b" },
    { label: "Hired", value: counts.hired || 0, accent: "#22c55e" },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px);} to { opacity:1; transform:translateY(0);} }
        .d-hero    { animation: fadeUp .5s ease both; }
        .d-stats   { animation: fadeUp .5s .1s ease both; }
        .d-content { animation: fadeUp .5s .2s ease both; }
      `}</style>

      <div className="min-h-screen bg-[#f0fbfe] font-sans flex flex-col">
        <Navbar />
        <main className="max-w-[900px] mx-auto px-7 pt-10 pb-10 flex-1 w-full">

          {/* ── HERO ── */}
          <div className="d-hero mb-10">
            {/* Back button */}
            <button onClick={() => navigate("/company/jobs")}
              className="flex items-center gap-2 text-[12px] font-bold text-neutral-400 hover:text-primary-400 transition-colors mb-6">
              <ArrowLeft size={14} /> Back to jobs
            </button>

            <p className="text-xs font-bold tracking-[1px] text-neutral-400 uppercase mb-3">
              Applicant Review
            </p>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-neutral-900 mb-3">
              Candidates for<br />
              <span className="text-primary-400">{jobTitle || "this posting."}</span>
            </h1>
            <p className="text-base text-neutral-500 max-w-[480px] leading-relaxed font-medium">
              Review, shortlist, and make your hiring decisions. Status changes are applied instantly.
            </p>
          </div>

          {/*stat cards*/}
          {!loading && applicants.length > 0 && (
            <div className="d-stats grid grid-cols-3 gap-4 mb-10">
              {statCards.map(({ label, value, accent }) => (
                <div key={label} style={{ borderTop: `3px solid ${accent}` }}
                  className="bg-white border border-neutral-200 rounded-[14px] p-5 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setFilter(label.toLowerCase() === filter ? "all" : label.toLowerCase())}
                >
                  <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px] mb-2">{label}</p>
                  <p className="text-[26px] font-extrabold tracking-[-0.5px] leading-none mb-1" style={{ color: accent }}>{value}</p>
                  <p className="text-[12px] text-neutral-400 font-medium">
                    {filter === label.toLowerCase() ? "Filtering →" : "Click to filter"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Search bar + filter*/}
          <div className="d-content flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight mb-1">All Candidates</h2>
              <p className="text-neutral-400 text-sm font-medium">{filtered.length} candidate{filtered.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex items-center gap-3">
              <form onSubmit={e => e.preventDefault()} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search candidates..."
                  className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-neutral-200 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 text-sm font-medium transition-all shadow-sm w-52"
                />
              </form>
              {filter !== "all" && (
                <button onClick={() => setFilter("all")}
                  className="text-[12px] font-bold text-primary-400 bg-primary-50 border border-primary-100 px-3 py-2.5 rounded-xl hover:bg-primary-100 transition-all">
                  Clear filter ×
                </button>
              )}
              {filtered.length > 0 && (
                <button onClick={handleExportCSV}
                  className="flex items-center gap-1.5 text-[12px] font-bold text-neutral-600 bg-white border border-neutral-200 px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-all">
                  <Download size={14} /> Export CSV
                </button>
              )}
            </div>
          </div>

          {/*Applicant cards */}
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(n => <div key={n} className="h-32 bg-neutral-50/50 rounded-[14px] border border-neutral-100 animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[14px] border border-neutral-200">
              <Users size={36} className="text-neutral-300 mx-auto mb-4" />
              <p className="font-bold text-neutral-500 mb-2">
                {search || filter !== "all" ? "No matching candidates" : "No applicants yet"}
              </p>
              <p className="text-sm text-neutral-400 mb-6">
                {search || filter !== "all" ? "Try adjusting your filter or search term" : "Share your job link to attract candidates"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map(app => {
                const sc = STATUS_CFG[app.status] || STATUS_CFG.applied;
                const initials = (app.student?.username || "A").slice(0, 2).toUpperCase();
                return (
                  <div key={app._id}
                    className="bg-white border border-neutral-200 rounded-[14px] p-5 hover:shadow-md hover:border-primary-100 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                      {/* Left: candidate info */}
                      <div className="flex items-center gap-4">
                        {/* Initials avatar */}
                        <div style={{ background: sc.bg, color: sc.color }}
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-[15px] font-bold text-neutral-900">{app.student?.username || "Unknown"}</h3>
                            {/* Status badge */}
                            <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {sc.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="text-[12px] text-neutral-400 font-medium flex items-center gap-1">
                              <Mail size={11} /> {app.student?.email || "—"}
                            </span>
                            <span className="text-[12px] text-neutral-400 font-medium flex items-center gap-1">
                              <Calendar size={11} /> {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* View Details + Resume Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                        {/* Status select — compact */}
                        <div className="flex flex-col gap-1 hidden sm:flex">
                          <select
                            value={app.status}
                            onChange={e => handleStatusChange(app._id, e.target.value)}
                            className="p-2.5 pr-8 rounded-xl bg-neutral-50 border border-neutral-200 text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer"
                          >
                            <option value="applied">Under Review</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Not Moving</option>
                            <option value="hired">Hired ✓</option>
                          </select>
                        </div>

                        <button onClick={() => navigate(`/company/applications/${app._id}`)}
                          className="flex items-center gap-1.5 text-[12px] font-bold text-primary-500 bg-primary-50 px-4 py-2.5 rounded-xl hover:bg-primary-100 transition-colors whitespace-nowrap">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* same pill CTA pattern as student dashboard */}
              <div className="flex items-center justify-center mt-4">
                <button onClick={() => navigate("/company/jobs")}
                  className="inline-flex items-center gap-2 px-8 py-2.5 bg-neutral-900 text-white font-bold text-sm rounded-full hover:bg-black transition-all active:scale-95">
                  ← Back to job listings
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
