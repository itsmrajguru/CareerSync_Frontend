import { useState, useEffect } from "react";
import {
  Github, Linkedin, Globe, MapPin, Calendar,
  User as UserIcon, Briefcase, GraduationCap,
  Search, Save, X, Edit2, Trash2, Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProfileList, createProfile, updateProfile, deleteProfile } from "../api";

// ─── helpers ────────────────────────────────────────────────
function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function calcCompletion(p) {
  if (!p) return 0;
  const fields = ["full_name", "domain", "location", "summary", "work", "education", "skills", "github"];
  const filled = fields.filter((f) => p[f] && p[f].trim() !== "").length;
  return Math.round((filled / fields.length) * 100);
}

// ─── small reusable field ───────────────────────────────────
function Field({ label, name, value, onChange, editing, placeholder, icon: Icon, textarea }) {
  const base =
    "w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-[13px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all font-medium";
  const disabled = "opacity-60 cursor-default bg-neutral-100";

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{label}</label>
      <div className="relative">
        {Icon && <Icon size={12} className="absolute left-3 top-[10px] text-neutral-400" />}
        {textarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            disabled={!editing}
            placeholder={placeholder}
            rows={3}
            className={`${base} resize-none ${Icon ? "pl-8" : ""} ${!editing ? disabled : ""}`}
          />
        ) : (
          <input
            name={name}
            value={value}
            onChange={onChange}
            disabled={!editing}
            placeholder={placeholder}
            className={`${base} ${Icon ? "pl-8" : ""} ${!editing ? disabled : ""}`}
          />
        )}
      </div>
    </div>
  );
}

// ─── bento cell ─────────────────────────────────────────────
function Cell({ children, className = "", style = {} }) {
  return (
    <div
      className={`bg-white border border-neutral-100 rounded-2xl p-5 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function CellLabel({ children }) {
  return (
    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

// ─── main page ──────────────────────────────────────────────
export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "", domain: "", gender: "", location: "",
    birthday: "", website: "", github: "", linkedin: "",
    summary: "", work: "", education: "", skills: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getProfileList();
        if (data && data.length > 0) {
          setProfile(data[0]);
          setFormData(data[0]);
          setEditing(false);
        } else {
          setEditing(true);
        }
      } catch {
        setEditing(true);
      }
    }
    fetch();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const processUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        website: processUrl(formData.website),
        github: processUrl(formData.github),
        linkedin: processUrl(formData.linkedin),
      };
      const result = profile?.id
        ? await updateProfile(profile.id, payload)
        : await createProfile(payload);
      setProfile(result);
      setFormData(result);
      setEditing(false);
    } catch (err) {
      alert(`Error saving profile: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your profile?")) return;
    await deleteProfile(profile.id);
    setProfile(null);
    setFormData({
      full_name: "", domain: "", gender: "", location: "",
      birthday: "", website: "", github: "", linkedin: "",
      summary: "", work: "", education: "", skills: "",
    });
    setEditing(true);
  };

  const handleCancel = () => {
    if (profile) { setFormData(profile); setEditing(false); }
  };

  const skills = formData.skills
    ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const completion = calcCompletion(editing ? formData : profile);
  const initials = getInitials(formData.full_name);
  const firstName = formData.full_name?.split(" ")[0] || "Your";

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <Navbar />

      <main className="max-w-[900px] mx-auto px-7 pt-10 pb-24">

        {/* ── Page header ── */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-[1px] text-neutral-400 uppercase mb-2">
              Career identity
            </p>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-neutral-900">
              Your <span className="text-primary-400">Profile.</span>
            </h1>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-600 text-sm font-bold hover:bg-neutral-50 transition-colors"
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-400 text-white text-sm font-bold hover:bg-primary-500 transition-colors disabled:opacity-60"
                >
                  <Save size={14} /> {loading ? "Saving..." : "Save changes"}
                </button>
              </>
            ) : (
              <>
                {profile && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-100 bg-red-50 text-red-500 text-sm font-bold hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                )}
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-400 text-white text-sm font-bold hover:bg-primary-500 transition-colors"
                >
                  <Edit2 size={14} /> Edit profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════
            BENTO GRID
        ══════════════════════════════════════ */}
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >

          {/* ── 1. Identity hero — col 1, row 1+2 ── */}
          <Cell
            className="flex flex-col items-center justify-center text-center"
            style={{
              gridColumn: "1",
              gridRow: "1 / 3",
              background: "#e6f9fe",
              borderColor: "#b3eefb",
              minHeight: 260,
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-extrabold text-white mb-4"
              style={{ background: "#02bcf0" }}
            >
              {initials}
            </div>
            <p className="text-base font-extrabold text-neutral-900 leading-tight">
              {formData.full_name || "Your Name"}
            </p>
            <p className="text-xs font-semibold mt-1" style={{ color: "#0179a0" }}>
              {formData.domain || "Job Title"}
            </p>
            <p className="text-xs mt-0.5 opacity-70" style={{ color: "#0179a0" }}>
              {formData.location || "Location"}
            </p>

            <div className="w-full mt-5">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] font-bold" style={{ color: "#0179a0" }}>
                  Profile complete
                </span>
                <span className="text-[10px] font-extrabold text-neutral-800">
                  {completion}%
                </span>
              </div>
              <div className="h-1 rounded-full" style={{ background: "#b3eefb" }}>
                <div
                  className="h-1 rounded-full transition-all"
                  style={{ width: `${completion}%`, background: "#02bcf0" }}
                />
              </div>
            </div>
          </Cell>

          {/* ── 2. About / Summary — col 2+3, row 1 ── */}
          <Cell style={{ gridColumn: "2 / 4", gridRow: "1" }}>
            <CellLabel>About me</CellLabel>
            {editing ? (
              <Field
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                editing={editing}
                placeholder="Brief professional summary..."
                textarea
              />
            ) : (
              <p className="text-[13px] text-neutral-500 leading-relaxed">
                {profile?.summary || "No summary added yet."}
              </p>
            )}
          </Cell>

          {/* ── 3. Basic info — col 2+3, row 2 ── */}
          <Cell style={{ gridColumn: "2 / 4", gridRow: "2" }}>
            <CellLabel>Basic info</CellLabel>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full name" name="full_name" value={formData.full_name}
                onChange={handleChange} editing={editing} placeholder="Alex Johnson" icon={UserIcon} />
              <Field label="Job title" name="domain" value={formData.domain}
                onChange={handleChange} editing={editing} placeholder="Frontend Developer" />
              <Field label="Location" name="location" value={formData.location}
                onChange={handleChange} editing={editing} placeholder="Pune, India" icon={MapPin} />
              <Field label="Birthday" name="birthday" value={formData.birthday}
                onChange={handleChange} editing={editing} placeholder="DD/MM/YYYY" icon={Calendar} />
            </div>
          </Cell>

          {/* ── 4. Skills — col 1+2, row 3 ── */}
          <Cell style={{ gridColumn: "1 / 3", gridRow: "3" }}>
            <CellLabel>Skills</CellLabel>
            {editing ? (
              <Field
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                editing={editing}
                placeholder="React, Python, Node.js, SQL..."
                icon={Plus}
              />
            ) : (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {skills.length > 0 ? skills.map((s, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold px-3 py-1 rounded-full"
                    style={{ background: "#e6f9fe", color: "#0079a0" }}
                  >
                    {s}
                  </span>
                )) : (
                  <p className="text-[12px] text-neutral-400">No skills added yet.</p>
                )}
              </div>
            )}
          </Cell>

          {/* ── 5. Gender — col 3, row 3 ── */}
          <Cell style={{ gridColumn: "3", gridRow: "3" }}>
            <CellLabel>Gender</CellLabel>
            <Field name="gender" value={formData.gender}
              onChange={handleChange} editing={editing} placeholder="Male / Female / Other" />
          </Cell>

          {/* ── 6. Experience — col 1, row 4 ── */}
          <Cell style={{ gridColumn: "1", gridRow: "4" }}>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase size={13} className="text-primary-400" />
              <CellLabel>Experience</CellLabel>
            </div>
            {editing ? (
              <Field name="work" value={formData.work}
                onChange={handleChange} editing={editing}
                placeholder="Work history..." textarea />
            ) : (
              <p className="text-[12px] text-neutral-500 leading-relaxed whitespace-pre-line">
                {profile?.work || "No experience added yet."}
              </p>
            )}
          </Cell>

          {/* ── 7. Education — col 2, row 4 ── */}
          <Cell style={{ gridColumn: "2", gridRow: "4" }}>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap size={13} className="text-primary-400" />
              <CellLabel>Education</CellLabel>
            </div>
            {editing ? (
              <Field name="education" value={formData.education}
                onChange={handleChange} editing={editing}
                placeholder="Degrees, courses..." textarea />
            ) : (
              <p className="text-[12px] text-neutral-500 leading-relaxed">
                {profile?.education || "No education added yet."}
              </p>
            )}
          </Cell>

          {/* ── 8. Social links — col 3, row 4 ── */}
          <Cell style={{ gridColumn: "3", gridRow: "4" }}>
            <CellLabel>Social links</CellLabel>
            <div className="flex flex-col gap-2">
              <Field label="GitHub" name="github" value={formData.github}
                onChange={handleChange} editing={editing}
                placeholder="github.com/..." icon={Github} />
              <Field label="LinkedIn" name="linkedin" value={formData.linkedin}
                onChange={handleChange} editing={editing}
                placeholder="linkedin.com/..." icon={Linkedin} />
              <Field label="Website" name="website" value={formData.website}
                onChange={handleChange} editing={editing}
                placeholder="yoursite.com" icon={Globe} />
            </div>
          </Cell>

          {/* ── 9. Footer action bar — full width, row 5 ── */}
          <Cell
            style={{ gridColumn: "1 / 4", gridRow: "5" }}
            className="flex items-center justify-between"
          >
            <button
              onClick={() => navigate(`/jobs?q=${encodeURIComponent(formData.domain || formData.skills || "")}`)}
              className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors"
            >
              <Search size={14} /> Find matching jobs
            </button>

            <div className="flex gap-2">
              {editing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-600 text-sm font-bold hover:bg-neutral-50 transition-colors"
                  >
                    <X size={14} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-400 text-white text-sm font-bold hover:bg-primary-500 transition-colors disabled:opacity-60"
                  >
                    <Save size={14} /> {loading ? "Saving..." : "Save changes"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-400 text-white text-sm font-bold hover:bg-primary-500 transition-colors"
                >
                  <Edit2 size={14} /> Edit profile
                </button>
              )}
            </div>
          </Cell>

        </div>
      </main>
    </div>
  );
}