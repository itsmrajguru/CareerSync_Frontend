import { useState, useEffect } from "react";
import ProfileForm from "../components/ProfileForm";
import ResumeCard from "../components/ResumeCard";
import PageLayout from "../components/PageLayout";
import { getProfileList, createProfile, updateProfile, deleteProfile } from "../api";
import { User, Sparkles } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfileList();
        if (data && data.length > 0) {
          setProfile(data[0]);
          setEditing(false);
        } else {
          setEditing(true);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setEditing(true);
      }
    }
    fetchProfile();
  }, []);

//caling the CRUD operations here 
  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      let updatedProfile;
      

      if (profile?.id) {
        updatedProfile = await updateProfile(profile.id, formData);
      } else {
        updatedProfile = await createProfile(formData);
      }
      setProfile(updatedProfile);
      setEditing(false);
    } catch (err) {
      console.error("Profile Save Error:", err.response?.data || err);
      const serverMessage = err.response?.data?.message;
      alert(`Error saving profile: ${serverMessage || err.message || "Connection error. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
{/* Hero section */}
      <div className="mb-16 md:mb-20">
        <h1 className="text-[3rem] font-extrabold leading-[1.15] tracking-[-1.5px] text-neutral-900 mb-6 flex items-center gap-4">
          Your <span className="text-primary-400">Profile.</span>
        </h1>
        <p className="max-w-2xl">
          Manage your career identity. Keep your details updated to match with the best opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start animate-fade-in-up">

{/* Left: Form */}
        <div className="w-full">
          <div className="bg-white border-none">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
              <Sparkles size={24} className="text-primary-400" />
              {editing ? "Edit Settings" : "Profile Details"}
            </h2>
            <ProfileForm
              initialData={profile}
              onSubmit={handleSubmit}
              loading={loading}
              editing={editing}
              onToggleEdit={setEditing}
            />
          </div>
        </div>

        {/* Right: Preview Card */}
        <div className="w-full lg:sticky lg:top-32 items-start border-t lg:border-t-0 lg:border-l border-neutral-100 pt-12 lg:pt-0 lg:pl-16">
          <h2 className="text-sm font-bold text-neutral-900 tracking-widest uppercase mb-8">
            Live Preview
          </h2>
          {profile ? (
            <ResumeCard
              profile={profile}
              onEdit={() => setEditing(true)}
              onDelete={async () => {
                if (window.confirm("Delete profile?")) {
                  await deleteProfile(profile.id);
                  setProfile(null);
                  setEditing(true);
                }
              }}
            />
          ) : (
            <div className="border-2 border-dashed border-neutral-200 rounded-3xl p-12 text-center text-neutral-400 bg-neutral-50/50 w-full aspect-[3/4] flex items-center justify-center">
              <div className="space-y-4">
                <User size={48} className="mx-auto text-neutral-300" />
                <p className="font-bold text-base">Complete your profile to see the preview card here.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </PageLayout>
  );
}