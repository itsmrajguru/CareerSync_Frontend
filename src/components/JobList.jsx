
import JobCard from "./JobCard";

export default function JobList({ jobs, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="h-52 bg-slate-100 rounded-2xl animate-pulse border border-slate-200"
          />
        ))}
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="text-center text-slate-500 py-20 font-medium bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
        No jobs found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {jobs.map((job, idx) => (
        <JobCard key={job.id || idx} job={job} />
      ))}
    </div>
  );
}





