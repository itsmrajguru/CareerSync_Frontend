import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, MapPin, Briefcase, Users, Calendar, CheckCircle2,
  Sparkles, RefreshCw, MessageSquare, ThumbsUp, Share2,
  Bookmark, BookmarkCheck, X, Trash2, ArrowUpRight
} from "lucide-react";
import PageLayout from "../../components/PageLayout";
import { getAllCompanies, followCompany, unfollowCompany } from "../../services/companyProfileService";
import { getFeed, likePost, unlikePost, commentOnPost, deleteComment, savePost, unsavePost } from "../../services/companyPostsService";

export default function CompaniesDiscoveryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("explore"); // explore or feed

  // Explore Companies States
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [hiringFilter, setHiringFilter] = useState("");
  const [industries, setIndustries] = useState([]);
  const [locations, setLocations] = useState([]);

  // Feed States
  const [feedPosts, setFeedPosts] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedSort, setFeedSort] = useState("trending"); // trending, latest, likes, comments
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (activeTab === "explore") {
      fetchCompaniesList();
    } else {
      fetchFeedPosts();
    }
  }, [activeTab, industryFilter, locationFilter, sizeFilter, hiringFilter, feedSort]);

  // fetch companies list
  async function fetchCompaniesList() {
    setLoading(true);
    try {
      const params = {
        search: searchQuery,
        industry: industryFilter,
        location: locationFilter,
        companySize: sizeFilter,
        hiringStatus: hiringFilter
      };
      const res = await getAllCompanies(params);
      if (res.success) {
        setCompanies(res.companies || []);
        if (industries.length === 0) {
          const inds = new Set(res.companies.map(c => c.industry).filter(Boolean));
          setIndustries(Array.from(inds));
        }
        if (locations.length === 0) {
          const locs = new Set(res.companies.map(c => c.location).filter(Boolean));
          setLocations(Array.from(locs));
        }
      }
    } catch (e) {
      console.error("Fetch Companies Error:", e);
    } finally {
      setLoading(false);
    }
  }

  // fetch student home feed posts
  async function fetchFeedPosts() {
    setFeedLoading(true);
    try {
      const res = await getFeed(feedSort);
      if (res.success) {
        setFeedPosts(res.posts || []);
      }
    } catch (e) {
      console.error("Fetch feed posts error:", e);
    } finally {
      setFeedLoading(false);
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCompaniesList();
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setIndustryFilter("");
    setLocationFilter("");
    setSizeFilter("");
    setHiringFilter("");
  };

  // follow/unfollow toggle
  const handleFollowToggle = async (e, companyId, isFollowingNow) => {
    e.stopPropagation();
    try {
      const apiCall = isFollowingNow ? unfollowCompany : followCompany;
      const res = await apiCall(companyId);
      if (res.success) {
        // update companies list state
        setCompanies(prev => prev.map(c => {
          if (c._id === companyId) {
            return {
              ...c,
              isFollowing: !isFollowingNow,
              followersCount: isFollowingNow ? Math.max(0, c.followersCount - 1) : (c.followersCount || 0) + 1
            };
          }
          return c;
        }));
        
        // update feed posts state (toggle follow on all posts from this company)
        setFeedPosts(prev => prev.map(post => {
          if (post.company?._id === companyId) {
            return {
              ...post,
              company: {
                ...post.company,
                isFollowing: !isFollowingNow
              }
            };
          }
          return post;
        }));
      }
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  // like post
  const handleLikePost = async (post) => {
    const isLiked = post.likes.includes(currentUser.id);
    try {
      const res = isLiked ? await unlikePost(post._id) : await likePost(post._id);
      if (res.success) {
        setFeedPosts(prev => prev.map(p => {
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

  // save post
  const handleSavePost = async (post) => {
    const isSaved = post.saves?.includes(currentUser.id);
    try {
      const apiCall = isSaved ? unsavePost : savePost;
      const res = await apiCall(post._id);
      if (res.success) {
        setFeedPosts(prev => prev.map(p => {
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

  // share post link copy
  const handleSharePost = (post) => {
    const url = `${window.location.origin}/student/companies/${post.company?._id}?tab=feed&post=${post._id}`;
    navigator.clipboard.writeText(url);
    setShareMessage("Post link copied to clipboard!");
    setTimeout(() => setShareMessage(""), 2000);
  };

  // add comment on post
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedPost) return;

    try {
      const res = await commentOnPost(selectedPost._id, commentText);
      if (res.success) {
        setFeedPosts(prev => prev.map(p => {
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

  // delete comment
  const handleDeleteComment = async (commentId) => {
    if (!selectedPost) return;
    try {
      const res = await deleteComment(selectedPost._id, commentId);
      if (res.success) {
        setFeedPosts(prev => prev.map(p => {
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

  return (
    <PageLayout>
      <div className="pb-20 animate-fade-in relative">
        {/* share feedback toast */}
        {shareMessage && (
          <div className="fixed bottom-5 right-5 bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg z-50 animate-bounce">
            {shareMessage}
          </div>
        )}

        {/* page hero section */}
        <section aria-label="Page header" className="mb-8 pt-4">
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px]">
            <div style={{ flex: 1 }}>
              <p className="cs-section-label">Ecosystem</p>
              <h1 className="cs-page-title">
                Companies Discovery<br />
                <span className="text-[#ef4444]">& Engagement Feed.</span>
              </h1>
              <p className="cs-subtext max-w-[480px]">
                Explore workspaces, follow company updates, engage with feeds, and apply directly to their hiring opportunities.
              </p>
            </div>
            <div className="hidden lg:block animate-fade-in" style={{ flexShrink: 0, width: "320px" }}>
              <div className="rounded-xl overflow-hidden border border-neutral-200 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80&auto=format&fit=crop"
                  alt="Corporate buildings"
                  style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* tab navigation */}
        <div className="border-b border-neutral-200 mb-8 flex gap-8">
          {[
            { id: "explore", label: "Explore Companies" },
            { id: "feed", label: "Home Feed (Social Updates)" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-bold border-b-2 transition-all cursor-pointer uppercase tracking-wider ${
                activeTab === tab.id
                  ? "border-black text-black font-extrabold"
                  : "border-transparent text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* EXPLORE COMPANIES VIEW */}
        {activeTab === "explore" && (
          <>
            {/* search and filter panel */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 mb-8 shadow-sm">
              <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by company name, industry or location..."
                    className="cs-input !pl-11 w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-6 py-2.5 bg-black text-white font-bold text-sm rounded-xl hover:bg-neutral-800 transition-colors uppercase tracking-wider">
                    Search
                  </button>
                  <button type="button" onClick={handleResetFilters} className="px-4 py-2.5 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
                    <RefreshCw size={14} />
                  </button>
                </div>
              </form>

              {/* filter dropdowns */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1 tracking-wider">Industry</label>
                  <select
                    value={industryFilter}
                    onChange={e => setIndustryFilter(e.target.value)}
                    className="cs-input !py-2 text-xs w-full bg-white border border-neutral-200 rounded-lg focus:outline-none"
                  >
                    <option value="">All Industries</option>
                    {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    <option value="Software">Software</option>
                    <option value="Banking">Banking</option>
                    <option value="Fintech">Fintech</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1 tracking-wider">Location</label>
                  <select
                    value={locationFilter}
                    onChange={e => setLocationFilter(e.target.value)}
                    className="cs-input !py-2 text-xs w-full bg-white border border-neutral-200 rounded-lg focus:outline-none"
                  >
                    <option value="">All Locations</option>
                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1 tracking-wider">Size</label>
                  <select
                    value={sizeFilter}
                    onChange={e => setSizeFilter(e.target.value)}
                    className="cs-input !py-2 text-xs w-full bg-white border border-neutral-200 rounded-lg focus:outline-none"
                  >
                    <option value="">All Sizes</option>
                    <option value="1-50">1-50 Employees</option>
                    <option value="51-200">51-200 Employees</option>
                    <option value="201-1000">201-1000 Employees</option>
                    <option value="1000+">1000+ Employees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1 tracking-wider">Hiring Status</label>
                  <select
                    value={hiringFilter}
                    onChange={e => setHiringFilter(e.target.value)}
                    className="cs-input !py-2 text-xs w-full bg-white border border-neutral-200 rounded-lg focus:outline-none"
                  >
                    <option value="">All Statuses</option>
                    <option value="hiring">Hiring (Has open jobs)</option>
                    <option value="not-hiring">Not Hiring</option>
                  </select>
                </div>
              </div>
            </div>

            {/* results section */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-black mb-0.5">Explore Profiles</h2>
                <p className="text-xs text-neutral-400 font-semibold">{companies.length} company profile{companies.length !== 1 ? 's' : ''} found</p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-72 bg-neutral-50/50 rounded-3xl border border-neutral-100 animate-pulse" />
                ))}
              </div>
            ) : companies.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
                <Briefcase size={36} className="text-neutral-300 mx-auto mb-4" />
                <p className="font-bold text-black mb-2">No companies found</p>
                <p className="text-sm text-neutral-400 max-w-[300px] mx-auto">Try updating your filters or search keyword.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map(c => (
                  <div
                    key={c._id}
                    onClick={() => navigate(`/student/companies/${c._id}`)}
                    className="cs-card flex flex-col group h-full cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden p-6 bg-white rounded-[24px] border border-neutral-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-14 h-14 rounded-[14px] bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden p-1 shadow-sm relative">
                        {c.logo ? (
                          <img src={c.logo} alt={c.name} className="w-full h-full object-cover rounded-[10px]" />
                        ) : (
                          <Briefcase size={22} className="text-slate-400" />
                        )}
                      </div>
                      
                      <button
                        onClick={(e) => handleFollowToggle(e, c._id, c.isFollowing)}
                        className={`px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all uppercase tracking-wider ${
                          c.isFollowing 
                            ? "bg-slate-100 text-slate-500 hover:bg-slate-200" 
                            : "bg-black text-white hover:bg-neutral-800"
                        }`}
                      >
                        {c.isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>

                    <div className="mb-2">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-lg font-bold text-black leading-snug truncate max-w-[200px]">
                          {c.name || "Confidential Company"}
                        </h3>
                        {c.isVerified && (
                          <CheckCircle2 size={15} className="text-blue-500 fill-blue-500/10 flex-shrink-0" title="Verified Employer" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 font-semibold line-clamp-1 italic mt-0.5">
                        {c.tagline || "Innovating the digital horizon."}
                      </p>
                    </div>

                    <div className="space-y-2 mb-6 flex-1 text-sm text-neutral-500">
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-neutral-400" />
                        {c.location || "Location Private"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={13} className="text-neutral-400" />
                        {c.industry || "Industry Unspecified"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={13} className="text-neutral-400" />
                        {c.employeesCount || 0} Employees
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-neutral-400" />
                        Founded {c.foundedYear || 2020}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Jobs Available</span>
                        <span className={`text-[12px] font-black uppercase mt-0.5 ${c.openJobsCount > 0 ? "text-green-600" : "text-neutral-500"}`}>
                          {c.openJobsCount > 0 ? `${c.openJobsCount} Openings` : "No Openings"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-black uppercase tracking-wider group-hover:text-[#ef4444] transition-colors">
                        View Profile &rarr;
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* HOME FEED VIEW */}
        {activeTab === "feed" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* feed posts */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Feed sorting filter bar */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-3 shadow-sm">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Sort feed updates</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "trending", label: "Trending" },
                    { id: "latest", label: "Latest" },
                    { id: "likes", label: "Most Liked" },
                    { id: "comments", label: "Most Discussed" }
                  ].map(sortOpt => (
                    <button
                      key={sortOpt.id}
                      onClick={() => setFeedSort(sortOpt.id)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                        feedSort === sortOpt.id
                          ? "bg-black text-white"
                          : "bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100 hover:text-slate-600"
                      }`}
                    >
                      {sortOpt.label}
                    </button>
                  ))}
                </div>
              </div>

              {feedLoading ? (
                <div className="space-y-6">
                  {[1, 2].map(n => (
                    <div key={n} className="h-64 bg-neutral-50/50 border border-neutral-100 rounded-3xl animate-pulse" />
                  ))}
                </div>
              ) : feedPosts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
                  <MessageSquare size={36} className="text-neutral-300 mx-auto mb-4" />
                  <p className="font-bold text-black mb-1">Your feed is empty</p>
                  <p className="text-sm text-neutral-400 max-w-[280px] mx-auto">Follow more companies on the explore tab to see updates here.</p>
                </div>
              ) : (
                feedPosts.map(post => {
                  const isFollowing = post.company?.isFollowing;
                  const isLiked = post.likes?.includes(currentUser.id);
                  const isSaved = post.saves?.includes(currentUser.id);
                  return (
                    <div key={post._id} className="bg-white border border-neutral-200 rounded-[22px] p-6 shadow-sm flex flex-col">
                      
                      {/* post company details */}
                      <div className="flex items-center justify-between mb-4">
                        <div
                          onClick={() => navigate(`/student/companies/${post.company?._id}`)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden p-0.5">
                            {post.company?.logo ? (
                              <img src={post.company.logo} alt="" className="w-full h-full object-cover rounded-[8px]" />
                            ) : (
                              <Briefcase size={16} className="text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-sm text-black group-hover:underline">{post.company?.name}</span>
                              <span className="px-2 py-0.5 bg-neutral-100 rounded-md text-[9px] font-black text-neutral-500 uppercase tracking-widest">
                                {post.postType}
                              </span>
                            </div>
                            <span className="text-[10px] text-neutral-400 font-semibold block">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleFollowToggle(e, post.company?._id, isFollowing)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            isFollowing
                              ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                              : "bg-black text-white hover:bg-neutral-800"
                          }`}
                        >
                          {isFollowing ? "Following" : "Follow"}
                        </button>
                      </div>

                      {/* post content */}
                      <h4 className="font-extrabold text-base text-black mb-1.5 leading-snug">{post.title}</h4>
                      <p className="text-sm text-neutral-500 font-medium leading-relaxed mb-4 whitespace-pre-line">{post.description}</p>

                      {/* post media */}
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
                          Learn More &rarr;
                        </a>
                      )}

                      {/* post actions */}
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

            {/* sidebar widget: recommended companies */}
            <div className="space-y-6">
              <div className="bg-white border border-neutral-200 p-6 rounded-[22px] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Top Hiring Companies</span>
                </div>
                <div className="space-y-4">
                  {companies.slice(0, 4).map(comp => (
                    <div
                      key={comp._id}
                      onClick={() => navigate(`/student/companies/${comp._id}`)}
                      className="flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden p-0.5">
                          {comp.logo ? (
                            <img src={comp.logo} alt="" className="w-full h-full object-cover rounded-[6px]" />
                          ) : (
                            <Briefcase size={14} className="text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-extrabold text-xs text-black block truncate group-hover:underline">{comp.name}</span>
                          <span className="text-[9px] text-[#475569] font-bold">{comp.industry || "Software"}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full">
                        {comp.openJobsCount || 0} Jobs
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* COMMENTS MODAL */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white border border-neutral-200 rounded-[28px] w-full max-w-[500px] flex flex-col max-h-[85vh] shadow-2xl relative animate-scale-up">
              
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-black text-base">Comments</h3>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{selectedPost.comments?.length || 0} responses</span>
                </div>
                <button onClick={() => setSelectedPost(null)} className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <X size={15} />
                </button>
              </div>

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
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

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
