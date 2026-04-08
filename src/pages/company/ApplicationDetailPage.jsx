import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationDetails, updateApplicationStatus } from "../../services/applicationService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { 
  ArrowLeft, Mail, FileText, Calendar, Briefcase, User, GraduationCap, Code, AlertCircle, Link as LinkIcon
} from "lucide-react";

const STATUS_CFG = {
  applied:     { label: "Applied",     bg: "#e6f9fd", color: "#0179a0", border: "#b3eefb" },
  shortlisted: { label: "Shortlisted", bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
  rejected:    { label: "Rejected",    bg: "#fef2f2", color: "#b91c1c", border: "#fca5a5" },
  hired:       { label: "Hired",       bg: "#f0fdf4", color: "#166534", border: "#86efac" },
};

export default function ApplicationDetailPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <div className="min-h-screen bg-[#f0fbfe] flex flex-col font-sans">
        <Navbar />
        <main className="max-w-[1000px] mx-auto px-7 py-16 flex-1 w-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#f0fbfe] flex flex-col font-sans">
        <Navbar />
        <main className="max-w-[1000px] mx-auto px-7 py-16 flex-1 w-full flex flex-col items-center justify-center">
          <AlertCircle size={48} className="text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Failed to load</h2>
          <p className="text-neutral-500 mb-6">{error}</p>
          <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-white border border-neutral-200 rounded-xl font-bold text-sm shadow-sm hover:bg-neutral-50">Go Back</button>
        </main>
        <Footer />
      </div>
    );
  }

  const { application, studentProfile } = data;
  const student = application.student;
  const job = application.job;
  const sc = STATUS_CFG[application.status] || STATUS_CFG.applied;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px);} to { opacity:1; transform:translateY(0);} }
        .d-hero    { animation: fadeUp .5s ease both; }
        .d-content { animation: fadeUp .5s .15s ease both; }
        .pdf-frame { width: 100%; height: 600px; border: none; border-radius: 14px; background: #f3f4f6; }
      `}</style>

      <div className="min-h-screen bg-[#f0fbfe] font-sans flex flex-col">
        <Navbar />
        <main className="max-w-[1000px] mx-auto px-7 pt-10 pb-10 flex-1 w-full">

          {/*Hero section*/}
          <div className="d-hero mb-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[12px] font-bold text-neutral-400 hover:text-primary-400 transition-colors mb-6">
                <ArrowLeft size={14} /> Back to applicants
              </button>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-[2.5rem] font-extrabold leading-[1.15] tracking-[-1px] text-neutral-900">
                  {student.username}
                </h1>
                <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
                  className="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide">
                  {sc.label}
                </span>
              </div>
              <p className="text-base text-neutral-500 font-medium flex items-center gap-2">
                Applied for <span className="font-bold text-primary-500">{job.title}</span> on {new Date(application.appliedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <select
                value={application.status}
                onChange={e => handleStatusChange(e.target.value)}
                className="p-3 pr-8 rounded-xl bg-white border border-neutral-200 text-sm font-bold text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer"
              >
                <option value="applied">Target Status: Under Review</option>
                <option value="shortlisted">Target Status: Shortlisted</option>
                <option value="rejected">Target Status: Not Moving Forward</option>
                <option value="hired">Target Status: Hired ✓</option>
              </select>
              <a href={`mailto:${student.email}`}
                className="flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white font-bold text-sm rounded-xl hover:bg-black transition-colors shadow-sm">
                <Mail size={16} /> Email Candidate
              </a>
            </div>
          </div>

          <div className="d-content grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* lEft Column: Candidate Profile */}
            <div className="flex flex-col gap-6">
              
              {/* Basic Info */}
              <div className="bg-white border border-neutral-200 rounded-[14px] p-6 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-xl font-black text-neutral-500 mb-5">
                  {student.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sm font-medium text-neutral-600">
                    <Mail size={16} className="text-neutral-400" /> {student.email}
                  </div>
                  {studentProfile?.domain && (
                    <div className="flex items-center gap-3 text-sm font-medium text-neutral-600">
                      <Briefcase size={16} className="text-neutral-400" /> {studentProfile.domain}
                    </div>
                  )}
                  {studentProfile?.education?.degree && (
                    <div className="flex items-center gap-3 text-sm font-medium text-neutral-600">
                      <GraduationCap size={16} className="text-neutral-400" /> {studentProfile.education.degree} ({studentProfile.education.year})
                    </div>
                  )}
                  {studentProfile?.githubLink && (
                    <a href={studentProfile.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-bold text-primary-500 hover:underline">
                      <LinkIcon size={16} /> GitHub Profile
                    </a>
                  )}
                </div>
              </div>

              {/* Skills */}
              {studentProfile?.skills && studentProfile.skills.length > 0 && (
                <div className="bg-white border border-neutral-200 rounded-[14px] p-6 shadow-sm">
                  <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px] mb-4 flex items-center gap-1.5"><Code size={14}/> Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {studentProfile.skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 text-xs font-bold text-neutral-700 rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              {studentProfile?.bio && (
                <div className="bg-white border border-neutral-200 rounded-[14px] p-6 shadow-sm">
                  <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px] mb-4 flex items-center gap-1.5"><User size={14}/> Bio</p>
                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">{studentProfile.bio}</p>
                </div>
              )}

            </div>

            {/* Right Column: Resume Viewer */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white border border-neutral-200 rounded-[14px] p-6 shadow-sm h-full flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                  <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.6px] flex items-center gap-1.5">
                    <FileText size={14} /> Resume Document
                  </p>
                  {application.resumeUrl && (
                    <a href={application.resumeUrl} target="_blank" rel="noreferrer"
                       className="flex items-center gap-1.5 text-xs font-bold text-primary-500 bg-primary-50 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors">
                      <LinkIcon size={12}/> Open full screen
                    </a>
                  )}
                </div>

                {application.resumeUrl ? (
                  <iframe src={`${application.resumeUrl}#view=FitH`} className="pdf-frame flex-1" title="Resume" />
                ) : (
                  <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-[14px] bg-neutral-50 text-neutral-400">
                    <FileText size={48} className="mb-4 opacity-50" />
                    <p className="font-bold text-sm">No resume attached</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
