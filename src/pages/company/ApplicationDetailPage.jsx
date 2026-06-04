import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationDetails, updateApplicationStatus, toggleSaveApplicant } from "../../services/applicationService";
import { scheduleInterview, cancelInterview } from "../../services/interviewService";
import PageLayout from "../../components/PageLayout";
import { 
  ArrowLeft, Mail, FileText, Briefcase, User, GraduationCap, Code, AlertCircle, Link as LinkIcon,
  CalendarCheck, X, MapPin, Video, Phone, Building2, Clock3, Trash2, Bookmark
} from "lucide-react";
import { logEmailCommunication } from "../../services/notificationService";


/* this array contains the 4 stats for the application status */
const STATUS_CFG = {
  applied:     { label: "Applied",     bg: "#e6f9fd", color: "#0d1117", border: "#b3eefb" },
  shortlisted: { label: "Shortlisted", bg: "#fffbeb", color: "#0d1117", border: "#fde68a" },
  rejected:    { label: "Rejected",    bg: "#fef2f2", color: "#0d1117", border: "#fca5a5" },
  hired:       { label: "Hired",       bg: "#f0fdf4", color: "#0d1117", border: "#86efac" },
};

/* interview mode icons for display */
const MODE_ICON = {
  online:    <Video size={13} className="text-blue-400" />,
  phone:     <Phone size={13} className="text-green-400" />,
  "in-person": <Building2 size={13} className="text-orange-400" />,
};

/* default form state for the schedule modal */
const EMPTY_FORM = {
  scheduledAt: "",
  mode: "online",
  location: "",
  message: "",
};

/* the main ApplicationDetailsPage */
export default function ApplicationDetailPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [interview, setInterview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  /* so we fetch the applicationsDetails from this function which utimately takes 
  it from the application Model and 
  save it into the setData state for local storage */
  const fetchData = async () => {
    setLoading(true); setError("");
    try {
      const res = await getApplicationDetails(appId);
      if (res.success) {
        setData(res);
        setInterview(res.interview || null);
      } else {
        setError(res.message || "Failed to load details.");
      }
    } catch (e) {
      setError("An error occurred loading the application.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [appId]);

  /* ṭhis function is used to update particular application with the updated status */
  const handleStatusChange = async (status) => {
    if (!window.confirm(`Set status to "${status.toUpperCase()}"? This will notify the candidate.`)) return;
    try {
      const res = await updateApplicationStatus(appId, status);
      if (res.success) fetchData();
    } catch (e) {
      alert("Failed to update status.");
    }
  };

  /* function to toggle the bookmark / save status for this specific applicant */
  const handleSaveToggle = async () => {
    try {
      const res = await toggleSaveApplicant(appId);
      if (res.success) fetchData();
    } catch (e) {
      console.error("Failed to save applicant.");
    }
  };

  const handleEmailClick = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      await logEmailCommunication({
        recipientId: student._id,
        recipientType: 'UserModel',
        subject: `Contact initiated for ${job.title}`,
        message: `${userData.username} has initiated contact with you regarding the "${job.title}" application.`
      });
    } catch (err) {
      console.error("Log comm error:", err);
    }
    window.location.href = `mailto:${student.email}`;
  };

  /* submits the schedule interview form */
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await scheduleInterview(appId, form);
      if (res.success) {
        setShowModal(false);
        setForm(EMPTY_FORM);
        fetchData();
      } else {
        alert(res.message || "Failed to schedule interview.");
      }
    } catch (err) {
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleCancelInterview = async () => {
    if (!window.confirm("Cancel this scheduled interview?")) return;
    try {
      const res = await cancelInterview(interview._id);
      if (res.success) fetchData();
    } catch (e) {
      alert("Failed to cancel interview.");
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="py-16 flex-1 w-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-neutral-100 border-t-black rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    );
  }

  if (error || !data) {
    return (
      <PageLayout>
        <div className="py-16 flex-1 w-full flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={24} className="text-red-400" />
          </div>
          <h2 className="text-[18px] font-bold text-black mb-1">Failed to process forge entry</h2>
          <p className="text-[14px] text-neutral-400 font-bold mb-8 italic">{error}</p>
          <button onClick={() => navigate(-1)} className="px-8 py-3 bg-white border border-neutral-200 rounded-xl font-bold text-[12px] shadow-sm hover:bg-neutral-50 transition-all uppercase tracking-wider">Return to Dashboard</button>
        </div>
      </PageLayout>
    );
  }

  const { application, studentProfile } = data;
  const student = application.student;
  const job = application.job;
  const sc = STATUS_CFG[application.status] || STATUS_CFG.applied;

  return (
    <PageLayout>
      <div className="pb-20 animate-fade-in text-left">
        <style>{`
          .pdf-frame { width: 100%; height: 600px; border: none; border-radius: 14px; background: #f3f4f6; }
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 9999; display: flex; padding: 16px; overflow-y: auto; }
          .modal-box { background: white; border-radius: 20px; width: 100%; max-width: 480px; border: 1px solid #e5e7eb; box-shadow: 0 20px 60px rgba(0,0,0,0.15); display: flex; flex-direction: column; overflow: hidden; margin: auto; max-height: 90vh; }
        `}</style>

        {/* schedule interview modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-neutral-100 flex-shrink-0">
                <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Interview Forge</p>
                  <h3 className="text-[16px] font-black text-black">Schedule Interview</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-all cursor-pointer border-none">
                  <X size={14} className="text-neutral-600" />
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto flex-1 min-h-0">

                {/* date & time */}
                <div>
                  <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.scheduledAt}
                    onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
                    className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-[13px] font-bold text-black focus:outline-none focus:ring-4 focus:ring-neutral-100 focus:border-neutral-400 bg-neutral-50"
                  />
                </div>

                {/* interview mode */}
                <div>
                  <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Mode</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["online", "phone", "in-person"].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, mode: m }))}
                        className={`h-10 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          form.mode === m
                            ? "bg-black text-white border-black"
                            : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        {MODE_ICON[m]} {m.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* location / link */}
                <div>
                  <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">
                    {form.mode === "online" ? "Meeting Link" : form.mode === "in-person" ? "Office Address" : "Phone Number"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={form.mode === "online" ? "https://meet.google.com/..." : form.mode === "in-person" ? "3rd Floor, Tower B, Pune..." : "+91 9876543210"}
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-[13px] font-bold text-black focus:outline-none focus:ring-4 focus:ring-neutral-100 focus:border-neutral-400 bg-neutral-50"
                  />
                </div>

                {/* message to candidate */}
                <div>
                  <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Message to Candidate <span className="text-neutral-300 normal-case font-bold">(optional)</span></label>
                  <textarea
                    rows={3}
                    placeholder="Please be available 5 minutes early..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-[13px] font-bold text-black focus:outline-none focus:ring-4 focus:ring-neutral-100 focus:border-neutral-400 bg-neutral-50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="h-12 bg-black text-white font-black text-[11px] rounded-xl hover:bg-neutral-800 transition-all shadow-xl shadow-black/10 uppercase tracking-widest border-none cursor-pointer disabled:opacity-50 mt-1"
                >
                  {submitting ? "Scheduling..." : "Confirm Interview →"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/*Hero section*/}
        <div className="mb-10 flex flex-col lg:flex-row items-start justify-between gap-6 pt-4">
          <div>
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[11px] font-black text-neutral-400 hover:text-black transition-all mb-8 uppercase tracking-widest bg-transparent border-none p-0 cursor-pointer">
              <ArrowLeft size={14} /> Back to applicants
            </button>
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <h1 className="cs-page-title !mb-0 text-left">
                {student.username}
              </h1>
              <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
                className="px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest">
                {sc.label}
              </span>
              <button 
                onClick={handleSaveToggle}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors border-none cursor-pointer ${application.isSaved ? 'bg-amber-100 text-amber-600' : 'bg-neutral-100 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200'}`}
                title={application.isSaved ? "Unsave Applicant" : "Save Applicant"}
              >
                <Bookmark size={16} fill={application.isSaved ? "currentColor" : "none"} />
              </button>
            </div>
            <p className="cs-subtext !mb-0">
              Applied for <span className="font-black text-black">{job.title}</span> on {new Date(application.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>

          {/* These status are sent to the updateApplications page */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <select
              value={application.status}
              onChange={e => handleStatusChange(e.target.value)}
              className="h-11 px-6 rounded-xl bg-white border border-neutral-200 text-[11px] font-black text-black shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-neutral-400 cursor-pointer uppercase tracking-widest appearance-none"
            >
              <option value="applied">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Not Moving Forward</option>
              <option value="hired">Hired ✓</option>
            </select>

            {/* only show the Schedule Interview button if the student is shortlisted and there is no interview yet */}
            {application.status === "shortlisted" && !interview && (
              <button
                onClick={() => setShowModal(true)}
                className="h-11 flex items-center justify-center gap-2 px-6 bg-amber-500 text-white font-black text-[11px] rounded-xl hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 uppercase tracking-widest border-none cursor-pointer"
              >
                <CalendarCheck size={16} /> Schedule Interview
              </button>
            )}

            {/* this functionality send the email to the user, on the basis of the updated 
            status of the job */}
            <button 
              onClick={handleEmailClick}
              className="h-11 flex items-center justify-center gap-2 px-6 bg-black text-white font-black text-[11px] rounded-xl hover:bg-neutral-800 transition-all shadow-xl shadow-black/5 uppercase tracking-widest border-none cursor-pointer"
            >
              <Mail size={16} /> Email Candidate
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          
          {/* Canditates profile....
          shows the candidates profile to the user... */}
          <div className="flex flex-col gap-6">
            
            {/* Basic Info */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-[22px] font-black text-black mb-6 border border-neutral-200 shadow-sm">
                {student.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3.5 text-[12px] font-bold text-neutral-600">
                  <Mail size={16} className="text-neutral-300" /> {student.email}
                </div>
                {studentProfile?.domain && (
                  <div className="flex items-center gap-3.5 text-[12px] font-bold text-neutral-600">
                    <Briefcase size={16} className="text-neutral-300" /> {studentProfile.domain}
                  </div>
                )}
                {studentProfile?.education?.degree && (
                  <div className="flex items-center gap-3.5 text-[12px] font-bold text-neutral-600">
                    <GraduationCap size={16} className="text-neutral-300" /> {studentProfile.education.degree} ({studentProfile.education.year})
                  </div>
                )}
                {studentProfile?.githubLink && (
                  <a href={studentProfile.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-3.5 text-[12px] font-black text-[#ef4444] hover:underline">
                    <LinkIcon size={16} /> GitHub Profile
                  </a>
                )}
              </div>
            </div>

            {/* Skills */}
            {studentProfile?.skills && studentProfile.skills.length > 0 && (
              <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
                <p className="cs-section-label !mb-5 flex items-center gap-2 uppercase tracking-widest"><Code size={14} className="text-neutral-300"/> Candidate Skills</p>
                <div className="flex flex-wrap gap-2">
                  {studentProfile.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 text-[10px] font-black text-black rounded-lg uppercase tracking-wider">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            {studentProfile?.bio && (
              <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
                <p className="cs-section-label !mb-4 flex items-center gap-2 uppercase tracking-widest"><User size={14} className="text-neutral-300"/> Profile Bio</p>
                <p className="text-[12px] text-neutral-500 leading-relaxed font-bold italic">"{studentProfile.bio}"</p>
              </div>
            )}

          </div>

          {/* Right Column: Resume Viewer + Interview Card */}
          <div className="flex flex-col gap-6">

            {/* interview card — only shows up if an interview is scheduled */}
            {interview && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="cs-section-label !mb-1 flex items-center gap-2 uppercase tracking-widest text-amber-600">
                      <CalendarCheck size={14} className="text-amber-400"/> Interview Scheduled
                    </p>
                    <p className="text-[12px] font-bold text-neutral-500">This candidate has an upcoming interview</p>
                  </div>
                  <button
                    onClick={handleCancelInterview}
                    className="flex items-center gap-1.5 text-[10px] font-black text-red-500 border border-red-200 bg-white px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all uppercase tracking-wider cursor-pointer"
                  >
                    <Trash2 size={11} /> Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 bg-white border border-amber-100 rounded-xl px-4 py-3">
                    <Clock3 size={15} className="text-amber-400 flex-shrink-0" />
                    <div>
                      <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Date & Time</p>
                      <p className="text-[12px] font-black text-black">
                        {new Date(interview.scheduledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {" · "}
                        {new Date(interview.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white border border-amber-100 rounded-xl px-4 py-3">
                    <div className="flex-shrink-0">{MODE_ICON[interview.mode] || <Video size={13} className="text-blue-400" />}</div>
                    <div>
                      <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Mode</p>
                      <p className="text-[12px] font-black text-black capitalize">{interview.mode?.replace("-", " ")}</p>
                    </div>
                  </div>
                  {interview.location && (
                    <div className="flex items-center gap-3 bg-white border border-amber-100 rounded-xl px-4 py-3">
                      <MapPin size={13} className="text-neutral-400 flex-shrink-0" />
                      <div>
                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Location / Link</p>
                        <p className="text-[12px] font-black text-black truncate max-w-[140px]">{interview.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* message from company if present */}
                {interview.message && (
                  <p className="mt-4 text-[12px] font-bold text-neutral-500 italic border-t border-amber-100 pt-4">
                    "{interview.message}"
                  </p>
                )}
              </div>
            )}

            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm min-h-[600px] flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-neutral-50">
                <p className="cs-section-label !mb-0 flex items-center gap-2 uppercase tracking-widest text-[#000]">
                  <FileText size={16} className="text-neutral-300" /> Application Artifacts
                </p>
                {application.resumeUrl && (
                  <a href={application.resumeUrl} target="_blank" rel="noreferrer"
                     className="flex items-center gap-1.5 text-[10px] font-black text-black bg-neutral-50 border border-neutral-100 px-4 py-2 rounded-lg hover:bg-neutral-100 transition-all uppercase tracking-widest shadow-sm">
                    <LinkIcon size={12}/> View Original PDF
                  </a>
                )}
              </div>

              {application.resumeUrl ? (
                <iframe src={`${application.resumeUrl}#view=FitH`} className="pdf-frame flex-1 border border-neutral-100 shadow-inner" title="Resume" />
              ) : (
                <div className="flex-1 min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-neutral-100 rounded-xl bg-neutral-50/50 text-neutral-400">
                  <FileText size={48} className="mb-4 opacity-30" />
                  <p className="font-black text-[12px] uppercase tracking-widest">No resume attached to forge entry</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );;
}
