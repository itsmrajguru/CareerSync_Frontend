import PageLayout from "../components/PageLayout";
import { CheckCircle2, Globe, Rocket, Shield, Users, Zap, Award, Globe2 } from "lucide-react";

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="pb-10 animate-fade-in">
        
        {/*hero section of the about page...
        we matched the herosection with the existing page styles and layouts
        where the header contains a mix style of midnight + red */}
        <section aria-label="Page header" className="mb-8 pt-4 p-0">
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px]">
            <div className="flex-1">
              <div className="mb-7 text-left">
                <p className="cs-section-label">
                  The Talent Infrastructure
                </p>
                <h1 className="cs-page-title">
                  One Source of <span className="text-[#ef4444]">Truth.</span>
                </h1>
                <p className="cs-subtext max-w-[460px]">
                  CareerSync is a high-fidelity talent ecosystem designed to bridge the gap between ambitious candidates and world-class organizations through verified data.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>
                <span className="flex items-center gap-1">✔ Talent Discovery</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span className="flex items-center gap-1">✔ Verified Credentials</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span className="flex items-center gap-1">✔ Rapid Deployment</span>
              </div>
            </div>

            {/* Platform Standard Imagery Grid
            displayed an image related to job portals taken from unsplash */}
            <div className="hidden lg:block animate-fade-in" style={{ flexShrink: 0, width: "360px" }}>
              <div className="rounded-xl overflow-hidden border border-neutral-200 grid grid-cols-2 shadow-sm">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80&auto=format&fit=crop" alt="1" style={{ width: "100%", height: "90px", objectFit: "cover", borderRight: "1px solid #fff", borderBottom: "1px solid #fff" }} />
                <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&q=80&auto=format&fit=crop" alt="2" style={{ width: "100%", height: "90px", objectFit: "cover", borderBottom: "1px solid #fff" }} />
                <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&q=80&auto=format&fit=crop" alt="3" style={{ width: "100%", height: "90px", objectFit: "cover", borderRight: "1px solid #fff" }} />
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&q=80&auto=format&fit=crop" alt="4" style={{ width: "100%", height: "90px", objectFit: "cover" }} />
              </div>
            </div>
          </div>
        </section>

        {/* main content grid following the StudentProfilePage 3-column cell structure exactly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* This is the how it works section... 
          created a grid structure with the dummy data as features of the website */}
          <div className="cs-card-modern p-6 lg:col-span-2 flex flex-col uppercase">
            <p className="cs-section-label">Operational Logic</p>
            <h2 className="cs-page-title mb-8">How it <span className="text-[#ef4444]">works.</span></h2>
            
            <div className="space-y-8 mt-2">
              {[
                { 
                  icon: Users, 
                  title: "Verified Identity", 
                  text: "Candidates build a single, standardized professional identity that acts as their unified source of truth across the entire platform."
                },
                { 
                  icon: Globe, 
                  title: "Discovery Forge", 
                  text: "Our internal search forge allows companies to discover top-tier talent based on verified skill sets and project deliverables."
                },
                { 
                  icon: Rocket, 
                  title: "Rapid Pipeline", 
                  text: "Streamlined tracking ensures the journey from discovery to hire is measured in days, not months, maximizing efficiency."
                }
              ].map((step, i) => (
                <div key={i} className="flex gap-5 group">
                   <div className="w-11 h-11 bg-neutral-50 border border-neutral-100 rounded-xl flex items-center justify-center text-[#ef4444] shrink-0 group-hover:bg-white transition-colors">
                     <step.icon size={20} />
                   </div>
                   <div>
                      <h3 className="text-[14px] font-bold text-black mb-1">{step.title}</h3>
                      <p className="text-[12px] text-neutral-500 leading-relaxed max-w-[420px] font-medium lowercase">
                        {step.text}
                      </p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* added premium features as a block
          used the map function to display all of the blocks by defining only once */}
          <div className="cs-card-modern p-6 flex flex-col">
            <p className="cs-section-label">Feature Suite</p>
            <h2 className="cs-page-title mb-8">Premium <span className="text-[#ef4444]">tools.</span></h2>
            
            <div className="space-y-6">
              {[
                { icon: Zap, title: "Live Analytics", text: "Track your real-time performance." },
                { icon: Shield, title: "Vault Security", text: "Encrypted data handling standard." },
                { icon: CheckCircle2, title: "Skill Badge", text: "Expertise validation system." }
              ].map((feat, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                    <feat.icon size={14} className="text-[#ef4444]" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#0f172a] mb-0.5">{feat.title}</h4>
                    <p className="text-[11px] text-neutral-400 font-medium leading-tight">{feat.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-neutral-100 italic">
               <p className="text-[11px] text-neutral-400 text-center">
                 "Advanced infrastructure for modern talent ecosystems."
               </p>
            </div>
          </div>

          {/* this is the strategic vision block which shows the long-term goals */}
          <div className="cs-card-modern p-6 lg:col-span-2 flex items-center justify-between gap-10">
             <div className="flex-1">
                <p className="cs-section-label">Strategic Vision</p>
                <div className="text-[15px] font-medium text-neutral-600 leading-relaxed italic">
                  "Envisioning a future where talent discovery is seamless, verified, and fundamentally fair for every ambitious professional."
                </div>
             </div>
             <div className="hidden sm:flex shrink-0 w-16 h-16 bg-neutral-50 border border-neutral-100 rounded-full items-center justify-center text-[#ef4444]">
                <Globe2 size={24} />
             </div>
          </div>

          {/* this is the right side architect block...
          developed by and displayed the founder details here */}
          <div className="rounded-2xl p-6 flex flex-col justify-between text-white shadow-xl relative overflow-hidden" 
               style={{ background: "#0f172a" }}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-600/30 rounded-full blur-3xl -mr-10 -mt-10" />
            
            <div className="relative z-10">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Architect</p>
              <h3 className="text-[18px] font-black tracking-tight mb-4 uppercase">Mangesh S Rajguru</h3>
              
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
                  <p className="text-[14px] font-black underline">2026</p>
                  <p className="text-[8px] font-bold text-white/30 tracking-widest uppercase">Established</p>
                </div>
                <div className="bg-[#ef4444] p-3 rounded-xl text-center shadow-lg shadow-red-900/40">
                  <p className="text-[14px] font-black uppercase">Global</p>
                  <p className="text-[8px] font-bold text-white/40 tracking-widest uppercase">Reach capacity</p>
                </div>
              </div>
            </div>

            {/* footer of the architect block... */}
            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
               <span className="text-[11px] font-bold text-white/40 uppercase">Lead Architect & Founder</span>
               <Award size={14} className="text-red-500" />
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
