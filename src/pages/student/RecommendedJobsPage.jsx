import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Briefcase, Users, CheckCircle, BriefcaseBusiness, Calendar,
  Bookmark, BookmarkCheck, Sparkles, X, ChevronRight, RefreshCw,
  TrendingUp, Search, Activity, Zap
} from "lucide-react";
import PageLayout from "../../components/PageLayout";
import { getRecommendedJobs, toggleSaveJob, getSavedJobs } from "../../services/jobsService";
import JobCard from "../../components/JobCard";

// Using the same JobItem pattern from ShowJobsPage but tailored slightly for recommendations
function RecommendedJobItem({ job, hasApplied, isSavedInitially, onToggleSave, index }) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(isSavedInitially);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = async (e) => {
    e.stopPropagation(); // prevent card click
    try {
      const response = await toggleSaveJob(job._id);
      setIsSaved(response.isSaved);
      if (onToggleSave) onToggleSave(job._id, response.isSaved);
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  };

  const contractLabel = job.jobType ? job.jobType.replace("_", " ").toUpperCase() : "FULL TIME";
  const locationLabel = job.location || "Remote";
  const matchPercentage = job.matchScore ? Math.min(100, job.matchScore * 15 + 60) : 0; // rough estimation for UI

  // check if deadline is passed
  const isExpired = job.deadline && new Date() > new Date(job.deadline);
  
  // get deadline string
  const deadlineText = job.deadline 
    ? new Date(job.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) 
    : "No deadline";

  return (
    <div
      onClick={() => { if (!isExpired) navigate(`/student/jobs/${job._id}`, { state: { job } }) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`cs-card-modern flex flex-col group transition-all duration-300 relative h-full p-6 bg-white rounded-[24px] overflow-hidden ${
        isExpired ? 'opacity-40 pointer-events-none select-none' : 'cursor-pointer'
      }`}
      style={{
        animation: `fadeUp 0.6s ease-out ${index * 0.1}s both`,
        boxShadow: isHovered && !isExpired ? "0 20px 40px -10px rgba(0, 0, 0, 0.08)" : "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        transform: isHovered && !isExpired ? "translateY(-4px)" : "none",
        border: isHovered && !isExpired ? "1px solid #e2e8f0" : "1px solid #f1f5f9"
      }}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        {hasApplied && (
          <div className="flex items-center gap-1 bg-[#10b981]/10 text-[#10b981] px-3 py-1 rounded-full text-[10px] font-bold border border-[#10b981]/20 uppercase tracking-widest shadow-sm">
            <CheckCircle size={10} /> Applied
          </div>
        )}
        <button
          onClick={handleSave}
          className={`p-2.5 rounded-xl border transition-all duration-300 ${isSaved
            ? "bg-gradient-to-br from-[#ef4444] to-[#dc2626] border-transparent text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
            : "bg-white/80 backdrop-blur-sm border-slate-200 text-slate-400 hover:text-[#ef4444] hover:border-[#ef4444]/30 hover:bg-[#ef4444]/5 shadow-sm"
            }`}
        >
          {isSaved ? <BookmarkCheck size={16} fill="currentColor" /> : <Bookmark size={16} />}
        </button>
      </div>

      <div className="flex items-start justify-between mb-5 gap-4 mt-2">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-14 h-14 rounded-[14px] bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors shadow-sm overflow-hidden p-1 relative">
            {job.company?.logo ? (
              <img src={job.company.logo} alt={job.company.name} className="w-full h-full rounded-[10px] object-cover" />
            ) : (
              <BriefcaseBusiness size={20} className="text-slate-400" />
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[14px]"></div>
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1 block">
              {job.company?.name || "Confidential"}
            </span>
            <h3 className="text-[18px] font-extrabold text-[#0f172a] leading-tight truncate transition-colors">
              {job.title}
            </h3>
          </div>
        </div>
      </div>

      {/* show smart match and job deadline */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.matchScore > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit transition-all duration-300 bg-[#02bcf0]/5 border border-[#02bcf0]/15">
            <Zap size={14} className="text-[#02bcf0] fill-[#02bcf0]/20" />
            <span className="text-[11px] font-black text-[#0179a0] uppercase tracking-wide">
              {matchPercentage}% Smart Match
            </span>
          </div>
        )}

        {job.deadline && (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit text-[11px] font-extrabold uppercase tracking-wide border ${
            isExpired 
              ? "bg-red-50 border-red-150 text-red-600" 
              : "bg-slate-50 border-slate-200 text-slate-600"
          }`}>
            <Calendar size={12} />
            <span>{isExpired ? "Expired" : `Due: ${deadlineText}`}</span>
          </div>
        )}
      </div>

      {/* Minimal Card - No description or tags as per user request */}

      <div className="mt-auto pt-5 flex items-center justify-between border-t border-slate-100">
        <span className="text-[11px] font-extrabold text-[#0f172a] uppercase tracking-[1px] transition-colors">
          Analyze Fit
        </span>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-[0_4px_12px_rgba(15,23,42,0.3)]">
          <span className="font-bold text-sm transform group-hover:translate-x-0.5 transition-transform">&rarr;</span>
        </div>
      </div>
    </div>
  );
}

export default function RecommendedJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData(isManualRefresh = false) {
    if (isManualRefresh) setIsRefreshing(true);
    else setLoading(true);
    
    // Simulate slight delay for UI feedback on manual refresh
    if (isManualRefresh) await new Promise(r => setTimeout(r, 600));

    await Promise.all([
      fetchRecommendedJobs(),
      fetchSavedJobIds()
    ]);
    
    setLoading(false);
    setIsRefreshing(false);
  }

  async function fetchSavedJobIds() {
    try {
      const response = await getSavedJobs();
      const ids = new Set(response.savedJobs.map(j => j._id));
      setSavedJobIds(ids);
    } catch (err) {
      console.error("Failed to fetch saved jobs:", err);
    }
  }

  async function fetchRecommendedJobs() {
    setError("");
    try {
      const response = await getRecommendedJobs();
      setJobs(response.jobs || []);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        setError("Please complete your profile to get personalized job recommendations.");
      } else {
        setError("Unable to process the recommendation engine. Try again later.");
      }
    }
  }

  return (
    <PageLayout>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .bg-mesh {
          background-color: #0f172a;
          background-image: 
            radial-gradient(at 80% 0%, hsla(189,100%,47%,0.15) 0px, transparent 50%),
            radial-gradient(at 0% 100%, hsla(0,0%,100%,0.05) 0px, transparent 50%),
            radial-gradient(at 40% 50%, hsla(189,100%,47%,0.08) 0px, transparent 50%);
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <div className="pb-24 bg-slate-50/50 min-h-screen">
        
        {/* Informative & Compact Hero Section */}
        <div className="bg-[#0f172a] -mx-7 px-7 py-10 mb-10 shadow-lg relative overflow-hidden">
          {/* Subtle Background decoration */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#02bcf0] rounded-full blur-[100px] opacity-10 pointer-events-none" />
          
          <div className="max-w-[1080px] mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="text-white max-w-xl">
              <h1 className="text-[28px] md:text-[34px] font-black leading-tight tracking-tight mb-3 text-white">
                Recommended <span className="text-[#02bcf0]">For You</span>
              </h1>
              <p className="text-[14px] text-slate-300 font-medium mb-5 leading-relaxed">
                We analyze your profile to find the perfect match. Here is how our algorithm works:
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <div className="w-6 h-6 rounded-md bg-[#02bcf0]/20 flex items-center justify-center"><Briefcase size={12} className="text-[#02bcf0]" /></div>
                  <span className="text-[12px] font-semibold text-slate-200">Domain & Field</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <div className="w-6 h-6 rounded-md bg-[#10b981]/20 flex items-center justify-center"><Activity size={12} className="text-[#10b981]" /></div>
                  <span className="text-[12px] font-semibold text-slate-200">Required Skills</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <div className="w-6 h-6 rounded-md bg-[#f59e0b]/20 flex items-center justify-center"><MapPin size={12} className="text-[#f59e0b]" /></div>
                  <span className="text-[12px] font-semibold text-slate-200">Location Match</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 min-w-[240px]">
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Matches Found</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#02bcf0] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#02bcf0]"></span>
                </span>
              </div>
              <div className="text-4xl font-black text-white">{jobs.length}</div>
              <button 
                onClick={() => fetchInitialData(true)}
                disabled={isRefreshing}
                className="w-full mt-2 py-2.5 bg-[#02bcf0] hover:bg-[#019bc6] text-white rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                {isRefreshing ? "Refreshing..." : "Refresh Matches"}
              </button>
            </div>
            
          </div>
        </div>

        <div className="max-w-[1080px] mx-auto px-7 lg:px-0">
          {error ? (
            <div className="p-10 bg-white border border-red-100 rounded-[32px] text-center max-w-2xl mx-auto shadow-xl shadow-red-500/5 relative overflow-hidden" style={{ animation: 'fadeUp 0.5s ease-out both' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-600" />
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[20px] flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <X size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Analysis Interrupted</h3>
              <p className="text-[15px] font-medium text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">{error}</p>
              <button onClick={() => navigate('/student/profile')} className="px-8 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-[13px] font-black uppercase tracking-[1px] rounded-xl hover:shadow-[0_8px_20px_rgba(239,68,68,0.3)] hover:-translate-y-0.5 transition-all">
                Optimize My Profile
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8 w-full">
              {!loading && jobs.length > 0 && (
                <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                  <div>
                    <h2 className="text-[18px] font-black text-slate-900 tracking-tight">Curated For You</h2>
                    <p className="text-[13px] font-bold text-slate-500 mt-1">Ranked by algorithm confidence</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-[24px] h-[160px] animate-pulse shadow-sm" />
                  ))
                ) : jobs.length > 0 ? (
                  jobs.map((job, idx) => (
                    <RecommendedJobItem
                      key={job._id}
                      job={job}
                      isSavedInitially={savedJobIds.has(job._id)}
                      index={idx}
                    />
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 py-28 text-center bg-white rounded-[32px] border border-slate-200 border-dashed shadow-sm" style={{ animation: 'fadeUp 0.5s ease-out both' }}>
                    <div className="w-24 h-24 bg-slate-50 shadow-inner border border-slate-100 rounded-[24px] flex items-center justify-center mx-auto mb-6 transform -rotate-3">
                      <Search size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-[22px] font-black text-slate-900 mb-3 tracking-tight">Awaiting Data Points</h3>
                    <p className="text-slate-500 font-medium text-[15px] max-w-lg mx-auto mb-8 leading-relaxed">
                      Our engine requires more information to synthesize accurate recommendations. Input your skills, domain, and preferred locations to activate the matching algorithm.
                    </p>
                    <button onClick={() => navigate('/student/profile')} className="px-8 py-4 bg-slate-900 text-white text-[13px] font-black uppercase tracking-[1.5px] rounded-xl hover:bg-black transition-all shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1">
                      Provide Data
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );;
}
