import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../api";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.debug('[Signup] Mounted');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.debug('[Signup] Initiated submit');
    setError("");
    setLoading(true);
    try {
      const data = await signupUser({ username, email, password });
      console.debug('[Signup] Response:', data);
      if (data && data.success) {
        setError("");
        setSuccessMsg(data.message || 'Account created! Please verify your email.');
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup Error Detailed:", err.response?.data || err);
      const serverMessage = err.response?.data?.message;
      setError(serverMessage || err.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 font-sans">
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white p-10 rounded-3xl border border-neutral-200 shadow-sm">
          <div className="text-center mb-8">
            <span className="text-2xl font-black text-neutral-700 tracking-tight">
              Career<span className="text-primary-500">Sync</span>
            </span>
            <p className="text-neutral-400 mt-2 text-sm font-medium">Sign up to find your next opportunity.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold text-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-semibold text-center">
              {successMsg} Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
              className="mt-4 w-full py-3.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2"
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
  );
}
