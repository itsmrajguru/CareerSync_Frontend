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
  const [profile, setProfile] = useState({ name: "", website: "", location: "", about: "", industry: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    /*fetch existing company profile on mount */
    async function fetchProfile() {
      try {
        const res = await getCompanyProfile();
        if (res.success && res.company) {
          setProfile({
            name: res.company.name || "",
            website: res.company.website || "",
            location: res.company.location || "",
            about: res.company.about || "",
            industry: res.company.industry || "",
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
        //clear success banner after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.message || "Failed to save profile.");
      }
    } catch (e) {
      setError(e.response?.data?.message || "Something went wrong.");
    } finally { setSaving(false); }
  };

  const completeness = calcCompleteness(profile);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px);} to { opacity:1; transform:translateY(0);} }
        .d-hero    { animation: fadeUp .5s ease both; }
        .d-content { animation: fadeUp .5s .15s ease both; }
      `}</style>

      <div className="min-h-screen bg-app-bg font-sans flex flex-col">
        <Navbar />
        <main className="max-w-[900px] mx-auto px-7 pt-10 pb-10 flex-1 w-full">

          {/*Hero section */}
          <div className="d-hero mb-10">
            <p className="text-xs font-bold tracking-[1px] text-black uppercase mb-3">
              Organization Settings
            </p>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-black mb-3">
              Build your<br />
              <span className="text-black">employer brand.</span>
            </h1>
            <p className="text-base text-black max-w-[480px] leading-relaxed font-medium">
              This profile is shown to candidates on your job postings. A complete profile gets
              significantly more qualified applicants.
            </p>
          </div>

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
            /*skeleton loading state */
            <div className="flex flex-col gap-4">
              {[120, 80, 200, 80].map((h, i) => (
                <div key={i} style={{ height: h }} className="bg-neutral-50/80 rounded-[14px] border border-neutral-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="d-content">

              {/*Profile Card */}
              <div className="cs-card mb-4 flex items-center gap-5">
                {/* Initial avatar */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #02bcf0, #014d65)" }}>
                  {profile.name ? profile.name[0].toUpperCase() : <Building2 size={28} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-black text-[15px] truncate">
                    {profile.name || "Your company name"}
                  </p>
                  <p className="text-[12px] text-black font-medium mb-2">
                    {profile.industry || "Industry not set"}{profile.location ? ` · ${profile.location}` : ""}
                  </p>
                  {/* Completeness bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-[200px] h-1.5 bg-neutral-100 rounded-full">
                      <div style={{ width: `${completeness}%`, background: completeness === 100 ? "#22c55e" : "#02bcf0" }}
                        className="h-full rounded-full transition-all duration-700" />
                    </div>
                    <span className="text-[11px] font-bold text-black">{completeness}% complete</span>
                  </div>
                </div>
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-[12px] font-bold text-black hover:underline flex-shrink-0">
                    <Globe size={12} /> Website
                  </a>
                )}
              </div>

              {/*Form Fields*/}
              <div className="bg-white border border-neutral-200 rounded-[14px] p-6 mb-4">
                <p className="text-[11px] font-bold text-black uppercase tracking-[0.6px] mb-6">
                  Company Identity
                </p>
                <div className="flex flex-col gap-5">

                  {/* Company name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">
                      Company Registered Name
                    </label>
                    <input required type="text" name="name" value={profile.name} onChange={handleChange}
                      className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                      placeholder="e.g. Acme Corporation" />
                  </div>

                  {/* Website + Location row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px] flex items-center gap-1.5">
                        <Globe size={11} className="text-black" /> Website
                      </label>
                      <input type="url" name="website" value={profile.website} onChange={handleChange}
                        className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                        placeholder="https://acme.com" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px] flex items-center gap-1.5">
                        <MapPin size={11} className="text-black" /> HQ Location
                      </label>
                      <input type="text" name="location" value={profile.location} onChange={handleChange}
                        className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                        placeholder="Mumbai, India" />
                    </div>
                  </div>

                  {/* Industry */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Industry Sector</label>
                    <input type="text" name="industry" value={profile.industry} onChange={handleChange}
                      className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all"
                      placeholder="e.g. Information Technology & Services" />
                  </div>
                </div>
              </div>

              {/* About section */}
              <div className="bg-white border border-neutral-200 rounded-[14px] p-6 mb-6">
                <p className="text-[11px] font-bold text-black uppercase tracking-[0.6px] mb-4">About Organization</p>
                <textarea rows={6} name="about" value={profile.about} onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-black font-medium text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all resize-none"
                  placeholder="Tell candidates about your mission, culture, values, and what makes your company a great place to work..." />
                <p className="text-[11px] text-black mt-2 font-medium">
                  {profile.about.length}/1000 characters
                </p>
              </div>

              {/* Actions — same button pattern as student pages */}
              <div className="flex items-center gap-3">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-400 text-white font-bold text-sm rounded-xl hover:bg-primary-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {success ? <CheckCircle2 size={16} /> : <Save size={16} />}
                  {saving ? "Saving..." : success ? "Saved!" : "Save Changes"}
                </button>
                <button type="button" onClick={() => navigate("/company/dashboard")}
                  className="px-6 py-3 bg-neutral-50 border border-neutral-200 text-black font-bold text-sm rounded-xl hover:bg-neutral-100 transition-colors">
                  Cancel
                </button>
              </div>

            </form>
          )}

        </main>
        <Footer />
      </div>
    </>
  );
}




