import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import PageLayout from "../../components/PageLayout";
import JobList from "../../components/JobList";
import { getJobs } from "../../services/externalJobsService";

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
    navigate(`/student/jobs?q=${encodeURIComponent(query)}`);
  };

  const currentJobs = jobs;
  const totalPages = Math.min(Math.ceil(totalJobs / jobsPerPage), 10);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <PageLayout>

      {/* Hero section */}
      <div className="max-w-3xl mb-16 animate-fade-in-down">
        <div className="mb-10">
          <p className="text-xs font-bold tracking-[1px] text-black uppercase mb-3">
            Fully Yours
          </p>
          <h1 className="text-[2.5rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-black mb-3">
            Discover roles that <br className="hidden md:block" />  <span style={{ color: "#ef4444" }}>match your skills.</span>
          </h1>
          <p className="text-[1.1rem] leading-[1.7] text-black max-w-[540px] font-medium opacity-80">
            Explore opportunities tailored to your skills — role matches, salary insights, and culture fit.
          </p>
        </div>

        {/* submitting the form for job fetch */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mt-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black" size={20} />
          <input
            className="cs-input !pl-14 !py-5 !rounded-3xl !border-2 !border-[#ef4444]/20 text-base"
            placeholder="Job title, company, or keyword"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn-primary absolute right-2.5 top-2.5 bottom-2.5 px-10">
            Search
          </button>
        </form>


        {/* job filters through location and company 
Not too productive ,need to change later(Remaindder)*/}
        <div className="flex flex-wrap gap-4 mt-8">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="cs-input !w-auto !px-5 !py-3 !rounded-2xl !border-[#b3eefb] font-bold"
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
            className="cs-input !w-auto !px-5 !py-3 !rounded-2xl !border-[#b3eefb] font-bold"
          >
            <option value="">🏢 All Companies</option>
            <option value="Google">Google</option>
            <option value="Microsoft">Microsoft</option>
            <option value="Amazon">Amazon</option>
          </select>
        </div>

      </div>

      {/*Displaying the fetched jobs*/}
      <div className="border-t border-[#ef4444]/10 pt-16">
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
                  className="btn-outline px-6 py-3 text-sm disabled:opacity-30 disabled:hover:scale-100"
                >
                  &larr; Previous
                </button>
                <span className="font-bold text-black text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="btn-outline px-6 py-3 text-sm disabled:opacity-30 disabled:hover:scale-100"
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


