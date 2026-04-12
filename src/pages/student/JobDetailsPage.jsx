import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft, MapPin, BriefcaseBusiness,
  Briefcase, Share2, CheckCircle, IndianRupee, Building
} from "lucide-react";
import PageLayout from "../../components/PageLayout";
import { getJobById } from "../../services/jobsService";


/* this page dedicately shows the deatails of the job
and provides the applly to the job button 
which takes the user to applyTojObPage */

/* salary formatter tool...
this shows the fixed format 7L – ₹14L / yr */
const formatSalary = (salary) => {
  if (!salary) return "Competitive";
  if (!salary.isVisible) return "Not disclosed";
  const { min, max, currency = "INR" } = salary;
  if (!min && !max) return "Competitive";
  const sym = currency === "INR" ? "₹" : "$";
  if (min && max) return `${sym}${(min / 100000).toFixed(0)}L – ${sym}${(max / 100000).toFixed(0)}L / yr`;
  if (min) return `${sym}${(min / 100000).toFixed(0)}L+ / yr`;
  return `Up to ${sym}${(max / 100000).toFixed(0)}L / yr`;
};

/* This function capitalizes words like 'full-time' to 'Full-time' */
const formatJobType = (type) => {
  if (!type) return "Full-time";
  return type
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
};


/* the main JobDetailsPage...*/
export default function JobDetailsPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [job, setJob] = useState(state?.job || null);
  const [loading, setLoading] = useState(!state?.job);
  const [copied, setCopied] = useState(false);

  /* initializing job data... */
  useEffect(() => {
    if (!job && id) fetchJob();
  }, [id]);

  /* job fetch functionality...
  logic: pulls specific entry details using the id from the url if not 
  passed through navigation state */
  const fetchJob = async () => {
    try {
      const response = await getJobById(id);
      setJob(response.data?.job || response.job || response);
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setLoading(false);
    }
  };

  /* redirecting user to apply page...
  logic: we are passing the job details in the state so we dont have to 
  fetch it again on the apply page */
  const handleApply = () => {
    // Redirect to application page or open modal
    navigate(`/student/apply/${job._id}`, { state: { job } });
  };

  /* sharing the forge entry... */
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this ${job.title} role at ${job.company?.name}`,
        url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* This page opens a window sized popup to show the job
  description of an indivisual job  */
  if (loading) {
    return (
      <PageLayout>
        <div className="pb-20 animate-pulse space-y-4">
          <div className="h-4 bg-neutral-100 w-24 rounded-lg" />
          <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-6 flex gap-4">
            <div className="w-14 h-14 bg-neutral-200 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-neutral-200 w-48 rounded-lg" />
              <div className="h-4 bg-neutral-100 w-72 rounded-lg" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  /* job not found display... */
  if (!job) {
    return (
      <PageLayout>
        <div className="py-20 text-center max-w-xl mx-auto">
          <div className="w-12 h-12 bg-neutral-50 border border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <BriefcaseBusiness size={24} className="text-neutral-400" />
          </div>
          <h2 className="text-[16px] font-bold text-black mb-2">Job details not found</h2>
          <p className="text-[14px] text-neutral-500 mb-8 mx-auto leading-relaxed font-medium">
            The job opportunity you are looking for has been removed or is no longer available.
          </p>
          <button
            onClick={() => navigate("/student/jobs")}
            className="text-[12px] font-bold border border-neutral-200 px-6 py-4 rounded-xl hover:bg-neutral-50 transition-colors uppercase tracking-wider"
          >
            Back to Jobs
          </button>
        </div>
      </PageLayout>
    );
  }

  const isOpen = job.status === "open";

  return (
    <PageLayout>
      {/* This page includes the data that we are showing 
      inside the job card */}
      <div className="pb-20 animate-fade-in text-left">

        {/* back navigation...
        redirects the user to the previous page in history */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-[12px] font-bold text-neutral-500 hover:text-black mb-6 transition-colors cursor-pointer bg-transparent border-none p-0 group"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Jobs
        </button>

        {/* section 1 : Hero section*/}
        <section aria-label="Page header" className="mb-8 p-0">
          <p className="cs-section-label">
            {job.company?.name || "Verified Organization"}
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="cs-page-title text-left">
                {job.title} <span className="text-[#ef4444]">Details</span>
              </h1>
              <div className="flex flex-wrap gap-2.5">
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                  isOpen ? "bg-green-50/50 border-green-100 text-green-700" : "bg-neutral-50 border-neutral-200 text-neutral-500"
                }`}>
                  <div className={`w-1 h-1 rounded-full ${isOpen ? 'bg-green-500' : 'bg-neutral-400'}`} />
                  {isOpen ? "Active" : "Closed"}
                </span>
                {job.location && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 bg-white border border-neutral-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    <MapPin size={11} className="text-neutral-400" />
                    {job.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 bg-white border border-neutral-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  <Briefcase size={11} className="text-neutral-400" />
                  {formatJobType(job.jobType)}
                </span>
              </div>
            </div>
            
            {/* section 2 : Share and Apply Directly buttons*/}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleShare}
                className="h-10 flex items-center justify-center gap-2 text-[11px] font-bold text-black border border-neutral-200 px-6 rounded-xl hover:bg-neutral-50 transition-all bg-white uppercase tracking-wider shadow-sm"
              >
                <Share2 size={13} />
                {copied ? "Copied" : "Share"}
              </button>
              <button
                onClick={handleApply}
                disabled={!isOpen}
                className="h-10 bg-black text-white px-7 rounded-xl text-[11px] font-bold hover:bg-neutral-800 transition-all disabled:opacity-40 flex items-center gap-2 uppercase tracking-wider shadow-sm"
              >
                <CheckCircle size={14} />
                Apply Directly
              </button>
            </div>
          </div>
        </section>

        {/* main grid container...
        here we display the left side description and right side role overview */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">

          {/* section 3 : Job description section */}
          <div className="space-y-6">

            {/* role Anlysis section... */}
            <section
              aria-label="About the role"
              className="bg-white border border-neutral-200 rounded-xl p-6"
            >
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-neutral-100">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-neutral-200 shadow-sm">
                  {job.company?.logo ? (
                    <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building size={20} className="text-neutral-500" />
                  )}
                </div>

              {/* job description section... */}
                <div>
                  <p className="cs-section-label !mb-0.5">
                    Directives
                  </p>
                  <h2 className="text-[14px] font-bold text-black uppercase tracking-tight">
                    Job Description
                  </h2>
                </div>
              </div>
              
              <div
                className="text-[13px] leading-relaxed text-neutral-600 prose-sm max-w-none text-left font-medium"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </section>

            {/* job requirements section... */}
            {job.requirements && (
              <section
                aria-label="Requirements"
                className="bg-white border border-neutral-200 rounded-xl p-6"
              >
                <p className="cs-section-label text-left">
                  Entry Criteria
                </p>
                <h2 className="text-[14px] font-bold text-black mb-4 uppercase tracking-tight text-left">
                  Requirements
                </h2>
                <div
                  className="text-[13px] leading-relaxed text-neutral-600 prose-sm max-w-none text-left font-medium"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </section>
            )}
          </div>

          {/* section 4: Job role Overview */}
          <aside className="space-y-6 text-left">

            {/* overview sidebar card... */}
            <section
              aria-label="Role overview"
              className="bg-white border border-neutral-200 rounded-xl p-5 sticky top-8 overflow-hidden shadow-sm"
            >
              <h3 className="cs-section-label !mb-6 border-b border-neutral-100 pb-4">
                ROLE OVERVIEW
              </h3>

              <div className="space-y-0 px-0.5">
                
                {/* salary range details... */}
                <div className="flex flex-col gap-1 pb-5 mb-5 border-b border-neutral-100">
                  <p className="cs-section-label !mb-1">Salary Range</p>
                  <p className="text-[17px] font-bold text-black leading-none flex items-center gap-1.5">
                    <IndianRupee size={15} className="text-[#ef4444]" />
                    {formatSalary(job.salary).replace("₹", "")}
                  </p>
                </div>

                {/* job schedule type... */}
                <div className="flex flex-col gap-1 pb-5 mb-5 border-b border-neutral-100">
                  <p className="cs-section-label !mb-1">Job Type</p>
                  <p className="text-[14px] font-bold text-black capitalize">
                    {job.jobType ? job.jobType.replace('-', ' ') : "Full Time"}
                  </p>
                </div>

                {/* required skills list... */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Skills Wanted</p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-neutral-50 border border-neutral-200 text-neutral-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* bottom apply shortcut button... */}
              <button
                onClick={handleApply}
                disabled={!isOpen}
                className="w-full h-11 bg-black text-white mt-8 flex items-center justify-center gap-2 text-[11px] font-bold rounded-xl hover:bg-neutral-800 transition-all disabled:opacity-40 uppercase tracking-wider shadow-sm"
              >
                Apply Directly <CheckCircle size={14} />
              </button>
            </section>

          </aside>
        </div>
      </div>
    </PageLayout>
  );
}