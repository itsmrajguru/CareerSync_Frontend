import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../api";
import Footer from "../components/Footer";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); //default role set to student
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    <div className="min-h-screen flex flex-col bg-[#f0fbfe] font-sans">
      <div className="flex-1 flex items-center justify-center px-4 w-full py-12">
        <div className="w-full max-w-md relative z-10">
          {/* adding feature-card class to match with home page dynamic ui */}
          <div className="feature-card p-10 w-full animate-fade-in">

            {/* Hero section with careeersync logo and Signup header*/}
            <div className="text-center mb-8">
              <img
                src="/logo.svg"
                alt="Logo"
                className="h-16 w-16 mx-auto mb-4 floating"
              />
              <span className="text-2xl font-black text-neutral-800 tracking-tight block">
                Join Career<span className="text-primary-500">Sync</span>
              </span>
              <p className="text-neutral-400 mt-2 text-sm font-medium">Create your account to get started.</p>
            </div>

            {/* Displaying the login failed errors */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold text-center">
                {error}
              </div>
            )}

            {/*through these inputs, data will be sent to the axios and 
            finally to databases via backend */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Role Selector (Student vs Employer) */}
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      role === "student"
                        ? "bg-primary-50 border-primary-500 text-primary-600 shadow-sm"
                        : "bg-white border-neutral-100 text-neutral-400 hover:border-neutral-200"
                    }`}
                  >
                    Job Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("company")}
                    className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      role === "company"
                        ? "bg-primary-50 border-primary-500 text-primary-600 shadow-sm"
                        : "bg-white border-neutral-100 text-neutral-400 hover:border-neutral-200"
                    }`}
                  >
                    Company
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-neutral-400 ml-1 uppercase tracking-wider">Username</label>
                <input
                  type="text"
                  name="username"
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Choose a username"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-neutral-400 ml-1 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-neutral-400 ml-1 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Create a password"
                  minLength={6}
                />
                <p className="text-[10px] text-neutral-400 ml-1">Minimum 6 characters required</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-4 w-full py-4 text-base"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="text-center mt-8 text-sm text-neutral-400 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-500 hover:text-primary-600 font-bold transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
