import { Building2, MapPin, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function JobCard({ job }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/jobs/${job.id}`, { state: { job } });
  };

  return (
    <div
      className="bg-white border hover:border-primary-300 border-[#b3eefb] rounded-2xl p-6 flex flex-col cursor-pointer group hover:shadow-[0_15px_45px_rgba(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.03] transform-gpu"
      onClick={handleViewDetails}
    >
{/* Company name */}
      <span className="text-xs font-bold text-neutral-500 tracking-widest uppercase mb-3">
        {job.company?.display_name || "Company"}
      </span>

{/* Title — like the feature card h3 */}
      <h4 className="font-bold text-base leading-snug text-neutral-900 group-hover:text-primary-500 transition-colors line-clamp-2 mb-3">
        {job.title}
      </h4>

{/* Description — like the feature card paragraph */}
      <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 mb-5">
        {job.description?.replace(/<[^>]*>/g, "")}
      </p>

{/* Meta tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="flex items-center gap-1.5 text-xs text-neutral-500 bg-white border border-[#b3eefb] rounded-full px-3 py-1">
          <MapPin size={12} className="text-neutral-300" />
          {job.location?.display_name?.split(",")[0] || "Remote"}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-neutral-500 bg-white border border-[#b3eefb] rounded-full px-3 py-1">
          <Briefcase size={12} className="text-neutral-300" />
          {job.contract_time ? job.contract_time.replace("_", " ") : "Full Time"}
        </span>
      </div>

{/* Footer action */}
      <div className="mt-auto border-t border-[#b3eefb] pt-4 flex items-center justify-between">
        <span className="text-sm font-bold text-neutral-900 group-hover:text-primary-500 transition-colors">
          View Details
        </span>
        <span className="text-neutral-300 group-hover:text-primary-400 transform group-hover:translate-x-1 transition-all">
          &rarr;
        </span>
      </div>
    </div>
  );
}