import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin, Briefcase, Users, Calendar, CheckCircle2,
  Globe, Linkedin, Twitter, Sparkles, MessageSquare,
  ThumbsUp, Share2, Bookmark, BookmarkCheck, Heart, Trash2, X
} from "lucide-react";
import PageLayout from "../../components/PageLayout";
import { getCompanyById, getCompanyJobs, followCompany, unfollowCompany } from "../../services/companyProfileService";
import { getPostsByCompany, likePost, unlikePost, commentOnPost, deleteComment, savePost, unsavePost } from "../../services/companyPostsService";
import { toggleSaveJob, getSavedJobs } from "../../services/jobsService";

export default function StudentCompanyProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  
  /* the state for feed and jobs lists */
  const [posts, setPosts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  
  /* modal states for handling comments */
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  useEffect(() => {
    if (activeTab === "feed") {
      fetchCompanyFeed();
    } else if (activeTab === "jobs") {
      fetchJobsList();
    }
  }, [activeTab]);

  /* function to fetch the main profile */
  async function fetchProfileData() {
    setLoading(true);
    try {
      const res = await getCompanyById(id);
      if (res.success) {
        setCompany(res.company);
      }
    } catch (e) {
      console.error("Fetch profile details error:", e);
    } finally {
      setLoading(false);
    }
  }

  /* fetching the feed posts of the company */
  async function fetchCompanyFeed() {
    try {
      const res = await getPostsByCompany(id);
      if (res.success) {
        setPosts(res.posts || []);
      }
    } catch (e) {
      console.error("Fetch feed error:", e);
    }
  }

  /* fetching all the jobs and saved jobs */
  async function fetchJobsList() {
    try {
      const [jobsRes, savedRes] = await Promise.all([
        getCompanyJobs(id),
        getSavedJobs()
      ]);
      if (jobsRes.success) setJobs(jobsRes.jobs || []);
      if (savedRes.success) {
        const ids = new Set(savedRes.savedJobs.map(j => j._id));
        setSavedJobIds(ids);
      }
    } catch (e) {
      console.error("Fetch jobs error:", e);
    }
  }

  /* toggling the follow status */
  const handleFollow = async () => {
    if (!company) return;
    const isFollowing = company.isFollowing;
    try {
      const apiCall = isFollowing ? unfollowCompany : followCompany;
      const res = await apiCall(company._id);
      if (res.success) {
        setCompany(prev => ({
          ...prev,
          isFollowing: !isFollowing,
          followersCount: isFollowing ? Math.max(0, prev.followersCount - 1) : (prev.followersCount || 0) + 1
        }));
      }
    } catch (e) {
      console.error("Follow error:", e);
    }
  };

  /* toggling the like status for a post */
  const handleLikePost = async (post) => {
    const isLiked = post.likes.includes(currentUser.id);
    try {
      const res = isLiked ? await unlikePost(post._id) : await likePost(post._id);
      if (res.success) {
        setPosts(prev => prev.map(p => {
          if (p._id === post._id) {
            return {
              ...p,
              likes: isLiked ? p.likes.filter(id => id !== currentUser.id) : [...p.likes, currentUser.id]
            };
          }
          return p;
        }));
      }
    } catch (e) {
      console.error("Like error:", e);
    }
  };

  /* toggling the save post feature */
  const handleSavePost = async (post) => {
    const isSaved = post.saves?.includes(currentUser.id);
    try {
      const apiCall = isSaved ? unsavePost : savePost;
      const res = await apiCall(post._id);
      if (res.success) {
        setPosts(prev => prev.map(p => {
          if (p._id === post._id) {
            return {
              ...p,
              saves: isSaved ? p.saves.filter(id => id !== currentUser.id) : [...(p.saves || []), currentUser.id]
            };
          }
          return p;
        }));
      }
    } catch (e) {
      console.error("Save post error:", e);
    }
  };

  /* copying the share post link to clipboard */
  const handleSharePost = (post) => {
    const url = `${window.location.origin}/student/companies/${id}?tab=feed&post=${post._id}`;
    navigator.clipboard.writeText(url);
    setShareMessage("Post link copied to clipboard!");
    setTimeout(() => setShareMessage(""), 2000);
  };

  /* adding a new comment */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedPost) return;

    try {
      const res = await commentOnPost(selectedPost._id, commentText);
      if (res.success) {
        setPosts(prev => prev.map(p => {
          if (p._id === selectedPost._id) {
            return { ...p, comments: res.comments };
          }
          return p;
        }));
        setSelectedPost(prev => ({ ...prev, comments: res.comments }));
        setCommentText("");
      }
    } catch (e) {
      console.error("Comment error:", e);
    }
  };

  /* deleting an existing comment */
  const handleDeleteComment = async (commentId) => {
    if (!selectedPost) return;
    try {
      const res = await deleteComment(selectedPost._id, commentId);
      if (res.success) {
        setPosts(prev => prev.map(p => {
          if (p._id === selectedPost._id) {
            return { ...p, comments: res.comments };
          }
          return p;
        }));
        setSelectedPost(prev => ({ ...prev, comments: res.comments }));
      }
    } catch (e) {
      console.error("Delete comment error:", e);
    }
  };

  /* toggle save job functionality */
  const handleSaveJob = async (jobId) => {
    try {
      const res = await toggleSaveJob(jobId);
      if (res.success) {
        setSavedJobIds(prev => {
          const next = new Set(prev);
          if (next.has(jobId)) next.delete(jobId);
          else next.add(jobId);
          return next;
        });
      }
    } catch (e) {
      console.error("Save job error:", e);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-96">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (!company) {
    return (
      <PageLayout>
        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
          <p className="font-bold text-black text-lg mb-2">Company profile not found</p>
          <button onClick={() => navigate("/student/companies")} className="btn-primary !px-6 !py-2.5">
            Back to Companies
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="pb-20 animate-fade-in relative">
        {/* share feedback toast */}
        {shareMessage && (
          <div className="fixed bottom-5 right-5 bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg z-50 animate-bounce">
            {shareMessage}
          </div>
        )}

        {/* header banner */}
        <div className="h-44 md:h-52 bg-gradient-to-r from-slate-100 to-slate-200 border-b border-neutral-200 rounded-[28px] relative overflow-hidden mb-6 shadow-sm">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        </div>

        {/* profile main header */}
        <div className="px-6 md:px-10 relative -mt-20 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-5">
            {/* Logo */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-[24px] bg-white border border-neutral-200 flex items-center justify-center p-2 shadow-md relative overflow-hidden flex-shrink-0">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-[16px]" />
              ) : (
                <Briefcase size={40} className="text-slate-400" />
              )}
            </div>
            
            {/* title & metadata */}
            <div className="min-w-0 pb-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-extrabold text-black leading-none">{company.name}</h1>
                {company.isVerified && (
                  <CheckCircle2 size={18} className="text-blue-500 fill-blue-500/10 flex-shrink-0" title="Verified Employer" />
                )}
              </div>
              
              <p className="text-sm text-[#475569] font-bold mb-3 italic">{company.tagline || "Innovating the future, today."}</p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-400 font-bold">
                <span className="flex items-center gap-1"><MapPin size={13} /> {company.location || "Remote"}</span>
                <span className="flex items-center gap-1"><Briefcase size={13} /> {company.industry || "Software"}</span>
                <span className="flex items-center gap-1"><Users size={13} /> {company.followersCount || 0} Followers</span>
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleFollow}
              className={`px-8 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                company.isFollowing 
                  ? "bg-slate-100 text-slate-500 hover:bg-slate-200" 
                  : "bg-black text-white hover:bg-neutral-800"
              }`}
            >
              {company.isFollowing ? "Following" : "Follow"}
            </button>
            
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-neutral-200 text-neutral-600 hover:text-black rounded-xl shadow-sm transition-colors" title="Visit Website">
                <Globe size={18} />
              </a>
            )}
            {company.linkedIn && (
              <a href={company.linkedIn} target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-neutral-200 text-neutral-600 hover:text-blue-600 rounded-xl shadow-sm transition-colors" title="LinkedIn">
                <Linkedin size={18} />
              </a>
            )}
            {company.twitter && (
              <a href={company.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-neutral-200 text-neutral-600 hover:text-sky-500 rounded-xl shadow-sm transition-colors" title="Twitter">
                <Twitter size={18} />
              </a>
            )}
          </div>
        </div>

        {/* tabs bar */}
        <div className="border-b border-neutral-200 mb-8 flex overflow-x-auto gap-8 no-scrollbar">
          {[
            { id: "about", label: "About" },
            { id: "culture", label: "Culture" },
            { id: "products", label: "Products" },
            { id: "feed", label: "Feed & Updates" },
            { id: "jobs", label: `Jobs (${company.openJobsCount || 0})` },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-4 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider ${
                activeTab === t.id 
                  ? "border-black text-black font-extrabold" 
                  : "border-transparent text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* tab content */}
        <div>
          {/* ABOUT TAB */}
          {activeTab === "about" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-black mb-3">About the Company</h3>
                  <p className="text-sm text-neutral-500 font-medium leading-relaxed bg-white border border-neutral-200 p-6 rounded-2xl">
                    {company.about || "No description provided."}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white border border-neutral-200 p-6 rounded-2xl">
                    <h4 className="text-sm font-extrabold uppercase tracking-wider text-black mb-2">Our Mission</h4>
                    <p className="text-xs text-neutral-500 font-medium leading-relaxed">{company.mission || "Striving to build innovative, efficient workflows."}</p>
                  </div>
                  <div className="bg-white border border-neutral-200 p-6 rounded-2xl">
                    <h4 className="text-sm font-extrabold uppercase tracking-wider text-black mb-2">Our Vision</h4>
                    <p className="text-xs text-neutral-500 font-medium leading-relaxed">{company.vision || "Empowering people with the technology of tomorrow."}</p>
                  </div>
                </div>
              </div>

              {/* stats sidebar */}
              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 p-6 rounded-[20px] shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Quick Facts</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Founded</span>
                      <span className="text-sm font-bold text-black">{company.foundedYear || 2020}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Company Size</span>
                      <span className="text-sm font-bold text-black">{company.employeesCount || 0} Employees</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Profile Views</span>
                      <span className="text-sm font-bold text-black">{company.views || 0} Views</span>
                    </div>
                  </div>
                </div>

                {company.values && company.values.length > 0 && (
                  <div className="bg-white border border-neutral-200 p-6 rounded-[20px] shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">Core Values</h3>
                    <div className="flex flex-wrap gap-2">
                      {company.values.map(val => (
                        <span key={val} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CULTURE TAB */}
          {activeTab === "culture" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-neutral-200 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-black mb-3">Work Culture</h3>
                  <p className="text-sm text-neutral-500 font-medium leading-relaxed">{company.workCulture || "Our work environment is built around collaboration, transparency, and high performance. We value ideas and encourage teams to take ownership of tasks."}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white border border-neutral-200 p-6 rounded-2xl">
                    <h4 className="text-sm font-extrabold uppercase tracking-wider text-black mb-2">Learning & Growth</h4>
                    <p className="text-xs text-neutral-500 font-medium leading-relaxed">{company.learningOpportunities || "Dedicated budgets for certifications, weekly learning syncs, and mentorship programs."}</p>
                  </div>
                  <div className="bg-white border border-neutral-200 p-6 rounded-2xl">
                    <h4 className="text-sm font-extrabold uppercase tracking-wider text-black mb-2">Growth Paths</h4>
                    <p className="text-xs text-neutral-500 font-medium leading-relaxed">{company.growthOpportunities || "Structured career paths, bi-annual reviews, and direct leadership opportunities."}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 p-6 rounded-[20px] shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">Remote Policy</h3>
                  <span className="inline-block px-3 py-1 bg-green-50 border border-green-200 rounded-lg text-xs font-bold text-green-700 uppercase tracking-widest">
                    {company.remotePolicy || "Hybrid"}
                  </span>
                </div>

                {company.benefits && company.benefits.length > 0 && (
                  <div className="bg-white border border-neutral-200 p-6 rounded-[20px] shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">Benefits & Perks</h3>
                    <div className="space-y-2">
                      {company.benefits.map(b => (
                        <div key={b} className="flex items-center gap-2 text-sm text-neutral-500 font-semibold">
                          <CheckCircle2 size={14} className="text-green-500" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === "products" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {company.mainProducts && company.mainProducts.length > 0 && (
                  <div className="bg-white border border-neutral-200 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-black mb-3">Main Products</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {company.mainProducts.map(prod => (
                        <div key={prod} className="border border-slate-100 p-4 rounded-xl bg-slate-50/50">
                          <span className="font-extrabold text-sm text-black mb-1 block">{prod}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {company.services && company.services.length > 0 && (
                  <div className="bg-white border border-neutral-200 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-black mb-3">Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {company.services.map(ser => (
                        <span key={ser} className="px-3 py-1.5 bg-neutral-100 rounded-lg text-xs font-bold text-black">
                          {ser}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {company.technologiesUsed && company.technologiesUsed.length > 0 && (
                  <div className="bg-white border border-neutral-200 p-6 rounded-[20px] shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {company.technologiesUsed.map(t => (
                        <span key={t} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {company.marketsServed && company.marketsServed.length > 0 && (
                  <div className="bg-white border border-neutral-200 p-6 rounded-[20px] shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">Markets Served</h3>
                    <div className="flex flex-wrap gap-2">
                      {company.marketsServed.map(m => (
                        <span key={m} className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FEED TAB */}
          {activeTab === "feed" && (
            <div className="max-w-[650px] mx-auto space-y-6">
              {posts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200">
                  <MessageSquare size={32} className="text-neutral-300 mx-auto mb-3" />
                  <p className="font-bold text-black text-sm mb-1">No updates posted yet</p>
                  <p className="text-xs text-neutral-400">Updates posted by the company will appear here.</p>
                </div>
              ) : (
                posts.map(post => {
                  const isLiked = post.likes?.includes(currentUser.id);
                  const isSaved = post.saves?.includes(currentUser.id);
                  return (
                    <div key={post._id} className="bg-white border border-neutral-200 rounded-[22px] p-6 shadow-sm flex flex-col">
                      
                      {/* post header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden p-0.5">
                          {company.logo ? (
                            <img src={company.logo} alt="" className="w-full h-full object-cover rounded-[8px]" />
                          ) : (
                            <Briefcase size={16} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm text-black">{company.name}</span>
                            <span className="px-2 py-0.5 bg-neutral-100 rounded-md text-[9px] font-black text-neutral-500 uppercase tracking-widest">
                              {post.postType}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-semibold">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* post body */}
                      <h4 className="font-extrabold text-base text-black mb-1.5 leading-snug">{post.title}</h4>
                      <p className="text-sm text-neutral-500 font-medium leading-relaxed mb-4 whitespace-pre-line">{post.description}</p>
                      
                      {/* optional media */}
                      {post.image && (
                        <div className="rounded-xl overflow-hidden border border-neutral-150 mb-4 max-h-[300px]">
                          <img src={post.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      
                      {post.video && (
                        <div className="rounded-xl overflow-hidden border border-neutral-150 mb-4 max-h-[300px] bg-black flex items-center justify-center">
                          <video src={post.video} controls className="w-full max-h-[300px]" />
                        </div>
                      )}

                      {post.externalLink && (
                        <a href={post.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-600 hover:underline mb-4 flex items-center gap-1">
                          Learn More Link &rarr;
                        </a>
                      )}

                      {/* footer interactions bar */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                        
                        <button
                          onClick={() => handleLikePost(post)}
                          className={`flex items-center gap-1.5 hover:text-[#ef4444] transition-colors ${isLiked ? 'text-[#ef4444]' : ''}`}
                        >
                          <ThumbsUp size={15} fill={isLiked ? "currentColor" : "none"} />
                          <span>{post.likes?.length || 0} Likes</span>
                        </button>
                        
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="flex items-center gap-1.5 hover:text-black transition-colors"
                        >
                          <MessageSquare size={15} />
                          <span>{post.comments?.length || 0} Comments</span>
                        </button>

                        <button
                          onClick={() => handleSavePost(post)}
                          className={`flex items-center gap-1.5 hover:text-amber-500 transition-colors ${isSaved ? 'text-amber-500' : ''}`}
                        >
                          {isSaved ? <BookmarkCheck size={15} fill="currentColor" /> : <Bookmark size={15} />}
                          <span>Save</span>
                        </button>

                        <button
                          onClick={() => handleSharePost(post)}
                          className="flex items-center gap-1.5 hover:text-black transition-colors"
                        >
                          <Share2 size={15} />
                          <span>Share</span>
                        </button>
                        
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* JOBS TAB */}
          {activeTab === "jobs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-neutral-200">
                  <Briefcase size={32} className="text-neutral-300 mx-auto mb-3" />
                  <p className="font-bold text-black text-sm mb-1">No vacancies available</p>
                  <p className="text-xs text-neutral-400">This company has not posted any active openings.</p>
                </div>
              ) : (
                jobs.map(job => {
                  const isSaved = savedJobIds.has(job._id);
                  const isExpired = job.deadline && new Date() > new Date(job.deadline);
                  return (
                    <div
                      key={job._id}
                      onClick={() => !isExpired && navigate(`/student/jobs/${job._id}`)}
                      className={`cs-card flex flex-col group relative h-full p-5 bg-white border border-neutral-200 rounded-[20px] ${
                        isExpired ? 'opacity-40 pointer-events-none select-none' : 'cursor-pointer hover:shadow-sm'
                      }`}
                    >
                      {/* save icon bookmark */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSaveJob(job._id); }}
                        className={`absolute top-4 right-4 p-2 rounded-xl border transition-all ${
                          isSaved 
                            ? "bg-[#ef4444] border-[#ef4444] text-white shadow-sm" 
                            : "bg-white border-neutral-100 text-[#94a3b8] hover:text-[#ef4444] shadow-sm"
                        }`}
                      >
                        {isSaved ? <BookmarkCheck size={14} fill="currentColor" /> : <Bookmark size={14} />}
                      </button>

                      {/* Header details */}
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1">
                          {company.logo ? (
                            <img src={company.logo} alt="" className="w-full h-full object-cover rounded-[8px]" />
                          ) : (
                            <Briefcase size={16} className="text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{company.name}</span>
                          <h4 className="font-extrabold text-sm text-black truncate max-w-[150px]">{job.title}</h4>
                        </div>
                      </div>

                      {/* description preview */}
                      <p className="text-xs text-neutral-500 font-medium leading-relaxed line-clamp-2 mb-4">
                        {job.description?.replace(/<[^>]*>/g, "")}
                      </p>

                      {/* metadata chips */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-400 font-bold mb-5 flex-1">
                        <span className="flex items-center gap-1.5"><MapPin size={12} /> {job.location || "Remote"}</span>
                        <span className="flex items-center gap-1.5"><Briefcase size={12} /> {job.jobType || "Full-time"}</span>
                      </div>

                      {/* actions */}
                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between mt-auto">
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-wide">
                          {job.deadline ? `Due: ${new Date(job.deadline).toLocaleDateString()}` : "No deadline"}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/student/apply/${job._id}`); }}
                          className="px-5 py-2 bg-black text-white hover:bg-neutral-800 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors"
                        >
                          Apply Now
                        </button>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* COMMENTS MODAL */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white border border-neutral-200 rounded-[28px] w-full max-w-[500px] flex flex-col max-h-[85vh] shadow-2xl relative animate-scale-up">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-black text-base">Comments</h3>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{selectedPost.comments?.length || 0} responses</span>
                </div>
                <button onClick={() => setSelectedPost(null)} className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <X size={15} />
                </button>
              </div>

              {/* comments list */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 no-scrollbar min-h-[150px]">
                {selectedPost.comments?.length === 0 ? (
                  <p className="text-center text-xs text-neutral-400 py-10 font-bold italic">No comments yet. Start the conversation!</p>
                ) : (
                  selectedPost.comments?.map(comment => {
                    const isOwnComment = comment.user?._id === currentUser.id || comment.user === currentUser.id;
                    return (
                      <div key={comment._id} className="flex gap-3 bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-slate-200 font-black text-xs flex items-center justify-center text-slate-600 flex-shrink-0 uppercase">
                          {(comment.user?.username || "U")[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="font-bold text-xs text-black">{comment.user?.username || "User"}</span>
                            <span className="text-[9px] text-neutral-400 font-bold">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-neutral-500 font-semibold leading-normal">{comment.text}</p>
                        </div>
                        {isOwnComment && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg flex-shrink-0 transition-colors"
                            title="Delete Comment"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add Comment input form */}
              <form onSubmit={handleAddComment} className="p-4 border-t border-slate-100 flex gap-2">
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on this post..."
                  className="cs-input !py-2.5 !px-4 flex-1 text-xs w-full focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black text-white font-extrabold text-xs rounded-xl hover:bg-neutral-800 transition-colors uppercase tracking-wider"
                >
                  Send
                </button>
              </form>

            </div>
          </div>
        )}

      </div>
    </PageLayout>
  );
}
