import { useState, useEffect } from "react";
import { Save, X, Edit2, Trash2 } from "lucide-react";
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
  const fields = ["full_name","domain","location","summary","work","education","skills","github"];
  const filled = fields.filter(f => p[f]?.trim()).length;
  return Math.round((filled / fields.length) * 100);
};


/* The Profile Page function , that provides create,update,delete
and cancle functions */
export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(emptyProfile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

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
        } else {
          setEditing(true);
        }
      } catch {
        setEditing(true);
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
    console.log("save clicked 1");
    setLoading(true);
    try {
      console.log("save clicked 2");
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

      console.log("payload:", payload);

      /* As we Saving the data They come
       from the user There could be two conditions Either we are updating the data Otherwise we are creating a new user So if the profile id exists that There is user whose id exists so we will update that id with this form Otherwise we will create a new Profile*/
      const result = profile?.id
        ? await updateProfile(profile.id, payload)
        : await createProfile(payload);

      console.log("result:", result);

      setProfile(result);
      setFormData(result);
      setEditing(false);
    } catch (err) {
      console.error("Save error:", err);
      alert(err.response?.data?.message || err.message);
    } finally {
      console.log("finally block");
      setLoading(false);
    }
  };

  //DeleteProfile Fuctionality
  const handleDelete = async () => {
    if (!window.confirm("Delete your profile?")) return;


    await deleteProfile(profile.id);
    setProfile(null);
    setFormData(emptyProfile);
    setEditing(true);
  };

  //cancle Save the data
  const handleCancel = () => {
    setLoading(false);
    setFormData(profile || emptyProfile);
    setEditing(!profile);
  };

  /*the skills are saved as comman seperated in a array  */
  const skills = formData.skills?.split(",").map(s => s.trim()).filter(Boolean) || [];
  
  /*The percentage of formData added */
  const completion = calcCompletion(editing ? formData : profile);

  /* Creating 2 character logo */
  const initials = getInitials(formData.full_name);

  return (
    <div className="min-h-screen bg-[#f0fbfe] font-sans flex flex-col">
      <Navbar />

      <main className="max-w-[900px] mx-auto px-7 pt-10 pb-10 flex-1 w-full">

        {/*profile header*/}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-[1px] text-neutral-400 uppercase mb-3">
              One Source of Truth
            </p>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-neutral-900 mb-3">
              Your <span className="text-primary-400">Profile.</span>
            </h1>
            <p className="text-[1rem] leading-[1.7] text-neutral-500 max-w-[560px] mt-3">
              Build your professional identity — showcase your experience, skills, and goals to stand out to top recruiters.
            </p>
          </div>


          <div className="flex gap-2">
            {/* This is the conditional toggle btween cancel+save and
            delete +edit */}

            {editing ? (
              <>
                <button
                  onClick={handleCancel}
                  /* Now applying the new HomePage UI classes for matching aesthetics */
                  className="btn-outline"
                  style={{ padding: "8px 16px" }}
                >
                  <X size={14}/> Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  /* Now applying the new HomePage UI classes */
                  className="btn-primary"
                  style={{ padding: "8px 16px" }}
                >
                  <Save size={14}/> {loading ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <>
                {profile && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-100 bg-red-50 text-red-500 text-sm font-bold hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14}/> Delete
                  </button>
                )}

                <button
                  onClick={() => setEditing(true)}
                  /* Now applying the new HomePage UI classes */
                  className="btn-primary"
                  style={{ padding: "8px 16px" }}
                >
                  <Edit2 size={14}/> Edit
                </button>
              </>
            )}
          </div>
        </div>

        <ProfileForm
          formData={formData}
          editing={editing}
          loading={loading}
          profile={profile}
          completion={completion}
          skills={skills}
          initials={initials}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
          onEdit={() => setEditing(true)}

          /* This is the personalized job search  */
          onNavigate={() =>
            navigate(`/student/jobs?q=${encodeURIComponent(formData.domain || formData.skills || "")}`)
          }
        />

      </main>
      <Footer />
    </div>
  );
}