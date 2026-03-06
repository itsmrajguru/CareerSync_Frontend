import { Link } from "react-router-dom";

export default function HomePage() {
  const raw = localStorage.getItem("user");
  let username = "there";
  try {
    const u = raw ? JSON.parse(raw) : null;
    if (u && u.username) username = u.username;
  } catch (e) {
    // ignore JSON errors
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 md:p-16 text-center">
          <div className="mb-8 inline-flex p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Career<span className="text-blue-600">Sync</span>
            </span>
          </div>

          <h2 className="text-xl font-semibold text-slate-500 mb-2">Hey, {username}!</h2>
          <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            The future of your career <br />
            <span className="text-blue-600">starts here.</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Discover verified roles from high-growth companies. Join thousands of developers finding their dream jobs today.
          </p>

          <div className="flex justify-center">
            <Link to="/dashboard" className="px-10 py-4 bg-blue-600 text-white rounded-xl text-[17px] font-bold shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:bg-blue-700 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] transform hover:-translate-y-0.5 transition-all">
              Explore Opportunities &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
