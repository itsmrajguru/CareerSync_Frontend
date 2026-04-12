import { useState, useEffect } from "react";
import { 
  BriefcaseBusiness, CheckCircle, XCircle, Search, 
  ArrowLeft, ExternalLink, Mail, Calendar, MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllCompanies, verifyCompany } from "../../services/adminService";
import PageLayout from "../../components/PageLayout";

export default function ManageCompaniesPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  /* fetch all registered companies...
  logic: 1) fetch list from backend 
         2) store in state to display in the list */
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await getAllCompanies();
      /* logic: accessing response.companies directly due to api interceptor */
      setCompanies(response.companies);
    } catch (err) {
      console.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  /* toggle verification logic...
  logic: 1) send the new status to the backend
         2) update the local state immediately for better UX */
  const handleVerify = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await verifyCompany(id, newStatus);
      setCompanies(companies.map(c => 
        c._id === id ? { ...c, isVerified: newStatus } : c
      ));
    } catch (err) {
      alert("Failed to update company status");
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
        
        {/* navigation and title...
        allows the admin to return to dashboard and see the total count */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#0f172a] mb-10 transition-all font-bold text-[13px] uppercase tracking-[1px] group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-2">
              Company <span style={{ color: "#ef4444" }}>Moderation.</span>
            </h1>
            <p className="text-[#64748b] font-medium text-sm">
              Review company identities and grant them posting permissions.
            </p>
          </div>

          <div className="relative w-full md:w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cs-input !pl-12 !py-3 font-bold"
            />
          </div>
        </div>

        {/* main companies list...
        shows each company as a premium card with verification controls */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-32 bg-neutral-50 rounded-[24px] border border-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredCompanies.map(company => (
              <div 
                key={company._id} 
                className={`cs-card !p-6 flex flex-col md:flex-row items-center gap-8 group transition-all duration-300 ${
                  company.isVerified ? 'border-neutral-100' : 'border-orange-200 bg-orange-50/10 shadow-lg shadow-orange-100/20'
                }`}
              >
                {/* Visual Identity */}
                <div className="w-16 h-16 bg-[#0f172a] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-900/10">
                  <BriefcaseBusiness className="text-white" size={28} />
                </div>

                {/* Primary Info */}
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <div>
                    <h3 className="text-lg font-black text-[#0f172a] flex items-center justify-center md:justify-start gap-3">
                      {company.name || "Untitled Company"}
                      {company.isVerified && (
                        <CheckCircle size={18} className="text-blue-500" fill="currentColor" fillOpacity={0.1} />
                      )}
                    </h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-1">
                      <p className="text-[12px] font-bold text-[#64748b] flex items-center gap-1.5">
                        <Mail size={12} /> {company.user?.email}
                      </p>
                      <p className="text-[12px] font-bold text-[#64748b] flex items-center gap-1.5">
                        <MapPin size={12} /> {company.location || "Location not set"}
                      </p>
                      <p className="text-[12px] font-bold text-[#64748b] flex items-center gap-1.5">
                        <Calendar size={12} /> Joined {new Date(company.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verification Toggle */}
                <div className="flex items-center gap-4 border-t border-neutral-100 md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8 h-full w-full md:w-auto justify-center">
                  {!company.isVerified ? (
                    <button
                      onClick={() => handleVerify(company._id, false)}
                      className="btn-primary !bg-blue-600 !hover:bg-blue-700 !px-8 !py-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
                    >
                      Verify Now <CheckCircle size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerify(company._id, true)}
                      className="btn-outline !text-red-500 !border-red-100 !hover:bg-red-50 !hover:border-red-200 !px-8 !py-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest"
                    >
                      Revoke Access <XCircle size={14} />
                    </button>
                  )}
                  {company.website && (
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-11 h-11 flex items-center justify-center rounded-xl bg-neutral-100 text-[#0f172a] hover:bg-black hover:text-white transition-all"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {filteredCompanies.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-[#64748b] font-bold italic">No companies matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
