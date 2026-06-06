import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, MapPin, Briefcase, FileText, BarChart2,
  ChevronDown, ArrowRight, Menu, X, Star, Zap,
  TrendingUp, Shield, Users, CheckCircle
} from "lucide-react";
import Footer from "../components/Footer";

/* these are the text blocks , that we are displaying 
 below the "Built doe serious job seekers "component */

const FEATURES = [
  {
    icon: <Zap size={20} />,
    title: "Smart Job Matching",
    desc: "AI-powered matching surfaces roles that fit your skills, experience, and location — no endless scrolling.",
    color: "#0d1117",
    bg: "#e6f9fe",
  },
  {
    icon: <FileText size={20} />,
    title: "Resume Analyser",
    desc: "Upload once, get an instant score, skill gap report, and tailored suggestions to reach the top of the pile.",
    color: "#0d1117",
    bg: "#d1fae5",
  },
  {
    icon: <BarChart2 size={20} />,
    title: "Application Tracker",
    desc: "Every application, interview, and follow-up — tracked in one clean dashboard so nothing slips through.",
    color: "#0d1117",
    bg: "#ede9fe",
  },
  {
    icon: <Shield size={20} />,
    title: "Verified Listings Only",
    desc: "Every job is verified before it goes live. No ghost jobs, no bait-and-switch, no wasted applications.",
    color: "#0d1117",
    bg: "#fef3c7",
  },
];


// The main function that displays the whole SPA
/* I have added some classes and medi queries in the css file
 to make the page look good on mobile phones as well */
export default function HomePage() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("candidate");

  /* This useEffect hook wil redirect the user 
  directly to the dashboard page , if user has a valid
  token, which ultimately means that the user is authenticated*/
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/student/dashboard");
  }, []);

  /* this functionality is used to make changes in the page
  components when the user will scroll more than 20 px
  ex...Navabr becomes stick and its background becomes blurr
  after user scrolls more than 20 px */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/login`);
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "var(--color-app-bg)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* SECTION 1:*/}
      {/*created a
seperate navbar for the home page */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.75)" : "#fff",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "2px solid #e2e8f0",
        transition: "all 0.3s",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="Logo" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -1 }}>
              <span style={{ color: "#0d1117" }}>Career</span><span style={{ color: "#ef4444" }}>Sync</span>
            </span>
          </div>

          <div style={{ width: 2, height: 24, background: "#e2e8f0", margin: "0 12px" }} className="desktop-nav" />

          {/* navbar links...
tried to make it dynamic  but no need  */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <a href="#jobseekers" className="nav-link" style={{ textDecoration: 'none' }}>For Job Seekers</a>
            <a href="#companies" className="nav-link" style={{ textDecoration: 'none' }}>For Companies</a>
            <a href="#about" className="nav-link" style={{ textDecoration: 'none', cursor: "pointer" }}>About</a>
          </div>

          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn-outline" onClick={() => navigate("/login")}>Login</button>
            <button className="btn-primary" onClick={() => navigate("/signup")}>Sign Up</button>
            <div style={{ width: 2, height: 24, background: "#e2e8f0", margin: "0 12px" }} />
            <button
              className="btn-dark"
              style={{ fontSize: 13, gap: 6, whiteSpace: "nowrap" }}
              onClick={() => navigate("/company-login")}
            >
              <Briefcase size={14} /> Company Portal
            </button>
          </div>

          {/* here lets add the changes in the navabr to open it for mobile */}
          <button
            className="mobile-menu-btn"
            style={{ background: "none", border: "none", cursor: "pointer", alignItems: "center" }}
            onClick={() => setMobileOpen(o => !o)}
          >
            {mobileOpen ? <X size={24} color="#111827" /> : <Menu size={24} color="#111827" />}
          </button>
        </div>

        {/* the whole functionality of the mobile navbar...
 changing the zindex and making it overlap on other features is the speciality
  of the hamburgers icon type */}
        {mobileOpen && (
          <div style={{
            position: "fixed", inset: "64px 0 0 0", background: "#fff",
            zIndex: 99, padding: "24px", display: "flex", flexDirection: "column", gap: 4,
            borderTop: "1px solid #f3f4f6",
          }}>
            {["For Job Seekers", "For Companies", "Blog", "About"].map(l => (
              <a
                key={l}
                href={l === "About" ? "#about" : undefined}
                onClick={() => l === "About" ? setMobileOpen(false) : null}
                style={{ padding: "14px 8px", fontSize: 16, fontWeight: 600, color: "#0d1117", borderBottom: "1px solid #f9fafb", cursor: "pointer", textDecoration: "none" }}
              >
                {l}
              </a>
            ))}
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="btn-outline" style={{ width: "100%", padding: 14 }} onClick={() => navigate("/login")}>Login</button>
              <button className="btn-primary" style={{ width: "100%", padding: 14 }} onClick={() => navigate("/signup")}>Sign Up Free</button>
              <button className="btn-dark" style={{ width: "100%", padding: 14 }} onClick={() => navigate("/login")}>Company Portal</button>
            </div>
          </div>
        )}
      </nav>

      {/* Section 2: Hero Section
this function matches the exact details of all other existing pages*/}
      <section style={{
        background: "linear-gradient(160deg, #e6f9fe 0%, var(--color-app-bg) 60%, #ffffff 100%)",
        padding: "clamp(28px, 5vw, 60px) 24px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(2,188,240,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(2,188,240,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", left: "15%", width: 180, height: 180, borderRadius: "50%", background: "rgba(2,188,240,0.04)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(2,188,240,0.1)", border: "1px solid rgba(2,188,240,0.2)", borderRadius: 20, padding: "6px 16px", marginBottom: 20 }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} className="pulse-dot" />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0d1117", letterSpacing: 0.5 }}>12,400+ verified jobs live right now</span>
          </div>

          {/* heading */}
          <h1 className="fade-up" style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 900, color: "#0d1117", letterSpacing: -2, lineHeight: 1, marginBottom: 16, animationDelay: '0.1s' }}>
            Find work that<br />
            <span style={{ color: "#ef4444", position: "relative" }}>
              actually fits you.
              <svg style={{ position: "absolute", bottom: -6, left: 0, width: "100%", height: 8, overflow: "visible" }} viewBox="0 0 300 8" preserveAspectRatio="none">
                <path d="M0 6 Q75 0 150 5 Q225 10 300 4" stroke="rgba(239,68,68,0.2)" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          {/*subheading */}
          <p className="fade-up" style={{ fontSize: 17, color: "#0d1117", maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.5, fontWeight: 400, animationDelay: '0.2s' }}>
            Browse thousands of verified jobs and internships. Upload your resume, track your applications, and land your next role — all in one place.
          </p>

          <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap", animationDelay: '0.4s' }}>
            {["Free for job seekers", "Resume analysis included", "No spam, ever"].map(t => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                <CheckCircle size={14} style={{ color: "#ef4444" }} /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Features - Job Seekers */}
      <section id="jobseekers" style={{ padding: "clamp(28px, 4vw, 52px) 24px", background: "#fff", borderTop: "2px solid #f1f5f9" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }} className="fade-up">
            <div style={{ display: "inline-flex", background: "#e6f9fe", borderRadius: 20, padding: "4px 14px", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#0d1117", textTransform: "uppercase", letterSpacing: 1 }}>Job Seeker Suite</span>
            </div>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 900, color: "#0d1117", letterSpacing: -1, marginBottom: 10 }}>
              Built for serious job seekers
            </h2>
            <p style={{ fontSize: 15, color: "#475569", maxWidth: 440, margin: "0 auto", lineHeight: 1.6 }}>
              Every tool you need to go from browsing to hired — in one focused platform.
            </p>
          </div>

          <div className="features-grid grid grid-cols-2 md:grid-cols-4" style={{ gap: 12 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="cs-card fade-up" style={{ animationDelay: `${0.1 * i}s`, padding: "20px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: 14 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0d1117", marginBottom: 8, lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 & 5: Recruitment + Premium Features — side by side */}
      <section id="companies" style={{ padding: "clamp(28px, 4vw, 56px) 0", background: "#f8fafc", borderTop: "2px solid #f1f5f9", borderBottom: "2px solid #f1f5f9", overflow: "hidden" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px" }}>

          {/* 2-col flex: Recruitment left | divider | Premium features right */}
          <div style={{ display: "flex", alignItems: "stretch", gap: 0, rowGap: 32, marginBottom: 40, flexWrap: "wrap" }}>

            {/* LEFT — Recruitment Suite */}
            <div id="about" className="fade-up md:pr-10" style={{ flex: "1 1 300px" }}>
              <div style={{ display: "inline-flex", background: "rgba(12,26,46,0.07)", borderRadius: 20, padding: "4px 14px", marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#0c1a2e", textTransform: "uppercase", letterSpacing: 1 }}>Recruitment Suite</span>
              </div>

              <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "#0f172a", letterSpacing: -1.5, marginBottom: 12, lineHeight: 1.1 }}>
                Hire the <span style={{ color: "#ef4444" }}>best talent</span><br /> faster than ever.
              </h2>

              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: 20, fontWeight: 500, textAlign: "justify" }}>
                Stop sorting through thousands of irrelevant resumes. CareerSync connects you with the right candidates using intelligent matching and verified professional identities.
              </p>

              {/* recruitment feature bullets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  { title: "Unlimited Postings", desc: "Post as many roles as you need." },
                  { title: "Talent Analytics", desc: "Track your recruitment funnel." },
                  { title: "Verified Profiles", desc: "Eliminate ghost candidates." },
                  { title: "Easy Management", desc: "Centralized hiring dashboard." }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: "flex-start" }}>
                    <div style={{ color: "#ef4444", marginTop: 2, flexShrink: 0 }}><CheckCircle size={15} /></div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 800, color: "#0f172a", fontSize: 13 }}>{item.title}</p>
                      <p style={{ margin: 0, color: "#64748b", fontSize: 11.5, fontWeight: 500, marginTop: 1 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <button className="btn-primary" style={{ padding: '11px 24px', borderRadius: 10, fontSize: 13.5 }} onClick={() => navigate('/signup')}>
                  Start Hiring Now
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="text-[#0f172a] font-bold text-sm hover:underline flex items-center gap-2"
                >
                  Learn More <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Vertical center divider — hidden on mobile */}
            <div className="hidden md:block" style={{ width: 1, background: "linear-gradient(to bottom, transparent, #e2e8f0 20%, #e2e8f0 80%, transparent)", flexShrink: 0, alignSelf: "stretch" }} />

            {/* RIGHT — Premium Features */}
            <div className="fade-up md:pl-10" style={{ flex: "1 1 300px", animationDelay: "0.15s" }}>
              <h2 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 900, color: "#0d1117", letterSpacing: -1.5, marginBottom: 20, lineHeight: 1.1 }}>
                Premium features for<br />
                <span style={{ color: "#ef4444" }}>ambitious goals.</span>
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  { icon: <Zap size={18} />, title: "Real-time Analytics", desc: "Track your profile performance and job application status in a live dashboard." },
                  { icon: <Shield size={18} />, title: "Identity Security", desc: "Encrypted data handling ensuring that your professional records remains private." },
                  { icon: <CheckCircle size={18} />, title: "Verified Skills", desc: "Badge-based skill validation to prove your expertise to potential employers." }
                ].map((feat, i) => (
                  <div key={i} style={{ display: "flex", gap: 14 }}>
                    <div style={{ flexShrink: 0, marginTop: 2, color: "#ef4444" }}>{feat.icon}</div>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0d1117", marginBottom: 3 }}>{feat.title}</h4>
                      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, fontWeight: 500, margin: 0, textAlign: "justify" }}>{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>


          {/* Developer card — centered below both columns */}
          <div className="fade-up" style={{ display: "flex", justifyContent: "center", animationDelay: "0.25s" }}>
            <div style={{
              background: "#fff",
              padding: "20px 32px",
              borderRadius: "16px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
              textAlign: "center"
            }}>
              <p style={{ fontSize: 10, fontWeight: 900, color: "#ef4444", textTransform: "uppercase", letterSpacing: 2, marginBottom: 5 }}>Developed By</p>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0d1117", letterSpacing: -0.5 }}>Mangesh S Rajguru</h3>
              <p style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginTop: 3 }}>Lead Architect &amp; Founder</p>
            </div>
          </div>

        </div>
      </section>


      {/* Sectiion  6: CTA (Moved down) */}
      

      <Footer />
    </div>
  );
}

