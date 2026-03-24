import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { getJobs } from "../api";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";

export default function DashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchJobs("");
  }, []);

  async function fetchJobs(q) {
    setLoading(true);
    setError("");
    try {
      const data = await getJobs(q, 1, 4);
      setJobs(data.jobs || []);
    } catch {
      setError("Unable to reach the career server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-neutral-800 font-sans selection:bg-primary-100 selection:text-primary-900 pb-24">
      <Navbar />

      <main className="max-w-[900px] mx-auto px-7 pt-14">

        {/* this is the hero section */}
        <p className="text-xs font-bold tracking-[1px] text-neutral-400 uppercase mb-4">
          Hello {user.username || "User"}!
        </p>
        <h1 className="text-[3rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-neutral-900 mb-4">
          Find work that<br />
          actually <span className="text-primary-400">fits you.</span>
        </h1>
        <p className="text-[1.125rem] leading-[1.7] text-black max-w-[560px] font-normal mb-10">
          Browse thousands of verified jobs and internships. Upload your resume, track
          your applications, and land your next role — all in one place.
        </p>

        {/* the dummy cards we added manually */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
            <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-[0.5px] mb-2">Jobs available</p>
            <p className="text-[28px] font-extrabold tracking-[-0.5px] text-neutral-900">12,400</p>
            <p className="text-[13px] text-neutral-500 mt-1">Updated today</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
            <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-[0.5px] mb-2">Applications</p>
            <p className="text-[28px] font-extrabold tracking-[-0.5px] text-neutral-900">3</p>
            <p className="text-[13px] text-neutral-500 mt-1">2 active, 1 saved</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
            <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-[0.5px] mb-2">Resume score</p>
            <p className="text-[28px] font-extrabold tracking-[-0.5px] text-neutral-900">74%</p>
            <p className="text-[13px] text-neutral-500 mt-1">Good — room to improve</p>
          </div>
        </div>

        {/* This rest block is calling the  jobcards one by one */}

        {/* search Bar for jobs */}
        <div className="border-t border-neutral-100 pt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-display-sm text-neutral-900 mb-2">
                Latest Opportunities
              </h2>
              <p className="text-neutral-500 font-medium text-base">Hand-picked roles matching your skillset.</p>
            </div>

            {/* Search bar form submit */}
            <form
              onSubmit={(e) => { e.preventDefault(); fetchJobs(query); }}
              className="relative w-full md:w-96"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                className="w-full pl-12 pr-24 py-3 rounded-2xl bg-white border border-neutral-200 focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 text-sm text-neutral-900 font-medium transition-all shadow-sm"
                placeholder="Search jobs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 px-6 rounded-full bg-primary-400 text-white text-sm font-bold active:scale-95 transition-all hover:bg-primary-500">
                Search
              </button>
            </form>
          </div>

          {error ? (
            <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                [1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-64 bg-neutral-50/50 rounded-2xl border border-neutral-100 animate-pulse" />
                ))
              ) : (
                <>
                  {jobs.map((job, idx) => (
                    <JobCard key={job.id || idx} job={job} />
                  ))}
                  
                  {/* View All Jobs Circular Button */}
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => navigate(`/jobs?q=${encodeURIComponent(query)}`)}
                      className="inline-flex items-center gap-2 px-10 py-3 bg-neutral-900 text-white font-bold text-sm rounded-full hover:bg-black transition-all active:scale-95"
                    >
                      View all jobs &rarr;
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
