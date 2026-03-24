import JobCard from "./JobCard";

export default function JobList({ jobs, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="h-64 bg-neutral-50/50 rounded-none border border-neutral-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="col-span-full w-full text-center text-neutral-400 py-32 font-bold px-4 border border-dashed border-neutral-200 bg-neutral-50/30">
        No jobs found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job, idx) => (
        <JobCard key={job.id || idx} job={job} />
      ))}
    </div>
  );
}
