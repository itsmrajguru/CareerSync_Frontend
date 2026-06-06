import { useState, useEffect, useRef } from "react";
import { Save, CheckCircle2, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import ProfileForm from "../../components/ProfileForm";
import { getProfileList, createProfile, updateProfile, deleteProfile } from "../../services/studentProfileService";
import { uploadAvatar } from "../../services/uploadService";

const emptyProfile = {
  full_name: "", domain: "", gender: "", location: "",
  birthday: "", website: "", github: "", linkedin: "",
  summary: "", work: "", education: "", skills: "",
};

/* Illustraion with Example
ex...Mangesh Rajguru Patil

.split()=['Mangesh','rajguru, 'patil']
.map(n[o])=['m','r,'p']
.join()=['mrp']
.toUpperCase()=['MRP']
.slice(0, 2)= ['MR']
*/

const getInitials = (name) =>
  name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";


/* Firstly we cheque whether the profile exists or not 
If the profile does not  Exists, simply priny 0 ,otherwsie
run Through the field And cheque how many fools are present
Then divide (filled/total*100)
This formula shows real time  profile completeness in %*/
const calcCompletion = (p) => {
  if (!p) return 0;
  const fields = ["full_name", "domain", "location", "summary", "work", "education", "skills", "github"];
  const filled = fields.filter(f => p[f]?.trim()).length;
  return Math.round((filled / fields.length) * 100);
};


/* The Profile Page function , that provides create,update,delete
and cancle functions */
export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(emptyProfile);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef(null);

  const navigate = useNavigate();

  /* fetch profile and if the profile exits,update/delete
  otherwise create->update/delete*/
  useEffect(() => {
    (async () => {
      try {
        const data = await getProfileList();
        if (data?.length) {
          setProfile(data[0]);
          setFormData(data[0]);
          /* restore existing avatar */
          if (data[0].avatar) setAvatarUrl(data[0].avatar);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    })();
  }, []);

  //mainHandler which is adding the data real time in the form
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* We are taking the formData.website  and adding 
  http:// to before the links */
  const processUrl = (url) =>
    url && !url.startsWith("http") ? `https://${url}` : url;

  // SAVE
  const handleSave = async () => {
    setLoading(true);
    try {
      /* This is the data That we are passing to the database
      As user profile d */
      const { user, _id, id, createdAt, updatedAt, __v, ...restData } = formData;
      const payload = {
        ...restData,
        /* We are updating the links with adding http://
        by calling processUrl function */
        website: processUrl(formData.website),
        github: processUrl(formData.github),
        linkedin: processUrl(formData.linkedin),
      };

      /* As we Saving the data They come
       from the user There could be two conditions Either we are updating the data Otherwise we are creating a new user So if the profile id exists that There is user whose id exists so we will update that id with this form Otherwise we will create a new Profile*/
      const result = profile?.id
        ? await updateProfile(profile.id, payload)
        : await createProfile(payload);

      setProfile(result);
      setFormData(result);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  //DeleteProfile Fuctionality
  const handleDelete = async () => {
    if (!window.confirm("Delete your profile?")) return;
    try {
      await deleteProfile(profile.id);
      setProfile(null);
      setFormData(emptyProfile);
    } catch (err) {
      alert("Failed to delete profile");
    }
  };

  //cancle Save the data
  const handleCancel = () => {
    setLoading(false);
    setFormData(profile || emptyProfile);
  };

  /* handle avatar file pick and upload to Cloudinary */
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const data = await uploadAvatar(file);
      setAvatarUrl(data.avatarUrl);
    } catch (err) {
      alert('Avatar upload failed. Please try again.');
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  /*the skills are saved as comman seperated in a array  */
  const skills = formData.skills?.split(",").map(s => s.trim()).filter(Boolean) || [];

  /*The percentage of formData added */
  const completion = calcCompletion(formData);

  /* Creating 2 character logo */
  const initials = getInitials(formData.full_name);

  return (
    <PageLayout>
      <div className="pb-20 animate-fade-in">

          {/* avatar upload section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl flex items-center justify-center"
                style={{ background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, #ef4444, #991b1b)' }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-white">{initials}</span>
                )}
              </div>
              {/* camera overlay on hover */}
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {avatarUploading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Camera size={18} className="text-white" />}
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 font-bold mt-2">Click to change photo</p>
            <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
          </div>

         {/*added the new hero section with the updated styles and layout*/}
          <section aria-label="Page header" className="mb-8">
            <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[60px]">
 
              {/* Left Column: Text & Actions */}
              <div style={{ flex: 1 }}>
                <div className="mb-7">
                  <p className="cs-section-label">
                    One Source of Truth
                  </p>
                  <h1 className="cs-page-title">
                    About <span className="text-[#ef4444]">me.</span>
                  </h1>
                  <p className="cs-subtext max-w-[460px]">
                    Build your professional identity — showcase your experience, skills, and goals to stand out to top recruiters.
                  </p>
                </div>
 
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>
                  <span className="flex items-center gap-1">✔ Career Pulse</span>
                  <span style={{ opacity: 0.3 }}>·</span>
                  <span className="flex items-center gap-1">✔ Skill Validation</span>
                  <span style={{ opacity: 0.3 }}>·</span>
                  <span className="flex items-center gap-1">✔ Identity Verification</span>
                </div>
              </div>
 
              {/* Right Column: Career Ecosystem Grid */}
              <div className="hidden lg:block animate-fade-in" style={{ flexShrink: 0, width: "360px" }}>
                <div className="rounded-xl overflow-hidden border border-neutral-200 grid grid-cols-2">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop"
                    alt="Offices"
                    style={{ width: "100%", height: "100px", objectFit: "cover", borderRight: "1px solid #fff", borderBottom: "1px solid #fff" }}
                  />
                   <img
                     src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80&auto=format&fit=crop"
                     alt="Jobs"
                     style={{ width: "100%", height: "100px", objectFit: "cover", borderBottom: "1px solid #fff" }}
                   />
                   <img
                     src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80&auto=format&fit=crop"
                     alt="Internships"
                     style={{ width: "100%", height: "100px", objectFit: "cover", borderRight: "1px solid #fff" }}
                   />
                   <img
                     src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=80&auto=format&fit=crop"
                     alt="Companies"
                     style={{ width: "100%", height: "100px", objectFit: "cover" }}
                   />
                </div>
              </div>
            </div>
          </section>

        <ProfileForm
          formData={formData}
          editing={true}
          loading={loading}
          profile={profile}
          completion={completion}
          skills={skills}
          initials={initials}
          avatarUrl={avatarUrl}
          onChange={handleChange}
          onSave={handleSave}
          onDiscard={() => navigate("/student/dashboard")}
          onCancel={handleCancel}
          onDelete={handleDelete}
          success={success}
          onNavigate={() =>
            navigate(`/student/jobs?q=${encodeURIComponent(formData.domain || formData.skills || "")}`)
          }
        />

      </div>
    </PageLayout>
  );
}
