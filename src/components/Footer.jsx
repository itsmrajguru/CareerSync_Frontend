export default function Footer() {
  return (
    <footer style={{ background: "#0c1a2e", padding: "48px 24px 32px", marginTop: "auto" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <img src="/logo.svg" alt="Logo" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
              <span style={{ fontSize: 18, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>Career<span style={{ color: "#02bcf0" }}>Sync</span></span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 260 }}>
              Connecting India's talent with the right opportunities. Verified jobs, smart matching, real results.
            </p>
          </div>

          {[
            { title: "Job Seekers", links: ["Browse Jobs", "Upload Resume", "Career Advice", "Salary Guide"] },
            { title: "Companies", links: ["Post a Job", "Search Candidates", "Pricing", "Enterprise"] },
            { title: "Company", links: ["About Us", "Blog", "Careers", "Contact"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14 }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(l => (
                  <span key={l} style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", cursor: "pointer", fontWeight: 500, transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "#02bcf0"}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}
                  >{l}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>© 2026 CareerSync. All rights reserved.</span>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
              <span key={l} style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", cursor: "pointer" }}
                onMouseEnter={e => e.target.style.color = "#02bcf0"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
              >{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
