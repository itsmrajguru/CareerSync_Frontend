import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle2, Globe, Rocket, Shield, Users, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-app-bg font-sans flex flex-col">
      <Navbar />

      <main className="flex-1">
        
        {/*hero section of the about page...
we matched the herosection with the existing page styles and layouts
where the header contains a mix style of midnight +r ed*/}
        <section style={{ background: "#ffffff", position: "relative", overflow: "hidden", padding: "32px 0 40px",marginTop:'-15px' }}> 
          <div className="max-w-[960px] mx-auto px-7 relative z-10 ">
            <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px]">
              <div className="flex-1">
                <p className="text-[13px] font-bold tracking-[0.5px]  text-[#475569] uppercase mb-2">
                  The Talent Infrastructure
                </p>
                <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-5">
                  One Source of <br/>
                  <span style={{ color: "#ef4444" }}>Truth.</span>
                </h1>
                <p className="text-[14px] leading-[1.6] text-[#64748b] font-medium max-w-[460px]">
                  CareerSync is a high-fidelity talent ecosystem designed to bridge the gap between ambitious candidates and world-class organizations.
                </p>
              </div>

              {/*displayed an image related to job portals taken from unsplash */}
              <div className="hidden lg:block" style={{ flexShrink: 0, width: "360px" }}>
                <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9" }}>
                  <img 
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80&auto=format&fit=crop" 
                    alt="CareerSync Infrastructure" 
                    style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*This is the how it works section... 
created a 3 grid structure with the dummy data as features of the website*/}
        <section className="py-16 max-w-[960px] mx-auto px-7">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-extrabold text-[#0f172a] tracking-tight mb-2">How it <span style={{ color: "#ef4444" }}>works.</span></h2>
            <div style={{ width: 32, height: 3, background: "#ef4444", borderRadius: 2, margin: "0 auto" }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cs-card p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#02bcf0] mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-[18px] font-bold text-[#0f172a] mb-2">Verified Profiles</h3>
              <p className="text-[14px] leading-[1.6] text-[#64748b] font-medium">
                Candidates build a single, standardized professional identity that acts as their unified resume across the platform.
              </p>
            </div>

            <div className="cs-card p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-[#ef4444] mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-[18px] font-bold text-[#0f172a] mb-2">Global Discovery</h3>
              <p className="text-[14px] leading-[1.6] text-[#64748b] font-medium">
                Our internal search engine allows companies to discover talent based on verified skills and project histories.
              </p>
            </div>

            <div className="cs-card p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                <Rocket size={24} />
              </div>
              <h3 className="text-[18px] font-bold text-[#0f172a] mb-2">Rapid Deployment</h3>
              <p className="text-[14px] leading-[1.6] text-[#64748b] font-medium">
                Streamlined application tracking ensures the journey from discovery to hire is measured in days.
              </p>
            </div>
          </div>
        </section>

        {/*added preminum fetures as 2 blocks
used the map function to display all of the blocks
by defining only once*/}
        <section className="py-16 bg-white border-y border-[#f1f5f9]">
          <div className="max-w-[960px] mx-auto px-7">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-[2rem] font-extrabold text-[#0f172a] tracking-[-1px] mb-8 leading-tight">
                  Premium features for <br/>
                  <span style={{ color: "#ef4444" }}>ambitious goals.</span>
                </h2>
                <div className="space-y-6">
                  {[
                    { icon: Zap, title: "Real-time Analytics", text: "Track your profile performance and job application status in a live dashboard." },
                    { icon: Shield, title: "Identity Security", text: "Encrypted data handling ensuring that your professional records remains private." },
                    { icon: CheckCircle2, title: "Verified Skills", text: "Badge-based skill validation to prove your expertise to potential employers." }
                  ].map((feat, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1 flex-shrink-0">
                        <feat.icon size={18} style={{ color: "#ef4444" }} />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-[#0f172a] mb-1">{feat.title}</h4>
                        <p className="text-[13.5px] text-[#64748b] font-medium leading-relaxed">{feat.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* this is the right side 3 blocks */}
              <div style={{ background: "#f8fafc", padding: "40px", borderRadius: "32px", border: "1px solid #f1f5f9", boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}>
                 <div className="flex flex-col gap-5">
                    <div style={{ background: "#fff", padding: "24px", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                       <p style={{ fontSize: "10px", fontWeight: "bold", color: "#ef4444", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Developed By</p>
                       <h3 style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a", letterSpacing: "-0.5px" }}>Mangesh S Rajguru</h3>
                       <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", marginTop: "2px" }}>Lead Architect & Founder</p>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px]">
                      <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-4">
                        <div style={{ flex: 1, background: "#0f172a", padding: "20px", borderRadius: "20px", textAlign: "center" }}>
                          <p style={{ fontSize: "22px", fontWeight: "900", color: "#fff", lineHeight: 1 }}>2026</p>
                          <p style={{ fontSize: "9px", fontWeight: "700", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>Established</p>
                        </div>
                        <div style={{ flex: 1.2, background: "#ef4444", padding: "20px", borderRadius: "20px", textAlign: "center" }}>
                          <p style={{ fontSize: "22px", fontWeight: "900", color: "#fff", lineHeight: 1 }}>Global</p>
                          <p style={{ fontSize: "9px", fontWeight: "700", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>Reach Capacity</p>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
