import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { getJobs } from "../api";
import Navbar from "../components/Navbar";
import JobList from "../components/JobList";

export default function DashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Note: ProtectedRoute already handles auth redirect, but keeping as safety net
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
      const data = await getJobs(q, 1, 10);
      setJobs(data.jobs || []);
    } catch {
      setError("Unable to reach the career server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-500 pb-20 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-neutral-700">
              Find Jobs That Actually Match Your Skills
            </h1>
            <p className="text-neutral-400 text-base mb-8 max-w-xl">
              Search verified jobs, track applications, and build your resume — all in one place.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchJobs(query);
              }}
              className="relative max-w-lg"
            >
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                className="w-full pl-10 pr-28 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm text-neutral-700 transition-all"
                placeholder="Job title, company, or keyword"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-lg bg-primary-500 text-white text-xs font-bold active:scale-95 transition-all shadow-sm hover:bg-primary-600">
                Search
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-primary-50 border border-primary-100 rounded-2xl flex items-center justify-center mb-5 rotate-3 shadow-sm">
              <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-700 mb-2">Accelerate Your Career</h3>
            <p className="text-neutral-400 text-sm">Discover your potential with verified roles from top tier companies.</p>
          </div>

          <div className="md:col-span-3 bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
            <div className="mb-8 flex items-center justify-between border-b border-neutral-200 pb-4">
              <h3 className="text-xl font-bold text-neutral-700">Latest Opportunities</h3>
              <button
                onClick={() => navigate(`/jobs?q=${encodeURIComponent(query)}`)}
                className="text-sm font-semibold text-neutral-500 hover:text-primary-500 hover:underline transition-colors"
              >
                View all jobs &rarr;
              </button>
            </div>

            {error ? (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                {error}
              </div>
            ) : (
              <JobList jobs={jobs} loading={loading} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
