import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search, Filter, X, MapPin, Briefcase,
  Users, CheckCircle, BriefcaseBusiness,
  Bookmark, BookmarkCheck
} from "lucide-react";
import PageLayout from "../../components/PageLayout";
import { getJobs, toggleSaveJob, getSavedJobs } from "../../services/jobsService";

/* This page has 3 componets
a) jobItem 
b) Filter panel
c) the main job page that combines both jobItem and filterpanel

and this page is dedicated to show the Jobs coming from the db*/

/*Here we added the filter functionality along with 2 grid structure */
function JobItem({ job, hasApplied, isSavedInitially, onToggleSave }) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(isSavedInitially);

  /* this function calls the toggleSaveJob,
and using the state setIsSaved , we store the job in the isSaved 
state otherwise , we keep it as it is...  */
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


  /* removes _ and make the title uppercase */
  const contractLabel = job.jobType
    ? job.jobType.replace("_", " ").toUpperCase()
    : "FULL TIME";

  const locationLabel = job.location || "Remote";

  return (
    <div
      /* redirect user to jobdetails page */
      onClick={() => navigate(`/student/jobs/${job._id}`, { state: { job } })}
      className="cs-card-modern flex flex-col group transition-all cursor-pointer relative h-full p-5"
    >
      {/* Platform Standard: Applied Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        {hasApplied && (
          <div className="flex items-center gap-1 bg-[#ef4444]/5 text-[#ef4444] px-3 py-1 rounded-full text-[10px] font-bold border border-[#ef4444]/10 uppercase tracking-widest">
            <CheckCircle size={10} /> Applied
          </div>
        )}
        <button
          onClick={handleSave}
          className={`p-2 rounded-xl border transition-all ${isSaved
            ? "bg-[#ef4444] border-[#ef4444] text-white"
            : "bg-white border-neutral-100 text-[#94a3b8] hover:text-[#ef4444] shadow-sm"
            }`}
        >
          {isSaved ? <BookmarkCheck size={16} fill="currentColor" /> : <Bookmark size={16} />}
        </button>
      </div>


      {/* job section to match with the website fixed layouts and styles...
      this function returns the job decsriotion to show on the card*/}
      {/* other job info */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors shadow-sm">
            {job.company?.logo ? (
              <img src={job.company.logo} alt={job.company.name} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <BriefcaseBusiness size={18} className="text-neutral-400" />
            )}
          </div>
          <div className="min-w-0">
            <span className="cs-section-label !mb-0.5">
              {job.company?.name || "Confidential"}
            </span>
            <h3 className="text-[16px] font-bold text-black leading-tight truncate group-hover:text-[#ef4444] transition-colors">
              {job.title}
            </h3>
          </div>
        </div>

      </div>

      {/* Description over the main Header added in the card*/}
      <p className="cs-subtext mb-6 line-clamp-2 text-[13px] font-medium">
        {job.description?.replace(/<[^>]*>/g, "") || "Detailed career requirements for this position are available upon forge entry."}
      </p>

      {/*Other icons and data to display in the jobcard */}
      <div className="grid grid-cols-2 gap-y-3 mb-6">
        {[
          { icon: <MapPin size={12} />, text: locationLabel },
          { icon: <Users size={12} />, text: "Direct Apply" },
          { icon: <Briefcase size={12} />, text: contractLabel },
          { icon: <CheckCircle size={12} />, text: "Internal" },
        ].map(({ icon, text }, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px] text-neutral-500 font-bold truncate">
            <span className="text-neutral-400">{icon}</span>
            <span className="truncate uppercase tracking-wider">{text}</span>
          </div>
        ))}
      </div>

      {/* this is the view details button which
      redirects the user to the jobdetails page */}
      <div className="mt-auto pt-4 flex items-center justify-between border-t border-neutral-100">
        <span className="text-[11px] font-bold text-black uppercase tracking-wider group-hover:text-[#ef4444] transition-colors">
          View Details
        </span>
        <span className="text-black font-bold text-lg group-hover:translate-x-1 transition-transform">&rarr;</span>
      </div>
    </div>
  );
}

// this is the full function for the filter section
function FilterPanel({ filters, onChange, onClear, activeCount }) {

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden sticky top-8 shadow-sm">
      <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
        <div className="flex items-center gap-2.5">
          <Filter size={15} className="text-black" />
          <span className="cs-section-label !mb-0 font-black">Forge Filters</span>
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
            className="cs-input !py-3 !text-[12px] !rounded-xl !border-neutral-100 font-bold"
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
            className="cs-input !py-3 !text-[12px] !rounded-xl !appearance-none cursor-pointer font-bold"
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
            className="cs-input !py-3 !text-[12px] !rounded-xl !border-neutral-100 font-bold"
          />
        </div>

        {/* Job Type Select */}
        <div>
          <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1 mb-2 block">Schedules</label>
          <select
            value={filters.jobType}
            onChange={e => onChange("jobType", e.target.value)}
            className="cs-input !py-3 !text-[12px] !rounded-xl !appearance-none cursor-pointer font-bold"
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
export default function ShowJobsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [quickSearch, setQuickSearch] = useState(searchParams.get("q") || "");
  const jobsPerPage = 12;


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
    fetchInitialData(q);
  }, [searchParams]);

  /* this calls both the getJobs and getSavedJobs functionalities*/
  async function fetchInitialData(q) {
    setLoading(true);
    await Promise.all([
      fetchJobs({ search: q }, 1),
      fetchSavedJobIds()
    ]);
    setLoading(false);
  }

  /* change 3 :We initially fetch the saved Jobs,and store
all the savedjobs Id's into the state setSavedJobIds so that 
we could display them as saved on the page... */
  async function fetchSavedJobIds() {
    try {
      const response = await getSavedJobs();
      const ids = new Set(response.savedJobs.map(j => j._id));
      setSavedJobIds(ids);
    } catch (err) {
      console.error("Failed to fetch saved jobs:", err);
    }
  }

  /*fetchJobs Functionality fetches all jobs with pagination support */
  async function fetchJobs(f = filters, page = currentPage) {
    setError("");
    try {
      const response = await getJobs({ ...f, page, limit: jobsPerPage });
      /* logic: accessing response.jobs directly due to api interceptor */
      setJobs(response.jobs || []);
      setTotalPages(response.totalPages || 1);
      setTotalJobs(response.totalJobs || 0);
      setCurrentPage(response.currentPage || 1);
    } catch {
      setError("Unable to process the job forge. Try again later.");
    }
  }


  // Effect to re-fetch when relevant filters change
  useEffect(() => {
    fetchJobs(filters, 1);
  }, [filters.industry, filters.jobType, filters.location, filters.search]);

  const activeFilterCount = [filters.search, filters.industry, filters.location, filters.jobType].filter(Boolean).length;

  return (
    <PageLayout>
      <div className="pb-20 animate-fade-in">

        {/* Section 1 :Hero Section */}
        {/* This is the herosection that matches the exact styles with the actual
        existing pages of the website */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-14 pt-4">
          <div>
            <p className="cs-section-label">
              Internal Forge
            </p>
            <h1 className="cs-page-title">
              Build your career <br />
              <span className="text-[#ef4444]">directly with partners.</span>
            </h1>
            <p className="cs-subtext max-w-[500px]">
              Direct forge entry into verified internal opportunities from our registered companies.
            </p>
          </div>


          {/* section 2 :Search Jobs Section */}

          {/* through this form , we ttook the query through Onchange ,
          and saved it in quickserach using setquicksearch
          then passed the quicksearch to the setFilters called in the filter panel*/}
          <form
            onSubmit={(e) => { e.preventDefault(); setFilters(p => ({ ...p, search: quickSearch })); }}
            className="relative w-full lg:w-[420px]"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
            <input
              value={quickSearch}
              onChange={e => setQuickSearch(e.target.value)}
              placeholder="Design, Tech, Engineering..."
              className="cs-input !pl-14 !pr-32 !py-4 !rounded-xl !text-[13px] font-bold"
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 px-8 bg-black text-white rounded-lg text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all">
              search
            </button>
          </form>
        </div>

        {/* section 3 : Filter Panel + Job Display section */}
        {/* section 3 : SubSection a ->Filter Panel  */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Re-integrated Filter Panel (All original fields restored) */}
          <aside className="w-full lg:w-[280px] flex-shrink-0">

            {/* passed the props to the filterpanel function  */}
            <FilterPanel
              filters={filters}
              onChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))}
              onClear={() => setFilters({ search: "", industry: "", location: "", jobType: "" })}
              activeCount={activeFilterCount}
            />
          </aside>

          {/* section 3 : SubSection b -> Displaying the Job section */}

          {/* Jobs Main - 2 Cards per row */}
          <div className="flex-1 min-w-0 flex flex-col gap-8 w-full">

            {!loading && totalJobs > 0 && (
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <p className="cs-section-label !mb-0">
                  Analysis: Showing {Math.min((currentPage - 1) * jobsPerPage + 1, totalJobs)}-{Math.min(currentPage * jobsPerPage, totalJobs)} of {totalJobs} roles
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                  <span className="text-[11px] font-black text-black uppercase tracking-widest">Active Jobs</span>
                </div>
              </div>
            )}

            {/* display error returned by the backend */}
            {error && (
              <div className="p-6 bg-red-50 rounded-xl text-[#ef4444] font-bold text-sm flex items-center gap-3">
                <X size={18} /> {error}
              </div>
            )}

            {/* Two cards per row 
this calls the jobItem and passes props accordingly*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="bg-neutral-50/50 border border-neutral-100 rounded-[28px] h-[260px] animate-pulse" />
                ))
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <JobItem
                    key={job._id}
                    job={job}
                    /* /this checks that wherther this current job
                    is saved or not ? */
                    isSavedInitially={savedJobIds.has(job._id)}
                  />
                ))
              ) : (

                <div className="md:col-span-2 py-20 text-center">
                  <p className="text-[#64748b] font-bold">No internal jobs found matching your criteria.</p>
                </div>
              )}
            </div>

            {/* Pagination....
the user can shift to diffrent pages based on this pagination section */}
            
            {/* this means that show the pages only when loading is stopeed
            and pages > 1 */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between pt-10 border-t border-neutral-100">
                <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[2px]">Page {currentPage} of {totalPages}</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => { const p = Math.max(currentPage - 1, 1); setCurrentPage(p); fetchJobs(filters, p); }}
                    disabled={currentPage === 1}
                    className="w-12 h-12 flex items-center justify-center rounded-xl border border-neutral-200 bg-white text-black hover:bg-neutral-50 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <span className="w-4 h-4">&larr;</span>
                  </button>
                  <button
                    onClick={() => { const p = Math.min(currentPage + 1, totalPages); setCurrentPage(p); fetchJobs(filters, p); }}
                    disabled={currentPage === totalPages}
                    className="w-12 h-12 flex items-center justify-center rounded-xl border border-neutral-200 bg-white text-black hover:bg-neutral-50 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <span className="w-4 h-4">&rarr;</span>
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
