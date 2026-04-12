import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationDetails, updateApplicationStatus } from "../../services/applicationService";
import PageLayout from "../../components/PageLayout";
import { 
  ArrowLeft, Mail, FileText, Briefcase, User, GraduationCap, Code, AlertCircle, Link as LinkIcon
} from "lucide-react";


/* this array contains the 4 stats for the application status */
const STATUS_CFG = {
  applied:     { label: "Applied",     bg: "#e6f9fd", color: "#0d1117", border: "#b3eefb" },
  shortlisted: { label: "Shortlisted", bg: "#fffbeb", color: "#0d1117", border: "#fde68a" },
  rejected:    { label: "Rejected",    bg: "#fef2f2", color: "#0d1117", border: "#fca5a5" },
  hired:       { label: "Hired",       bg: "#f0fdf4", color: "#0d1117", border: "#86efac" },
};

/* the main ApplicationDetailsPage */
export default function ApplicationDetailPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* so we fetch the applicationsDetails from this function which utimately takes 
  it from the application Model and 
  save it into the setData state for local storage */
  const fetchData = async () => {
    setLoading(true); setError("");
    try {
      const res = await getApplicationDetails(appId);
      if (res.success) {
        setData(res);
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
        `}</style>

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
            {/* this functionality send the email to the user, on the basis of the updated 
            status of the job */}
            <a href={`mailto:${student.email}`}
              className="h-11 flex items-center justify-center gap-2 px-6 bg-black text-white font-black text-[11px] rounded-xl hover:bg-neutral-800 transition-all shadow-xl shadow-black/5 uppercase tracking-widest">
              <Mail size={16} /> Email Candidate
            </a>
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

          {/* Right Column: Resume Viewer */}
          <div className="flex flex-col gap-6">
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
  );
}
