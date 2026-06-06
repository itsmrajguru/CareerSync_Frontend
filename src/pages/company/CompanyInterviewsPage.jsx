import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompanyInterviews } from "../../services/interviewService";
import PageLayout from "../../components/PageLayout";
import {
  CalendarCheck, Video, Phone, Building2, Clock3, MapPin,
  AlertCircle, ChevronRight, Search
} from "lucide-react";


/* interview mode display config */
const MODE_CFG = {
  online:     { label: "Online",     icon: <Video size={13} />,     pill: "bg-blue-50 text-blue-600 border-blue-100" },
  phone:      { label: "Phone",      icon: <Phone size={13} />,     pill: "bg-green-50 text-green-600 border-green-100" },
  "in-person": { label: "In Person",  icon: <Building2 size={13} />, pill: "bg-orange-50 text-orange-600 border-orange-100" },
};

/* filters for the top bar */
const FILTERS = ["all", "online", "phone", "in-person"];

const getRelativeTime = (dateStr) => {
  const diff = new Date(dateStr) - new Date();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (diff < 0) return "Past";
  if (hours < 24) return `in ${hours}h`;
  return `in ${days}d`;
};

/* main CompanyInterviewsPage */
export default function CompanyInterviewsPage() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [filter, setFilter]         = useState("all");

  useEffect(() => { fetchInterviews(); }, []);

  const fetchInterviews = async () => {
    try {
      const res = await getCompanyInterviews();
      if (res.success) {
        setInterviews(res.interviews || []);
      } else {
        setError(res.message || "Failed to load interviews.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const filtered = interviews.filter(iv =>
    filter === "all" ? true : iv.mode === filter
  );

  /* quick counts for the top stats bar */
  const counts = {
    total:     interviews.length,
    online:    interviews.filter(iv => iv.mode === "online").length,
    phone:     interviews.filter(iv => iv.mode === "phone").length,
    "in-person": interviews.filter(iv => iv.mode === "in-person").length,
  };

  return (
    <PageLayout>
      <div className="pb-20 animate-fade-in">

        {/* hero section */}
        <section aria-label="Page header" className="mb-8 pt-4">
          <p className="cs-section-label mb-1">Talent Pipeline</p>
          <h1 className="cs-page-title">
            Scheduled <span className="text-[#ef4444]">Interviews</span>
          </h1>
          <p className="cs-subtext">
            All upcoming interviews you have scheduled across your job postings.
          </p>
        </section>

        {/* stat overview — total and per-mode counts */}
        <section aria-label="Interview stats" className="mb-8">
          <p className="cs-section-label">Overview</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: "total",     label: "Total",     color: "text-black" },
              { key: "online",    label: "Online",    color: "text-blue-600" },
              { key: "phone",     label: "Phone",     color: "text-green-600" },
              { key: "in-person", label: "In Person", color: "text-orange-600" },
            ].map(({ key, label, color }) => (
              <div key={key} className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 shadow-sm">
                <div className={`text-[22px] font-black ${color}`}>{counts[key]}</div>
                <div className="text-[11px] font-bold text-neutral-400 mt-0.5 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer uppercase tracking-wider ${
                filter === f
                  ? "bg-black text-white border-black"
                  : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"
              }`}
            >
              {f.replace("-", " ")}
            </button>
          ))}
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-24 bg-neutral-50 border border-neutral-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="p-10 text-center bg-red-50 border border-red-100 rounded-xl flex flex-col items-center gap-3">
            <AlertCircle size={24} className="text-red-300" />
            <p className="text-red-600 text-[13px] font-bold">{error}</p>
            <button
              onClick={fetchInterviews}
              className="text-[12px] font-bold border border-red-200 text-red-700 px-6 py-2 rounded-xl hover:bg-red-100 transition-all cursor-pointer uppercase tracking-wider"
            >
              Try Again
            </button>
          </div>
        )}

        {/* empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="p-14 text-center border border-neutral-200 rounded-xl bg-neutral-50 shadow-sm">
            <div className="w-12 h-12 bg-white border border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={18} className="text-neutral-400" />
            </div>
            <h3 className="text-[14px] font-bold text-black mb-1">No interviews found</h3>
            <p className="text-[12px] font-bold text-neutral-400 mb-5 max-w-[240px] mx-auto italic">
              {filter === "all"
                ? "You haven't scheduled any interviews yet. Head to an applicant's profile to get started."
                : `No "${filter.replace("_", " ")}" interviews scheduled.`}
            </p>
          </div>
        )}

        {/* interview cards list */}
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map(iv => {
              const mc = MODE_CFG[iv.mode] || MODE_CFG.online;
              const isPast = new Date(iv.scheduledAt) < new Date();
              return (
                <div
                  key={iv._id}
                  className={`cs-card-modern flex items-center gap-5 p-5 hover:scale-[1.003] transition-all ${isPast ? "opacity-60" : ""}`}
                >
                  {/* calendar icon block */}
                  <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                    <CalendarCheck size={18} className="text-amber-500" />
                  </div>

                  {/* main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5">
                      <p className="text-[15px] font-bold text-black truncate">
                        {iv.student?.username || "Candidate"}
                      </p>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border flex items-center gap-1 ${mc.pill}`}>
                        {mc.icon} {mc.label}
                      </span>
                      {isPast && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-neutral-100 text-neutral-400 border border-neutral-200">
                          Past
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      {/* job title */}
                      <span className="text-[12px] font-bold text-neutral-500 truncate">
                        {iv.job?.title || "—"}
                      </span>

                      <span className="text-[12px] font-bold text-neutral-400 flex items-center gap-1.5 border-l border-neutral-200 pl-3">
                        <Clock3 size={11} className="text-neutral-300" />
                        {new Date(iv.scheduledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {" · "}
                        {new Date(iv.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </span>

                      <span className="text-[11px] font-black text-amber-500">
                        {getRelativeTime(iv.scheduledAt)}
                      </span>

                      {iv.location && (
                        <span className="text-[12px] font-bold text-neutral-400 flex items-center gap-1.5 border-l border-neutral-200 pl-3">
                          <MapPin size={11} className="text-neutral-300" />
                          <span className="max-w-[200px] truncate">{iv.location}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* go to applicant profile button */}
                  <button
                    onClick={() => navigate(`/company/applications/${iv.application}`)}
                    className="w-9 h-9 border border-neutral-200 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-neutral-50 transition-all bg-white shadow-sm cursor-pointer"
                    title="View applicant profile"
                  >
                    <ChevronRight size={16} className="text-neutral-500" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </PageLayout>
  );
};;
