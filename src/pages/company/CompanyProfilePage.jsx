import { useEffect, useState } from "react";
import { getCompanyProfile, updateCompanyProfile } from "../../services/companyProfileService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Building2, Globe, MapPin, Save, CheckCircle2 } from "lucide-react";

//profile fields and how complete they are (20% per field)
function calcCompleteness(p) {
  return [p.name, p.about, p.website, p.industry, p.location].filter(Boolean).length * 20;
}

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

  /* Fetch profile on mount */
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getCompanyProfile();
        if (res.success && res.company) {
          const c = res.company;
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

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    if (success) setSuccess(false);
    if (error) setError("");
  };

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
    <div className={`cs-card p-6 ${className}`} style={style}>{children}</div>
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
    <div className="min-h-screen bg-app-bg font-sans flex flex-col">
      <Navbar />
      <main className="max-w-[960px] mx-auto px-7 pt-4 pb-10 flex-1 w-full">

        {/*added the herosection with matches the
            existing styles effectively*/} 
        <section className="d-hero mb-8">
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px]">

            {/* Left Column: Text & Actions */}
            <div style={{ flex: 1 }}>
              <div className="mb-7">
                <p className="text-[13px] font-bold tracking-[0.5px] text-[#475569] uppercase mb-2">
                  Organization Settings
                </p>
                <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-5">
                  Build your<br />
                  <span style={{ color: "#ef4444" }}>employer brand.</span>
                </h1>
                <p className="text-[14px] leading-[1.6] text-[#64748b] font-medium max-w-[460px]">
                  This profile is shown to candidates on your job postings. A complete profile gets significantly more qualified applicants.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>
                <span className="flex items-center gap-1">✔ Brand Reputation</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span className="flex items-center gap-1">✔ Talent Engagement</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span className="flex items-center gap-1">✔ Profile Completion</span>
              </div>
            </div>

            {/* Right Column: Career Ecosystem Grid */}
            <div className="hidden lg:block slide-in" style={{ flexShrink: 0, width: "360px" }}>
              <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9" }} className="grid grid-cols-2">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80&auto=format&fit=crop"
                  alt="Offices"
                  style={{ width: "100%", height: "120px", objectFit: "cover", borderRight: "1px solid #fff", borderBottom: "1px solid #fff" }}
                />
                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80&auto=format&fit=crop"
                  alt="Jobs"
                  style={{ width: "100%", height: "120px", objectFit: "cover", borderBottom: "1px solid #fff" }}
                />
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80&auto=format&fit=crop"
                  alt="Team"
                  style={{ width: "100%", height: "120px", objectFit: "cover", borderRight: "1px solid #fff" }}
                />
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80&auto=format&fit=crop"
                  alt="Companies"
                  style={{ width: "100%", height: "120px", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* profile success popup */}
        {success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-[14px] p-4 mb-6 text-green-700 font-bold text-sm">
            <CheckCircle2 size={18} /> Profile saved successfully!
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-[14px] p-4 mb-6 text-red-600 font-bold text-sm text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-4">
            {[120, 80, 200, 80].map((h, i) => (
              <div key={i} style={{ height: h }} className="bg-neutral-50/80 rounded-[14px] border border-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="d-content">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* 1st Cell: Profile Lead */}
              <Cell className="flex flex-col items-center justify-center text-center lg:row-span-2"
                style={{ background: "#f8fafc", border: "1px solid #f1f5f9", minHeight: 280 }}>
                <div className="w-[84px] h-[84px] rounded-[30px] flex items-center justify-center text-4xl font-black text-white mb-6 shadow-xl border border-white/20"
                  style={{ background: "linear-gradient(135deg, #ef4444, #991b1b)" }}>
                  {profile.name ? profile.name[0].toUpperCase() : <Building2 size={36} />}
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
                <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest mb-4">Company Identity</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Organization Name" name="name" value={profile.name} onChange={handleChange} placeholder="e.g. Acme Inc" />
                  <Field label="Industry Sector" name="industry" value={profile.industry} onChange={handleChange} placeholder="e.g. Fintech" />
                  <Field label="Official Website" name="website" value={profile.website} onChange={handleChange} icon={Globe} placeholder="https://..." />
                  <Field label="HQ Location" name="location" value={profile.location} onChange={handleChange} icon={MapPin} placeholder="e.g. Mumbai" />
                </div>
              </Cell>

              {/* 3rd Cell: About - The Mission */}
              <Cell className="lg:col-span-2">
                <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest mb-4">Mission & Culture</p>
                <Field textarea label="The About Organization" name="about" value={profile.about} onChange={handleChange}
                  placeholder="Describe your mission, vision, and organizational culture..." />
              </Cell>

              {/* Bottom Row */}
              <Cell>
                <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest mb-4">Quick Stats</p>
                <div className="flex flex-col gap-4">
                  <Field label="Founded In" name="founded" value={profile.founded} onChange={handleChange} placeholder="e.g. 2018" />
                  <Field label="Team Size" name="size" value={profile.size} onChange={handleChange} placeholder="e.g. 50-100" />
                </div>
              </Cell>

              <Cell className="lg:col-span-2">
                <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest mb-4">Social Footprint</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="LinkedIn Profile" name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="linkedin.com/company/..." icon={Building2} />
                  <Field label="Twitter / X" name="twitter" value={profile.twitter} onChange={handleChange} placeholder="twitter.com/..." icon={Globe} />
                </div>
              </Cell>

            </div>

            {/* Actions */}
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

      </main>
      <Footer />
    </div>
  );
}
