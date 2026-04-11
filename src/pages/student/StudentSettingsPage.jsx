import { useState } from "react";
import { changePassword, deleteAccount } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { Shield, Key, Bell, Trash2, CheckCircle2 } from "lucide-react";



/* this page has been copied from the company settings page exactly
just changed the hero section to own it by the student settings page */



export default function StudentSettingsPage() {
  const navigate = useNavigate();
  const [passData, setPassData] = useState({ current: "", newPass: "", confirm: "" });
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState("");

  const [notifs, setNotifs] = useState({ jobAlerts: true, applications: true, marketing: false });

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    setPassError(""); setPassSuccess(false);

    if (passData.newPass !== passData.confirm) {
      return setPassError("New passwords do not match.");
    }
    if (passData.newPass.length < 6) {
      return setPassError("New password must be at least 6 characters.");
    }

    setPassLoading(true);
    try {
      const res = await changePassword(passData.current, passData.newPass);
      if (res.success) {
        setPassSuccess(true);
        setPassData({ current: "", newPass: "", confirm: "" });
        setTimeout(() => setPassSuccess(false), 3000);
      } else {
        setPassError(res.message || "Failed to change password.");
      }
    } catch (e) {
      setPassError(e.response?.data?.message || "Something went wrong.");
    } finally {
      setPassLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you absolutely sure? This will permanently delete your account, your profile, and all your applications. This action CANNOT be undone.")) {
      try {
        const res = await deleteAccount();
        if (res.success) {
          // Clear local storage and redirect to home
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        } else {
          alert(res.message || "Failed to delete account.");
        }
      } catch (e) {
        console.error("Delete account error:", e);
        alert("An error occurred while deleting your account. Please try again.");
      }
    }
  };

  return (
    <PageLayout>
      <div className="pb-20 animate-fade-in">

           <section aria-label="Page header" className="mb-8 p-0">
             <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px]">
               <div style={{ flex: 1 }}>
                 <div className="mb-7">
                   <p className="cs-section-label">
                     Account Security & Control
                   </p>
                   <h1 className="cs-page-title">
                     Your<br />
                     <span className="text-[#ef4444]">Settings.</span>
                   </h1>
                   <p className="cs-subtext max-w-[460px]">
                     Update your security credentials and customize how CareerSync communicates with you.
                   </p>
                 </div>
                 <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>
                   <span className="flex items-center gap-1">✔ Secure Access</span>
                   <span style={{ opacity: 0.3 }}>·</span>
                   <span className="flex items-center gap-1">✔ Notif Control</span>
                   <span style={{ opacity: 0.3 }}>·</span>
                   <span className="flex items-center gap-1">✔ Data Privacy</span>
                 </div>
               </div>
               <div className="hidden lg:block animate-fade-in" style={{ flexShrink: 0, width: "360px" }}>
                 <div className="rounded-xl overflow-hidden border border-neutral-200">
                   <img
                     src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&auto=format&fit=crop"
                     alt="Student Settings"
                     style={{ width: "100%", height: "280px", objectFit: "cover", display: "block" }}
                   />
                 </div>
               </div>
             </div>
           </section>

          <div className="d-content flex flex-col gap-6">
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-[#0f172a] flex items-center justify-center">
                  <Key size={16} />
                </div>
                <h2 className="text-[15px] font-bold text-black">Update Password</h2>
              </div>
              {passSuccess && (
                <div className="mb-5 flex items-center gap-2 text-[12px] font-bold text-green-700 bg-green-50 border border-green-200 p-3 rounded-xl">
                  <CheckCircle2 size={16} /> Password updated successfully.
                </div>
              )}
              {passError && (
                <div className="mb-5 text-[12px] font-bold text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
                  {passError}
                </div>
              )}
              <form onSubmit={handlePassSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="cs-section-label ml-0.5">Current Password</label>
                  <input required type="password" value={passData.current} onChange={e => setPassData({ ...passData, current: e.target.value })}
                    className="cs-input w-full sm:w-80 !py-2.5" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="cs-section-label ml-0.5">New Password</label>
                  <input required type="password" value={passData.newPass} onChange={e => setPassData({ ...passData, newPass: e.target.value })}
                    className="cs-input w-full sm:w-80 !py-2.5" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="cs-section-label ml-0.5">Confirm New</label>
                  <input required type="password" value={passData.confirm} onChange={e => setPassData({ ...passData, confirm: e.target.value })}
                    className="cs-input w-full sm:w-80 !py-2.5" />
                </div>
                <div className="mt-2">
                  <button type="submit" disabled={passLoading}
                    className="bg-black text-white text-[13px] font-bold px-8 py-3 rounded-lg hover:bg-neutral-800 transition-all active:scale-95">
                    {passLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                  <Bell size={16} />
                </div>
                <h2 className="text-[15px] font-bold text-black">Discovery Alerts</h2>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { id: "jobAlerts", label: "Job & Internship Alerts", desc: "Get notified when new roles match your skills." },
                  { id: "applications", label: "Application Tracking", desc: "Status updates for your submitted applications." },
                  { id: "marketing", label: "Platform Updates", desc: "Product enhancements and career tips." },
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2.5 border-b border-neutral-100 last:border-0">
                    <div>
                      <p className="text-[14px] font-bold text-black mb-0.5">{item.label}</p>
                      <p className="cs-subtext !mb-0">{item.desc}</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" id={item.id} checked={notifs[item.id]} 
                        onChange={() => setNotifs({ ...notifs, [item.id]: !notifs[item.id] })}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-neutral-200" 
                        style={{ zIndex: 2, top: 0, right: notifs[item.id] ? 0 : 'auto', left: notifs[item.id] ? 'auto' : 0, transition: 'right 0.2s, left 0.2s, border-color 0.2s' }} />
                      <label htmlFor={item.id} 
                        className={`toggle-label block overflow-hidden h-6 rounded-full bg-neutral-200 cursor-pointer ${notifs[item.id] ? 'bg-primary-400' : ''}`}
                        style={{ transition: 'background-color 0.2s' }}></label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-50/50 border border-red-100 rounded-xl p-6 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-red-600" />
                <h2 className="text-[13px] font-bold text-red-600 uppercase tracking-wider">Danger Zone</h2>
              </div>
              <p className="cs-subtext !text-black mb-6">
                Deleting your account is permanent. All your profile data, resumes, and application history will be eradicated.
              </p>
              <button 
                onClick={handleDeleteAccount}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-red-600 font-bold text-[12px] rounded-lg hover:bg-red-50 transition-all uppercase tracking-wider shadow-sm">
                <Trash2 size={14} /> Delete My Account
              </button>
            </div>
          </div>
      </div>
    </PageLayout>
  );
}
