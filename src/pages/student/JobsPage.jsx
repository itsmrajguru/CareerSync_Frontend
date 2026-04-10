import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search, Filter, X, MapPin, Briefcase, DollarSign,
  Users, ChevronLeft, ChevronRight, CheckCircle, Building2
} from "lucide-react";
import PageLayout from "../../components/PageLayout";
import { getJobs } from "../../services/jobsService";


/* This page has 3 componets
a) jobItem 
b)Filter panel
c) the main job page that combines both jobItem and filterpanel */

/*Here we added the filter functionality along with 2 grid structure */
function JobItem({ job, hasApplied }) {
  const navigate = useNavigate();

  /* removes _ and make the title uppercase */
  const contractLabel = job.jobType
    ? job.jobType.replace("_", " ").toUpperCase()
    : "FULL TIME";

  const locationLabel = job.location || "Remote";
  const salary = job.salary
    ? `$${Number(job.salary).toLocaleString()}`
    : "Competitive";

  return (
    <div
    /* redirect user to jobdetails page */
      onClick={() => navigate(`/student/jobs/${job._id}`, { state: { job } })}
      className="cs-card flex flex-col group transition-all !p-6 border-neutral-200 hover:border-black cursor-pointer shadow-sm relative h-full"
    >
      {/* Platform Standard: Applied Badge */}
      {hasApplied && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#ef4444]/5 text-[#ef4444] px-3 py-1 rounded-full text-[10px] font-bold border border-[#ef4444]/10 z-10 uppercase tracking-widest">
          <CheckCircle size={10} /> Applied
        </div>
      )}

      {/* job section to match with the website fixed layouts and styles...
      this function returns the job decsriotion to show on the card*/}
      {/* other job info */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#0f172a] flex items-center justify-center flex-shrink-0 border border-[#0f172a] shadow-lg shadow-primary-900/10 transition-transform group-hover:scale-105">
            {job.company?.logo ? (
              <img src={job.company.logo} alt={job.company.name} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <Building2 size={24} className="text-white" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black tracking-[1.5px] text-[#ef4444] uppercase mb-1 block">
              {job.company?.name || "Confidential"}
            </span>
            <h3 className="text-[16px] font-extrabold text-[#0f172a] leading-tight truncate group-hover:text-black transition-colors">
              {job.title}
            </h3>
          </div>
        </div>
        <div className="text-black font-black text-[14px] bg-neutral-50 px-3 py-1 rounded-xl border border-neutral-100 flex-shrink-0">
          {salary}
        </div>
      </div>

      {/* Description over the main Header added in the card*/}
      <p className="text-[13px] text-[#64748b] leading-relaxed mb-6 font-medium line-clamp-2">
        {job.description?.replace(/<[^>]*>/g, "") || "Detailed career requirements for this position are available upon forge entry."}
      </p>

      {/*Other icons and data to display in the jobcard */}
      <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
        {[
          { icon: <MapPin size={12} />, text: locationLabel },
          { icon: <Users size={12} />, text: "Direct Apply" },
          { icon: <Briefcase size={12} />, text: contractLabel },
          { icon: <CheckCircle size={12} />, text: "Internal" },
        ].map(({ icon, text }, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px] text-[#64748b] font-bold truncate">
            <span className="text-[#94a3b8]">{icon}</span>
            <span className="truncate uppercase tracking-wider">{text}</span>
          </div>
        ))}
      </div>

      {/* this is the view details button which
      redirects the user to the jobdetails page */}
      <div className="cs-card-divider mt-auto pt-5 flex items-center justify-between !m-0 !p-0">
        <span className="text-[12px] font-black text-black uppercase tracking-[1px] group-hover:text-[#ef4444] transition-colors">
          View Details
        </span>
        <span className="text-black font-black text-lg group-hover:translate-x-1 transition-transform">&rarr;</span>
      </div>
    </div>
  );
}

// this is the full function for the filter section
function FilterPanel({ filters, onChange, onClear, activeCount }) {
  const workLocations = ["Onsite", "Remote", "Hybrid"];

  return (
    <div className="bg-white border border-neutral-200 rounded-[22px] overflow-hidden sticky top-8 shadow-sm">
      <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
        <div className="flex items-center gap-2.5">
          <Filter size={15} className="text-black" />
          <span className="font-extrabold text-[14px] text-black">Forge Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 flex items-center justify-center bg-[#ef4444] text-white rounded-full text-[10px] font-black">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onClear} className="text-[11px] font-bold text-[#64748b] hover:text-[#ef4444] transition-colors uppercase tracking-[1.5px]">
            Clear
          </button>
        )}
      </div>

      <div className="p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
        {/* Search Field */}
        <div>
          <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1 mb-2.5 block flex items-center gap-2">
            <Search size={12} /> Search Forge
          </label>
          <input
            value={filters.search}
            onChange={e => onChange("search", e.target.value)}
            placeholder="Title, Skills..."
            className="cs-input !py-3 !text-[12px] !rounded-2xl !border-neutral-100"
          />
        </div>

        {/* Industry Select */}
        <div>
          <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1 mb-2.5 block flex items-center gap-2">
            <Briefcase size={12} /> Industry
          </label>
          <select
            value={filters.industry}
            onChange={e => onChange("industry", e.target.value)}
            className="cs-input !py-3 !text-[12px] !rounded-2xl !appearance-none cursor-pointer font-bold"
          >
            <option value="">All Sectors</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
          </select>
        </div>

        {/* Location Select */}
        <div>
          <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1 mb-2.5 block flex items-center gap-2">
            <MapPin size={12} /> Location
          </label>
          <input
            value={filters.location}
            onChange={e => onChange("location", e.target.value)}
            placeholder="City, State..."
            className="cs-input !py-3 !text-[12px] !rounded-2xl !border-neutral-100"
          />
        </div>

        {/* Job Type Select */}
        <div>
          <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1 mb-2 block">Schedules</label>
          <select
            value={filters.jobType}
            onChange={e => onChange("jobType", e.target.value)}
            className="cs-input !py-3 !text-[12px] !rounded-2xl !appearance-none cursor-pointer font-bold"
          >
            <option value="">All Schedules</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="internship">Internship</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Main function of the page that combines the filter section and jobs section
export default function JobsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quickSearch, setQuickSearch] = useState(searchParams.get("q") || "");

  /* fiters array, that is passed to the filterpanel as a  prop */
  const [filters, setFilters] = useState({
    search: "",
    industry: "",
    location: "",
    jobType: "",
  });

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuickSearch(q);
    fetchJobs({ search: q });
  }, [searchParams]);

  async function fetchJobs(f = filters) {
    setLoading(true); setError("");
    try {
      const response = await getJobs(f);
      /* logic: accessing response.jobs directly due to api interceptor */
      setJobs(response.jobs || []);
    } catch {
      setError("Unable to process the job forge. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  // Effect to re-fetch when relevant filters change
  useEffect(() => {
    fetchJobs(filters);
  }, [filters.industry, filters.jobType, filters.location, filters.search]);

  const activeFilterCount = [filters.search, filters.industry, filters.location, filters.jobType].filter(Boolean).length;

  return (
    <PageLayout>
      <div className="pb-10 animate-fade-in">

        {/* This is the herosection that matches the exact styles with the actual
        existing pages of the website */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-14">
          <div>
            <p className="text-[13px] font-bold tracking-[1.5px]  text-[#475569] uppercase mb-4">
              Internal Forge
            </p>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-5">
              Build your career<br />
              <span className="text-[#ef4444]">directly with partners.</span>
            </h1>
            <p className="text-[16px] leading-[1.6] text-[#64748b] font-medium max-w-[500px]">
              Direct forge entry into verified internal opportunities from our registered companies.
            </p>
          </div>

          {/* through this form , we are taking the quick search input 
          from the user */}
          <form
            onSubmit={(e) => { e.preventDefault(); setFilters(p => ({ ...p, search: quickSearch })); }}
            className="relative w-full md:w-[420px]"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
            <input
              value={quickSearch}
              onChange={e => setQuickSearch(e.target.value)}
              placeholder="Design, Tech, Engineering..."
              className="cs-input !pl-14 !pr-32 !py-4.5 !rounded-[24px] !border-neutral-100 !text-[14px]"
            />
            <button type="submit" className="btn-primary absolute right-2 top-2 bottom-2 px-10 !py-0 !rounded-[18px] !text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all">
              Refine
            </button>
          </form>
        </div>

        {/* This is the main layout where we are displaying the jobs 
        and the filter panel */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Re-integrated Filter Panel (All original fields restored) */}
          <aside className="w-full lg:w-[280px] flex-shrink-0">
            <FilterPanel
              filters={filters}
              onChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))}
              onClear={() => setFilters({ search: "", industry: "", location: "", jobType: "" })}
              activeCount={activeFilterCount}
            />
          </aside>

          {/* Jobs Main - 2 Cards per row */}
          <div className="flex-1 min-w-0 flex flex-col gap-8 w-full">

            {!loading && jobs.length > 0 && (
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <p className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[2.5px]">
                  Analysis: Showing {jobs.length} verified roles
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                  <span className="text-[11px] font-black text-black uppercase tracking-widest">Active Forge</span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-6 bg-red-50 rounded-[22px] text-[#ef4444] font-bold text-sm flex items-center gap-3">
                <X size={18} /> {error}
              </div>
            )}

            {/* Two cards per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="bg-neutral-50/50 border border-neutral-100 rounded-[28px] h-[260px] animate-pulse" />
                ))
              ) : jobs.length > 0 ? (
                jobs.map((job) => <JobItem key={job._id} job={job} />)
              ) : (
                <div className="md:col-span-2 py-20 text-center">
                   <p className="text-[#64748b] font-bold">No internal jobs found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
