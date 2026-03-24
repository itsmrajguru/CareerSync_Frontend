import { Pencil, Trash2, Quote, Briefcase, GraduationCap, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResumeCard({ profile, onEdit, onDelete }) {
  const navigate = useNavigate();
  if (!profile) return null;

  const skills = profile.skills ? profile.skills.split(",") : [];

  const handlePersonalizedSearch = () => {
    const query = profile.domain || profile.skills || "";
    navigate(`/jobs?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="bg-white border border-neutral-100 p-8 md:p-10 w-full max-w-xl relative group transition-all flex flex-col font-sans">
      <div className="flex justify-between items-start mb-8 pb-8 border-b border-neutral-100">
        <div>
          <p className="text-xs font-bold text-primary-400 tracking-widest uppercase mb-2">
            CANDIDATE PROFILE
          </p>
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-2">
            {profile.full_name}
          </h2>
          {profile.domain && <p className="text-neutral-500 font-bold text-sm">{profile.domain}</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-primary-500 hover:bg-primary-50 transition-colors"
            title="Edit Profile"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete Profile"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-10 flex-1">
        <section className="relative">
          <Quote size={32} className="absolute -left-2 -top-2 text-primary-100 opacity-50" />
          <p className="leading-relaxed relative z-10 pt-2 pl-4 border-l-2 border-primary-200">
            "{profile.summary}"
          </p>
        </section>
 
        <div className="grid grid-cols-1 gap-8">
          <section>
            <h4 className="flex items-center gap-2 text-neutral-900 text-xs font-bold uppercase tracking-widest mb-4">
              <Briefcase size={16} className="text-primary-400" /> Experience
            </h4>
            <p className="leading-relaxed whitespace-pre-line">
              {profile.work}
            </p>
          </section>
 
          <section>
            <h4 className="flex items-center gap-2 text-neutral-900 text-xs font-bold uppercase tracking-widest mb-4">
              <GraduationCap size={16} className="text-primary-400" /> Education
            </h4>
            <p className="leading-relaxed">
              {profile.education}
            </p>
          </section>
        </div>

        <section className="pt-8 border-t border-neutral-100">
          <h4 className="text-neutral-900 text-xs font-bold uppercase tracking-widest mb-5">
            Skills & Expertise
          </h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </section>
      </div>

      <div className="pt-10 mt-10 border-t border-neutral-100">
        <button
          onClick={handlePersonalizedSearch}
          className="w-full py-4 bg-neutral-900 text-white text-sm font-bold flex items-center justify-center gap-3 hover:bg-black transition-colors"
        >
          <Search size={16} className="text-white" />
          Find Matching Jobs
        </button>
      </div>
    </div>
  );
}