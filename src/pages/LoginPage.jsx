import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(username, password);
      if (data.access) {
        localStorage.setItem("token", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
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
              Career<span className="text-blue-600">Sync</span>
            </span>
            <p className="text-slate-500 mt-2 text-sm font-medium">Welcome back! Please login to continue.</p>
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
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="Enter your username"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                name="password"
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-end -mt-2">
              <Link to="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-8 text-sm text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
