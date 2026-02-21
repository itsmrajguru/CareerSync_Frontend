
import { Building2, MapPin, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function JobCard({ job }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/jobs/${job.id}`, { state: { job } });
  };

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
      onClick={handleViewDetails}
    >
      <div>
        <h4 className="font-bold text-lg mb-3 text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1">{job.title}</h4>

        <div className="text-xs text-slate-500 flex flex-col gap-2 mb-4 font-medium">
          <span className="flex items-center gap-2">
            <Building2 size={15} className="text-slate-400" /> {job.company?.display_name || "Company"}
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={15} className="text-slate-400" />{" "}
            {job.location?.display_name?.split(",")[0]}
          </span>
        </div>

        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-6">
          {job.description?.replace(/<[^>]*>/g, "")}
        </p>
      </div>

      <button
        className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 hover:text-slate-900 transition-colors w-full"
      >
        View Details <Briefcase size={14} />
      </button>
    </div>
  );
}
