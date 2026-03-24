import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

//submit the form and call the login axios function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

// If the login is successful, the user will be redirected to the dashboard page
      if (data.success) {
        navigate("/dashboard");
      } else {
        // Step 3: Display specific server error messages
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
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 font-sans">
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white p-10 rounded-3xl border border-neutral-200 shadow-sm">
          <div className="text-center mb-8">
            <img 
              src="/logo.svg" 
              alt="Logo" 
              className="h-16 w-16 rounded-full mx-auto mb-4 object-cover"
            />
            <span className="text-2xl font-black text-neutral-800 tracking-tight block">
              Career<span className="text-primary-500">Sync</span>
            </span>
            <p className="text-neutral-400 mt-2 text-sm font-medium">Welcome back! Please login to continue.</p>
          </div>

{/* Displaying the login failed errors */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold text-center">
              {error}
            </div>
          )}

{/* Through these forma we are submitting the data to the backend */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                placeholder="Enter your email"
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
                autoComplete="current-password"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div className="flex justify-end -mt-2">
              <Link to="/forgot-password" className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-3.5 rounded-full bg-primary-500 hover:bg-primary-600 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-8 text-sm text-neutral-400 font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary-500 hover:text-primary-600 font-bold transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
