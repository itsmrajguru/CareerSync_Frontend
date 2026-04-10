import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search, Filter, X, MapPin, Briefcase, DollarSign,
  Users, ChevronLeft, ChevronRight, CheckCircle, Building2
} from "lucide-react";
import PageLayout from "../../components/PageLayout";
import { getJobs } from "../../services/externalJobsService";

// updated the jobspage with complete new version
/*Here  we added the filter funcyionality along with 2 grid structure */
function JobItem({ job, hasApplied }) {
  const navigate = useNavigate();
  const contractLabel = job.contract_time
    ? job.contract_time.replace("_", " ").toUpperCase()
    : "FULL TIME";

  const locationLabel = job.location?.display_name?.split(",")[0] || "Remote";
  const salary = job.salary_max
    ? `$${Number(job.salary_max).toLocaleString()}`
    : job.salary_min
      ? `$${Number(job.salary_min).toLocaleString()}`
      : null;

  return (
    <div
      onClick={() => navigate(`/student/jobs/${job.id}`, { state: { job } })}
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
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#0f172a] flex items-center justify-center flex-shrink-0 border border-[#0f172a] shadow-lg shadow-primary-900/10 transition-transform group-hover:scale-105">
            <Building2 size={24} className="text-white" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black tracking-[1.5px] text-[#ef4444] uppercase mb-1 block">
              {job.company?.display_name || "Confidential"}
            </span>
            <h3 className="text-[16px] font-extrabold text-[#0f172a] leading-tight truncate group-hover:text-black transition-colors">
              {job.title}
            </h3>
          </div>
        </div>
        {salary && (
          <div className="text-black font-black text-[14px] bg-neutral-50 px-3 py-1 rounded-xl border border-neutral-100 flex-shrink-0">
            {salary}
          </div>
        )}
      </div>

      {/* Description over the main Header added in the card*/}
      <p className="text-[13px] text-[#64748b] leading-relaxed mb-6 font-medium line-clamp-2">
        {job.description?.replace(/<[^>]*>/g, "") || "Detailed career requirements for this position are available upon forge entry."}
      </p>

      {/*Other icons and data to display in the jobcard */}
      <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
        {[
          { icon: <MapPin size={12} />, text: locationLabel },
          { icon: <Users size={12} />, text: "Open Position" },
          { icon: <Briefcase size={12} />, text: contractLabel },
          { icon: <CheckCircle size={12} />, text: "Verified" },
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
          <span className="font-extrabold text-[14px] text-black">Discovery Filters</span>
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
            placeholder="Title, Company..."
            className="cs-input !py-3 !text-[12px] !rounded-2xl !border-neutral-100"
          />
        </div>

        {/* Role Select */}
        <div>
          <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1 mb-2.5 block flex items-center gap-2">
            <Briefcase size={12} /> Industry
          </label>
          <select
            value={filters.role}
            onChange={e => onChange("role", e.target.value)}
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

        {/* Salary Min/Max */}
        <div>
          <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1 mb-2.5 block flex items-center gap-2">
            <DollarSign size={12} /> Salary (USD)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number" placeholder="Min"
              value={filters.min_salary}
              onChange={e => onChange("min_salary", e.target.value)}
              className="cs-input !py-3 !text-[12px] !rounded-2xl !border-neutral-100"
            />
            <input
              type="number" placeholder="Max"
              value={filters.max_salary}
              onChange={e => onChange("max_salary", e.target.value)}
              className="cs-input !py-3 !text-[12px] !rounded-2xl !border-neutral-100"
            />
          </div>
        </div>

        {/* Job Type Select */}
        <div>
          <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1 mb-2 block">Schedules</label>
          <select
            value={filters.job_type}
            onChange={e => onChange("job_type", e.target.value)}
            className="cs-input !py-3 !text-[12px] !rounded-2xl !appearance-none cursor-pointer font-bold"
          >
            <option value="">All Schedules</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Freelance</option>
            <option value="internship">Student</option>
          </select>
        </div>

        {/* Work Location Checkboxes */}
        <div>
          <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1 mb-3 block flex items-center gap-2">
            <MapPin size={12} /> Location Type
          </label>
          <div className="flex flex-col gap-3 ml-1">
            {workLocations.map(loc => (
              <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.work_location.includes(loc.toLowerCase())}
                  onChange={e => {
                    const val = loc.toLowerCase();
                    const next = e.target.checked
                      ? [...filters.work_location, val]
                      : filters.work_location.filter(v => v !== val);
                    onChange("work_location", next);
                  }}
                  className="w-4.5 h-4.5 rounded-lg border-2 border-neutral-200 text-[#ef4444] focus:ring-[#ef4444]/10 transition-all cursor-pointer accent-[#ef4444]"
                />
                <span className="text-[13px] font-bold text-[#475569] group-hover:text-black transition-colors">{loc}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main function of the page that combines the filter section and jobs section
export default function ExternalJobsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [quickSearch, setQuickSearch] = useState(searchParams.get("q") || "");
  const jobsPerPage = 10;

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    min_salary: "",
    max_salary: "",
    job_type: "",
    work_location: [],
  });

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuickSearch(q);
    fetchJobs(q, 1);
  }, [searchParams]);

  async function fetchJobs(q = quickSearch, page = currentPage) {
    setLoading(true); setError("");
    try {
      // Composite query building for Adzuna backend
      let finalQuery = q || "";
      if (filters.search) finalQuery += ` ${filters.search}`;
      if (filters.role) finalQuery += ` ${filters.role}`;
      if (filters.work_location?.length > 0) finalQuery += ` ${filters.work_location.join(" ")}`;
      if (filters.job_type) finalQuery += ` ${filters.job_type}`;

      const data = await getJobs(finalQuery, page, jobsPerPage);
      setJobs(data.jobs || []);
      setTotalJobs(data.count || 0);
    } catch {
      setError("Unable to process the discovery link. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  // Effect to re-fetch when relevant filters change
  useEffect(() => {
    fetchJobs(quickSearch, 1);
  }, [filters.role, filters.work_location, filters.job_type, filters.search]);

  const activeFilterCount = [filters.search, filters.role, filters.min_salary || filters.max_salary, filters.job_type, filters.work_location.length > 0].filter(Boolean).length;
  const totalPages = Math.min(Math.ceil(totalJobs / jobsPerPage), 10);
  const showingFrom = ((currentPage - 1) * jobsPerPage) + 1;
  const showingTo = Math.min(currentPage * jobsPerPage, totalJobs);

  return (
    <PageLayout>
      <div className="pb-10 animate-fade-in">

        {/* This is the herosection that matches the exact styles with the actual
existing pages of the website */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-14">
          <div>
            <p className="text-[13px] font-bold tracking-[1.5px]  text-[#475569] uppercase mb-4">
              Discovery Index
            </p>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-5">
              Find work that<br />
              <span className="text-[#ef4444]">actually fits you.</span>
            </h1>
            <p className="text-[16px] leading-[1.6] text-[#64748b] font-medium max-w-[500px]">
              Direct forge entry into {totalJobs.toLocaleString()} verified external opportunities.
            </p>
          </div>

          {/* thorug thif form , we are taking the quick search input 
from the user */}
          <form
            onSubmit={(e) => { e.preventDefault(); fetchJobs(quickSearch, 1); navigate(`/student/jobs?q=${encodeURIComponent(quickSearch)}`); }}
            className="relative w-full md:w-[420px]"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
            <input
              value={quickSearch}
              onChange={e => setQuickSearch(e.target.value)}
              placeholder="Design, Tech, Google..."
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
              onClear={() => setFilters({ search: "", role: "", min_salary: "", max_salary: "", job_type: "", work_location: [] })}
              activeCount={activeFilterCount}
            />
          </aside>

          {/* Jobs Main - 2 Cards per row */}
          <div className="flex-1 min-w-0 flex flex-col gap-8 w-full">

            {!loading && totalJobs > 0 && (
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <p className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[2.5px]">
                  Analysis: Showing {showingFrom}-{showingTo} of {totalJobs.toLocaleString()} roles
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                  <span className="text-[11px] font-black text-black uppercase tracking-widest">Live Forge</span>
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
              ) : (
                jobs.map((job, idx) => <JobItem key={job.id || idx} job={job} />)
              )}
            </div>

            {/* Pagination....
the user can shift to diffrent pages based on this pagination section */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between pt-10 border-t border-neutral-100">
                <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[2px]">Page {currentPage} of {totalPages}</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => { setCurrentPage(p => Math.max(p - 1, 1)); fetchJobs(quickSearch, currentPage - 1); }}
                    disabled={currentPage === 1}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl border border-neutral-200 bg-white text-black hover:bg-neutral-50 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => { setCurrentPage(p => Math.min(p + 1, totalPages)); fetchJobs(quickSearch, currentPage + 1); }}
                    disabled={currentPage === totalPages}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl border border-neutral-200 bg-white text-black hover:bg-neutral-50 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}