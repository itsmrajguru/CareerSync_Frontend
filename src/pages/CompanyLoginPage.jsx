import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function CompanyLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  /* validates credentials — if valid, backend issues JWT tokens directly */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      if (data.success) {
        if (data.user?.role === "company") {
          navigate("/company/dashboard");
        } else {
          // If student accidentally uses company login, redirect correctly
          navigate("/student/dashboard");
        }
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || err.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-white font-sans overflow-hidden">

      {/*added new 40-60 view
and this is the left side 60 panel*/}

      <div className="hidden lg:flex lg:flex-[0.6] bg-[#0c1a2e] relative flex-col items-center pt-[12vh] p-8 overflow-hidden shadow-[inset_-20px_0_40px_rgba(0,0,0,0.1)]">

        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 w-full max-w-[440px] text-center">
          <img
            src="/logo.svg"
            alt="CareerSync Logo"
            className="w-32 h-32 mx-auto mb-6 shadow-2xl rounded-[32px] border border-white/10 p-2"
            style={{ filter: "drop-shadow(0 0 50px rgba(59, 130, 246, 0.35))" }}
          />
          <h2 className="text-[52px] font-black text-white leading-[0.9] tracking-[-3px] mb-3">
            Hire better. <span className="text-[#3b82f6]">Hire faster.</span>
          </h2>
          <p className="text-[17px] text-[#94a3b8] font-medium leading-relaxed mb-4 mx-auto max-w-[380px]">
            The recruiter-first talent platform to post jobs, review verified candidates, and close roles faster than ever.
          </p>
        </div>

        {/* Back to Home Button — same as LoginPage */}
        <Link to="/" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl text-[10px] font-bold text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all uppercase tracking-[2px] whitespace-nowrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><path d="m15 18-6-6 6-6" /></svg>
          Back to Home
        </Link>
      </div>

      {/* right side actual login portal form  */}
      <div className="flex-1 lg:flex-[0.4] flex flex-col items-center justify-center px-8 lg:px-12 relative z-10 bg-white">
        <div className="w-full max-w-[320px] py-4 flex flex-col gap-6">

          <div className="text-left">
            {/* Company indicator */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", borderRadius: 10, padding: "4px 10px", marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#3b82f6", textTransform: "uppercase", letterSpacing: 1 }}>🏢 Company Portal</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 4 }}>
              Welcome back,<br />
              <span style={{ color: "#3b82f6" }}>Recruiter.</span>
            </h1>
            <p style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
              Sign in to manage your talent pipeline.
            </p>
          </div>

          {/* Displaying state messages 
i.e. those error message , which shoudl be shown on incorrect email,
incorrect password, email not verified... etc*/}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-[12px] font-bold flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          {/*through this form, we will take the email and password
from the user and log them in directly  */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold text-[#475569] uppercase tracking-[1.5px] ml-0.5">Company Email</label>
              <input
                type="email"
                name="email"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3.5 py-2 text-[14px] text-[#0f172a] font-bold focus:outline-none placeholder:text-[#94a3b8] placeholder:font-normal transition-all"
                style={{ "--tw-ring-color": "#3b82f6" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="hr@yourcompany.com"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between px-0.5">
                <label className="text-[9px] font-extrabold text-[#475569] uppercase tracking-[1.5px]">Password</label>
                <Link to="/forgot-password" className="text-[9px] font-black hover:underline uppercase tracking-widest" style={{ color: "#3b82f6" }}>
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg pl-3.5 pr-10 py-2 text-[14px] text-[#0f172a] font-bold focus:outline-none placeholder:text-[#94a3b8] placeholder:font-normal transition-all"
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* user will be redirected to company dashboard on successful login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-[14px] font-bold rounded-[10px] mt-1 transition-all"
              style={{
                background: loading ? "#93c5fd" : "#3b82f6",
                color: "#fff",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 8px 24px rgba(59,130,246,0.25)"
              }}
            >
              {loading ? "Signing in..." : "Sign in to Recruiter Portal"}
            </button>
          </form>

          {/* Switch to student login */}
          <div style={{ textAlign: "center", fontSize: 12, color: "#64748b", fontWeight: 500, borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
            Looking for{" "}
            <Link to="/login" style={{ color: "#0f172a", fontWeight: 800, textDecoration: "underline", textDecorationColor: "rgba(0,0,0,0.15)" }}>
              Job Seeker Login?
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, fontSize: 9, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, opacity: 0.6 }}>
          <span>© 2026 CareerSync</span>
          <Link to="/privacy" style={{ color: "inherit" }}>Privacy</Link>
          <Link to="/legal" style={{ color: "inherit" }}>Legal</Link>
        </div>
      </div>
    </div>
  );
}
