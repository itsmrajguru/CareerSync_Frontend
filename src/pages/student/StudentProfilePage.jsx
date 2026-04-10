import { useState, useEffect } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProfileForm from "../../components/ProfileForm";
import { getProfileList, createProfile, updateProfile, deleteProfile } from "../../services/studentProfileService";

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

  /*the skills are saved as comman seperated in a array  */
  const skills = formData.skills?.split(",").map(s => s.trim()).filter(Boolean) || [];

  /*The percentage of formData added */
  const completion = calcCompletion(formData);

  /* Creating 2 character logo */
  const initials = getInitials(formData.full_name);

  return (
    <div className="min-h-screen bg-app-bg font-sans flex flex-col">
      <Navbar />

      <main className="max-w-[960px] mx-auto px-7 pt-4 pb-10 flex-1 w-full">
 
         {/*added the new hero section with the updated styles and layout*/}
         <section className="d-hero mb-8">
           <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "60px"}}>
 
             {/* Left Column: Text & Actions */}
             <div style={{ flex: 1 }}>
               <div className="mb-7">
                 <p className="text-[13px] font-bold tracking-[0.5px] text-[#475569] uppercase mb-2">
                   One Source of Truth
                 </p>
                 <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-[-2px] text-[#0f172a] mb-5">
                   About <span style={{ color: "#ef4444" }}>me.</span>
                 </h1>
                 <p className="text-[14px] leading-[1.6] text-[#64748b] font-medium max-w-[460px]">
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
             <div className="hidden lg:block slide-in" style={{ flexShrink: 0, width: "360px" }}>
               <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9" }} className="grid grid-cols-2">
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

      </main>
      <Footer />
    </div>
  );
}
