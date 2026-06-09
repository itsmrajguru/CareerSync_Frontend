import { useNavigate } from "react-router-dom";
import { Wrench, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function UnderConstructionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-app-bg font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
          <Wrench size={48} className="text-primary-500 animate-pulse" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] tracking-tight mb-4">
          Under Construction
        </h1>
        
        <p className="text-[#64748b] text-base md:text-lg max-w-md mx-auto mb-8 font-medium leading-relaxed">
          We are currently working hard to bring this feature to life. Check back soon for exciting updates!
        </p>
        
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 px-8 py-3 bg-[#0f172a] text-white font-bold rounded-xl hover:bg-black transition-all hover:-translate-y-0.5 shadow-lg shadow-black/10"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </main>

      <Footer />
    </div>
  );
}
