import { useState, useEffect } from "react";
import { 
  Briefcase, MapPin, Clock, BriefcasePlus, 
  Search, ArrowLeft, Trash2, ShieldAlert, CheckCircle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllJobsAdmin } from "../../services/adminService";
import PageLayout from "../../components/PageLayout";

export default function ManageJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  /* fetch all jobs across platform...
  logic: 1) fetch all postings from the admin service
         2) store in local state for moderation display */
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await getAllJobsAdmin();
      /* logic: accessing response.jobs directly due to api interceptor */
      setJobs(response.jobs);
    } catch (err) {
      console.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
        
        {/* navigation and title...
        returns the admin to dashboard and shows moderation controls */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#0f172a] mb-10 transition-all font-bold text-[13px] uppercase tracking-[1px] group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-2">
              Job <span style={{ color: "#ef4444" }}>Moderation.</span>
            </h1>
            <p className="text-[#64748b] font-medium text-sm">
              Review and manage all job postings submitted on the platform.
            </p>
          </div>

          <div className="relative w-full md:w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
            <input
              type="text"
              placeholder="Filter jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cs-input !pl-12 !py-3 font-bold"
            />
          </div>
        </div>

        {/* jobs management list...
        displays jobs with status indicators and company verification markers */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-40 bg-neutral-50 rounded-[28px] border border-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map(job => (
              <div 
                key={job._id} 
                className="cs-card !p-8 flex flex-col md:flex-row items-center gap-8 group hover:border-[#0f172a] transition-all"
              >
                {/* Visual Context */}
                <div className="w-16 h-16 bg-[#0f172a] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-900/10">
                  <Briefcase className="text-white" size={28} />
                </div>

                {/* Job Info */}
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <h3 className="text-xl font-black text-[#0f172a]">
                      {job.title}
                    </h3>
                    <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      job.status === 'open' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {job.status}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#64748b]">
                      <BriefcasePlus size={14} className="text-[#94a3b8]" />
                      <span>{job.company?.name}</span>
                      {job.company?.isVerified && <CheckCircle size={14} className="text-blue-500" fill="currentColor" fillOpacity={0.1} />}
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#64748b]">
                      <MapPin size={14} className="text-[#94a3b8]" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#64748b]">
                      <Clock size={14} className="text-[#94a3b8]" />
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="flex items-center gap-4 border-t border-neutral-100 md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8 h-full w-full md:w-auto justify-center">
                  <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                    <Trash2 size={20} />
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all shadow-sm">
                    <ShieldAlert size={20} />
                  </button>
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="py-20 text-center bg-neutral-50 rounded-[32px] border-2 border-dashed border-neutral-200">
                <p className="text-[#64748b] font-bold italic">No jobs found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
