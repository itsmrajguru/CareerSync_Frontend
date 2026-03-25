import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Briefcase, PenLine, FileText, User, Bell,
  HelpCircle, Settings, LogOut, Menu, X,
  Home, Bookmark, ClipboardList, Edit2,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Dashboard", path: "/dashboard", icon: <Briefcase size={15} /> },
  { label: "Jobs", path: "/jobs", icon: <PenLine size={15} /> },
  { label: "Resume", path: "/resume", icon: <FileText size={15} /> },
  { label: "Profile", path: "/profile", icon: <User size={15} /> },
];

//Navbar 
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const initial = (user.username || "U")[0].toUpperCase();




  /* This is the automated function for the Navbar to 
  open in the mobile screen */

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);


/* Here we just  remove the token from the localstorage
and due to this  within miliseconds, user will be thrown out of the
website and redirected to the login page... because the system checks
for the token , for even a single click or redirection to any page 
functionLity */

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    setDropdownOpen(false);
    setMobileOpen(false);

    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">

          {/* Here we updated the header CareerSync with logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 flex-shrink-0 group">
            <img
              src="/logo.svg"
              alt="Logo"
              className="h-9 w-9 rounded-full object-cover transition-transform group-hover:scale-105"
            />
            <span className="text-[19px] font-extrabold tracking-tight text-black">
              Career<span className="text-primary-400">Sync</span>
            </span>
          </Link>

          {/* Right-Side Desktop Actions */}
          <div className="hidden md:flex items-center gap-1">

{/* This is a map functionality run in the NAVLINK Array and 
displaying each route along with its properties */}
            {NAV_LINKS.map(({ label, path, icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3.5 py-0.5 rounded-lg text-[13.5px] font-semibold
                            transition-all duration-150
                            ${isActive(path)
                    ? "bg-primary-50 text-primary-500"
                    : "text-black hover:bg-neutral-50"
                  }`}
              >
                <span className={isActive(path) ? "text-primary-400" : "text-neutral-400"}>
                  {icon}
                </span>
                {label}
              </Link>
            ))}

            <div className="w-px h-6 bg-neutral-100 mx-2" />

{/*Hers is the notification logo  */}
            {token && (
              <button className="relative w-9 h-9 rounded-lg flex items-center justify-center
                                 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50
                                 transition-all duration-150">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500
                                 border border-white" />
              </button>
            )}

            {/* Support/Help Logo */}
            <button className="w-9 h-9 rounded-lg flex items-center justify-center
                               text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50
                               transition-all duration-150">
              <HelpCircle size={18} />
            </button>

            <div className="w-px h-6 bg-neutral-100 mx-2" />

            {/* User Profile & Account Dropdown */}
            {token && (
              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  className={`w-9 h-9 rounded-full bg-primary-400 flex items-center justify-center
                              text-white text-sm font-bold transition-all duration-150
                              hover:bg-primary-500 ring-2 ring-transparent
                              ${dropdownOpen ? "ring-primary-200" : ""}`}
                >
                  {initial}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full w-56 bg-white border border-[#b3eefb]
                                  rounded-2xl shadow-lg shadow-neutral-100/80 py-1.5 z-50">

                    {/* User name + email */}
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-bold text-black leading-tight">
                        {user.username || "User"}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5 truncate">
                        {user.email || ""}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium
                                   text-black hover:bg-neutral-50 transition-colors"
                      >
                        <Home size={15} /> Home
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium
                                   text-black hover:bg-neutral-50 transition-colors"
                      >
                        <ClipboardList size={15} /> My Applications
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium
                                   text-black hover:bg-neutral-50 transition-colors"
                      >
                        <Bookmark size={15} /> My Bookmarks
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium
                                   text-black hover:bg-neutral-50 transition-colors"
                      >
                        <Edit2 size={15} /> Edit Profile
                      </Link>
                      <button
                        onClick={() => setDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium
                                   text-black hover:bg-neutral-50 transition-colors"
                      >
                        <Settings size={15} /> Settings
                      </button>
                    </div>

                    <div className="border-t border-neutral-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium
                                   text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger (Mobile Toggle) */}
          <button
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center
                       text-neutral-600 hover:bg-neutral-50 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
{/* The functyiionality refers to the navbar opening in the mobile screen */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-white flex flex-col pt-4">

          {/* User Preview */}
          {token && (
            <div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-100">
              <div className="w-10 h-10 rounded-full bg-primary-400 flex items-center justify-center
                              text-white text-sm font-bold flex-shrink-0">
                {initial}
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-800">{user.username || "User"}</p>
                <p className="text-xs text-neutral-400">{user.email || ""}</p>
              </div>
            </div>
          )}

          {/* Sidebar Links */}
          <nav className="flex flex-col px-4 py-4 gap-1 flex-1">
            {NAV_LINKS.map(({ label, path, icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold
                            transition-colors
                            ${isActive(path)
                    ? "bg-primary-50 text-primary-500"
                    : "text-black hover:bg-neutral-50"
                  }`}
              >
                <span className={isActive(path) ? "text-primary-400" : "text-neutral-400"}>
                  {icon}
                </span>
                {label}
              </Link>
            ))}

            <div className="h-px bg-neutral-100 my-3" />

            <button className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-semibold
                               text-black hover:bg-neutral-50 transition-colors text-left">
              <span className="text-neutral-400"><Settings size={15} /></span>
              Settings
            </button>
          </nav>

          {/* Account Footnote & Logout */}
          <div className="px-4 pb-8 flex flex-col gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-semibold
                         text-red-500 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}