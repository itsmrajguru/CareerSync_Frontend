import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProfileForm from "../components/ProfileForm";
import ResumeCard from "../components/ResumeCard";
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
      console.error(err);
      alert(`Error saving profile: ${err.message}`);
    } finally {
      setLoading(false);
    } 
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-slate-900 flex items-center justify-center gap-3">
            <User size={36} className="text-blue-600" /> Your <span className="text-blue-600">Profile</span>
          </h1>
          <p className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
            Manage your career identity. Keep your details updated to match with the best opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-in-up">

          {/* Left: Form */}
          <div className="flex justify-center transition-all duration-300 w-full">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm w-full max-w-2xl">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Sparkles size={20} className="text-blue-500" />
                {editing ? "Edit Profile" : "Profile Details"}
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
          <div className="flex justify-center w-full lg:sticky lg:top-24 items-start">
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
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 bg-slate-50 w-full max-w-lg aspect-[3/4] flex items-center justify-center shadow-sm">
                <div className="space-y-4">
                  <User size={48} className="mx-auto text-slate-300" />
                  <p className="font-medium">Complete your profile to see the preview card here.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}