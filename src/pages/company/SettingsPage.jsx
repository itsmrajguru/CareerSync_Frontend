import { useState } from "react";
import { changePassword, deleteAccount } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Shield, Key, Bell, Trash2, CheckCircle2 } from "lucide-react";


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

  // function for the delete functionality
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you absolutely sure you want to delete this organization? This will permanently wipe your company profile, all jobs, and applicant history. This action CANNOT be undone.")) {
      try {
        const res = await deleteAccount();
        if (res.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        } else {
          alert(res.message || "Failed to delete organization.");
        }
      } catch (e) {
        console.error("Delete organization error:", e);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-app-bg font-sans flex flex-col">
      <Navbar />
      <main className="max-w-[960px] mx-auto px-7 pt-4 pb-10 flex-1 w-full">

        {/* hero section for the settings page */}
        <section className="d-hero mb-8">
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px]">

            {/* Left Column: Text & Actions */}
            <div style={{ flex: 1 }}>
              <div className="mb-7">
                <p className="text-[13px] font-bold tracking-[0.5px] text-[#475569] uppercase mb-2">
                  Account Security & Prefs
                </p>
                <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-5">
                  Organization<br />
                  <span style={{ color: "#ef4444" }}>Settings.</span>
                </h1>
                <p className="text-[14px] leading-[1.6] text-[#64748b] font-medium max-w-[460px]">
                  Manage your password, notification preferences, and account security.
                </p>
              </div>

              {/* 3 dummy cards showing the features */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>
                <span className="flex items-center gap-1">✔ Secure Access</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span className="flex items-center gap-1">✔ Notification Control</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span className="flex items-center gap-1">✔ Privacy Guard</span>
              </div>
            </div>

            {/*added an image to mmatch the website design  flow */}
            <div className="hidden lg:block slide-in" style={{ flexShrink: 0, width: "360px" }}>
              <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9" }}>
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&auto=format&fit=crop"
                  alt="Settings"
                  style={{ width: "100%", height: "280px", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="d-content flex flex-col gap-6">

          {/*Password Change functionality...
here we take current passsword, new password and confirm new password to 
complete the functionality*/}
          <div className="bg-white border border-neutral-200 rounded-[14px] p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary-50 text-black flex items-center justify-center">
                <Key size={16} />
              </div>
              <h2 className="text-[15px] font-bold text-black">Change Password</h2>
            </div>

            {/* this show the state message ,
dependding upon the situation */}
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

            {/* form extracting the data as a input from the user */}
            <form onSubmit={handlePassSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Current Password</label>
                <input required type="password" value={passData.current} onChange={e => setPassData({ ...passData, current: e.target.value })}
                  className="w-full sm:w-80 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-sm font-bold focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">New Password</label>
                <input required type="password" value={passData.newPass} onChange={e => setPassData({ ...passData, newPass: e.target.value })}
                  className="w-full sm:w-80 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-sm font-bold focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-black uppercase tracking-[0.6px]">Confirm New</label>
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
              <h2 className="text-[15px] font-bold text-black">Email Notifications</h2>
            </div>

            {/* the below dummy data to acta as a subheading about the main feature */}
            <div className="flex flex-col gap-4">
              {[
                { id: "newApp", label: "New Application Alerts", desc: "Get an email when a candidate applies to your jobs." },
                { id: "messages", label: "Direct Messages", desc: "Get notified when a student replies to you." },
                { id: "marketing", label: "CareerSync Updates", desc: "Product updates, newsletters, and tips." },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-black">{item.label}</p>
                    <p className="text-[12px] text-black font-medium">{item.desc}</p>
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
            <p className="text-[13px] text-black font-medium mb-4">
              Deleting your account will permanently wipe your company profile, all jobs, and applicant history. This action cannot be reversed.
            </p>
            <button onClick={handleDeleteAccount}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-red-200 text-red-600 font-bold text-[13px] rounded-xl hover:bg-red-50 transition-colors">
              <Trash2 size={14} /> Delete Organization Account
            </button>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
