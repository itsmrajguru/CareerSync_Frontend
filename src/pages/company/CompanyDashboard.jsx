import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Users, ChevronRight, Briefcase,
  CheckCircle2, TrendingUp, MapPin, Calendar, Eye,
} from "lucide-react";
import { getMyJobs } from "../../services/jobsService";
import { getCompanyProfile } from "../../services/companyProfileService";
import { getCompanyStats } from "../../services/applicationService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// This shows the Pipeline status 
const PIPELINE = [
  { key: "applied", label: "Applied", color: "#0d1117", bg: "#e6f9fd" },
  { key: "shortlisted", label: "Shortlisted", color: "#0d1117", bg: "#fffbeb" },
  { key: "hired", label: "Hired", color: "#0d1117", bg: "#f0fdf4" },
  { key: "rejected", label: "Rejected", color: "#0d1117", bg: "#fef2f2" },
];

function calcCompleteness(c) {
  if (!c) return 0;
  return [c.name, c.about, c.website, c.industry, c.location].filter(Boolean).length * 20;
}

// Main Dashboard function
export default function CompanyDashboard() {
  const navigate = useNavigate();

  // API data states — follows same pattern as StudentDashboard
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [pipelineStats, setPipelineStats] = useState({ applied: 0, shortlisted: 0, rejected: 0, hired: 0 });
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  /* Fetch all dashboard data in a single parallel call — same useEffect
     pattern as DashboardPage in StudentDashboard.jsx */
  useEffect(() => {
    async function fetchAll() {
      try {
        const [jobsRes, compRes, statsRes] = await Promise.all([
          getMyJobs(),
          getCompanyProfile(),
          getCompanyStats().catch(() => ({ success: false })),
        ]);
        if (jobsRes.success) setJobs(jobsRes.jobs || []);
        if (compRes.success) setCompany(compRes.company);
        if (statsRes.success) {
          setPipelineStats(statsRes.stats || { applied: 0, shortlisted: 0, rejected: 0, hired: 0 });
          setRecentApplicants(statsRes.recentApplications || []);
        }
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // derived values computed from real API data
  const activeJobs = jobs.filter(j => j.status === "open").length;
  const closedJobs = jobs.filter(j => j.status === "closed").length;
  const totalApps = Object.values(pipelineStats).reduce((a, b) => a + b, 0);
  const completeness = calcCompleteness(company);
  const bestJob = [...jobs].sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0))[0];

  // 3 stat cards — mirrors student dashboard 3-col stat row
  const statCards = [
    {
      label: "Active Jobs",
      value: loading ? "—" : activeJobs,
      sub: activeJobs > 0 ? `${closedJobs} closed · ${jobs.length} total` : "Post your first job",
      accent: "#02bcf0",
      link: "/company/jobs",
    },
    {
      label: "Total Applications",
      value: loading ? "—" : String(totalApps),
      sub: pipelineStats.shortlisted > 0 ? `${pipelineStats.shortlisted} shortlisted` : "No applications yet",
      accent: "#8b5cf6",
    },
    {
      label: "Hired",
      value: loading ? "—" : String(pipelineStats.hired),
      sub: pipelineStats.hired > 0 ? "This hiring cycle" : "Keep reviewing applicants",
      accent: "#22c55e",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-app-bg font-sans flex flex-col">
        <Navbar />

        <main className="max-w-[960px] mx-auto px-7 pt-4 pb-10 flex-1 w-full">

          {/*added the herosection with matches the
            existing styles effectively*/}
          <section className="d-hero mb-8">
            <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px]">

              {/* Left Column: Text & Actions */}
              <div style={{ flex: 1 }}>
                <div className="mb-7">
                  <p className="text-[13px] font-bold tracking-[0.5px] text-[#475569] uppercase mb-2">
                    Welcome back, {company?.name || user.username || "there"}
                  </p>
                  <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-5">
                    Your hiring, in<br />
                    <span style={{ color: "#ef4444" }}>real-time.</span>
                  </h1>
                  <p className="text-[14px] leading-[1.6] text-[#64748b] font-medium max-w-[460px]">
                    HiringPulse shows live pipeline status vs. your postings — so you always know who to shortlist and which roles to fill next.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <button onClick={() => navigate("/company/jobs/create")} className="btn-primary !px-10 !py-3.5 shadow-xl shadow-primary-400/20">
                    <Plus size={16} /> Post New Job
                  </button>
                  <button onClick={() => navigate("/company/applicants")} className="btn-outline !px-10 !py-3.5">
                    <Users size={16} /> View Applicants
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>
                  <span className="flex items-center gap-1">✔ Smart Shortlisting</span>
                  <span style={{ opacity: 0.3 }}>·</span>
                  <span className="flex items-center gap-1">✔ Pipeline Analytics</span>
                  <span style={{ opacity: 0.3 }}>·</span>
                  <span className="flex items-center gap-1">✔ Seamless Hiring</span>
                </div>
              </div>

              {/* Right Column: High-Fidelity Image */}
              <div className="hidden lg:block slide-in" style={{ flexShrink: 0, width: "380px" }}>
                <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9" }}>
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop"
                    alt="Recruiter Dashboard"
                    style={{ width: "100%", height: "280px", objectFit: "cover", display: "block" }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* stats cards */}
          <div className="d-stats grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {statCards.map(({ label, value, sub, accent, link }) => (
              <div
                key={label}
                onClick={link ? () => navigate(link) : undefined}
                style={{ borderTop: `3px solid ${accent}` }}
                className={`cs-card group hover:scale-[1.01] transition-all ${link ? "cursor-pointer" : ""}`}
              >
                <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.6px] mb-2">
                  {label}
                </p>
                <p className="text-[26px] font-extrabold tracking-[-0.5px] leading-none mb-1 text-[#0f172a]">
                  {value}
                </p>
                <p className="text-[12px] text-[#64748b] font-medium">{sub}</p>
              </div>
            ))}
          </div>

          {/* Hiring Pulse Panel */}
          <div
            className="d-pulse"
            style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: "24px", overflow: "hidden", marginBottom: "48px", boxShadow: "var(--shadow-card)" }}
          >
            {/* Panel Header */}
            <div style={{ padding: "24px 28px 0", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", animation: "livePulse 2s ease-in-out infinite" }} />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Hiring Pulse — Live Pipeline Intelligence
                  </span>
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.6px", margin: "0 0 4px" }}>
                  Your Hiring Pipeline
                </h2>
                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "18px", fontWeight: 500 }}>
                  Live applicant status across all your job postings
                </p>
              </div>

              {completeness < 100 && (
                <button
                  onClick={() => navigate("/company/profile")}
                  style={{ marginTop: "4px", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "10px", padding: "7px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: "#475569", transition: "all 0.2s" }}
                >
                  {completeness}% complete → Fill profile
                </button>
              )}
            </div>

            {/* Inner grid */}
            <div className="flex flex-col lg:grid" style={{ gridTemplateColumns: "1fr 190px" }}>

              {/* Left: pipeline funnel + active job chips */}
              <div style={{ padding: "18px 28px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>
                  Application Funnel
                </p>
                {PIPELINE.map(({ key, label, color }) => {
                  const count = pipelineStats[key] || 0;
                  const pct = totalApps > 0 ? Math.round(count / totalApps * 100) : 0;
                  return (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                      <span style={{ fontSize: "13px", color: "#475569", width: "95px", flexShrink: 0, fontWeight: 600 }}>
                        {label}
                      </span>
                      <div style={{ flex: 1, background: "#f8fafc", borderRadius: "4px", height: "8px", overflow: "hidden" }}>
                        <div style={{ width: `${loading ? 0 : pct}%`, height: "100%", borderRadius: "4px", background: color, transition: "width 0.8s ease" }} />
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", minWidth: "32px", textAlign: "right" }}>
                        {loading ? "—" : count}
                      </span>
                    </div>
                  );
                })}

                {/* active job chips — click to view applicants */}
                {jobs.length > 0 && (
                  <div style={{ marginTop: "14px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
                      Active Postings
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {jobs.filter(j => j.status === "open").slice(0, 4).map(job => (
                        <button
                          key={job._id}
                          onClick={() => navigate(`/company/jobs/${job._id}/applicants`)}
                          style={{ fontSize: "11px", fontWeight: 600, padding: "5px 12px", borderRadius: "20px", border: "1px solid var(--color-primary-100)", background: "var(--color-primary-50)", color: "var(--color-primary-700)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.15s" }}
                        >
                          {job.title.length > 22 ? job.title.slice(0, 22) + "…" : job.title}
                          <span style={{ opacity: 0.5, fontWeight: 800 }}>
                            {job.applicationsCount || 0}
                          </span>
                        </button>
                      ))}
                      <button
                        onClick={() => navigate("/company/jobs/create")}
                        style={{ fontSize: "11px", fontWeight: 600, padding: "5px 12px", borderRadius: "20px", border: "1px dashed #cbd5e1", background: "transparent", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <Plus size={10} /> Post Job
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right sidebar */}
              <div className="border-t lg:border-t-0 lg:border-l border-[#f8fafc]" style={{ padding: "24px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", background: "#fcfcfc" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Hiring Score
                </span>

                {/* big hired count */}
                <div style={{ textAlign: "center", margin: "12px 0" }}>
                  <div style={{ fontSize: "56px", fontWeight: 800, letterSpacing: "-3px", lineHeight: 1, color: pipelineStats.hired > 0 ? "#ef4444" : "var(--color-primary-500)" }}>
                    {loading ? "—" : pipelineStats.hired}
                  </div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "4px" }}>
                    hired this cycle
                  </div>
                </div>

                {/* profile strength bar */}
                <div style={{ width: "100%", borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    Profile Strength
                  </div>
                  <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "10px", marginBottom: "6px" }}>
                    <div style={{ width: `${completeness}%`, height: "100%", background: completeness === 100 ? "#ef4444" : "var(--color-primary-400)", borderRadius: "10px", transition: "width 0.8s" }} />
                  </div>
                  <div style={{ fontSize: "12px", color: "#0f172a", fontWeight: 700 }}>{completeness}% complete</div>
                  {completeness < 100 && (
                    <button
                      onClick={() => navigate("/company/profile")}
                      style={{ marginTop: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "11px", color: "#ef4444", fontWeight: 700, padding: 0 }}
                    >
                      Complete →
                    </button>
                  )}
                </div>

                {/* top performing job — mirrors "Learn Next" section */}
                {bestJob && (
                  <div style={{ width: "100%", borderTop: "1px solid #f3f4f6", paddingTop: "10px" }}>
                    <div style={{ fontSize: "9px", fontWeight: 700, color: "#0d1117", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "7px" }}>
                      Top Job
                    </div>
                    <button
                      onClick={() => navigate(`/company/jobs/${bestJob._id}/applicants`)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "transparent", border: "none", padding: "3.5px 0", cursor: "pointer" }}
                    >
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#0d1117", textAlign: "left", lineHeight: 1.35 }}>
                        {bestJob.title.length > 20 ? bestJob.title.slice(0, 20) + "…" : bestJob.title}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                        <div style={{ width: `${Math.min(28, (bestJob.applicationsCount || 0) * 3)}px`, height: "3px", background: "#02bcf0", borderRadius: "2px" }} />
                        <ChevronRight size={10} color="#02bcf0" />
                      </div>
                    </button>
                    <div style={{ fontSize: "10px", color: "#0d1117" }}>
                      {bestJob.applicationsCount || 0} applicants
                    </div>
                  </div>
                )}

                {/* quick action to post job */}
                <button
                  onClick={() => navigate("/company/jobs/create")}
                  style={{ width: "100%", marginTop: "4px", background: "#02bcf0", color: "#0d1117", border: "none", borderRadius: "9px", padding: "8px 0", fontSize: "11px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0199c6"}
                  onMouseLeave={e => e.currentTarget.style.background = "#02bcf0"}
                >
                  <Plus size={12} /> Post New Job
                </button>
              </div>
            </div>
          </div>

          {/*Recent Applicatons*/}
          <div className="d-apps border-t border-neutral-100 pt-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
              <div>
                <h2 className="text-xl font-bold text-black tracking-tight mb-1">
                  Recent Applicants
                </h2>
                <p className="text-black text-sm font-medium">
                  Latest candidates across all your postings
                </p>
              </div>
              {/* matches the search bar column position, but for company it's a manage-jobs button */}
              <button
                onClick={() => navigate("/company/jobs")}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary-400 text-white text-xs font-bold rounded-xl hover:bg-primary-500 transition-colors"
              >
                Manage Jobs <ChevronRight size={12} />
              </button>
            </div>

            {/* loading skeletons — same animate-pulse pattern as student */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-36 bg-neutral-50/50 rounded-2xl border border-neutral-100 animate-pulse" />
                ))}
              </div>
            ) : recentApplicants.length === 0 ? (
              /* empty state with CTA */
              <div className="text-center py-16 bg-white rounded-2xl border border-neutral-100">
                <Users size={32} className="text-black mx-auto mb-3" />
                <p className="font-bold text-black mb-2">No applicants yet</p>
                <p className="text-sm text-black mb-5">Post a job to start receiving applications</p>
                <button
                  onClick={() => navigate("/company/jobs/create")}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white font-bold text-sm rounded-full hover:bg-black transition-all"
                >
                  <Plus size={14} /> Post a Job
                </button>
              </div>
            ) : (
              <>
                {/* applicant cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recentApplicants.slice(0, 6).map((app) => {
                    const cfg = PIPELINE.find(p => p.key === app.status) || PIPELINE[0];
                    const initials = (app.student?.username || "A").slice(0, 2).toUpperCase();
                    return (
                      <div
                        key={app._id}
                        onClick={() => navigate(`/company/jobs/${app.job?._id}/applicants`)}
                        className="cs-card cursor-pointer hover:shadow-md hover:border-primary-200 transition-all group"
                      >
                        {/* Applicant header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div style={{ width: 38, height: 38, borderRadius: "10px", background: cfg.bg, color: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, flexShrink: 0 }}>
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-black truncate">
                              {app.student?.username || "Unknown"}
                            </p>
                            <p className="text-[11px] text-black font-medium truncate">
                              {app.job?.title || "Job"}
                            </p>
                          </div>
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 7px", borderRadius: "6px", background: cfg.bg, color: cfg.color, whiteSpace: "nowrap" }}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>
                        {/* Bottom row */}
                        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                          <span className="text-[11px] text-black font-medium">
                            {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </span>
                          <span className="text-[11px] font-bold text-black group-hover:translate-x-0.5 transition-transform">
                            Review →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* same pill button as student's "View all jobs →" */}
                <div className="flex items-center justify-center mt-8">
                  <button
                    onClick={() => navigate("/company/jobs")}
                    className="inline-flex items-center gap-2 px-8 py-2.5 bg-neutral-900 text-white font-bold text-sm rounded-full hover:bg-black transition-all active:scale-95"
                  >
                    View all jobs →
                  </button>
                </div>
              </>
            )}
          </div>

        </main>
        <Footer />
      </div>
    </>
  );
}





