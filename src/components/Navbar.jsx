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
  { label: "Resume Tools", path: "/resume", icon: <FileText size={15} /> },
  { label: "Profile", path: "/profile", icon: <User size={15} /> },
];

//Navbar 
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const initial = (user.username || "U")[0].toUpperCase();

  /* This is the automated function for the Navbar to 
  open in the mobile screen */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // added scroll effect for the sticky transparent navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.95)" : "#fff",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid #f3f4f6",
        transition: "all 0.3s",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Here we updated the header CareerSync with logo */}
          <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/logo.svg" alt="Logo" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
            <span style={{ fontSize: 20, fontWeight: 900, color: "#111827", letterSpacing: -0.5 }}>
              Career<span style={{ color: "#02bcf0" }}>Sync</span>
            </span>
          </Link>

          {/* Right-Side Desktop Actions */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {/* This is a map functionality run in the NAVLINK Array and 
            displaying each route along with its properties */}
            {NAV_LINKS.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="nav-link"
                style={isActive(path) ? { color: "#02bcf0", borderColor: "#02bcf0" } : {}}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/*Hers is the notification logo  */}
            {token && (
              <button style={{
                background: "transparent", border: "none", color: "#9ca3af",
                position: "relative", width: 36, height: 36, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s"
              }} onMouseEnter={e => { e.currentTarget.style.color = "#111827"; e.currentTarget.style.background = "#f9fafb"; }} onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.background = "transparent"; }}>
                <Bell size={18} />
                <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff" }} />
              </button>
            )}

            {/* Support/Help Logo */}
            <button style={{
                background: "transparent", border: "none", color: "#9ca3af",
                width: 36, height: 36, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s"
              }} onMouseEnter={e => { e.currentTarget.style.color = "#111827"; e.currentTarget.style.background = "#f9fafb"; }} onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.background = "transparent"; }}>
              <HelpCircle size={18} />
            </button>

            <div style={{ width: 1, height: 24, background: "#e5e7eb", margin: "0 6px" }} />

            {/* User Profile & Account Dropdown */}
            {token ? (
              <div className="relative" ref={dropdownRef} onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                <button style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "linear-gradient(135deg, #02bcf0, #014d65)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, color: "#fff", fontSize: 15, cursor: "pointer", border: "none",
                  boxShadow: dropdownOpen ? "0 0 0 3px rgba(2,188,240,0.2)" : "none",
                  transition: "all 0.2s"
                }}>
                  {initial}
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: "absolute", right: 0, top: "100%", width: 240,
                    background: "#fff", border: "1px solid #b3eefb", borderRadius: 16,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.08)", zIndex: 50, overflow: "hidden",
                    paddingBottom: 6
                  }}>
                    {/* User name + email */}
                    <div style={{ padding: "16px", borderBottom: "1px solid #f3f4f6", background: "#f8fbfe" }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: "#111827", margin: 0 }}>{user.username || "User"}</p>
                      <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email || ""}</p>
                    </div>

                    <div style={{ padding: "8px 0" }}>
                      {[
                        { to: "/dashboard", icon: <Home size={16} />, label: "Dashboard" },
                        { to: "/profile", icon: <Edit2 size={16} />, label: "Edit Profile" },
                        { to: "/jobs", icon: <Bookmark size={16} />, label: "Saved Jobs" },
                      ].map((item, i) => (
                        <Link key={i} to={item.to} onClick={() => setDropdownOpen(false)} style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "8px 16px",
                          fontSize: 13, fontWeight: 600, color: "#374151", textDecoration: "none"
                        }} onMouseEnter={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.color = "#02bcf0"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#374151"; }}>
                          {item.icon} {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Account Footnote & Logout */}
                    <div style={{ borderTop: "1px solid #f3f4f6", padding: "8px 0 0" }}>
                      <button onClick={handleLogout} style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", width: "100%",
                        fontSize: 13, fontWeight: 700, color: "#ef4444", background: "transparent", border: "none", cursor: "pointer", textAlign: "left"
                      }} onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* buttons for authentication pages */}
                <button className="btn-outline" onClick={() => navigate("/login")}>Login</button>
                <button className="btn-primary" onClick={() => navigate("/signup")}>Sign Up Free</button>
              </div>
            )}
          </div>

          {/* Hamburger (Mobile Toggle) */}
          <button
            className="mobile-menu-btn"
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", alignItems: "center" }}
            onClick={() => setMobileOpen(o => !o)}
          >
            {mobileOpen ? <X size={24} color="#111827" /> : <Menu size={24} color="#111827" />}
          </button>
        </div>

        {/* The functyiionality refers to the navbar opening in the mobile screen */}
        {mobileOpen && (
          <div style={{
            position: "fixed", inset: "64px 0 0 0", background: "#fff",
            zIndex: 99, padding: "24px", display: "flex", flexDirection: "column", gap: 4,
            borderTop: "1px solid #f3f4f6", overflowY: "auto"
          }}>
            {/* User Preview */}
            {token && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: "1px solid #f3f4f6", marginBottom: 16 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #02bcf0, #014d65)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 16 }}>{initial}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>{user.username || "User"}</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{user.email || ""}</div>
                </div>
              </div>
            )}

            {/* Sidebar Links */}
            {NAV_LINKS.map(({ label, path }) => (
              <Link key={path} to={path} onClick={() => setMobileOpen(false)} style={{
                padding: "14px 12px", fontSize: 16, fontWeight: 600, color: isActive(path) ? "#02bcf0" : "#374151",
                background: isActive(path) ? "#e6f9fe" : "transparent", borderRadius: 10, textDecoration: "none"
              }}>{label}</Link>
            ))}

            <div style={{ marginTop: "auto", paddingTop: 24 }}>
              {token ? (
                <button onClick={handleLogout} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%",
                  padding: "14px", borderRadius: 12, background: "#fef2f2", color: "#ef4444", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer"
                }}>
                  <LogOut size={18} /> Logout
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button className="btn-outline" style={{ padding: "14px", width: "100%" }} onClick={() => navigate("/login")}>Login</button>
                  <button className="btn-primary" style={{ padding: "14px", width: "100%" }} onClick={() => navigate("/signup")}>Sign Up Free</button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}