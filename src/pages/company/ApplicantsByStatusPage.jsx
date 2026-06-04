import { useEffect, useState } from "react";
import { getApplicationsByStatus, updateApplicationStatus, toggleSaveApplicant } from "../../services/applicationService";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import {
  Mail, ArrowLeft,
  Search, Users, Briefcase, Bookmark
} from "lucide-react";

const STATUS_CFG = {
  applied: { label: "Applied", bg: "#f8fafc", color: "#475569", border: "#f1f5f9" },
  shortlisted: { label: "Shortlisted", bg: "var(--color-primary-50)", color: "var(--color-primary-700)", border: "var(--color-primary-100)" },
  rejected: { label: "Rejected", bg: "#fef2f2", color: "#991b1b", border: "#fee2e2" },
  hired: { label: "Hired", bg: "#f0fdf4", color: "#166534", border: "#dcfce7" },
};

export default function ApplicantsByStatusPage() {
  const { status } = useParams();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const displayStatus = status === 'Selected' ? 'hired' : (status === 'saved' ? 'applied' : status?.toLowerCase());

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getApplicationsByStatus(displayStatus || 'all');
      if (res.success) setApplicants(res.applications || []);
    } catch (e) {
      console.error("Fetch Applicants Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [status]);

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Set this applicant to "${newStatus.toUpperCase()}"?`)) return;
    try {
      const res = await updateApplicationStatus(id, newStatus);
      if (res.success) fetchData();
    } catch (e) { console.error("Status Update Error:", e); }
  };

  const handleSaveToggle = async (id) => {
    try {
      const res = await toggleSaveApplicant(id);
      if (res.success) fetchData();
    } catch (e) { console.error("Toggle Save Error:", e); }
  };

  const filtered = applicants.filter(app => {
    const matchSearch =
      (app.student?.username || "").toLowerCase().includes(search.toLowerCase()) ||
      (app.student?.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (app.job?.title || "").toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const pageTitle = status === 'saved' ? 'Saved Applicants' : 
                    status === 'Selected' ? 'Selected Candidates' :
                    status ? `${status.charAt(0).toUpperCase() + status.slice(1)} Applicants` : 'All Applicants';

  return (
    <PageLayout>
      <div className="pb-20 animate-fade-in text-left">
        {/* Header section */}
        <div className="flex flex-col gap-6 mb-10 pb-6 border-b border-neutral-100">
          <div className="flex flex-col gap-1.5">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-[10px] font-black text-neutral-400 hover:text-black transition-all uppercase tracking-widest bg-transparent border-none p-0 cursor-pointer w-max mb-4">
              <ArrowLeft size={12} /> Back
            </button>
            <h1 className="cs-page-title !mb-2 flex items-center gap-3 text-left">
              <Users size={28} className="text-primary-500" />
              {pageTitle}
            </h1>
            <p className="cs-subtext !mb-0 max-w-2xl text-left text-neutral-500">
              Review and manage your {pageTitle.toLowerCase()} across all jobs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full">
            <div className="relative w-full sm:w-[320px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search candidates or jobs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-neutral-50 border border-neutral-200 text-[13px] font-bold text-black focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all shadow-sm"
              />
            </div>
            <div className="text-[12px] font-black text-neutral-500 uppercase tracking-widest bg-neutral-50 px-4 py-2 rounded-xl border border-neutral-200">
              {filtered.length} Applicant{filtered.length !== 1 && "s"}
            </div>
          </div>
        </div>

        {/* List section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-neutral-100 border-t-primary-500 rounded-full animate-spin mb-4" />
            <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">Loading Profiles...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-2xl flex flex-col items-center justify-center p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 border border-neutral-100 shadow-inner">
              <Users size={24} className="text-neutral-400" />
            </div>
            <h3 className="text-[16px] font-black text-black mb-2 uppercase tracking-wide">No Applicants Found</h3>
            <p className="text-[13px] text-neutral-500 font-medium max-w-md">
              There are no {pageTitle.toLowerCase()} matching your current criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(app => {
              const sc = STATUS_CFG[app.status] || STATUS_CFG.applied;
              return (
                <div key={app._id} className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
                  
                  {/* Status Banner */}
                  <div className="absolute top-0 left-0 w-full h-[4px]" style={{ background: sc.color }} />

                  {/* Header */}
                  <div className="flex items-start justify-between mb-5 pt-1">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center text-[18px] font-black text-white shadow-md">
                        {app.student?.username?.slice(0, 2).toUpperCase() || "??"}
                      </div>
                      <div>
                        <h4 className="text-[15px] font-black text-black leading-none mb-1.5">{app.student?.username || "Unknown"}</h4>
                        <p className="text-[11px] font-bold text-neutral-400 flex items-center gap-1.5 m-0 uppercase tracking-wider">
                          <Mail size={11} className="text-neutral-300" /> {app.student?.email}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSaveToggle(app._id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border-none cursor-pointer ${app.isSaved ? 'bg-amber-50 text-amber-500' : 'bg-transparent text-neutral-300 hover:text-neutral-500 hover:bg-neutral-50'}`}
                      title={app.isSaved ? "Unsave Applicant" : "Save Applicant"}
                    >
                      <Bookmark size={16} fill={app.isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Job context */}
                  <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-3 mb-5 mt-auto">
                    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Briefcase size={10} /> Applied For
                    </p>
                    <p className="text-[12px] font-black text-black truncate">{app.job?.title || "Unknown Job"}</p>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between mt-2 pt-5 border-t border-neutral-100">
                    <select
                      value={app.status}
                      onChange={e => handleStatusChange(app._id, e.target.value)}
                      style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}
                      className="h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-50 cursor-pointer appearance-none transition-colors"
                    >
                      <option value="applied">Under Review</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                    </select>

                    <button
                      onClick={() => navigate(`/company/applications/${app._id}`)}
                      className="text-[10px] font-black text-black uppercase tracking-widest hover:text-primary-600 transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
                    >
                      View Profile →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
