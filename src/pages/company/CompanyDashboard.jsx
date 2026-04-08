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
  { key: "applied", label: "Applied", color: "#02bcf0", bg: "#e6f9fd" },
  { key: "shortlisted", label: "Shortlisted", color: "#f59e0b", bg: "#fffbeb" },
  { key: "hired", label: "Hired", color: "#22c55e", bg: "#f0fdf4" },
  { key: "rejected", label: "Rejected", color: "#ef4444", bg: "#fef2f2" },
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
      {/* keyframe animations — matches the same animation style as StudentDashboard.jsx */}
      <style>{`
        @keyframes fadeUp    { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes livePulse { 0%,100%{box-shadow:0 0 0 3px rgba(34,197,94,.2)} 50%{box-shadow:0 0 0 7px rgba(34,197,94,.06)} }
        .d-hero  { animation: fadeUp .5s ease both; }
        .d-stats { animation: fadeUp .5s .1s ease both; }
        .d-pulse { animation: fadeUp .5s .2s ease both; }
        .d-apps  { animation: fadeUp .5s .3s ease both; }
      `}</style>

      {/*same outer wrapper + bg as student dashboard — bg-[#f0fbfe] font-sans */}
      <div className="min-h-screen bg-[#f0fbfe] font-sans flex flex-col">
        <Navbar />

        <main className="max-w-[900px] mx-auto px-7 pt-10 pb-10 flex-1 w-full">

          {/* Hero Section*/}
          <div className="d-hero mb-10">
            <p className="text-xs font-bold tracking-[1px] text-neutral-400 uppercase mb-3">
              Welcome back, {company?.name || user.username || "there"}
            </p>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-neutral-900 mb-3">
              Your hiring, in<br />
              <span className="text-primary-400">real-time.</span>
            </h1>
            <p className="text-base text-neutral-500 max-w-[480px] leading-relaxed font-medium">
              HiringPulse shows live pipeline status vs. your postings — so you always know
              who to shortlist and which roles to fill next.
            </p>
          </div>

          {/* Stat Cards — same 3-col pattern as student dashboard */}
          <div className="d-stats grid grid-cols-3 gap-4 mb-10">
            {statCards.map(({ label, value, sub, accent, link }) => (
              <div
                key={label}
                onClick={link ? () => navigate(link) : undefined}
                style={{ borderTop: `3px solid ${accent}` }}
                className={`bg-white border border-neutral-200 rounded-[14px] p-5 ${link ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
              >
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px] mb-2">
                  {label}
                </p>
                <p className="text-[26px] font-extrabold tracking-[-0.5px] leading-none mb-1"
                  style={{ color: accent }}>
                  {value}
                </p>
                <p className="text-[12px] text-neutral-400 font-medium">{sub}</p>
              </div>
            ))}
          </div>

          {/*Hiring Pulse Panel */}
          <div
            className="d-pulse"
            style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "20px", overflow: "hidden", marginBottom: "48px" }}
          >
            {/* Panel header — same layout as CareerPulse header */}
            <div style={{ padding: "18px 22px 0", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
                  {/* live green dot — same animation as CareerPulse indicator */}
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", animation: "livePulse 2s ease-in-out infinite" }} />
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Hiring Pulse — Live Pipeline Intelligence
                  </span>
                </div>
                <h2 style={{ fontSize: "19px", fontWeight: 800, color: "#111827", letterSpacing: "-0.5px", margin: "0 0 4px" }}>
                  Your Hiring Pipeline
                </h2>
                <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "14px", fontWeight: 500 }}>
                  Live applicant status across all your job postings
                </p>
              </div>
              {/* profile completeness CTA — mirrors the "Refresh" button position */}
              {completeness < 100 && (
                <button
                  onClick={() => navigate("/company/profile")}
                  style={{ marginTop: "4px", background: "transparent", border: "1px solid #e5e7eb", borderRadius: "9px", padding: "6px 11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, color: "#6b7280", transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {completeness}% complete → Fill profile
                </button>
              )}
            </div>

            {/* Inner grid — same gridTemplateColumns as CareerPulse (1fr sidebar) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 190px" }}>

              {/* Left: pipeline funnel + active job chips */}
              <div style={{ padding: "18px 22px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>
                  Application Funnel
                </p>
                {PIPELINE.map(({ key, label, color }) => {
                  const count = pipelineStats[key] || 0;
                  const pct = totalApps > 0 ? Math.round(count / totalApps * 100) : 0;
                  return (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                      <span style={{ fontSize: "12.5px", color: "#64748b", width: "90px", flexShrink: 0, fontWeight: 600 }}>
                        {label}
                      </span>
                      <div style={{ flex: 1, background: "#f1f5f9", borderRadius: "3px", height: "7px", overflow: "hidden" }}>
                        <div style={{ width: `${loading ? 0 : pct}%`, height: "100%", borderRadius: "3px", background: color, transition: "width 0.8s ease" }} />
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: 800, color: "#0f172a", minWidth: "28px", textAlign: "right" }}>
                        {loading ? "—" : count}
                      </span>
                    </div>
                  );
                })}

                {/* active job chips — click to view applicants */}
                {jobs.length > 0 && (
                  <div style={{ marginTop: "14px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
                      Active Postings
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {jobs.filter(j => j.status === "open").slice(0, 4).map(job => (
                        <button
                          key={job._id}
                          onClick={() => navigate(`/company/jobs/${job._id}/applicants`)}
                          style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", border: "1px solid #b3eefb", background: "#e6f9fd", color: "#0179a0", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", transition: "all 0.12s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#c7f3fd"}
                          onMouseLeave={e => e.currentTarget.style.background = "#e6f9fd"}
                        >
                          {job.title.length > 22 ? job.title.slice(0, 22) + "…" : job.title}
                          <span style={{ background: "rgba(1,121,160,0.12)", borderRadius: "10px", padding: "1px 5px", fontSize: "10px", fontWeight: 700 }}>
                            {job.applicationsCount || 0}
                          </span>
                        </button>
                      ))}
                      <button
                        onClick={() => navigate("/company/jobs/create")}
                        style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", border: "1px dashed #b3eefb", background: "transparent", color: "#0179a0", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <Plus size={10} /> Post Job
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right sidebar — mirrors CareerPulse's "Readiness Radar" side panel */}
              <div style={{ borderLeft: "1px solid #f3f4f6", padding: "18px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", background: "#fafafa" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Hiring Score
                </span>

                {/* big hired count — mirrors market match % display */}
                <div style={{ textAlign: "center", margin: "8px 0" }}>
                  <div style={{ fontSize: "48px", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, color: pipelineStats.hired > 0 ? "#22c55e" : "#02bcf0" }}>
                    {loading ? "—" : pipelineStats.hired}
                  </div>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px" }}>
                    hired this cycle
                  </div>
                </div>

                {/* profile strength bar */}
                <div style={{ width: "100%", borderTop: "1px solid #f3f4f6", paddingTop: "10px" }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "7px" }}>
                    Profile Strength
                  </div>
                  <div style={{ height: "5px", background: "#e5e7eb", borderRadius: "3px", marginBottom: "5px" }}>
                    <div style={{ width: `${completeness}%`, height: "100%", background: completeness === 100 ? "#22c55e" : "#02bcf0", borderRadius: "3px", transition: "width 0.8s" }} />
                  </div>
                  <div style={{ fontSize: "11px", color: "#374151", fontWeight: 700 }}>{completeness}% complete</div>
                  {completeness < 100 && (
                    <button
                      onClick={() => navigate("/company/profile")}
                      style={{ marginTop: "4px", background: "none", border: "none", cursor: "pointer", fontSize: "11px", color: "#02bcf0", fontWeight: 700, padding: 0 }}
                    >
                      Complete →
                    </button>
                  )}
                </div>

                {/* top performing job — mirrors "Learn Next" section */}
                {bestJob && (
                  <div style={{ width: "100%", borderTop: "1px solid #f3f4f6", paddingTop: "10px" }}>
                    <div style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "7px" }}>
                      Top Job
                    </div>
                    <button
                      onClick={() => navigate(`/company/jobs/${bestJob._id}/applicants`)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "transparent", border: "none", padding: "3.5px 0", cursor: "pointer" }}
                    >
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#374151", textAlign: "left", lineHeight: 1.35 }}>
                        {bestJob.title.length > 20 ? bestJob.title.slice(0, 20) + "…" : bestJob.title}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                        <div style={{ width: `${Math.min(28, (bestJob.applicationsCount || 0) * 3)}px`, height: "3px", background: "#02bcf0", borderRadius: "2px" }} />
                        <ChevronRight size={10} color="#02bcf0" />
                      </div>
                    </button>
                    <div style={{ fontSize: "10px", color: "#9ca3af" }}>
                      {bestJob.applicationsCount || 0} applicants
                    </div>
                  </div>
                )}

                {/* quick action to post job */}
                <button
                  onClick={() => navigate("/company/jobs/create")}
                  style={{ width: "100%", marginTop: "4px", background: "#02bcf0", color: "#fff", border: "none", borderRadius: "9px", padding: "8px 0", fontSize: "11px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", transition: "background 0.15s" }}
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
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight mb-1">
                  Recent Applicants
                </h2>
                <p className="text-neutral-400 text-sm font-medium">
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
                <Users size={32} className="text-neutral-300 mx-auto mb-3" />
                <p className="font-bold text-neutral-500 mb-2">No applicants yet</p>
                <p className="text-sm text-neutral-400 mb-5">Post a job to start receiving applications</p>
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
                        className="bg-white border border-neutral-200 rounded-[14px] p-5 cursor-pointer hover:shadow-md hover:border-primary-200 transition-all group"
                      >
                        {/* Applicant header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div style={{ width: 38, height: 38, borderRadius: "10px", background: cfg.bg, color: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, flexShrink: 0 }}>
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-neutral-900 truncate">
                              {app.student?.username || "Unknown"}
                            </p>
                            <p className="text-[11px] text-neutral-400 font-medium truncate">
                              {app.job?.title || "Job"}
                            </p>
                          </div>
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 7px", borderRadius: "6px", background: cfg.bg, color: cfg.color, whiteSpace: "nowrap" }}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>
                        {/* Bottom row */}
                        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                          <span className="text-[11px] text-neutral-400 font-medium">
                            {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </span>
                          <span className="text-[11px] font-bold text-primary-400 group-hover:translate-x-0.5 transition-transform">
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
