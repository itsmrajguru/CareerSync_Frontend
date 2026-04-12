//Har Har Mahadev

import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { SearchX, ArrowLeft, Home } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 animate-fade-in">
        
        {/* main container of the 404 page...
        designed this block to match the clean and modern card aesthetics 
        of the careersync platform */}
        <div className="cs-card-modern max-w-lg w-full text-center p-12 shadow-2xl relative overflow-hidden">
          
          {/* background glow effect to maintain the premium feel */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-slate-500/5 rounded-full blur-3xl -ml-16 -mb-16" />

          <div className="relative z-10 flex flex-col items-center">
            {/* icon representing the error state...
            used the searchX icon from lucide react icons set */}
            <div className="w-20 h-20 bg-neutral-50 border border-neutral-100 rounded-2xl flex items-center justify-center text-[#ef4444] mb-8 floating">
              <SearchX size={40} />
            </div>

            <p className="cs-section-label">Error 404</p>
            <h1 className="cs-page-title text-[32px] md:text-[40px] mb-4">
              Lost in <span className="text-[#ef4444]">Space?</span>
            </h1>
            
            <p className="cs-subtext mb-10 max-w-[320px] mx-auto lowercase">
              the page you are looking for does not exist or has been moved to a different coordinate.
            </p>

            {/* navigation buttons for the user...
            added two options for better user experience to go back or home */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button 
                onClick={() => navigate(-1)}
                className="btn-outline"
              >
                <ArrowLeft size={16} />
                Go Back
              </button>
              
              <button 
                onClick={() => navigate("/")}
                className="btn-primary"
              >
                <Home size={16} />
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* small strategic footer as seen in other pages... */}
        <div className="mt-12">
          <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest italic">
            "CareerSync — The talent infrastructure."
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
