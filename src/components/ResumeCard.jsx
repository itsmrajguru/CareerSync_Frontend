
import { Pencil, Trash2, Quote, Briefcase, GraduationCap, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResumeCard({ profile, onEdit, onDelete }) {
  const navigate = useNavigate();
  if (!profile) return null;

  const skills = profile.skills ? profile.skills.split(",") : [];

  const handlePersonalizedSearch = () => {
    // Pass domain to query params for targeted job view
    const query = profile.domain || profile.skills || "";
    navigate(`/jobs?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden w-full max-w-lg relative group transition-all flex flex-col font-sans">
      <div className="h-1.5 w-full bg-indigo-500" />

      <div className="p-8 flex-1">
        <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">{profile.full_name}</h2>
            <div className="flex items-center gap-2">
              <p className="text-indigo-600 text-xs font-bold uppercase tracking-widest">Candidate Profile</p>
              {profile.domain && <span className="text-slate-400 text-xs font-medium">• {profile.domain}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
              title="Edit Profile"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Delete Profile"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <section className="relative pl-6 border-l-2 border-indigo-200">
            <Quote size={24} className="absolute -left-3 -top-2 text-indigo-400 bg-white p-0.5" />
            <p className="text-slate-600 text-sm italic leading-relaxed font-medium">
              "{profile.summary}"
            </p>
          </section>

          <div className="grid grid-cols-1 gap-6">
            <section>
              <h4 className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <Briefcase size={14} className="text-indigo-500" /> Experience
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{profile.work}</p>
            </section>

            <section>
              <h4 className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <GraduationCap size={14} className="text-indigo-500" /> Education
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed border-l-2 border-slate-100 pl-3">
                {profile.education}
              </p>
            </section>
          </div>

          <section>
            <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 pt-6 border-t border-slate-100">
              Skills & Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="p-5 bg-slate-50 border-t border-slate-100">
        <button
          onClick={handlePersonalizedSearch}
          className="w-full py-3.5 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <Search size={16} className="text-white" />
          Search Personalized Results
        </button>
      </div>

    </div>
  );
}