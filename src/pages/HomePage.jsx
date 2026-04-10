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
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", alignItems: "center" }}
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
        background: "linear-gradient(160deg, #e6f9fe 0%, var(--color-app-bg) 45%, #ffffff 100%)",
        padding: "40px 24px 40px",
        position: "relative", overflow: "hidden",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
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

          {/* the form is not workign yet...
but shows the options for diffrent query seraches for the whole job serach platform */}
          <form className="fade-up" onSubmit={handleSearch} style={{
            maxWidth: 720, margin: "0 auto 24px", animationDelay: '0.3s',
          }}>
            <div className="cs-card !p-2 flex items-stretch" style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.06)" }}>
              <div className="search-bar-inner" style={{ display: "flex", flex: 1, alignItems: "stretch" }}>
                <div style={{ flex: 2.5, padding: "8px 16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>Skills / Role</div>
                  {/* serach on the basis of direct input */}
                  <input
                    className="cs-input !border-none !p-0"
                    placeholder="e.g. Data Scientist..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    style={{ fontWeight: 600, fontSize: 13.5 }}
                  />
                </div>

                {/* search on the basis of experinece */}
                <div className="search-divider" style={{ width: 1, background: "#f3f4f6", margin: "8px 0" }} />
                <div style={{ flex: 1.2, padding: "8px 16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>Experience</div>
                  <select
                    className="cs-input !border-none !p-0 !bg-transparent"
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    style={{ fontWeight: 600, fontSize: 13.5 }}
                  >
                    <option value="">Any level</option>
                    <option>Fresher</option>
                    <option>Junior</option>
                    <option>Mid</option>
                    <option>Senior</option>
                  </select>
                </div>

                {/* seracah on the basis of location */}
                <div className="search-divider" style={{ width: 1, background: "#f3f4f6", margin: "8px 0" }} />
                <div style={{ flex: 1.5, padding: "8px 16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>Location</div>
                  <input
                    className="cs-input !border-none !p-0"
                    placeholder="City or Remote"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    style={{ fontWeight: 600, fontSize: 13.5 }}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ borderRadius: 10, padding: "10px 24px", fontSize: 14, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <Search size={14} /> Search
              </button>
            </div>
          </form>

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
      <section id="jobseekers" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }} className="fade-up">
            <div style={{ display: "inline-flex", background: "#e6f9fe", borderRadius: 20, padding: "5px 14px", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0d1117", textTransform: "uppercase", letterSpacing: 1 }}>Job Seeker Suite</span>
            </div>
            <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, color: "#0d1117", letterSpacing: -1, marginBottom: 14 }}>
              Built for serious job seekers
            </h2>
            <p style={{ fontSize: 16, color: "#0d1117", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
              Every tool you need to go from browsing to hired — in one focused platform.
            </p>
          </div>

          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="cs-card fade-up" style={{ animationDelay: `${0.1 * i}s` }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: 18 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0d1117", marginBottom: 10, lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: "#0d1117", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Recruitment - For Companies */}
      <section id="companies" style={{ padding: "100px 0", background: "#ffffff", borderBottom: "2px solid #f1f5f9" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 80, flexWrap: "wrap" }}>

            <div className="flex-1 fade-up" style={{ minWidth: 320 }}>
              <div style={{ display: "inline-flex", background: "rgba(12,26,46,0.05)", borderRadius: 20, padding: "5px 14px", marginBottom: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#0c1a2e", textTransform: "uppercase", letterSpacing: 1 }}>Recruitment Suite</span>
              </div>

              <h2 style={{ fontSize: "clamp(32px, 5vw, 42px)", fontWeight: 900, color: "#0f172a", letterSpacing: -2, marginBottom: 24, lineHeight: 1.1 }}>
                Hire the <span style={{ color: "#ef4444" }}>best talent</span><br /> faster than ever.
              </h2>

              <p style={{ fontSize: 16, color: "#64748b", maxWidth: 540, lineHeight: 1.6, marginBottom: 40, fontWeight: 500 }}>
                Stop sorting through thousands of irrelevant resumes. CareerSync connects you with the right candidates using intelligent matching and verified professional identities.
              </p>
              {/* this holds the dummy data to show for the
 reqruitment features section */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32, marginBottom: 48 }}>
                {[
                  { title: "Unlimited Postings", desc: "Post as many roles as you need." },
                  { title: "Talent Analytics", desc: "Track your recruitment funnel." },
                  { title: "Verified Profiles", desc: "Eliminate ghost candidates." },
                  { title: "Easy Management", desc: "Centralized hiring dashboard." }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14 }}>
                    <div style={{ color: "#ef4444", marginTop: 2 }}><CheckCircle size={18} /></div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 800, color: "#0f172a", fontSize: 14 }}>{item.title}</p>
                      <p style={{ margin: 0, color: "#64748b", fontSize: 12, fontWeight: 500, marginTop: 2 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: "center" }}>
                <button className="btn-primary" style={{ padding: '16px 36px', borderRadius: 12 }} onClick={() => navigate('/signup')}>
                  Start Hiring Now
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="text-[#0f172a] font-bold text-sm hover:underline flex items-center gap-2"
                >
                  Learn More <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Right Side Visual Block */}
            <div className="flex-1 fade-up" style={{ minWidth: 320, animationDelay: "0.2s" }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  background: "#f8fafc",
                  borderRadius: "40px",
                  padding: "40px",
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.03)",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  {/* Background Image Accent...
added an imahge to match the website existing styles*/}
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80&auto=format&fit=crop"
                    alt="Hiring"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.1, pointerEvents: "none" }}
                  />

                  <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "relative" }}>
                    <div className="bg-white p-6 rounded-3xl border border-[#f1f5f9] shadow-sm">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontSize: 10, fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Candidate Match</span>
                        <span style={{ fontSize: 11, fontWeight: 900, color: "#ef4444" }}>High Potential</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#0c1a2e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900 }}>JD</div>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>Senior Product Designer</p>
                          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>98% Skill Alignment</p>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div className="bg-[#0c1a2e] text-white p-5 rounded-3xl">
                        <p style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>4x</p>
                        <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>Faster Hiring</p>
                      </div>
                      <div className="bg-white border border-[#f1f5f9] p-5 rounded-3xl">
                        <p style={{ fontSize: 24, fontWeight: 900, color: "#ef4444", margin: 0 }}>82%</p>
                        <p style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>Cost Reduction</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 5: About & Developer (Newly addedd)...
this adds the info about the developer (thats me...) */}
      <section id="about" style={{ padding: "100px 24px", background: "#fff", borderTop: "1px solid #f1f5f9" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 64, alignItems: "center" }}>

            {/* Left: Features */}
            <div className="fade-up">
              <h2 style={{ fontSize: "clamp(28px,4vw,36px)", fontWeight: 900, color: "#0d1117", letterSpacing: -1.5, marginBottom: 40, lineHeight: 1.1 }}>
                Premium features for<br />
                <span style={{ color: "#ef4444" }}>ambitious goals.</span>
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {[
                  { icon: <Zap size={20} />, title: "Real-time Analytics", desc: "Track your profile performance and job application status in a live dashboard." },
                  { icon: <Shield size={20} />, title: "Identity Security", desc: "Encrypted data handling ensuring that your professional records remains private." },
                  { icon: <CheckCircle size={20} />, title: "Verified Skills", desc: "Badge-based skill validation to prove your expertise to potential employers." }
                ].map((feat, i) => (
                  <div key={i} style={{ display: "flex", gap: 16 }}>
                    <div style={{ flexShrink: 0, marginTop: 4, color: "#ef4444" }}>{feat.icon}</div>
                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 800, color: "#0d1117", marginBottom: 4 }}>{feat.title}</h4>
                      <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.6, fontWeight: 500 }}>{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Developer Profile Card */}
            <div className="fade-up" style={{ animationDelay: "0.2s" }}>
              <div style={{
                background: "#f8fafc",
                padding: "40px",
                borderRadius: "40px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 20px 50px rgba(0,0,0,0.05)"
              }}>
                <div style={{ background: "#fff", padding: "24px", borderRadius: "24px", border: "1px solid #f1f5f9", marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                  <p style={{ fontSize: 11, fontWeight: 900, color: "#ef4444", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Developed By</p>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: "#0d1117", letterSpacing: -1 }}>Mangesh S Rajguru</h3>
                  <p style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginTop: 4 }}>Lead Architect & Founder</p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0c1a2e", padding: "24px", borderRadius: "24px", color: "#fff" }}>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 900 }}>2026</div>
                    <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.4, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 4 }}>Established</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 24, fontWeight: 900 }}>Global</div>
                    <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.4, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 4 }}>Reach Capacity</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Sectiion  6: CTA (Moved down) */}
      <section style={{ background: "linear-gradient(135deg, #e6f9fe 0%, var(--color-app-bg) 100%)", padding: "100px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", marginTop: "-170px" }}>
          <div>
            <h2 className="fade-up" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, color: "#0d1117", letterSpacing: -1, marginBottom: 16 }}>
              Ready to find your next role?🚀
            </h2>
          </div>
          <p className="fade-up" style={{ fontSize: 17, color: "#0d1117", lineHeight: 1.7, marginBottom: 36, animationDelay: '0.1s' }}>
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
          <p className="fade-up" style={{ fontSize: 13, color: "#0d1117", marginTop: 18, animationDelay: '0.3s' }}>No credit card required · Takes 2 minutes · Free forever for job seekers</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

