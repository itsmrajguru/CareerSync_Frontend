import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { verifySignupOtp } from "../services/authService";
import Footer from "../components/Footer";

export default function VerifySignupOtpPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* extract the email passed from SignupPage via navigation state */
  const location = useLocation();
  const email = location.state?.email;

  /* if user lands here without going through signup, send them back */
  if (!email) {
    navigate("/signup");
    return null;
  }

  /* This function verifies the OTP sent to the user's email during signup */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      //step 1 : call the verifySignupOtp api with email and otp
      const data = await verifySignupOtp(email, otp);

      if (data && data.success) {
        //step 2 : on success, redirect to login page
        navigate("/login");
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP Verify Error:", err);
      setError(err.response?.data?.message || err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans overflow-y-auto">

      {/* we created a 40-60 panel view and added the left side showup view here */}
      <div className="hidden lg:flex lg:flex-[0.6] bg-[#0c1a2e] relative flex-col items-center pt-[12vh] p-8 overflow-hidden shadow-[inset_-20px_0_40px_rgba(0,0,0,0.1)]">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px]" />
        <div className="relative z-10 w-full max-w-[440px] text-center">
          <img
            src="/logo.svg"
            alt="CareerSync Logo"
            className="w-32 h-32 mx-auto mb-6 shadow-2xl rounded-[32px] border border-white/10 p-2"
            style={{ filter: "drop-shadow(0 0 50px rgba(239, 68, 68, 0.3))" }}
          />
          <h2 className="text-[52px] font-black text-white leading-[0.9] tracking-[-3px] mb-3">
            Final <span className="text-[#ef4444]">step.</span>
          </h2>
          <p className="text-[17px] text-[#94a3b8] font-medium leading-relaxed mb-4 mx-auto max-w-[380px]">
            We prioritize account integrity above all. This final verification step ensures that your professional profile remains protected.
          </p>
        </div>

        {/* Back to Home Button */}
        <Link to="/" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl text-[10px] font-bold text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all uppercase tracking-[2px] whitespace-nowrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><path d="m15 18-6-6 6-6" /></svg>
          Back to Home
        </Link>
      </div>

      {/* and this right side content actuually showws the form here */}
      <div className="flex-1 lg:flex-[0.4] flex flex-col items-center justify-center px-6 lg:px-12 py-12 relative z-10 bg-white">
        <div className="w-full max-w-[320px] flex flex-col gap-8">

          {/* mobile logo - only visible on small screens */}
          <div className="lg:hidden flex justify-center mb-2" onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="Logo" className="w-14 h-14 rounded-2xl shadow-lg border border-slate-100" />
          </div>

          {/* Hero section */}
          <div className="text-left">
            <h1 className="text-[30px] font-black text-[#0f172a] tracking-[-1.5px] leading-tight mb-2">
              Verify Email.
            </h1>
            <p className="text-[#64748b] text-[12px] font-medium leading-tight">
              A 6-digit code has been sent to <span className="font-black text-[#0f172a] underline decoration-[#ef4444]">{email}</span>.
            </p>
          </div>


          {/* Displaying state messages 
i.e. those error message , which shoudl be shown on incorrect email,
incorrect password, email not verified... etc*/}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-[12px] font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          {/* this form takes the input data from the user
 and sends to the backend through axios */}
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-[9px] font-extrabold text-[#475569] uppercase tracking-[1.5px] ml-0.5 text-center">Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-4 text-center tracking-[0.5em] text-3xl font-black text-[#0f172a] focus:ring-8 focus:ring-primary-50 transition-all outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                placeholder="000000"
                autoFocus
              />
              <p className="text-[9px] text-[#94a3b8] text-center font-bold uppercase tracking-wider mt-2">Expires in 10 minutes</p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="btn-primary w-full py-4 text-[14px] font-bold shadow-md shadow-primary-200/50"
              >
                {loading ? "Verifying..." : "Confirm Verification"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-[11px] font-black text-[#64748b] hover:text-[#0f172a] transition-colors text-center uppercase tracking-widest"
              >
                ← Use different email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}





