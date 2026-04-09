import {
  Github, Linkedin, Globe, MapPin, Calendar,
  User as UserIcon, Briefcase, GraduationCap,
  Search, Save, X, Edit2, Trash2, Plus
} from "lucide-react";

/* we are calling this field function on every input form,
if the inputform is a normal input ,otherwise textarea for fields 
like skills, experience 

it totally depends upon the type of cell we want*/
function Field({ label, name, value, onChange, editing, placeholder, icon: Icon, textarea }) {
  // css for base
  const base = "w-full bg-neutral-50 border border-[#d0d0ff] rounded-xl px-3 py-2 text-[13px] text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[rgba(73,75,214,0.12)] focus:border-[#494bd6] transition-all font-medium";
  // css for disabled input
  const disabled = "opacity-60 cursor-default bg-neutral-100";

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold text-black uppercase tracking-widest">{label}</label>
      <div className="relative">
        {Icon && <Icon size={12} className="absolute left-3 top-[10px] text-black" />}
        {/*If Textarea ->display textarea , otherwise input */}
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

// We are wrapping the Field function in the cell box item
function Cell({ children, className = "", style = {} }) {
  return (
    <div
      className={`cs-card p-5 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

// This is just the cell title component
function CellLabel({ children }) {
  return (
    <p className="text-[10px] font-bold text-black uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

/* This profile form is madeup of 3 things
1)Input Field
2)cell ( a specific box )
3)celltitle */
export default function ProfileForm({
  formData, editing, loading, profile, completion, skills,
  initials, onChange, onSave, onCancel, onDelete, onEdit,
  onNavigate,
}) {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
    >

      {/*(1st cell) : which displays profle completeness
      as well as intils, username, domain,title */}
      <Cell
        className="flex flex-col items-center justify-center text-center"
        style={{
          gridColumn: "1",
          gridRow: "1 / 3",
          background: "#e6f9fe",
          bordercolor: "#0d1117",
          minHeight: 260,
        }}>
        {/* Added intials */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-extrabold text-white mb-4"
          style={{ background: "#02bcf0" }}>
          {initials}
        </div>
        <p className="text-base font-extrabold text-black leading-tight">
          {formData.full_name || "Your Name"}
        </p>
        <p className="text-xs font-semibold mt-1" style={{ color: "#0d1117" }}>
          {formData.domain || "Job Title"}
        </p>
        <p className="text-xs mt-0.5 opacity-70" style={{ color: "#0d1117" }}>
          {formData.location || "Location"}
        </p>

        <div className="w-full mt-5">

          {/* Diaplays the profile complete % */}
          <div className="flex justify-between mb-1">
            <span className="text-[10px] font-bold" style={{ color: "#0d1117" }}>
              Profile complete
            </span>
            <span className="text-[10px] font-extrabold text-black">
              {completion}%
            </span>
          </div>

          {/* the automated line increase functionality */}
          <div className="h-1 rounded-full" style={{ background: "#b3eefb" }}>
            <div
              className="h-1 rounded-full transition-all"
              style={{ width: `${completion}%`, background: "#02bcf0" }}
            />
          </div>
        </div>
      </Cell>

      {/* (2nd cell) : About me Section*/}
      <Cell style={{ gridColumn: "2 / 4", gridRow: "1" }}>
        <CellLabel>About me</CellLabel>
        {editing ? (
          <Field
            name="summary"
            value={formData.summary}
            onChange={onChange}
            editing={editing}
            placeholder="Brief professional summary..."
            textarea
          />
        ) : (
          <p className="text-[13px] text-black leading-relaxed">
            {profile?.summary || "No summary added yet."}
          </p>
        )}
      </Cell>

      {/* (3rd cell): basic Info section */}
      <Cell style={{ gridColumn: "2 / 4", gridRow: "2" }}>
        <CellLabel>Basic info</CellLabel>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full name" name="full_name" value={formData.full_name}
            onChange={onChange} editing={editing} placeholder="Alex Johnson" icon={UserIcon} />
          <Field label="Job title" name="domain" value={formData.domain}
            onChange={onChange} editing={editing} placeholder="Frontend Developer" />
          <Field label="Location" name="location" value={formData.location}
            onChange={onChange} editing={editing} placeholder="Pune, India" icon={MapPin} />
          <Field label="Birthday" name="birthday" value={formData.birthday}
            onChange={onChange} editing={editing} placeholder="DD/MM/YYYY" icon={Calendar} />
        </div>
      </Cell>

      {/*(4th cell) : Skills section*/}
      <Cell style={{ gridColumn: "1 / 3", gridRow: "3" }}>
        <CellLabel>Skills</CellLabel>
        {editing ? (
          <Field
            name="skills"
            value={formData.skills}
            onChange={onChange}
            editing={editing}
            placeholder="React, Python, Node.js, SQL..."
            icon={Plus}
          />
        ) : (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {skills.length > 0 ? skills.map((s, i) => (
              <span
                key={i}
                className="cs-badge !rounded-full !px-3 !py-1 !text-[11px]"
              >
                {s}
              </span>
            )) : (
              <p className="text-[12px] text-black">No skills added yet.</p>
            )}
          </div>
        )}
      </Cell>

      {/* (5th cell): Gender section */}
      <Cell style={{ gridColumn: "3", gridRow: "3" }}>
        <CellLabel>Gender</CellLabel>
        <Field name="gender" value={formData.gender}
          onChange={onChange} editing={editing} placeholder="Male / Female / Other" />
      </Cell>

      {/* (6th section) :Experience section */}
      <Cell style={{ gridColumn: "1", gridRow: "4" }}>
        <div className="flex items-center gap-2 mb-3">
          <Briefcase size={13} className="text-black" />
          <CellLabel>Experience</CellLabel>
        </div>
        {editing ? (
          <Field name="work" value={formData.work}
            onChange={onChange} editing={editing}
            placeholder="Work history..." textarea />
        ) : (
          <p className="text-[12px] text-black leading-relaxed whitespace-pre-line">
            {profile?.work || "No experience added yet."}
          </p>
        )}
      </Cell>

      {/* (7th section) :Education Section*/}
      <Cell style={{ gridColumn: "2", gridRow: "4" }}>
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap size={13} className="text-black" />
          <CellLabel>Education</CellLabel>
        </div>
        {editing ? (
          <Field name="education" value={formData.education}
            onChange={onChange} editing={editing}
            placeholder="Degrees, courses..." textarea />
        ) : (
          <p className="text-[12px] text-black leading-relaxed">
            {profile?.education || "No education added yet."}
          </p>
        )}
      </Cell>

      {/* (8th section) : Social Links section*/}
      <Cell style={{ gridColumn: "3", gridRow: "4" }}>
        <CellLabel>Social links</CellLabel>
        <div className="flex flex-col gap-2">
          <Field label="GitHub" name="github" value={formData.github}
            onChange={onChange} editing={editing}
            placeholder="github.com/..." icon={Github} />
          <Field label="LinkedIn" name="linkedin" value={formData.linkedin}
            onChange={onChange} editing={editing}
            placeholder="linkedin.com/..." icon={Linkedin} />
          <Field label="Website" name="website" value={formData.website}
            onChange={onChange} editing={editing}
            placeholder="yoursite.com" icon={Globe} />
        </div>
      </Cell>

      {/* (9th section) : Footer section*/}
      <Cell
        style={{ gridColumn: "1 / 4", gridRow: "5" }}
        className="flex items-center justify-between"
      >
        <button
          onClick={onNavigate}
          className="btn-dark px-5 py-2.5 text-sm"
        >
          <Search size={14} /> Find matching jobs
        </button>

        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={onCancel}
                className="btn-outline px-4 py-2.5 text-sm"
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={onSave}
                disabled={loading}
                className="btn-primary px-4 py-2.5 text-sm"
              >
                <Save size={14} /> {loading ? "Saving..." : "Save changes"}
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="btn-primary px-4 py-2.5 text-sm"
            >
              <Edit2 size={14} /> Edit profile
            </button>
          )}
        </div>
      </Cell>

    </div>
  );
}



