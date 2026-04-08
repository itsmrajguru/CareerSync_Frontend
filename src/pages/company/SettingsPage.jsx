import { useState } from "react";
import { changePassword } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Shield, Key, Bell, Trash2, CheckCircle2, ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [passData, setPassData] = useState({ current: "", newPass: "", confirm: "" });
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState("");

  const [notifs, setNotifs] = useState({ newApp: true, messages: true, marketing: false });

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

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px);} to { opacity:1; transform:translateY(0);} }
        .d-hero { animation: fadeUp .5s ease both; }
        .d-content { animation: fadeUp .5s .15s ease both; }
        
        /* Custom toggle switch CSS */
        .toggle-checkbox:checked { right: 0; border-color: #02bcf0; }
        .toggle-checkbox:checked + .toggle-label { background-color: #02bcf0; }
      `}</style>

      <div className="min-h-screen bg-[#f0fbfe] font-sans flex flex-col">
        <Navbar />
        <main className="max-w-[800px] mx-auto px-7 pt-10 pb-10 flex-1 w-full">

          {/* Hero Section*/}
          <div className="d-hero mb-10">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[12px] font-bold text-neutral-400 hover:text-primary-400 transition-colors mb-6">
              <ArrowLeft size={14} /> Back
            </button>
            <p className="text-xs font-bold tracking-[1px] text-neutral-400 uppercase mb-3">
              Account Security & Prefs
            </p>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-neutral-900 mb-3">
              Organization <span className="text-primary-400">Settings</span>
            </h1>
            <p className="text-base text-neutral-500 max-w-[480px] leading-relaxed font-medium">
              Manage your password, notification preferences, and account security.
            </p>
          </div>

          <div className="d-content flex flex-col gap-6">

            {/*Password Change*/}
            <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center">
                  <Key size={16} />
                </div>
                <h2 className="text-[15px] font-bold text-neutral-900">Change Password</h2>
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
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px]">Current Password</label>
                  <input required type="password" value={passData.current} onChange={e => setPassData({ ...passData, current: e.target.value })}
                    className="w-full sm:w-80 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-sm font-bold focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px]">New Password</label>
                  <input required type="password" value={passData.newPass} onChange={e => setPassData({ ...passData, newPass: e.target.value })}
                    className="w-full sm:w-80 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-sm font-bold focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px]">Confirm New</label>
                  <input required type="password" value={passData.confirm} onChange={e => setPassData({ ...passData, confirm: e.target.value })}
                    className="w-full sm:w-80 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-sm font-bold focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all outline-none" />
                </div>
                <div className="mt-2">
                  <button type="submit" disabled={passLoading}
                    className="px-6 py-3 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-black transition-colors disabled:opacity-60">
                    {passLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>

            {/* Notifications scetion*/}
            <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                  <Bell size={16} />
                </div>
                <h2 className="text-[15px] font-bold text-neutral-900">Email Notifications</h2>
              </div>
              
              <div className="flex flex-col gap-4">
                {[
                  { id: "newApp", label: "New Application Alerts", desc: "Get an email when a candidate applies to your jobs." },
                  { id: "messages", label: "Direct Messages", desc: "Get notified when a student replies to you." },
                  { id: "marketing", label: "CareerSync Updates", desc: "Product updates, newsletters, and tips." },
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{item.label}</p>
                      <p className="text-[12px] text-neutral-400 font-medium">{item.desc}</p>
                    </div>
                    {/* Toggle switch */}
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

            {/*Danger zone section*/}
            <div className="bg-red-50/50 border border-red-100 rounded-[14px] p-6 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-red-500" />
                <h2 className="text-[15px] font-bold text-red-600">Danger Zone</h2>
              </div>
              <p className="text-[13px] text-neutral-500 font-medium mb-4">
                Deleting your account will permanently wipe your company profile, all jobs, and applicant history. This action cannot be reversed.
              </p>
              <button onClick={() => window.confirm("Are you absolutely sure you want to delete your account? All data will be lost.")}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-red-200 text-red-600 font-bold text-[13px] rounded-xl hover:bg-red-50 transition-colors">
                <Trash2 size={14} /> Delete Organization Account
              </button>
            </div>

          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
