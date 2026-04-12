import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Clock, ChevronRight, Search, BriefcaseBusiness,
  ExternalLink, Bookmark
} from "lucide-react";
import PageLayout from "../../components/PageLayout";
import { getApplications } from "../../services/applicationService";
import { getSavedJobs } from "../../services/jobsService";

const STATUS_CONFIG = {
  applied:     { label: "Applied",     pill: "bg-blue-50 text-blue-700 border border-blue-100" },
  shortlisted: { label: "Shortlisted", pill: "bg-amber-50 text-amber-700 border border-amber-100" },
  hired:       { label: "Hired",       pill: "bg-green-50 text-green-700 border border-green-100" },
  rejected:    { label: "Rejected",    pill: "bg-red-50 text-red-700 border border-red-100" },
};

const FILTERS = ["all", "applied", "shortlisted", "hired", "rejected"];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [filter, setFilter]             = useState("all");
  const [savedJobs, setSavedJobs]       = useState([]);

  /* fetch applications functionality...
  logic: 1) call the getApplications service to fetch all apps for the logged-in student
         2) store the data in our local state to display it on the page */
  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const [appRes, savedRes] = await Promise.all([
        getApplications(),
        getSavedJobs()
      ]);
      /* logic: accessing response applications directly */
      setApplications(appRes.applications || []);
      setSavedJobs(savedRes.savedJobs || []);
    } catch {
      setError("Failed to load your applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* calculating entry counts...
  logic: we are filtering the main applications array to get numbers for 
  each status like applied, hired etc to show in the overview cards */
  const counts = {
    total:       applications.length,
    applied:     applications.filter(a => a.status === "applied").length,
    shortlisted: applications.filter(a => a.status === "shortlisted").length,
    hired:       applications.filter(a => a.status === "hired").length,
    rejected:    applications.filter(a => a.status === "rejected").length,
  };

  /* filtering applications...
  if a specific status filter is selected, we only show those applications
  and this filter is added through the array of tabs  */
  const filteredApplications = applications.filter(app =>
    filter === "all" ? true : app.status === filter
  );

  return (
    <PageLayout>
      <div className="pb-20 animate-fade-in">

        {/* herosection...*/}
        <section aria-label="Page header" className="mb-8 pt-4 p-0">
          <p className="cs-section-label mb-1">
            Career Pipeline
          </p>
          <h1 className="cs-page-title">
            My <span className="text-[#ef4444]">Applications</span>
          </h1>
          <p className="cs-subtext">
            Track and manage all your job applications in one place.
          </p>
        </section>

        {/* SECTION 1 : application stats overview...
        this section shows the quick numbers for all your career entries */}
        <section aria-label="Application stats" className="mb-8">
          <p className="cs-section-label">
            Overview
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { key: "total",       label: "Total",       color: "text-black" },
              { key: "applied",     label: "Applied",     color: "text-blue-600" },
              { key: "shortlisted", label: "Shortlisted", color: "text-amber-500" },
              { key: "hired",       label: "Hired",       color: "text-green-600" },
            ].map(({ key, label, color }) => (
              <div
                key={key}
                className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 shadow-sm"
              >
                <div className={`text-[22px] font-black ${color}`}>
                  {counts[key]}
                </div>
                <div className="text-[11px] font-bold text-neutral-400 mt-0.5 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* main grid section...
        here we have the application list on the left and saved jobs on the right */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">

          {/* application list column...*/}
          <section aria-label="Application list">

            {/* Section label */}
            <p className="cs-section-label">
              Applications
            </p>

            {/* users current status about applied job tabs...
            this section shows the diffrent tabs to show the user result accordingly */}
            <div className="flex flex-wrap gap-2 mb-5">
              {FILTERS.map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer uppercase tracking-wider ${
                    filter === s
                      ? "bg-black text-white border-black"
                      : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* loading state skeleton... */}
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map(n => (
                  <div
                    key={n}
                    className="h-24 bg-neutral-50 border border-neutral-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* error message display... */}
            {!loading && error && (
              <div className="p-8 text-center bg-red-50 border border-red-100 rounded-xl">
                <p className="text-red-600 text-[13px] font-bold mb-4">{error}</p>
                <button
                  onClick={fetchApplications}
                  className="text-[12px] font-bold border border-red-200 text-red-700 px-6 py-2 rounded-xl hover:bg-red-100 transition-all cursor-pointer uppercase tracking-wider"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* empty list condition...
            this checks if no job is applied by the user or for a specific filter */}
            {!loading && !error && filteredApplications.length === 0 && (
              <div className="p-14 text-center border border-neutral-200 rounded-xl bg-neutral-50 shadow-sm">
                <div className="w-12 h-12 bg-white border border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={18} className="text-neutral-400" />
                </div>
                <h3 className="text-[14px] font-bold text-black mb-1">
                  No applications found
                </h3>
                <p className="text-[12px] font-bold text-neutral-400 mb-5 max-w-[220px] mx-auto italic">
                  {filter === "all"
                    ? "You haven't applied to any jobs yet. Start your journey today!"
                    : `No applications with status "${filter}".`}
                </p>
                <Link
                  to="/student/jobs"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold border border-neutral-200 px-6 py-2 rounded-xl hover:bg-white transition-all uppercase tracking-wider bg-white shadow-sm"
                >
                  Browse Jobs <ExternalLink size={12} />
                </Link>
              </div>
            )}

            {/* SECTION 2 : main list section...
            here we display the filtered list of applications one by one */}
            {!loading && !error && filteredApplications.length > 0 && (
              <div className="space-y-3">
                {filteredApplications.map(app => (
                  <div
                    key={app._id}
                    className="cs-card-modern hover:scale-[1.005] transition-all group flex items-center gap-4 p-5"
                  >
                    {/* company logo icon...*/}
                    <div className="w-11 h-11 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                      {app.company?.logo ? (
                        <img
                          src={app.company.logo}
                          alt={app.company.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BriefcaseBusiness size={18} className="text-neutral-400" />
                      )}
                    </div>

                    {/* the horizontal job details card...
                    shows the job title, status badge, company name and application date */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-bold text-black truncate mb-1.5 group-hover:text-[#ef4444] transition-colors">
                        {app.job?.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${STATUS_CONFIG[app.status]?.pill || ""}`}
                        >
                          {STATUS_CONFIG[app.status]?.label || app.status}
                        </span>
                        {app.company?.name && (
                          <span className="text-[12px] font-bold text-neutral-400 flex items-center gap-1.5">
                            <BriefcaseBusiness size={11} className="text-neutral-300" />
                            {app.company.name}
                          </span>
                        )}
                        <span className="text-[12px] font-bold text-neutral-400 flex items-center gap-1.5 border-l border-neutral-200 pl-3">
                          <Clock size={11} className="text-neutral-300" />
                          {new Date(app.appliedAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>

                    {/* view job button...*/}
                    <Link
                      to={`/student/jobs/${app.job?._id}`}
                      className="w-9 h-9 border border-neutral-200 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-neutral-50 transition-all bg-white shadow-sm"
                    >
                      <ChevronRight size={16} className="text-neutral-500" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECCTION 3 : saved jobs sidebar...
          this section displays the role entries you have bookmarked for later */}
          <aside aria-label="Saved jobs">

            {/* Section label */}
            <p className="cs-section-label">
              Saved Jobs
            </p>

            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-bold text-black uppercase tracking-tight">Bookmarks</span>
                <span className="text-[10px] font-bold bg-neutral-100 border border-neutral-200 rounded-full px-2.5 py-0.5 text-neutral-500">
                  {savedJobs.length} saved
                </span>
              </div>

              {savedJobs.length === 0 ? (

                /* empty saved jobs and saved jobs condition...*/
                <div className="flex flex-col items-center text-center py-8">
                  <div className="w-11 h-11 bg-neutral-50 border border-neutral-100 rounded-xl flex items-center justify-center mb-4">
                    <Bookmark size={18} className="text-neutral-300" />
                  </div>
                  <h4 className="text-[13px] font-bold text-black mb-1">No saved jobs yet</h4>
                  <p className="text-[12px] font-bold text-neutral-400 leading-relaxed mb-6 max-w-[180px] italic">
                    Bookmark jobs you like while browsing to find them here.
                  </p>
                  <Link
                    to="/student/jobs"
                    className="w-full text-center text-[11px] font-bold border border-neutral-200 px-4 py-2.5 rounded-xl hover:bg-neutral-50 transition-all text-black uppercase tracking-wider bg-white shadow-sm"
                  >
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedJobs.map(job => (
                    <Link to={`/student/jobs/${job._id}`} key={job._id} className="block group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-white transition-colors">
                          {job.company?.logo ? (
                            <img src={job.company.logo} alt="" className="w-full h-full object-cover"/>
                          ) : (
                            <BriefcaseBusiness size={16} className="text-neutral-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-black truncate group-hover:text-[#ef4444] transition-colors">
                            {job.title}
                          </p>
                          <p className="text-[11px] font-bold text-neutral-400 truncate mt-0.5">
                            {job.company?.name || "Confidential"}
                          </p>
                        </div>
                        <ChevronRight size={14} className="text-neutral-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </aside>

        </div>
      </div>
    </PageLayout>
  );
}