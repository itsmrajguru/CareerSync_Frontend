import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import PageLayout from "../components/PageLayout";
import JobList from "../components/JobList";
import { getJobs } from "../api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [locationFilter, setLocationFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  useEffect(() => {
    setQuery(initialQuery);
    fetchJobs(initialQuery, currentPage, locationFilter, companyFilter);
  }, [initialQuery, currentPage, locationFilter, companyFilter]);


  async function fetchJobs(q, page, location = "", company = "") {
    setLoading(true);
    setError("");

    try {

// Step 1: Build a composite query string for the search API
      let urlQuery = q;
      if (location) urlQuery += ` location:${location}`;
      if (company) urlQuery += ` company:${company} `;

// Step 2: now we will call the adzuna api service for that jobs
      const data = await getJobs(urlQuery, page, jobsPerPage);

// Step 3: save the jobs with local and total jobs
      setJobs(data.jobs || []);
      setTotalJobs(data.count || 0);
    } catch (err) {
      console.error("Job Fetching Error:", err);
      setError("Unable to fetch jobs. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

// Fetches the data for the searched query
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs(query, 1, locationFilter, companyFilter);
    navigate(`/jobs?q=${encodeURIComponent(query)}`);
  };

  const currentJobs = jobs;
  const totalPages = Math.min(Math.ceil(totalJobs / jobsPerPage), 10);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <PageLayout>

{/* Hero section */}
      <div className="max-w-3xl mb-16 animate-fade-in-down">
        <p className="text-xs font-bold text-neutral-900 tracking-widest uppercase mb-6">
          JOB BOARD
        </p>
        <h1 className="text-[3rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-neutral-900 mb-6">
          Discover roles that <br className="hidden md:block" /> <span className="text-primary-400">match your skills.</span>
        </h1>

{/* submitting the form for job fetch */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mt-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input
            className="w-full pl-14 pr-32 py-5 rounded-3xl bg-white border-2 border-neutral-100 focus:outline-none focus:border-primary-300 focus:ring-4 focus:ring-primary-50 text-base transition-all shadow-sm text-neutral-900 font-medium placeholder-neutral-400"
            placeholder="Job title, company, or keyword"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="absolute right-2.5 top-2.5 bottom-2.5 px-10 rounded-full bg-primary-400 text-white text-base font-bold shadow-[0_4px_14px_0_rgba(2,188,240,0.3)] hover:bg-primary-500 transition-transform active:scale-95">
            Search
          </button>
        </form>


{/* job filters through location and company 
Not too productive ,need to change later(Remaindder)*/}
        <div className="flex flex-wrap gap-4 mt-8">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-5 py-3 rounded-2xl border border-neutral-200 bg-white text-neutral-600 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-50 hover:border-neutral-300 transition-colors shadow-sm cursor-pointer"
          >
            <option value="">🗺️ All Locations</option>
            <option value="Remote">Remote</option>
            <option value="New York">New York</option>
            <option value="San Francisco">San Francisco</option>
            <option value="London">London</option>
          </select>

          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="px-5 py-3 rounded-2xl border border-neutral-200 bg-white text-neutral-600 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-50 hover:border-neutral-300 transition-colors shadow-sm cursor-pointer"
          >
            <option value="">🏢 All Companies</option>
            <option value="Google">Google</option>
            <option value="Microsoft">Microsoft</option>
            <option value="Amazon">Amazon</option>
          </select>
        </div>
      </div>

{/*Displaying the fetched jobs*/}
      <div className="border-t border-neutral-100 pt-16">
        {error ? (
          <div className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-600 font-bold text-center">
            {error}
          </div>
        ) : (
          <>
            <JobList jobs={currentJobs} loading={loading} />

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-16 pb-12">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-6 py-3 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-30 text-sm font-bold text-neutral-800 shadow-sm transition-colors"
                >
                  &larr; Previous
                </button>
                <span className="font-bold text-neutral-400 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-30 text-sm font-bold text-neutral-800 shadow-sm transition-colors"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
