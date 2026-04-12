import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, Send, BriefcasePlus, MapPin, 
  Briefcase, CheckCircle, AlertCircle 
} from "lucide-react";
import PageLayout from "../../components/PageLayout";
import { applyToJob } from "../../services/applicationService";
import { getJobById } from "../../services/jobsService";

export default function ApplyPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [job, setJob] = useState(state?.job || null);
  const [loading, setLoading] = useState(!state?.job);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    resumeUrl: "",
    coverNote: ""
  });

  /* fetch job details functionality...
  if the job data is not passed through navigation state, we fetch it 
  directly from the database using the jobId from the url */
  useEffect(() => {
    if (!job && id) {
      fetchJob();
    }
  }, [id]);

  /*job fetch functionlality...
  here we will pass the jobId to the axios funcction which will
  return the job and set the job in the job state
  and then we will display the job detials in a sidebar*/
  const fetchJob = async () => {
    try {
      const response = await getJobById(id);
      /* logic: accessing response.job directly due to api interceptor */
      setJob(response.job);
    } catch (err) {
      setError("Failed to load job details.");
    } finally {
      setLoading(false);
    }
  };

  /* apply to job functionality...
  logic: 1) check if resume link is provided
         2) send the resumeUrl and coverNote to the backend
         3) show success message and redirect to dashboard */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resumeUrl) {
      setError("Please provide a link to your resume.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await applyToJob(id, formData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/student/dashboard");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  /* loading state display... */
  if (loading) {
    return (
      <PageLayout>
        <div className="pb-10 animate-pulse space-y-4">
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

  /* error state display... */
  if (!job) {
    return (
      <PageLayout>
        <div className="max-w-xl mx-auto py-20 text-center">
          <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={20} className="text-red-500" />
          </div>
          <h2 className="text-[16px] font-bold text-black mb-1">Job not found</h2>
          <p className="text-[13px] text-neutral-500 mb-6 mx-auto">
            The job opportunity you are looking for might have been closed or removed.
          </p>
          <button 
            onClick={() => navigate("/student/dashboard")} 
            className="text-[12px] border border-neutral-200 px-6 py-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="pb-20 animate-fade-in">
        
        {/* back navigation button...
        redirects the user to the previous page in history */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-[12px] font-bold text-neutral-500 hover:text-black mb-6 transition-colors cursor-pointer bg-transparent border-none p-0 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Return to Details
        </button>

        {/* success state display...
        this section is shown only after the application is successfully sent */}
        {success ? (
          <div className="bg-white border border-neutral-200 rounded-xl p-10 text-center max-w-lg mx-auto my-12 shadow-sm">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <h2 className="text-[18px] font-bold text-black mb-2">Application Submitted!</h2>
            <p className="text-[14px] text-neutral-500 mb-8 leading-relaxed">
              Your application for <span className="text-black font-bold">{job.title}</span> at <span className="text-black font-bold">{job.company?.name}</span> has been sent successfully.
            </p>
            <div className="inline-flex items-center gap-2 text-neutral-400 text-[12px] font-bold">
              <div className="w-3 h-3 border-2 border-neutral-200 border-t-blue-500 rounded-full animate-spin" />
              Redirecting to dashboard...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
            
            {/* application form section...
            here the student enters their resume link and writes a optional message */}
            <div className="space-y-6">
              
              {/* page header area... */}
              <section aria-label="Page header" className="mb-2 p-0">
                <p className="cs-section-label">
                  Forge Entry
                </p>
                <h1 className="cs-page-title">
                  Apply for <span className="text-[#ef4444]">Position</span>
                </h1>
                <p className="cs-subtext max-w-[480px]">
                  Provide your portfolio and resume details to apply for this verified opportunity.
                </p>
              </section>

              {/* form container section... */}
              <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[12px] font-bold flex items-center gap-2">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                {/* resume link input... */}
                <div className="space-y-2">
                <label className="cs-section-label ml-0.5">
                  Resume Link (Public Drive/PDF)
                </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/your-resume-link"
                    required
                    value={formData.resumeUrl}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    className="w-full text-[13px] border border-neutral-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all bg-neutral-50/50 font-bold"
                  />
                  <p className="text-[11px] text-neutral-400 ml-0.5 font-bold">
                    Note: Ensure your link is publicly viewable by recruiters.
                  </p>
                </div>

                {/* cover note text area... */}
                <div className="space-y-2">
                  <label className="cs-section-label ml-0.5">
                    Experience Note (Optional)
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Explain why you're a good fit for this role..."
                    value={formData.coverNote}
                    onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                    className="w-full text-[13px] border border-neutral-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all bg-neutral-50/50 resize-none font-bold"
                  />
                </div>

                {/* submit button... */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black text-white text-[12px] font-bold py-3.5 rounded-xl hover:bg-neutral-800 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Submit Application <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* job summary side card...
            this shows a quick summary of the job the user is applying for */}
            <aside className="space-y-6">
              
              <p className="cs-section-label">
                Role Summary
              </p>

              <div className="bg-white border border-neutral-200 rounded-xl p-5 sticky top-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {job.company?.logo ? (
                      <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                    ) : (
                      <BriefcasePlus className="text-neutral-400" size={20} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-[15px] font-bold text-black truncate">
                      {job.title}
                    </h2>
                    <p className="text-[12px] font-bold text-neutral-400 truncate">
                      {job.company?.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 border-t border-neutral-100 pt-5">
                  <div className="flex items-center gap-3 text-[12px] font-bold text-neutral-600">
                    <MapPin size={14} className="text-neutral-400" />
                    <span>{job.location || "Remote"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[12px] font-bold text-neutral-600">
                    <Briefcase size={14} className="text-neutral-400" />
                    <span className="capitalize">{job.jobType?.replace('-', ' ')}</span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <p className="text-[11px] font-bold text-neutral-400 leading-relaxed text-center italic">
                    "Analysis: Profile and credentials will be shared with the partner for review."
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
