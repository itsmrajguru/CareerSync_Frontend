import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationDetails, updateApplicationStatus } from "../../services/applicationService";
import { scheduleInterview, cancelInterview } from "../../services/interviewService";
import PageLayout from "../../components/PageLayout";
import { 
  ArrowLeft, Mail, FileText, Briefcase, User, GraduationCap, Code, AlertCircle, Link as LinkIcon,
  CalendarCheck, X, MapPin, Video, Phone, Building2, Clock3, Trash2, ChevronDown, Maximize2, Minimize2
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
  const [isResumeExpanded, setIsResumeExpanded] = useState(false);

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
          .pdf-frame { width: 100%; height: 100%; border: none; border-radius: 12px; background: #f9fafb; }
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 16px; }
          .modal-box { background: white; border-radius: 20px; width: 100%; max-width: 480px; border: 1px solid #e5e7eb; box-shadow: 0 20px 60px rgba(0,0,0,0.15); max-height: calc(100vh - 32px); display: flex; flex-direction: column; overflow: hidden; }
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

        {/* Hero Candidate Profile Card */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-50 rounded-bl-full -z-10 opacity-70"></div>
          
          <div className="flex items-center gap-5">
            {/* Initials Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-900 flex items-center justify-center text-[22px] sm:text-[26px] font-black text-white border-2 border-neutral-100 shadow-md flex-shrink-0 transition-transform hover:scale-105 duration-300">
              {student.username.slice(0, 2).toUpperCase()}
            </div>
            
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-[10px] font-black text-neutral-400 hover:text-black transition-all uppercase tracking-widest bg-transparent border-none p-0 cursor-pointer self-start">
                <ArrowLeft size={12} /> Back to applicants
              </button>
              
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[20px] sm:text-[24px] font-black text-black tracking-tight leading-none m-0">
                  {student.username}
                </h1>
                <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
                  className="px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-widest leading-none">
                  {sc.label}
                </span>
              </div>
              <p className="text-[12px] text-neutral-500 font-bold m-0 leading-none">
                Applied for <span className="font-black text-black">{job.title}</span> on {new Date(application.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Action buttons and Status selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Custom dropdown */}
            <div className="relative flex items-center w-full sm:w-auto">
              <select
                value={application.status}
                onChange={e => handleStatusChange(e.target.value)}
                className="h-11 w-full sm:w-auto pl-5 pr-10 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px] font-black text-black shadow-sm focus:outline-none focus:ring-4 focus:ring-neutral-100 focus:border-neutral-400 cursor-pointer uppercase tracking-widest appearance-none"
              >
                <option value="applied">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Not Moving Forward</option>
                <option value="hired">Hired ✓</option>
              </select>
              <ChevronDown size={14} className="text-neutral-500 absolute right-4 pointer-events-none" />
            </div>

            {application.status === "shortlisted" && !interview && (
              <button
                onClick={() => setShowModal(true)}
                className="h-11 flex items-center justify-center gap-2 px-5 bg-amber-500 text-white font-black text-[11px] rounded-xl hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] transition-all uppercase tracking-widest border-none cursor-pointer w-full sm:w-auto"
              >
                <CalendarCheck size={14} /> Schedule Interview
              </button>
            )}

            <button 
              onClick={handleEmailClick}
              className="h-11 flex items-center justify-center gap-2 px-5 bg-black text-white font-black text-[11px] rounded-xl hover:bg-neutral-800 hover:shadow-lg hover:shadow-black/10 active:scale-[0.98] transition-all uppercase tracking-widest border-none cursor-pointer w-full sm:w-auto"
            >
              <Mail size={14} /> Email Candidate
            </button>
          </div>
        </div>

        {/* Main Grid content */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          
          {/* Left Column: Unified Profile details */}
          <div className="flex flex-col gap-6">
            
            {/* Profile Info block */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Overview</p>
                <h3 className="text-[14px] font-black text-black uppercase tracking-wider m-0">Candidate Details</h3>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-[12px] font-bold text-neutral-600 hover:text-black transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center border border-neutral-100 flex-shrink-0">
                    <Mail size={14} className="text-neutral-400" />
                  </div>
                  <div className="truncate">
                    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5 leading-none">Email Address</p>
                    <p className="truncate font-semibold m-0 leading-tight">{student.email}</p>
                  </div>
                </div>

                {studentProfile?.domain && (
                  <div className="flex items-center gap-3 text-[12px] font-bold text-neutral-600 hover:text-black transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center border border-neutral-100 flex-shrink-0">
                      <Briefcase size={14} className="text-neutral-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5 leading-none">Expertise</p>
                      <p className="font-semibold m-0 leading-tight">{studentProfile.domain}</p>
                    </div>
                  </div>
                )}

                {studentProfile?.education?.degree && (
                  <div className="flex items-center gap-3 text-[12px] font-bold text-neutral-600 hover:text-black transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center border border-neutral-100 flex-shrink-0">
                      <GraduationCap size={14} className="text-neutral-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5 leading-none">Education</p>
                      <p className="font-semibold m-0 leading-tight">{studentProfile.education.degree} ({studentProfile.education.year})</p>
                    </div>
                  </div>
                )}

                {studentProfile?.githubLink && (
                  <a href={studentProfile.githubLink} target="_blank" rel="noreferrer" 
                     className="flex items-center gap-3 text-[12px] font-black text-[#ef4444] hover:text-red-600 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-red-50/50 group-hover:bg-red-50 flex items-center justify-center border border-red-100 flex-shrink-0 transition-colors">
                      <LinkIcon size={14} className="text-[#ef4444]" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-red-400/80 uppercase tracking-widest mb-0.5 leading-none">External Profile</p>
                      <p className="underline font-black m-0 leading-tight">GitHub Profile</p>
                    </div>
                  </a>
                )}
              </div>

              {/* Bio section if exists */}
              {studentProfile?.bio && (
                <div className="border-t border-neutral-100 pt-5">
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <User size={11} className="text-neutral-300"/> Candidate Bio
                  </p>
                  <div className="bg-neutral-50/50 border border-neutral-100 rounded-xl p-4 italic text-[11px] font-medium text-neutral-500 leading-relaxed relative">
                    <span className="text-[20px] font-serif text-neutral-300 absolute top-2 left-2 select-none leading-none">“</span>
                    <span className="pl-4 block">
                      {studentProfile.bio}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Core Competencies */}
            {studentProfile?.skills && studentProfile.skills.length > 0 && (
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2 m-0">
                  <Code size={13} className="text-neutral-400"/> Core Competencies
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {studentProfile.skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-100 text-[10px] font-bold text-neutral-700 rounded-lg uppercase tracking-wider hover:bg-neutral-100 hover:border-neutral-300 transition-colors cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: PDF Viewer + Scheduled Interview Card */}
          <div className="flex flex-col gap-6">

            {/* Scheduled Interview Card */}
            {interview && (
              <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-100/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-200 flex items-center justify-center flex-shrink-0">
                      <CalendarCheck size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-black text-amber-900 uppercase tracking-wider leading-none mb-1 m-0">Interview Scheduled</h4>
                      <p className="text-[11px] font-bold text-amber-700/80 leading-none m-0">Upcoming discussion arranged with applicant</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelInterview}
                    className="flex items-center gap-1.5 text-[9px] font-black text-red-500 border border-red-200 bg-white px-3.5 py-2 rounded-xl hover:bg-red-50 active:scale-[0.98] transition-all uppercase tracking-wider cursor-pointer shadow-sm self-start sm:self-auto"
                  >
                    <Trash2 size={11} /> Cancel Session
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-amber-200/40 rounded-xl px-4 py-3 shadow-[0_1px_2px_rgba(245,158,11,0.02)]">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <Clock3 size={14} className="text-amber-500" />
                      <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest m-0">Date & Time</p>
                    </div>
                    <p className="text-[13px] font-black text-black leading-tight m-0">
                      {new Date(interview.scheduledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <p className="text-[11px] font-bold text-neutral-500 leading-none mt-1 m-0">
                      {new Date(interview.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  <div className="bg-white border border-amber-200/40 rounded-xl px-4 py-3 shadow-[0_1px_2px_rgba(245,158,11,0.02)]">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      {MODE_ICON[interview.mode] || <Video size={13} className="text-blue-400" />}
                      <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest m-0">Method</p>
                    </div>
                    <p className="text-[13px] font-black text-black capitalize leading-none m-0">
                      {interview.mode?.replace("-", " ")}
                    </p>
                  </div>

                  {interview.location && (
                    <div className="bg-white border border-amber-200/40 rounded-xl px-4 py-3 shadow-[0_1px_2px_rgba(245,158,11,0.02)]">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <MapPin size={13} className="text-amber-500" />
                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest m-0">
                          {interview.mode === "online" ? "Meeting Link" : interview.mode === "in-person" ? "Office Address" : "Phone Number"}
                        </p>
                      </div>
                      <p className="text-[13px] font-black text-black truncate max-w-[170px] leading-tight m-0" title={interview.location}>
                        {interview.location}
                      </p>
                    </div>
                  )}
                </div>

                {/* message from company if present */}
                {interview.message && (
                  <div className="mt-4 pt-4 border-t border-amber-200/40">
                    <p className="text-[9px] font-black text-amber-700/60 uppercase tracking-widest mb-1.5 m-0">Message to Candidate</p>
                    <p className="text-[11px] font-bold text-amber-800 leading-relaxed italic bg-white/40 border border-amber-200/20 rounded-xl p-3 m-0">
                      "{interview.message}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Resume viewer card */}
            <div className={`bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${isResumeExpanded ? "min-h-[750px]" : "min-h-[460px] h-[460px]"}`}>
              
              {/* Fake Browser toolbar */}
              <div className="bg-neutral-50 px-5 py-4 border-b border-neutral-100 flex items-center justify-between flex-wrap gap-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400/80"></span>
                  </div>
                  <div className="h-4 w-[1px] bg-neutral-200 hidden sm:block"></div>
                  <p className="text-[11px] font-black text-black uppercase tracking-widest flex items-center gap-2 m-0">
                    <FileText size={14} className="text-neutral-400" /> Candidate Resume
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {application.resumeUrl && (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsResumeExpanded(prev => !prev)}
                        className="flex items-center gap-1.5 text-[9px] font-black text-neutral-600 bg-white border border-neutral-200 px-3.5 py-2 rounded-lg hover:bg-neutral-50 hover:border-neutral-300 transition-all uppercase tracking-widest shadow-sm cursor-pointer"
                      >
                        {isResumeExpanded ? (
                          <>
                            <Minimize2 size={11} /> Collapse Viewer
                          </>
                        ) : (
                          <>
                            <Maximize2 size={11} /> Expand Viewer
                          </>
                        )}
                      </button>

                      <a href={application.resumeUrl} target="_blank" rel="noreferrer"
                         className="flex items-center gap-1.5 text-[9px] font-black text-black bg-white border border-neutral-200 px-3.5 py-2 rounded-lg hover:bg-neutral-50 hover:border-neutral-300 transition-all uppercase tracking-widest shadow-sm">
                        <LinkIcon size={11}/> View Original PDF
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* PDF Content Area */}
              <div className="p-4 flex-1 bg-neutral-50/50 flex flex-col min-h-0">
                {application.resumeUrl ? (
                  <iframe src={`${application.resumeUrl}#view=FitH`} className="pdf-frame flex-1 border border-neutral-200 rounded-xl bg-white shadow-sm" title="Resume" />
                ) : (
                  <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-xl bg-white text-neutral-400 p-6">
                    <FileText size={48} className="mb-4 opacity-20 text-black" />
                    <p className="font-black text-[11px] uppercase tracking-widest text-neutral-400 m-0">No Resume Attached to Profile</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
