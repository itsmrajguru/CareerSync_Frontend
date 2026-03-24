
import { useState, useEffect } from "react";
import { Edit2, Save, X, Github, Linkedin, Globe, MapPin, Calendar, User as UserIcon } from "lucide-react";

export default function ProfileForm({ initialData, onSubmit, onToggleEdit, loading, editing }) {
  // Prevent uncontrolled input warnings
  const [formData, setFormData] = useState({
    full_name: "",
    domain: "",
    gender: "",
    location: "",
    birthday: "",
    website: "",
    github: "",
    linkedin: "",
    summary: "",
    work: "",
    education: "",
    skills: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        full_name: initialData.full_name || "",
        domain: initialData.domain || "",
        gender: initialData.gender || "",
        location: initialData.location || "",
        birthday: initialData.birthday || "",
        website: initialData.website || "",
        github: initialData.github || "",
        linkedin: initialData.linkedin || "",
        summary: initialData.summary || "",
        work: initialData.work || "",
        education: initialData.education || "",
        skills: initialData.skills || ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const processUrl = (url) => {
      if (!url) return "";
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return `https://${url}`;
      }
      return url;
    };

    const finalData = {
      ...formData,
      website: processUrl(formData.website),
      github: processUrl(formData.github),
      linkedin: processUrl(formData.linkedin),
    };

    onSubmit(finalData);
  };


  const inputBase = `w-full p-4 bg-white border border-neutral-200 text-neutral-900 text-base placeholder-neutral-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all font-bold`;
  const inputDisabled = `opacity-50 cursor-default bg-neutral-50 text-neutral-500`;

  return (
    <div className="w-full font-sans">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-200 pb-2 mb-2">Basic Info</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <UserIcon size={14} className="absolute left-3.5 top-3.5 text-neutral-400" />
                <input
                  disabled={!editing}
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`${inputBase} pl-10 pr-3 py-3 ${!editing ? inputDisabled : ""}`}
                  placeholder="e.g. Alex Johnson"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider ml-1">Domain / Job Title</label>
              <input
                disabled={!editing}
                name="domain"
                type="text"
                value={formData.domain}
                onChange={handleChange}
                className={`${inputBase} ${!editing ? inputDisabled : ""}`}
                placeholder="e.g. Frontend Developer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider ml-1">Gender</label>
              <input
                disabled={!editing}
                name="gender"
                type="text"
                value={formData.gender}
                onChange={handleChange}
                className={`${inputBase} ${!editing ? inputDisabled : ""}`}
                placeholder="e.g. Male/Female"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider ml-1">Location</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3.5 top-3.5 text-neutral-400" />
                <input
                  disabled={!editing}
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className={`${inputBase} pl-10 pr-3 py-3 ${!editing ? inputDisabled : ""}`}
                  placeholder="City, Country"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider ml-1">Birthday</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3.5 top-3.5 text-neutral-400" />
                <input
                  disabled={!editing}
                  name="birthday"
                  type="text"
                  value={formData.birthday}
                  onChange={handleChange}
                  className={`${inputBase} pl-10 pr-3 py-3 ${!editing ? inputDisabled : ""}`}
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider ml-1">Summary</label>
            <textarea
              disabled={!editing}
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              className={`${inputBase} min-h-[80px] ${!editing ? inputDisabled : ""}`}
              rows="3"
              placeholder="Brief professional summary..."
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-200 pb-2 mb-2">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider ml-1">GitHub</label>
              <div className="relative">
                <Github size={14} className="absolute left-3.5 top-3.5 text-neutral-400" />
                <input
                  disabled={!editing}
                  name="github"
                  type="text"
                  value={formData.github}
                  onChange={handleChange}
                  className={`${inputBase} pl-10 pr-3 py-3 ${!editing ? inputDisabled : ""}`}
                  placeholder="github.com/user"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider ml-1">LinkedIn</label>
              <div className="relative">
                <Linkedin size={14} className="absolute left-3.5 top-3.5 text-neutral-400" />
                <input
                  disabled={!editing}
                  name="linkedin"
                  type="text"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className={`${inputBase} pl-10 pr-3 py-3 ${!editing ? inputDisabled : ""}`}
                  placeholder="linkedin.com/in/user"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider ml-1">Website</label>
              <div className="relative">
                <Globe size={14} className="absolute left-3.5 top-3.5 text-neutral-400" />
                <input
                  disabled={!editing}
                  name="website"
                  type="text"
                  value={formData.website}
                  onChange={handleChange}
                  className={`${inputBase} pl-10 pr-3 py-3 ${!editing ? inputDisabled : ""}`}
                  placeholder="your-portfolio.com"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-200 pb-2 mb-2">Professional Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider ml-1">Experience</label>
              <textarea
                disabled={!editing}
                name="work"
                value={formData.work}
                onChange={handleChange}
                className={`${inputBase} min-h-[100px] ${!editing ? inputDisabled : ""}`}
                placeholder="Work history..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider ml-1">Education</label>
              <textarea
                disabled={!editing}
                name="education"
                value={formData.education}
                onChange={handleChange}
                className={`${inputBase} min-h-[100px] ${!editing ? inputDisabled : ""}`}
                placeholder="Degrees..."
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider ml-1">Skills (Comma Separated)</label>
            <input
              disabled={!editing}
              name="skills"
              type="text"
              value={formData.skills}
              onChange={handleChange}
              className={`${inputBase} ${!editing ? inputDisabled : ""}`}
              placeholder="e.g. Python, React"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-3 pt-4 border-t border-neutral-200 z-20">
          {editing ? (
            <>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {loading ? "Saving..." : <><Save size={16} /> Save Profile</>}
              </button>
              <button
                type="button"
                onClick={() => onToggleEdit(false)}
                className="px-6 py-3 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <X size={16} /> Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onToggleEdit(true)}
              className="w-full mt-2 py-3.5 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-full text-primary-600 font-bold flex items-center justify-center gap-2 transition-all group"
            >
              <Edit2 size={16} className="group-hover:scale-110 transition-transform" /> Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}