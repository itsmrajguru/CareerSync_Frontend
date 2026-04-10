import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../services/authService";
import Footer from "../components/Footer";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); //default role set to student
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  /* This function calls the SignUpPage axios and now passes the role */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await signupUser({ username, email, password, role }); //change 1:added role

      if (data && data.success) {
        setError("");
        /* redirect to the OTP verification page, passing email via navigation state
        so VerifySignupOtpPage knows which email to verify */
        navigate("/verify-signup-otp", { state: { email } });
      } else {
        setError(data.message || "Signup failed. Please check your details.");
      }
    } catch (err) {
      console.error("Signup Flow Error:", err);
      const serverMessage = err.response?.data?.message;
      setError(serverMessage || err.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-white font-sans overflow-hidden">

      {/*added new 40-60 view
and this is the left side 60 panel*/}
      <div className="hidden lg:flex lg:flex-[0.6] bg-[#0c1a2e] relative flex-col items-center pt-[12vh] p-8 overflow-hidden shadow-[inset_-20px_0_40px_rgba(0,0,0,0.1)]">

        {/* this diaplays the content on the left panel with 
carrersync logo and the text below it
we have also added the return to home page here*/}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px]" />
        <div className="relative z-10 w-full max-w-[440px] text-center">
          {/* careersync logo */}
          <img
            src="/logo.svg"
            alt="CareerSync Logo"
            className="w-32 h-32 mx-auto mb-6 shadow-2xl rounded-[32px] border border-white/10 p-2"
            style={{ filter: "drop-shadow(0 0 50px rgba(239, 68, 68, 0.3))" }}
          />
          <h2 className="text-[52px] font-black text-white leading-[0.9] tracking-[-3px] mb-3">
            Build your <span className="text-[#ef4444]">future.</span>
          </h2>
          <p className="text-[17px] text-[#94a3b8] font-medium leading-relaxed mb-4 mx-auto max-w-[380px]">
            The unified network for professional growth. Join thousands of candidates and companies building the next generation of career infrastructure.
          </p>
        </div>

        {/* Back to Home Button */}
        <Link to="/" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl text-[10px] font-bold text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all uppercase tracking-[2px] whitespace-nowrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><path d="m15 18-6-6 6-6" /></svg>
          Back to Home
        </Link>
      </div>

      {/* added new 40-60 view
and this is the right side 40 panel*/}
      <div className="flex-1 lg:flex-[0.4] flex flex-col items-center justify-center px-8 lg:px-12 relative z-10 bg-white">
        <div className="w-full max-w-[320px] py-4 flex flex-col gap-4">

          {/* Hero section */}
          <div className="text-left">
            <h1 className="text-[26px] font-black text-[#0f172a] tracking-[-1.5px] leading-tight mb-0.5">
              Create Account.
            </h1>
            <p className="text-[#64748b] text-[12px] font-medium leading-tight">
              Join the unified network for careers.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-[12px] font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}


          {/*through this form, we will take the email and password
from the user and log them in directly  */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            {/* Role Selector...
from here we shift the user credentials among student and company
depending upon the type of user */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold text-[#475569] uppercase tracking-[1.5px] ml-0.5">Identity</label>
              <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#f1f5f9] rounded-lg">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`py-1 rounded-md text-[10px] font-bold transition-all ${role === "student" ? "bg-white text-[#000] shadow-sm" : "text-[#64748b]"}`}
                >Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setRole("company")}
                  className={`py-1 rounded-md text-[10px] font-bold transition-all ${role === "company" ? "bg-white text-[#000] shadow-sm" : "text-[#64748b]"}`}
                >Employer
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold text-[#475569] uppercase tracking-[1.5px] ml-0.5">Username</label>
              <input
                type="text"
                name="username"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3.5 py-1.5 text-[13px] text-[#0f172a] font-bold focus:ring-4 focus:ring-primary-50 transition-all outline-none placeholder:text-[#94a3b8]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Pick a handle"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold text-[#475569] uppercase tracking-[1.5px] ml-0.5">Email address</label>
              <input
                type="email"
                name="email"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3.5 py-1.5 text-[13px] text-[#0f172a] font-bold focus:ring-4 focus:ring-primary-50 transition-all outline-none placeholder:text-[#94a3b8]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@company.com"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold text-[#475569] uppercase tracking-[1.5px] ml-0.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg pl-3.5 pr-10 py-1.5 text-[13px] text-[#0f172a] font-bold focus:ring-4 focus:ring-primary-50 transition-all outline-none placeholder:text-[#94a3b8]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                />
                {/* the eye button that display , and undisplay the password 
to show and hide it for the user */}
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-[13px] mt-0.5 font-bold shadow-md shadow-primary-200/50"
            >
              {loading ? "Deploying account..." : "Start Building Future"}
            </button>
          </form>

          <div className="text-center text-[11px] text-[#64748b] font-medium border-t border-[#f1f5f9] pt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#0f172a] hover:text-[#ef4444] font-black transition-colors underline decoration-[#ef4444]/20 hover:decoration-[#ef4444]">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}





