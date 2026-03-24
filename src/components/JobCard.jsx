
import { Building2, MapPin, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function JobCard({ job }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/jobs/${job.id}`, { state: { job } });
  };

  return (
    <div
      className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer group"
      onClick={handleViewDetails}
    >
      <div>
        <h4 className="font-bold text-lg mb-3 text-neutral-700 group-hover:text-primary-500 transition-colors line-clamp-1">{job.title}</h4>

        <div className="text-xs text-neutral-400 flex flex-col gap-2 mb-4 font-medium">
          <span className="flex items-center gap-2">
            <Building2 size={15} className="text-neutral-400" /> {job.company?.display_name || "Company"}
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={15} className="text-neutral-400" />{" "}
            {job.location?.display_name?.split(",")[0]}
          </span>
        </div>

        <p className="text-sm text-neutral-500 line-clamp-3 leading-relaxed mb-6">
          {job.description?.replace(/<[^>]*>/g, "")}
        </p>
      </div>

      <button
        className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-50 border border-primary-200 text-primary-600 font-semibold text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors w-full"
      >
        View Details <Briefcase size={14} />
      </button>
    </div>
  );
}
