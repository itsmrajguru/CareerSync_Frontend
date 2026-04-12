import { BriefcaseBusiness, MapPin, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function JobCard({ job }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/student/jobs/${job.id}`, { state: { job } });
  };

  return (
    <div
      className="cs-card flex flex-col cursor-pointer group"
      onClick={handleViewDetails}
    >
{/* Company name */}
      <span className="text-xs font-bold text-black tracking-widest uppercase mb-3">
        {job.company?.display_name || "Company"}
      </span>

{/* Title — like the feature card h3 */}
      <h4 className="font-bold text-base leading-snug text-black group-hover:text-black transition-colors line-clamp-2 mb-3">
        {job.title}
      </h4>

{/* Description — like the feature card paragraph */}
      <p className="text-sm text-black leading-relaxed line-clamp-3 mb-5">
        {job.description?.replace(/<[^>]*>/g, "")}
      </p>

{/* Meta tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="cs-badge">
          <MapPin size={12} className="mr-1 opacity-70" />
          {job.location?.display_name?.split(",")[0] || "Remote"}
        </span>
        <span className="cs-badge">
          <Briefcase size={12} className="mr-1 opacity-70" />
          {job.contract_time ? job.contract_time.replace("_", " ") : "Full Time"}
        </span>
      </div>

{/* Footer action */}
      <div className="cs-card-divider mt-auto !p-0 !m-0 pt-4 flex items-center justify-between">
        <span className="text-sm font-bold text-black group-hover:text-black transition-colors">
          View Details
        </span>
        <span className="text-black group-hover:text-black transform group-hover:translate-x-1 transition-all">
          &rarr;
        </span>
      </div>
    </div>
  );
}

