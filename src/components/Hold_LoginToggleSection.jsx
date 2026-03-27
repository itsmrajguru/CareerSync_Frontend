
// const STATS = [
//   { value: "12,400+", label: "Active Jobs" },
//   { value: "3.2L+", label: "Candidates Placed" },
//   { value: "4,800+", label: "Hiring Companies" },
//   { value: "94%", label: "Satisfaction Rate" },
// ];




{/* <section style={{ background: "linear-gradient(135deg, #0c1a2e 0%, #013a52 60%, #014d65 100%)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 64 }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-card">
                <div style={{ fontSize: 40, fontWeight: 900, color: "#02bcf0", letterSpacing: -1.5, lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}




{/* <section style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(28px,4vw,38px)", fontWeight: 900, color: "#0c1a2e", letterSpacing: -1, marginBottom: 14 }}>
              Choose your path
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7 }}>
              CareerSync works for both candidates and employers — get started below.
            </p>
          </div>

          <div style={{ background: "#0c1a2e", borderRadius: 24, overflow: "hidden" }}>
            <div style={{ display: "flex", padding: "24px 28px 0", gap: 6 }}>
              {["candidate", "employer"].map(tab => (
                <button key={tab} className={`tab-btn ${activeTab === tab ? "active" : "inactive"}`} onClick={() => setActiveTab(tab)} style={{ textTransform: "capitalize" }}>
                  {tab === "candidate" ? "🎓 I'm a Job Seeker" : "🏢 I'm an Employer"}
                </button>
              ))}
            </div>

            {activeTab === "candidate" ? (
              <div style={{ padding: "36px 36px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 28 }}>
                <div>
                  <h3 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 12, letterSpacing: -0.5 }}>
                    Land your dream job faster.
                  </h3>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 400, marginBottom: 24 }}>
                    Create your free profile, upload your resume, and get matched with roles that actually fit your skills and goals.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                    {["Free resume analysis & score", "AI-powered job matching", "Track all your applications", "Email alerts for new matches"].map(item => (
                      <span key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
                        <CheckCircle size={16} style={{ color: "#02bcf0", flexShrink: 0 }} /> {item}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button className="btn-primary" style={{ padding: "13px 28px", fontSize: 15 }} onClick={() => navigate("/signup")}>
                      Create Free Account →
                    </button>
                    <button className="btn-ghost-white" onClick={() => navigate("/login")}>
                      Already have an account? Login
                    </button>
                  </div>
                </div>
                <div className="floating" style={{ background: "rgba(2,188,240,0.08)", border: "1px solid rgba(2,188,240,0.15)", borderRadius: 18, padding: "24px 28px", minWidth: 220 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(2,188,240,0.7)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 16 }}>Your Dashboard Preview</div>
                  {[{ label: "Jobs matched", value: "247", color: "#02bcf0" }, { label: "Resume score", value: "74%", color: "#10b981" }, { label: "Applications", value: "3", color: "#f59e0b" }].map(m => (
                    <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{m.label}</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color: m.color }}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ padding: "36px 36px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 28 }}>
                <div>
                  <h3 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 12, letterSpacing: -0.5 }}>
                    Find your next great hire.
                  </h3>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 400, marginBottom: 24 }}>
                    Post jobs, search a growing pool of verified candidates, and use AI screening to shortlist the best fits — faster than ever.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                    {["Post unlimited jobs", "AI-powered candidate screening", "Access 3.2L+ candidate profiles", "Real-time application tracking"].map(item => (
                      <span key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
                        <CheckCircle size={16} style={{ color: "#02bcf0", flexShrink: 0 }} /> {item}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button className="btn-primary" style={{ padding: "13px 28px", fontSize: 15 }} onClick={() => navigate("/employer-signup")}>
                      Register as Employer →
                    </button>
                    <button className="btn-ghost-white" onClick={() => navigate("/employer-login")}>
                      Employer Login
                    </button>
                  </div>
                </div>
                <div className="floating" style={{ background: "rgba(2,188,240,0.08)", border: "1px solid rgba(2,188,240,0.15)", borderRadius: 18, padding: "24px 28px", minWidth: 220 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(2,188,240,0.7)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 16 }}>Platform Stats</div>
                  {[{ label: "Active candidates", value: "3.2L+", color: "#02bcf0" }, { label: "Avg. time to hire", value: "11 days", color: "#10b981" }, { label: "Hiring companies", value: "4,800+", color: "#f59e0b" }].map(m => (
                    <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{m.label}</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color: m.color }}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section> */}