
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  Bell,
  Settings,
  ChevronDown,
  Briefcase,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setMobileOpen(false);
    navigate("/login");
  };

  const navItems = [
    { label: "JOBS", path: "/jobs" },
    { label: "RESUME", path: "/resume" },
    { label: "PROFILE", path: "/profile" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/jobs" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
              <Briefcase size={18} className="text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              CareerSync
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                      ${active
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              {token && (
                <button className="hidden md:flex p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                  <Bell size={20} />
                </button>
              )}

              {token && (
                <div className="hidden md:block relative group">
                  <div className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors">
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.username || "User"
                        }&background=4f46e5&color=fff&rounded=true`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border border-slate-200"
                    />
                    <ChevronDown size={14} className="text-slate-400" />
                  </div>

                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                    <div className="w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1 flex flex-col">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <Settings size={16} /> Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-fade-in-down">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg font-semibold transition-colors
                  ${location.pathname === item.path
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                {item.label}
              </Link>
            ))}

            {token && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-semibold transition-colors mt-2"
              >
                <LogOut size={18} /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
