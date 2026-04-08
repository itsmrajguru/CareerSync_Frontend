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
    color: "#02bcf0",
    bg: "#e6f9fe",
  },
  {
    icon: <FileText size={20} />,
    title: "Resume Analyser",
    desc: "Upload once, get an instant score, skill gap report, and tailored suggestions to reach the top of the pile.",
    color: "#10b981",
    bg: "#d1fae5",
  },
  {
    icon: <BarChart2 size={20} />,
    title: "Application Tracker",
    desc: "Every application, interview, and follow-up — tracked in one clean dashboard so nothing slips through.",
    color: "#7c3aed",
    bg: "#ede9fe",
  },
  {
    icon: <Shield size={20} />,
    title: "Verified Listings Only",
    desc: "Every job is verified before it goes live. No ghost jobs, no bait-and-switch, no wasted applications.",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
];


// The main function that displays the whole SPA
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
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fff", minHeight: "100vh", overflowX: "hidden" }}>

      {/* SECTION 1:*/}
      {/*created a
seperate navbar for the home page */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.75)" : "#fff",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid #f3f4f6",
        transition: "all 0.3s",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="Logo" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
            <span style={{ fontSize: 20, fontWeight: 900, color: "#111827", letterSpacing: -0.5 }}>
              Career<span style={{ color: "#02bcf0" }}>Sync</span>
            </span>
          </div>

          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <a href="#jobseekers" className="nav-link" style={{ textDecoration: 'none' }}>For Job Seekers</a>
            <a href="#companies" className="nav-link" style={{ textDecoration: 'none' }}>For Companies</a>
            <span className="nav-link">Blog</span>
            <span className="nav-link">About</span>
          </div>

          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn-outline" onClick={() => navigate("/login")}>Login</button>
            <button className="btn-primary" onClick={() => navigate("/signup")}>Sign Up</button>
            <div style={{ width: 1, height: 24, background: "#e5e7eb", margin: "0 6px" }} />
            <button
              className="btn-dark"
              style={{ fontSize: 13, gap: 6, whiteSpace: "nowrap" }}
              onClick={() => navigate("/login")}
            >
              <Briefcase size={14} /> Company Portal
            </button>
          </div>

          <button
            className="mobile-menu-btn"
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", alignItems: "center" }}
            onClick={() => setMobileOpen(o => !o)}
          >
            {mobileOpen ? <X size={24} color="#111827" /> : <Menu size={24} color="#111827" />}
          </button>
        </div>

        {mobileOpen && (
          <div style={{
            position: "fixed", inset: "64px 0 0 0", background: "#fff",
            zIndex: 99, padding: "24px", display: "flex", flexDirection: "column", gap: 4,
            borderTop: "1px solid #f3f4f6",
          }}>
            {["For Job Seekers", "For Companies", "Blog", "About"].map(l => (
              <div key={l} style={{ padding: "14px 8px", fontSize: 16, fontWeight: 600, color: "#374151", borderBottom: "1px solid #f9fafb", cursor: "pointer" }}>{l}</div>
            ))}
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="btn-outline" style={{ width: "100%", padding: 14 }} onClick={() => navigate("/login")}>Login</button>
              <button className="btn-primary" style={{ width: "100%", padding: 14 }} onClick={() => navigate("/signup")}>Sign Up Free</button>
              <button className="btn-dark" style={{ width: "100%", padding: 14 }} onClick={() => navigate("/login")}>Company Portal</button>
            </div>
          </div>
        )}
      </nav>

      {/* SECTION 2: Hero Section */}
      <section style={{
        background: "linear-gradient(160deg, #e6f9fe 0%, #f0fbfe 45%, #ffffff 100%)",
        padding: "80px 24px 40px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(2,188,240,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(2,188,240,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", left: "15%", width: 180, height: 180, borderRadius: "50%", background: "rgba(2,188,240,0.04)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", marginTop: "-30px" }}>
          <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(2,188,240,0.1)", border: "1px solid rgba(2,188,240,0.2)", borderRadius: 20, padding: "6px 16px", marginBottom: 28 }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} className="pulse-dot" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#029ac5", letterSpacing: 0.5 }}>12,400+ verified jobs live right now</span>
          </div>

          <h1 className="fade-up" style={{ fontSize: "clamp(36px,6vw,62px)", fontWeight: 900, color: "#0c1a2e", letterSpacing: -2, lineHeight: 1.06, marginBottom: 20, animationDelay: '0.1s' }}>
            Find work that<br />
            <span style={{ color: "#02bcf0", position: "relative" }}>
              actually fits you.
              <svg style={{ position: "absolute", bottom: -6, left: 0, width: "100%", height: 8, overflow: "visible" }} viewBox="0 0 300 8" preserveAspectRatio="none">
                <path d="M0 6 Q75 0 150 5 Q225 10 300 4" stroke="#b3eefb" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="fade-up" style={{ fontSize: 18, color: "#64748b", maxWidth: 520, margin: "0 auto 44px", lineHeight: 1.7, fontWeight: 400, animationDelay: '0.2s' }}>
            Browse thousands of verified jobs and internships. Upload your resume, track your applications, and land your next role — all in one place.
          </p>

          <form className="fade-up" onSubmit={handleSearch} style={{
            background: "#fff", border: "1px solid rgba(2,188,240,0.25)",
            borderRadius: 18, padding: 8, display: "flex", alignItems: "stretch",
            maxWidth: 720, margin: "0 auto 24px", animationDelay: '0.3s',
            boxShadow: "0 8px 40px rgba(2,188,240,0.14), 0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <div className="search-bar-inner" style={{ display: "flex", flex: 1, alignItems: "stretch" }}>
              <div style={{ flex: 2.5, padding: "10px 18px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 3 }}>Skills / Role</div>
                <input
                  className="search-input"
                  placeholder="e.g. Data Scientist, React Developer..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontWeight: 600, fontSize: 14 }}
                />
              </div>

              <div className="search-divider" style={{ width: 1, background: "#f3f4f6", margin: "8px 0" }} />
              <div style={{ flex: 1.2, padding: "10px 18px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 3 }}>Experience</div>
                <select 
                  className="search-input" 
                  value={experience} 
                  onChange={e => setExperience(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontWeight: 600, fontSize: 14, background: 'transparent' }}
                >
                  <option value="">Any level</option>
                  <option>Fresher (0–1 yr)</option>
                  <option>Junior (1–3 yrs)</option>
                  <option>Mid (3–6 yrs)</option>
                  <option>Senior (6+ yrs)</option>
                </select>
              </div>

              <div className="search-divider" style={{ width: 1, background: "#f3f4f6", margin: "8px 0" }} />
              <div style={{ flex: 1.5, padding: "10px 18px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 3 }}>Location</div>
                <input
                  className="search-input"
                  placeholder="City or Remote"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontWeight: 600, fontSize: 14 }}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ borderRadius: 12, padding: "12px 28px", fontSize: 15, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <Search size={16} /> Search
            </button>
          </form>

          <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap", animationDelay: '0.4s' }}>
            {["Free for job seekers", "Resume analysis included", "No spam, ever"].map(t => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
                <CheckCircle size={14} style={{ color: "#02bcf0" }} /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Features - Job Seekers */}
      <section id="jobseekers" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }} className="fade-up">
            <div style={{ display: "inline-flex", background: "#e6f9fe", borderRadius: 20, padding: "5px 14px", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#029ac5", textTransform: "uppercase", letterSpacing: 1 }}>Job Seeker Suite</span>
            </div>
            <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, color: "#0c1a2e", letterSpacing: -1, marginBottom: 14 }}>
              Built for serious job seekers
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
              Every tool you need to go from browsing to hired — in one focused platform.
            </p>
          </div>

          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card fade-up" style={{ animationDelay: `${0.1 * i}s` }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: 18 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0c1a2e", marginBottom: 10, lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* com: SECTION 4: Recruitment - For Companies */}
      <section id="companies" style={{ padding: "100px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", lgDirection: "row", alignItems: "center", gap: 64 }}>
             <div className="flex-1 fade-up" style={{ textAlign: 'left' }}>
                <div style={{ display: "inline-flex", background: "#0c1a2e", borderRadius: 20, padding: "5px 14px", marginBottom: 16 }}>
                   <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: 1 }}>Recruitment Portal</span>
                </div>
                <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, color: "#0c1a2e", letterSpacing: -1.5, marginBottom: 20, lineHeight: 1.1 }}>
                  Hire the <span className="text-primary-500">best talent</span><br /> faster than ever.
                </h2>
                <p style={{ fontSize: 18, color: "#64748b", maxWidth: 540, lineHeight: 1.7, marginBottom: 32 }}>
                  Stop sorting through thousands of irrelevant resumes. CareerSync connects you with the right candidates using intelligent matching and verified profiles.
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 40 }}>
                   <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ color: '#02bcf0' }}><CheckCircle size={20} /></div>
                      <div>
                         <p style={{ margin: 0, fontWeight: 800, color: '#0c1a2e', fontSize: 14 }}>Unlimited Postings</p>
                         <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>Post as many roles as you need.</p>
                      </div>
                   </div>
                   <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ color: '#02bcf0' }}><CheckCircle size={20} /></div>
                      <div>
                         <p style={{ margin: 0, fontWeight: 800, color: '#0c1a2e', fontSize: 14 }}>Talent Analytics</p>
                         <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>Track your recruitment funnel.</p>
                      </div>
                   </div>
                   <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ color: '#02bcf0' }}><CheckCircle size={20} /></div>
                      <div>
                         <p style={{ margin: 0, fontWeight: 800, color: '#0c1a2e', fontSize: 14 }}>Verified Profiles</p>
                         <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>Say goodbye to ghost candidates.</p>
                      </div>
                   </div>
                   <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ color: '#02bcf0' }}><CheckCircle size={20} /></div>
                      <div>
                         <p style={{ margin: 0, fontWeight: 800, color: '#0c1a2e', fontSize: 14 }}>Easy Management</p>
                         <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>Centralized applicant dashboard.</p>
                      </div>
                   </div>
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                   <button className="btn-dark" style={{ padding: '16px 32px' }} onClick={() => navigate('/signup')}>
                      Start Hiring Now
                   </button>
                   <button className="btn-outline" style={{ border: 'none', color: '#0c1a2e', textDecoration: 'underline' }}>
                      Learn More &rarr;
                   </button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section style={{ background: "linear-gradient(135deg, #e6f9fe 0%, #f0fbfe 100%)", padding: "100px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto",marginTop:"-170px" }}>
          <div>
          <h2 className="fade-up" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, color: "#0c1a2e", letterSpacing: -1, marginBottom: 16 }}>
            Ready to find your next role?🚀
          </h2>
          </div>
          <p className="fade-up" style={{ fontSize: 17, color: "#64748b", lineHeight: 1.7, marginBottom: 36, animationDelay: '0.1s' }}>
            Join over 3 lakh professionals who found their next opportunity on CareerSync. It's free, it's fast, and it actually works.
          </p>
          <div className="fade-up" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animationDelay: '0.2s' }}>
            <button className="btn-primary" style={{ padding: "15px 36px", fontSize: 16, borderRadius: 12 }} onClick={() => navigate("/signup")}>
              Get Started Free &rarr;
            </button>
            <button className="btn-outline" style={{ padding: "14px 36px", fontSize: 16, borderRadius: 12 }} onClick={() => navigate("/login")}>
              Login to Your Account
            </button>
          </div>
          <p className="fade-up" style={{ fontSize: 13, color: "#94a3b8", marginTop: 18, animationDelay: '0.3s' }}>No credit card required · Takes 2 minutes · Free forever for job seekers</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}