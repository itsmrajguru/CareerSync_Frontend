import { useEffect, useState } from "react";
import {
  Sparkles, MessageSquare, ThumbsUp, Trash2, Edit3, Plus,
  X, BarChart2, Eye, Users, FileText, ArrowUpRight, Link2
} from "lucide-react";
import PageLayout from "../../components/PageLayout";
import { getCompanyProfile } from "../../services/companyProfileService";
import { getPostsByCompany, createPost, updatePost, deletePost } from "../../services/companyPostsService";
import { getMyJobs } from "../../services/jobsService";

export default function CompanyPostManagement() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState("Announcement");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [externalLink, setExternalLink] = useState("");
  
  // Analytics state
  const [analytics, setAnalytics] = useState({
    profileViews: 0,
    followers: 0,
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    totalReach: 0,
    applicationsGenerated: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  // fetch company profile, posts, and jobs
  async function fetchData() {
    setLoading(true);
    try {
      const [profRes, postsRes, jobsRes] = await Promise.all([
        getCompanyProfile(),
        getPostsByCompany("me").catch(() => ({ success: false })), // backend can resolve 'me' or we pass profile ID after getting it
        getMyJobs().catch(() => ({ success: false }))
      ]);

      let companyProfile = null;
      let companyPosts = [];
      let companyJobs = [];

      if (profRes.success) {
        companyProfile = profRes.company;
        setProfile(companyProfile);
      }

      // if backend needs exact company ID for posts, we fetch using that ID
      if (companyProfile) {
        const exactPostsRes = await getPostsByCompany(companyProfile._id);
        if (exactPostsRes.success) {
          companyPosts = exactPostsRes.posts || [];
          setPosts(companyPosts);
        }
      }

      if (jobsRes.success) {
        companyJobs = jobsRes.jobs || [];
        setJobs(companyJobs);
      }

      // calculate analytics
      const totalLikes = companyPosts.reduce((sum, p) => sum + (p.likes ? p.likes.length : 0), 0);
      const totalComments = companyPosts.reduce((sum, p) => sum + (p.comments ? p.comments.length : 0), 0);
      const totalReach = companyPosts.reduce((sum, p) => sum + (p.reach || 0), 0);
      const applicationsGenerated = companyJobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);

      setAnalytics({
        profileViews: companyProfile?.views || 0,
        followers: companyProfile?.followersCount || 0,
        totalPosts: companyPosts.length,
        totalLikes,
        totalComments,
        totalReach,
        applicationsGenerated
      });

    } catch (e) {
      console.error("Fetch data error:", e);
    } finally {
      setLoading(false);
    }
  }

  // open modal for create
  const handleOpenCreate = () => {
    setEditingPost(null);
    setTitle("");
    setDescription("");
    setPostType("Announcement");
    setImage("");
    setVideo("");
    setExternalLink("");
    setShowModal(true);
  };

  // open modal for edit
  const handleOpenEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setDescription(post.description);
    setPostType(post.postType);
    setImage(post.image || "");
    setVideo(post.video || "");
    setExternalLink(post.externalLink || "");
    setShowModal(true);
  };

  // submit post (create or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const payload = { title, description, postType, image, video, externalLink };
    try {
      if (editingPost) {
        const res = await updatePost(editingPost._id, payload);
        if (res.success) {
          setPosts(prev => prev.map(p => p._id === editingPost._id ? { ...p, ...payload } : p));
        }
      } else {
        const res = await createPost(payload);
        if (res.success) {
          setPosts(prev => [res.post, ...prev]);
        }
      }
      setShowModal(false);
      // update analytics counts
      setTimeout(fetchData, 500);
    } catch (err) {
      console.error("Submit post error:", err);
    }
  };

  // delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this update?")) return;
    try {
      const res = await deletePost(postId);
      if (res.success) {
        setPosts(prev => prev.filter(p => p._id !== postId));
        setTimeout(fetchData, 500);
      }
    } catch (err) {
      console.error("Delete post error:", err);
    }
  };

  return (
    <PageLayout>
      <div className="pb-20 animate-fade-in">
        
        {/* page hero header */}
        <section aria-label="Page header" className="mb-8 pt-4">
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px] justify-between">
            <div>
              <p className="cs-section-label">Recruiter Feed</p>
              <h1 className="cs-page-title">
                Social Updates<br />
                <span className="text-[#ef4444]">& Engagement.</span>
              </h1>
              <p className="cs-subtext max-w-[480px]">
                Create posts, share announcements, webinars, achievements, and track recruiting analytics directly.
              </p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-8 py-3.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors uppercase tracking-wider shadow-md"
            >
              <Plus size={14} /> New Post
            </button>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ANALYTICS SECTION */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Profile Views", value: analytics.profileViews, icon: <Eye size={16} />, color: "#3b82f6" },
                { label: "Followers", value: analytics.followers, icon: <Users size={16} />, color: "#8b5cf6" },
                { label: "Post Engagement", value: analytics.totalLikes + analytics.totalComments, icon: <MessageSquare size={16} />, color: "#ef4444" },
                { label: "Applications Generated", value: analytics.applicationsGenerated, icon: <FileText size={16} />, color: "#10b981" }
              ].map((stat, i) => (
                <div key={i} className="cs-card-modern p-5 bg-white border border-neutral-200 rounded-[20px] shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{stat.label}</span>
                    <div style={{ color: stat.color }} className="opacity-80">{stat.icon}</div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-black">{stat.value}</span>
                    <span className="text-[10px] text-green-500 font-bold flex items-center"><ArrowUpRight size={10} /> Live</span>
                  </div>
                </div>
              ))}
            </div>

            {/* FEED POSTS GRID */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-black mb-1">Your Published Updates</h2>
              <p className="text-xs text-neutral-400 font-semibold">{posts.length} update{posts.length !== 1 ? 's' : ''} published</p>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
                <Sparkles size={36} className="text-neutral-300 mx-auto mb-4" />
                <p className="font-bold text-black mb-2">No posts published yet</p>
                <p className="text-sm text-neutral-400 max-w-[280px] mx-auto mb-6">Create your first social update to engage with students looking for work.</p>
                <button onClick={handleOpenCreate} className="px-6 py-2.5 bg-black text-white font-bold text-xs rounded-xl hover:bg-neutral-800 transition-colors uppercase tracking-wider">
                  Post an Update
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map(post => (
                  <div key={post._id} className="bg-white border border-neutral-200 rounded-[24px] p-6 shadow-sm flex flex-col relative group">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        {post.postType}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="p-2 border border-neutral-100 rounded-xl text-neutral-500 hover:text-black hover:bg-neutral-50 transition-all shadow-sm"
                          title="Edit Post"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="p-2 border border-red-50 text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                          title="Delete Post"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-base text-black mb-1.5 leading-snug line-clamp-1">{post.title}</h3>
                    <p className="text-xs text-neutral-500 font-semibold leading-relaxed mb-4 line-clamp-3">{post.description}</p>
                    
                    {/* optional media preview icons */}
                    <div className="flex gap-4 mb-5 text-[10px] text-neutral-400 font-bold mt-auto pt-4 border-t border-neutral-50">
                      {post.image && <span className="flex items-center gap-1">🖼 Image Included</span>}
                      {post.video && <span className="flex items-center gap-1">🎥 Video Included</span>}
                      {post.externalLink && <span className="flex items-center gap-1"><Link2 size={12} /> External Link</span>}
                    </div>

                    {/* analytics engagement */}
                    <div className="flex gap-6 text-[11px] font-extrabold text-[#475569] uppercase tracking-wider">
                      <span className="flex items-center gap-1"><ThumbsUp size={13} /> {post.likes?.length || 0} Likes</span>
                      <span className="flex items-center gap-1"><MessageSquare size={13} /> {post.comments?.length || 0} Comments</span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* CREATE / EDIT MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white border border-neutral-200 rounded-[28px] w-full max-w-[550px] flex flex-col max-h-[90vh] shadow-2xl relative animate-scale-up">
              
              {/* modal header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                <h3 className="font-extrabold text-black text-base">{editingPost ? "Edit Feed Update" : "Publish Feed Update"}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <X size={15} />
                </button>
              </div>

              {/* modal body */}
              <form onSubmit={handleSubmit} className="flex flex-col min-h-0 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-4 no-scrollbar flex-1">
                  
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1 tracking-wider">Post Type</label>
                    <select
                      value={postType}
                      onChange={e => setPostType(e.target.value)}
                      className="cs-input w-full bg-white border border-neutral-200 rounded-lg text-xs py-2 focus:outline-none"
                    >
                      {['Announcement', 'Hiring Update', 'Product Launch', 'Achievement', 'Event', 'Webinar', 'Internship Drive', 'Funding News'].map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1 tracking-wider">Title</label>
                    <input
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Enter short update title..."
                      className="cs-input w-full text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1 tracking-wider">Description</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Write detailed post description here..."
                      className="cs-input w-full text-xs h-32 focus:outline-none py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1 tracking-wider">Image URL (Optional)</label>
                    <input
                      value={image}
                      onChange={e => setImage(e.target.value)}
                      placeholder="Enter image URL..."
                      className="cs-input w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1 tracking-wider">Video URL (Optional)</label>
                    <input
                      value={video}
                      onChange={e => setVideo(e.target.value)}
                      placeholder="Enter video URL..."
                      className="cs-input w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1 tracking-wider">External Link (Optional)</label>
                    <input
                      value={externalLink}
                      onChange={e => setExternalLink(e.target.value)}
                      placeholder="Enter external reference link..."
                      className="cs-input w-full text-xs"
                    />
                  </div>
                </div>

                {/* footer actions */}
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0 bg-white rounded-b-[28px]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-black text-white font-extrabold text-xs rounded-xl hover:bg-neutral-800 uppercase tracking-wider transition-colors"
                  >
                    {editingPost ? "Save Changes" : "Publish Post"}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </PageLayout>
  );
}
