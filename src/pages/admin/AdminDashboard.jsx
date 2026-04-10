import { useState, useEffect } from "react";
import { 
  Users, Building2, Briefcase, FileText, 
  TrendingUp, ShieldCheck, AlertCircle, ChevronRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAdminStats } from "../../services/adminService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    companies: 0,
    jobs: 0,
    applications: 0
  });
  const [loading, setLoading] = useState(true);

  /* fetch statistics logic...
  loads the platform-wide numbers to show on the dashboard cards */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminStats();
        /* logic: accessing response.stats directly */
        setStats(response.stats);
      } catch (err) {
        console.error("Failed to fetch admin stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Students", value: stats.students, icon: <Users size={24} />, color: "bg-blue-50 text-blue-600" },
    { label: "Total Companies", value: stats.companies, icon: <Building2 size={24} />, color: "bg-purple-50 text-purple-600" },
    { label: "Direct Jobs", value: stats.jobs, icon: <Briefcase size={24} />, color: "bg-orange-50 text-orange-600" },
    { label: "Applications", value: stats.applications, icon: <FileText size={24} />, color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-app-bg font-sans">
      <Navbar />
      
      <main className="max-w-[1140px] mx-auto px-7 py-12">
        
        {/* header section...
        explains the purpose of the admin panel to the user */}
        <div className="mb-12">
          <p className="text-[13px] font-bold tracking-[1.5px] text-[#475569] uppercase mb-2">
            Administrator Office
          </p>
          <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-4">
            Platform <span style={{ color: "#ef4444" }}>Control Center.</span>
          </h1>
          <p className="text-[14px] leading-[1.6] text-[#64748b] font-medium max-w-[500px]">
            Manage users, moderate content, and monitor the overall health of the CareerSync ecosystem.
          </p>
        </div>

        {/* statistics grid...
        shows the four main platform KPIs in a card layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, i) => (
            <div key={i} className="cs-card !p-8 border-neutral-100 flex items-center gap-6 group hover:border-[#0f172a] transition-all">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.color} transition-transform group-hover:scale-110`}>
                {card.icon}
              </div>
              <div>
                <p className="text-[11px] font-black text-[#94a3b8] uppercase tracking-wider mb-1">
                  {card.label}
                </p>
                <p className="text-2xl font-black text-[#0f172a]">
                  {loading ? "..." : card.value.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* quick actions section...
        provides direct links to management pages for companies and jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="cs-card !p-10 border-neutral-100 flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <Building2 size={120} />
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-black text-[#0f172a] mb-4 uppercase tracking-tighter">
                Company Moderation
              </h2>
              <p className="text-[#64748b] font-medium text-sm leading-relaxed mb-8 max-w-[320px]">
                Review and verify new company registrations. Only verified companies can post jobs on the platform.
              </p>
            </div>
            <Link to="/admin/companies" className="btn-primary !px-8 !py-4 self-start flex items-center gap-2 group/btn">
              Manage Companies <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="cs-card !p-10 border-neutral-100 flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <Briefcase size={120} />
            </div>
            <div>
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-2xl font-black text-[#0f172a] mb-4 uppercase tracking-tighter">
                Job Moderation
              </h2>
              <p className="text-[#64748b] font-medium text-sm leading-relaxed mb-8 max-w-[320px]">
                Monitor all job postings. Ensure content follows platform guidelines and remove inappropriate listings.
              </p>
            </div>
            <Link to="/admin/jobs" className="btn-primary !px-8 !py-4 self-start flex items-center gap-2 group/btn">
              Manage Jobs <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

        {/* productivity tip section...
        a subtle footer-like card for admin experience */}
        <div className="mt-12 p-8 bg-neutral-900 rounded-[28px] text-white flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-[#ef4444]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Live Insights</span>
            </div>
            <h3 className="text-lg font-black tracking-tight mb-2">Platform activity is up 24% this week.</h3>
            <p className="text-sm text-[#94a3b8] font-medium max-w-[400px]">We've seen a surge in student registrations from design fields. Consider inviting more creative agencies.</p>
          </div>
          <div className="hidden md:block opacity-20">
            <SparkleIcon />
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 0L54 46L100 50L54 54L50 100L46 54L0 50L46 46L50 0Z" fill="white"/>
    </svg>
  );
}
