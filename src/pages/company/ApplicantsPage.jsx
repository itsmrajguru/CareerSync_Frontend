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
  applied: { label: "Applied", bg: "#f8fafc", color: "#475569", border: "#f1f5f9" },
  shortlisted: { label: "Shortlisted", bg: "var(--color-primary-50)", color: "var(--color-primary-700)", border: "var(--color-primary-100)" },
  rejected: { label: "Rejected", bg: "#fef2f2", color: "#991b1b", border: "#fee2e2" },
  hired: { label: "Hired", bg: "#f0fdf4", color: "#166534", border: "#dcfce7" },
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
                     Applicant Review
                   </p>
                   <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-5">
                     Candidates for<br />
                     <span style={{ color: "#ef4444" }}>{jobTitle || "this posting."}</span>
                   </h1>
                   <p className="text-[14px] leading-[1.6] text-[#64748b] font-medium max-w-[460px]">
                     Review top talent, shortlist potential hires, and move candidates through your pipeline.
                   </p>
                 </div>
 
                 <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>
                   <span className="flex items-center gap-1">✔ Resume Analysis</span>
                   <span style={{ opacity: 0.3 }}>·</span>
                   <span className="flex items-center gap-1">✔ Status Tracking</span>
                   <span style={{ opacity: 0.3 }}>·</span>
                   <span className="flex items-center gap-1">✔ Team Selection</span>
                 </div>
               </div>
 
               {/* Right Column: High-Fidelity Image */}
               <div className="hidden lg:block slide-in" style={{ flexShrink: 0, width: "360px" }}>
                 <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9" }}>
                   <img
                     src="https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800&q=80&auto=format&fit=crop"
                     alt="Talent Review"
                     style={{ width: "100%", height: "280px", objectFit: "cover", display: "block" }}
                   />
                 </div>
               </div>
             </div>
           </section>
 
          {/*stat cards*/}
          {!loading && applicants.length > 0 && (
            <div className="d-stats grid grid-cols-3 gap-4 mb-8">
              {statCards.map(({ label, value, accent }) => (
                <div key={label} style={{ borderTop: `3px solid ${accent}` }}
                  className="cs-card cursor-pointer group hover:scale-[1.01] transition-all"
                  onClick={() => setFilter(label.toLowerCase() === filter ? "all" : label.toLowerCase())}
                >
                  <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.6px] mb-2">{label}</p>
                  <p className="text-[26px] font-extrabold tracking-[-0.5px] leading-none mb-1 text-[#0f172a]">{value}</p>
                  <p className="text-[12px] text-[#64748b] font-medium">
                    {filter === label.toLowerCase() ? "Filtering →" : "Click to filter"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Search bar + filter*/}
          <div className="d-content flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a] tracking-tight mb-1">All Candidates</h2>
              <p className="text-[#64748b] text-[13px] font-medium">{filtered.length} candidate{filtered.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex items-center gap-3">
              <form onSubmit={e => e.preventDefault()} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={14} />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search candidates..."
                  className="cs-input !pl-10 w-52"
                />
              </form>
              {filter !== "all" && (
                <button onClick={() => setFilter("all")}
                  className="text-[12px] font-bold text-black bg-primary-50 border border-primary-100 px-3 py-2.5 rounded-xl hover:bg-primary-100 transition-all">
                  Clear filter ×
                </button>
              )}
              {filtered.length > 0 && (
                <button onClick={handleExportCSV}
                  className="flex items-center gap-1.5 text-[12px] font-bold text-black bg-white border border-neutral-200 px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-all">
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
              <Users size={36} className="text-black mx-auto mb-4" />
              <p className="font-bold text-black mb-2">
                {search || filter !== "all" ? "No matching candidates" : "No applicants yet"}
              </p>
              <p className="text-sm text-black mb-6">
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
                    className="cs-card hover:scale-[1.005] transition-all group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
 
                       {/* Left: candidate info */}
                       <div className="flex items-center gap-4">
                         {/* Initials avatar */}
                         <div style={{ background: sc.bg, color: sc.color }}
                           className="w-12 h-12 rounded-2xl flex items-center justify-center text-[12px] font-black flex-shrink-0 border border-black/5 shadow-sm">
                           {initials}
                         </div>
                         <div>
                           <div className="flex items-center gap-2 flex-wrap mb-1.5">
                             <h3 className="text-[17px] font-extrabold text-[#0f172a] tracking-tight">{app.student?.username || "Unknown"}</h3>
                             {/* Status badge */}
                             <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
                               className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                               {sc.label}
                             </span>
                           </div>
                           <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
                             <span className="text-[13px] text-[#64748b] font-medium flex items-center gap-1.5">
                               <Mail size={13} className="text-[#94a3b8]" /> {app.student?.email || "—"}
                             </span>
                             <span className="text-[13px] text-[#64748b] font-medium flex items-center gap-1.5">
                               <Calendar size={13} className="text-[#94a3b8]" /> {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                             </span>
                           </div>
                         </div>
                       </div>
 
                       {/* View Details + Resume Actions */}
                       <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                         <div className="flex flex-col gap-1 hidden sm:flex">
                           <select
                             value={app.status}
                             onChange={e => handleStatusChange(app._id, e.target.value)}
                             className="text-sm font-bold bg-[#f8fafc] border border-[#f1f5f9] rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-primary-50 transition-all cursor-pointer"
                           >
                             <option value="applied">Under Review</option>
                             <option value="shortlisted">Shortlisted</option>
                             <option value="rejected">Not Moving</option>
                             <option value="hired">Hired ✓</option>
                           </select>
                         </div>
 
                         <button onClick={() => navigate(`/company/applications/${app._id}`)}
                           className="flex items-center gap-1.5 text-[12px] font-bold text-white bg-[#0f172a] px-5 py-2.5 rounded-xl hover:bg-black transition-all shadow-sm">
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
    );
}





