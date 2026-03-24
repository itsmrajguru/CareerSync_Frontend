
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
    <div className="bg-white border border-neutral-200 shadow-sm rounded-3xl overflow-hidden w-full max-w-lg relative group transition-all flex flex-col font-sans">
      {/* Top accent bar — terracotta */}
      <div className="h-1.5 w-full bg-primary-500" />

      <div className="p-8 flex-1">
        <div className="flex justify-between items-start mb-8 border-b border-neutral-200 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-700 tracking-tight mb-1">{profile.full_name}</h2>
            <div className="flex items-center gap-2">
              <p className="text-primary-500 text-xs font-bold uppercase tracking-widest">Candidate Profile</p>
              {profile.domain && <span className="text-neutral-400 text-xs font-medium">• {profile.domain}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-lg text-neutral-400 hover:text-primary-500 hover:bg-neutral-50 transition-colors"
              title="Edit Profile"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Delete Profile"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <section className="relative pl-6 border-l-2 border-primary-200">
            <Quote size={24} className="absolute -left-3 -top-2 text-primary-400 bg-white p-0.5" />
            <p className="text-neutral-500 text-sm italic leading-relaxed font-medium">
              "{profile.summary}"
            </p>
          </section>

          <div className="grid grid-cols-1 gap-6">
            <section>
              <h4 className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Briefcase size={14} className="text-primary-500" /> Experience
              </h4>
              <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-line">{profile.work}</p>
            </section>

            <section>
              <h4 className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
                <GraduationCap size={14} className="text-primary-500" /> Education
              </h4>
              <p className="text-neutral-600 text-sm leading-relaxed border-l-2 border-neutral-200 pl-3">
                {profile.education}
              </p>
            </section>
          </div>

          <section>
            <h4 className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-3 pt-6 border-t border-neutral-200">
              Skills & Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-primary-50 border border-primary-200 text-primary-600 text-xs font-semibold"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="p-5 bg-neutral-50 border-t border-neutral-200">
        <button
          onClick={handlePersonalizedSearch}
          className="w-full py-3.5 bg-primary-500 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-sm hover:bg-primary-600 transition-colors"
        >
          <Search size={16} className="text-white" />
          Search Personalized Results
        </button>
      </div>
    </div>
  );
}