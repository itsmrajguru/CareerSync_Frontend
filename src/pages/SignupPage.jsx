import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../api";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
      if (data && data.message && data.message.includes("successfully")) {
        // Change logic to show success message instead of auto-redirecting
        setError(""); // clear error
        // Re-use `error` state for success message (hacky, or add new state)
        // Wait, better to alert or set a success state. Let's just alert and redirect for now.
        // Actually, let's use a standard Javascript alert, then redirect.
        alert(data.message);
        navigate("/login");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans">
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-center mb-8">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Career<span className="text-indigo-600">Sync</span>
            </span>
            <p className="text-slate-500 mt-2 text-sm font-medium">Sign up to find your next opportunity.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Username</label>
              <input
                type="text"
                name="username"
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="Choose a username"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Enter your email address"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                name="password"
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Create a password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-8 text-sm text-slate-500 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
