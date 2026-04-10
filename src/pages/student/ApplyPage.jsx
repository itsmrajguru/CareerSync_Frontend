import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, FileText, Send, Building2, MapPin, 
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

  if (loading) {
    return (
      <PageLayout>
        <div className="py-20 text-center animate-pulse">
          <div className="h-8 bg-neutral-100 w-64 mx-auto rounded-lg mb-4" />
          <div className="h-4 bg-neutral-100 w-96 mx-auto rounded-lg" />
        </div>
      </PageLayout>
    );
  }

  if (!job) {
    return (
      <PageLayout>
        <div className="py-20 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Job not found</h2>
          <button onClick={() => navigate("/student/dashboard")} className="btn-primary px-8 py-3">
            Back to Dashboard
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
        
        {/* back navigation button...
        redirects the user to the previous page in history */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#0f172a] mb-10 transition-all font-bold text-[13px] uppercase tracking-[1px] group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        {/* success state display...
        this section is shown only after the application is successfully sent */}
        {success ? (
          <div className="cs-card p-12 text-center border-green-100 bg-green-50/30">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-green-200">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-black text-[#0f172a] mb-4">Application Submitted!</h2>
            <p className="text-[#64748b] font-medium max-w-md mx-auto mb-8">
              Your application for <span className="text-black font-bold">{job.title}</span> at <span className="text-black font-bold">{job.company?.name}</span> has been successfully sent.
            </p>
            <p className="text-[11px] font-black text-[#94a3b8] uppercase tracking-widest">
              Redirecting to dashboard...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* application form section...
            here the student enters their resume link and writes a optional message */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-[#0f172a] mb-2 uppercase">
                  Apply for Position
                </h1>
                <p className="text-[#64748b] font-medium">
                  Complete your application by providing the details below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
                    <AlertCircle size={18} /> {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1 flex items-center gap-2">
                    <FileText size={12} /> Resume Link (PDF/Drive)
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    required
                    value={formData.resumeUrl}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    className="cs-input !py-4"
                  />
                  <p className="text-[11px] text-[#94a3b8] ml-1">
                    Provide a public link to your resume. Make sure anyone with the link can view it.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Briefcase size={12} /> Cover Note (Optional)
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Tell the company why you're a good fit for this role..."
                    value={formData.coverNote}
                    onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                    className="cs-input !py-4 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full !py-5 shadow-xl shadow-primary-500/20 flex items-center justify-center gap-3 text-sm"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Submit Application <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* job summary side card...
            this shows a quick summary of the job the user is applying for */}
            <div className="lg:col-span-1">
              <div className="cs-card !p-8 border-neutral-100 sticky top-8">
                <div className="w-16 h-16 bg-[#0f172a] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-900/10 overflow-hidden">
                  {job.company?.logo ? (
                    <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="text-white" size={32} />
                  )}
                </div>

                <h3 className="text-[11px] font-black text-[#ef4444] uppercase tracking-[2px] mb-1">
                  Applying for
                </h3>
                <h2 className="text-xl font-black text-[#0f172a] leading-tight mb-6">
                  {job.title}
                </h2>

                <div className="space-y-4 pt-6 border-t border-neutral-100">
                  <div className="flex items-center gap-3 text-[13px] font-bold text-[#64748b]">
                    <Building2 size={16} className="text-[#94a3b8]" />
                    <span>{job.company?.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[13px] font-bold text-[#64748b]">
                    <MapPin size={16} className="text-[#94a3b8]" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[13px] font-bold text-[#64748b]">
                    <Briefcase size={16} className="text-[#94a3b8]" />
                    <span className="capitalize">{job.jobType?.replace('-', ' ')}</span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <p className="text-[11px] font-medium text-[#64748b] leading-relaxed">
                    By submitting, your profile details and resume will be shared with the company for review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
