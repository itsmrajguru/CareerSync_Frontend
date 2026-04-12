import { useEffect, useState } from "react";
import { getCompanyProfile, updateCompanyProfile } from "../../services/companyProfileService";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { BriefcaseBusiness, Globe, MapPin, Save, CheckCircle2 } from "lucide-react";

//this functions calculates that how much resume has been completed (20% per field)
function calcCompleteness(p) {
  return [p.name, p.about, p.website, p.industry, p.location].filter(Boolean).length * 20;
}

/*main CompanyProfilePage function */
export default function CompanyProfilePage() {
  const [profile, setProfile] = useState({
    name: "", website: "", location: "", about: "", industry: "",
    founded: "", size: "", linkedin: "", twitter: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /* this useState calls the getCompanyProfile
  so that the companyProfileDetails are shown on the page,
  if any profileFields are saved</thead> */
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getCompanyProfile();
        if (res.success && res.company) {
          const c = res.company;
          /* this stores the fetched company details in the state setProfile
          otherwise sets empty to every field */
          setProfile({
            name: c.name || "",
            website: c.website || "",
            location: c.location || "",
            about: c.about || "",
            industry: c.industry || "",
            founded: c.founded || "",
            size: c.size || "",
            linkedin: c.linkedin || "",
            twitter: c.twitter || "",
          });
        }
      } catch (e) { console.error("Profile Fetch Error:", e); }
      finally { setLoading(false); }
    }
    fetchProfile();
  }, []);


  /* on changing any field, the profile is automatically updated */
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    if (success) setSuccess(false);
    if (error) setError("");
  };

  /* This functipm just updated the company details and 
  thus again the companydetails are fetched and cycle continues*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setSuccess(false); setError("");
    try {
      const res = await updateCompanyProfile(profile);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.message || "Failed to save profile.");
      }
    } catch (e) {
      setError(e.response?.data?.message || "Something went wrong.");
    } finally { setSaving(false); }
  };

  const completeness = calcCompleteness(profile);

  // Internal Helper Components for the Student-Style Grid
  const Cell = ({ children, className = "", style = {} }) => (
    <div className={`cs-card-modern p-6 ${className}`} style={style}>{children}</div>
  );

  const Field = ({ label, name, value, onChange, placeholder, icon: Icon, textarea }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-extrabold text-[#475569] uppercase tracking-wider">{label}</label>
      <div className="relative">
        {Icon && <Icon size={12} className="absolute left-3 top-[13px] text-[#94a3b8]" />}
        {textarea ? (
          <textarea name={name} value={value} onChange={onChange} rows={5} placeholder={placeholder}
            className={`w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-3 text-[13px] text-[#0f172a] focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all font-bold resize-none ${Icon ? "pl-9" : ""}`} />
        ) : (
          <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder}
            className={`w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-3 text-[13px] text-[#0f172a] focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all font-bold ${Icon ? "pl-9" : ""}`} />
        )}
      </div>
    </div>
  );

  return (
    <PageLayout>
      <div className="pb-10 animate-fade-in">

        {/*added the herosection with matches the
            existing styles effectively*/}
        <section className="mb-8 pt-4 p-0">
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px]">

            {/* Left Column: Text & Actions */}
            <div style={{ flex: 1 }}>
              <div className="mb-7">
                <p className="cs-section-label">
                  Organization Settings
                </p>
                <h1 className="cs-page-title">
                  Build your<br />
                  <span className="text-[#ef4444]">employer brand.</span>
                </h1>
                <p className="cs-subtext max-w-[460px]">
                  This profile is shown to candidates on your job postings. A complete profile gets significantly more qualified applicants.
                </p>
              </div>

              {/* the dummy cards matching the existing css of the project */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>
                <span className="flex items-center gap-1">✔ Brand Reputation</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span className="flex items-center gap-1">✔ Talent Engagement</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span className="flex items-center gap-1">✔ Profile Completion</span>
              </div>
            </div>

            {/* we have taken images and show here*/}
            <div className="hidden lg:block animate-fade-in" style={{ flexShrink: 0, width: "360px" }}>
              <div className="rounded-xl overflow-hidden border border-neutral-200 grid grid-cols-2 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80&auto=format&fit=crop"
                  alt="Offices"
                  style={{ width: "100%", height: "100px", objectFit: "cover", borderRight: "1px solid #fff", borderBottom: "1px solid #fff" }}
                />
                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80&auto=format&fit=crop"
                  alt="Jobs"
                  style={{ width: "100%", height: "100px", objectFit: "cover", borderBottom: "1px solid #fff" }}
                />
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80&auto=format&fit=crop"
                  alt="Team"
                  style={{ width: "100%", height: "100px", objectFit: "cover", borderRight: "1px solid #fff" }}
                />
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80&auto=format&fit=crop"
                  alt="Companies"
                  style={{ width: "100%", height: "100px", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* profile success popup section */}
        {success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-green-700 font-bold text-sm">
            <CheckCircle2 size={18} /> Profile saved successfully!
          </div>
        )}
        {/* this state displayes the errors... */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-600 font-bold text-sm text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-4">
            {[120, 80, 200, 80].map((h, i) => (
              <div key={i} style={{ height: h }} className="bg-neutral-50/80 rounded-xl border border-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* 1st Cell: Profile Lead logic and display */}
              <Cell className="flex flex-col items-center justify-center text-center lg:row-span-2"
                style={{ background: "#f8fafc", border: "1px solid #f1f5f9", minHeight: 280 }}>
                <div className="w-[84px] h-[84px] rounded-2xl flex items-center justify-center text-4xl font-black text-white mb-6 shadow-xl border border-white/20"
                  style={{ background: "linear-gradient(135deg, #ef4444, #991b1b)" }}>
                  {profile.name ? profile.name[0].toUpperCase() : <BriefcaseBusiness size={36} />}
                </div>
                <h3 className="text-[19px] font-black text-[#0f172a] tracking-tight mb-2 uppercase">{profile.name || "Company Name"}</h3>
                <p className="text-[12px] font-extrabold text-[#ef4444] uppercase tracking-widest mb-6">{profile.industry || "Industry Not Set"}</p>

                <div className="w-full px-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-[#94a3b8] uppercase">Completion</span>
                    <span className="text-[10px] font-black text-[#0f172a]">{completeness}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white border border-[#f1f5f9] rounded-full overflow-hidden">
                    <div style={{ width: `${completeness}%` }} className="h-full bg-[#ef4444] rounded-full transition-all duration-1000" />
                  </div>
                </div>
              </Cell>

              {/* 2nd Cell: Identity */}
              <Cell className="lg:col-span-2">
                <p className="cs-section-label">Company Identity</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Organization Name" name="name" value={profile.name} onChange={handleChange} placeholder="e.g. Acme Inc" />
                  <Field label="Industry Sector" name="industry" value={profile.industry} onChange={handleChange} placeholder="e.g. Fintech" />
                  <Field label="Official Website" name="website" value={profile.website} onChange={handleChange} icon={Globe} placeholder="https://..." />
                  <Field label="HQ Location" name="location" value={profile.location} onChange={handleChange} icon={MapPin} placeholder="e.g. Mumbai" />
                </div>
              </Cell>

              {/* 3rd Cell: About - The Mission */}
              <Cell className="lg:col-span-2">
                <p className="cs-section-label">Mission & Culture</p>
                <Field textarea label="The About Organization" name="about" value={profile.about} onChange={handleChange}
                  placeholder="Describe your mission, vision, and organizational culture..." />
              </Cell>

              {/* Bottom Row stats */}
              <Cell>
                <p className="cs-section-label">Quick Stats</p>
                <div className="flex flex-col gap-4">
                  <Field label="Founded In" name="founded" value={profile.founded} onChange={handleChange} placeholder="e.g. 2018" />
                  <Field label="Team Size" name="size" value={profile.size} onChange={handleChange} placeholder="e.g. 50-100" />
                </div>
              </Cell>

              <Cell className="lg:col-span-2">
                <p className="cs-section-label">Social Footprint</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="LinkedIn Profile" name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="linkedin.com/company/..." icon={BriefcaseBusiness} />
                  <Field label="Twitter / X" name="twitter" value={profile.twitter} onChange={handleChange} placeholder="twitter.com/..." icon={Globe} />
                </div>
              </Cell>

            </div>

            {/* Actions button section */}
            <div className="flex items-center gap-3 mt-8">
              <button type="submit" disabled={saving}
                className="btn-primary" style={{ padding: "10px 24px" }}>
                {success ? <CheckCircle2 size={16} /> : <Save size={16} />}
                {saving ? "Saving..." : success ? "Changes Saved" : "Update Profile"}
              </button>
              <button type="button" onClick={() => navigate("/company/dashboard")}
                className="btn-outline" style={{ padding: "10px 24px" }}>
                Discard
              </button>
            </div>
          </form>
        )}
      </div>
    </PageLayout>
  );
}
