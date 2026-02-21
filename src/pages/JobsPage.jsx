import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import Navbar from "../components/Navbar";
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
      let urlQuery = q;
      if (location) urlQuery += ` location:${location}`;
      if (company) urlQuery += ` company:${company}`;

      const data = await getJobs(urlQuery, page, jobsPerPage);
      setJobs(data.jobs || []);
      setTotalJobs(data.count || 0);
    } catch {
      setError("Unable to fetch jobs.");
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs(query, 1, locationFilter, companyFilter);
    navigate(`/jobs?q=${encodeURIComponent(query)}`);
  };

  // Direct bind server paginated results
  const currentJobs = jobs;
  // Arbitrary pagination cap
  const totalPages = Math.min(Math.ceil(totalJobs / jobsPerPage), 10);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <div className="mx-4 mt-6">
        <div className="max-w-5xl mx-auto relative z-10">

          <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 md:p-12 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-slate-900">
              Find Jobs That Actually Match Your Skills
            </h1>
            <p className="text-slate-500 text-base mb-8 max-w-xl mx-auto font-medium">
              Search verified jobs, track applications, and build your resume — all in one place.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="w-full pl-12 pr-32 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm transition-all text-slate-900"
                placeholder="Job title, company, or keyword"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 rounded-lg bg-indigo-600 text-white text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors">
                Search
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium shadow-sm hover:border-slate-300 transition-colors"
              >
                <option value="">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="New York">New York</option>
                <option value="San Francisco">San Francisco</option>
                <option value="London">London</option>
              </select>

              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium shadow-sm hover:border-slate-300 transition-colors"
              >
                <option value="">All Companies</option>
                <option value="Google">Google</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Amazon">Amazon</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 md:p-8">
        {error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium text-center">
            {error}
          </div>
        ) : (
          <>
            <JobList jobs={currentJobs} loading={loading} />

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8 pb-12">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-sm font-semibold text-slate-700 shadow-sm"
                >
                  Previous
                </button>
                <span className="font-medium text-slate-500 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-sm font-semibold text-slate-700 shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
