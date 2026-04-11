import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase, MapPin, Clock, ExternalLink, 
  Search, Filter, ChevronRight, Building2 
} from "lucide-react";
import PageLayout from "../../components/PageLayout";
import { getApplications } from "../../services/applicationService";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  /* fetch applications functionality...
  logic: 1) call the getApplications service to fetch all apps for the logged-in student
         2) store the data in our local state to display it on the page */
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await getApplications();
      /* logic: accessing response.applications directly */
      setApplications(response.applications || []);
    } catch (err) {
      setError("Failed to load your applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* filtering applications...
  if a specific status filter is selected, we only show those applications
  and this filter is added through the array of tabs  */
  const filteredApplications = applications.filter(app => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  /* status badge style helper...
  this function returns specific css classes based on the status of the application */
  const getStatusStyle = (status) => {
    switch (status) {
      case "applied": return "bg-blue-50 text-blue-600 border-blue-100";
      case "shortlisted": return "bg-yellow-50 text-yellow-600 border-yellow-100";
      case "hired": return "bg-green-50 text-green-600 border-green-100";
      case "rejected": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
        
        {/* herosection...*/}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[13px] font-bold tracking-[1.5px] text-[#475569] uppercase mb-2">
              Career Pipeline
            </p>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-4">
              Track your <span className="text-[#ef4444]">progress.</span>
            </h1>
            <p className="text-[14px] leading-[1.6] text-[#64748b] font-medium max-w-[500px]">
              Monitor the status of your applications and prepare for your next career move.
            </p>
          </div>

          {/* users current status about applied job tabs...
this section shows the diffrent tabs to show the user result accordingly*/}
          <div className="flex bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200 shadow-inner overflow-x-auto max-w-full no-scrollbar">
            {["all", "applied", "shortlisted", "hired", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                  filter === s 
                    ? "bg-white text-[#ef4444] shadow-sm" 
                    : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* main list section...
        here we display the filtered list of applications one by one */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-32 bg-neutral-50 rounded-[28px] border border-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-10 text-center bg-red-50 rounded-[28px] border border-red-100">
            <p className="text-red-600 font-bold mb-4">{error}</p>
            <button onClick={fetchApplications} className="btn-primary px-8 py-3">Try Again</button>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="cs-card p-20 text-center border-neutral-100">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#94a3b8]">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#0f172a] mb-2">No applications found</h3>
            <p className="text-[#64748b] mb-8 max-w-xs mx-auto">
              {/* this is a toggle conditon that checks if no
any job is applied by the user , diplay the error message otherwise for
single filte,the result is showm exactly */}
              {filter === "all" 
                ? "You haven't applied to any jobs yet. Start your journey today!" 
                : `You don't have any applications with status "${filter}".`}
            </p>
            <Link to="/student/jobs" className="btn-primary inline-flex items-center gap-2 px-10 py-4">
              Browse Jobs <ExternalLink size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {filteredApplications.map((app) => (
              <div 
                key={app._id} 
                className="cs-card flex flex-col md:flex-row items-center gap-6 !p-6 border-neutral-200 hover:border-black transition-all group"
              >
                {/* company logo icon...*/}
                <div className="w-16 h-16 bg-[#0f172a] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-900/10 overflow-hidden">
                  {app.company?.logo ? (
                    <img src={app.company.logo} alt={app.company.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="text-white" size={24} />
                  )}
                </div>

                {/* the horizontal job details card...
shows the job title, status badge, company name and application date */}
                <div className="flex-1 min-w-0 text-center md:text-left">
                <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px]">
                    <h3 className="text-[18px] font-black text-[#0f172a] truncate">
                      {app.job?.title}
                    </h3>
                    <div className={`inline-flex self-center md:self-auto px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-1">
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#64748b]">
                      <Building2 size={14} className="text-[#94a3b8]" />
                      <span>{app.company?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#64748b]">
                      <MapPin size={14} className="text-[#94a3b8]" />
                      <span>{app.job?.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#64748b]">
                      <Clock size={14} className="text-[#94a3b8]" />
                      <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* view job button...*/}
                <div className="flex items-center gap-4">
                  <Link 
                    to={`/student/jobs/${app.job?._id}`}
                    className="btn-outline !py-3 !px-6 !text-[11px] font-black uppercase tracking-widest hover:bg-neutral-50"
                  >
                    View Job
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
