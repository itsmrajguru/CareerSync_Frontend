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
       <section className="d-hero mb-8">
         <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "60px" }}>
 
           {/* Left Column: Text & Actions */}
           <div style={{ flex: 1 }}>
             <div className="mb-7">
               <p className="text-[13px] font-bold tracking-[0.5px] text-[#475569] uppercase mb-2">
                 Fully Yours
               </p>
               <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-5">
                 Discover roles that <br />  <span style={{ color: "#ef4444" }}>match your skills.</span>
               </h1>
               <p className="text-[14px] leading-[1.6] text-[#64748b] font-medium max-w-[460px]">
                 Explore opportunities tailored to your skills — role matches, salary insights, and culture fit.
               </p>
             </div>
 
             {/* Search Bar - Compact matching layout */}
             <div className="mb-8">
               <form onSubmit={handleSearch} className="relative max-w-2xl">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" size={16} />
                 <input
                   className="cs-input !pl-11 !py-3.5 !rounded-2xl !border-[#ef4444]/10 text-sm shadow-sm"
                   placeholder="Job title, company, or keyword"
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                 />
                 <button className="btn-primary absolute right-1.5 top-1.5 bottom-1.5 px-6 !py-0 !rounded-xl !text-xs">
                   Search
                 </button>
               </form>
             </div>
 
             <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>
               <span className="flex items-center gap-1">✔ High Match Roles</span>
               <span style={{ opacity: 0.3 }}>·</span>
               <span className="flex items-center gap-1">✔ Salary Transparency</span>
               <span style={{ opacity: 0.3 }}>·</span>
               <span className="flex items-center gap-1">✔ Culture Insights</span>
             </div>
           </div>
 
           {/* Right Column: High-Fidelity Image */}
           <div className="hidden lg:block slide-in" style={{ flexShrink: 0, width: "360px" }}>
             <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9" }}>
               <img
                 src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80&auto=format&fit=crop"
                 alt="Jobs Portal"
                 style={{ width: "100%", height: "260px", objectFit: "cover", display: "block opacity-90" }}
               />
             </div>
           </div>
         </div>
       </section>


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


