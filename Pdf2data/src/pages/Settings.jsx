import { useState } from "react";
import {
  HiOutlinePencil,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineLockClosed,
  HiOutlineCamera,
  HiOutlineTrash,
  HiCheck,
  HiX,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { updateProfile, changeEmail, uploadAvatar } from "../services/auth";

export default function Settings() {
  const { user } = useAuth();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.username || "Diksha");
  const [email, setEmail] = useState(user?.email || "dikshakarpe06@gmail.com");

  const [savedAvatar, setSavedAvatar] = useState(
    user?.profilePicture || localStorage.getItem("profilePicture") || null,
  );
  const [tempAvatar, setTempAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [showCropModal, setShowCropModal] = useState(false);

  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handlePhotoSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      const objectUrl = URL.createObjectURL(file);
      setTempAvatar(objectUrl);
      setCropZoom(1);
      setShowCropModal(true);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      let currentAvatarUrl = savedAvatar;

      if (avatarFile) {
        const updatedUser = await uploadAvatar(avatarFile);

        const newAvatarUrl = updatedUser?.profilePicture || updatedUser;

        setSavedAvatar(newAvatarUrl);
        localStorage.setItem("profilePicture", newAvatarUrl);
      }

      await updateProfile(fullName, currentAvatarUrl);

      if (fullName) {
        localStorage.setItem("username", fullName);
      }

      const originalEmail = user?.email || localStorage.getItem("email");
      if (email && email !== originalEmail) {
        const confirmPassword = prompt(
          "To change your email address, please enter your current password:",
        );

        if (confirmPassword) {
          await changeEmail(email, confirmPassword);
          localStorage.setItem("email", email);
          toast?.success
            ? toast.success("Profile and email updated successfully!")
            : alert("Profile and email updated!");
        } else {
          toast?.error
            ? toast.error("Email update canceled: Password required.")
            : alert("Email update canceled.");
          setEmail(originalEmail);
        }
      } else {
        toast?.success
          ? toast.success("Profile saved successfully!")
          : alert("Profile saved!");
      }

      setIsEditing(false);
      setAvatarFile(null);
      setTempAvatar(null);
    } catch (err) {
      console.error("Failed to save profile:", err);
      const errMsg =
        err.response?.data || err.message || "Failed to update profile.";
      toast?.error ? toast.error(errMsg) : alert(errMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelProfile = () => {
    setFullName(user?.username || localStorage.getItem("username") || "Diksha");
    setEmail(
      user?.email || localStorage.getItem("email") || "dikshakarpe06@gmail.com",
    );
    setTempAvatar(null);
    setAvatarFile(null);
    setIsEditing(false);
  };

  const handleThemeChange = (selectedTheme) => {
    if (theme === selectedTheme) return;
    setTheme(selectedTheme);
    const root = document.documentElement;
    if (selectedTheme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F5F8] dark:bg-[#09090b] p-4 sm:p-6 space-y-6">
      <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-10 w-full">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Profile Information
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Update your personal details and display photo.
              </p>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer self-start sm:self-auto"
              >
                <HiOutlinePencil size={15} /> Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <HiCheck size={16} />{" "}
                  {saving ? "Uploading..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancelProfile}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer disabled:opacity-50"
                >
                  <HiX size={16} /> Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-zinc-50/80 dark:bg-[#09090b] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80">
            <div className="relative group shrink-0">
              <div className="w-28 h-28 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-3xl flex items-center justify-center overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xs">
                {tempAvatar || savedAvatar ? (
                  <img
                    src={tempAvatar || savedAvatar}
                    alt="Profile"
                    className="w-full h-full object-cover transition duration-200"
                    style={{ transform: `scale(${isEditing ? cropZoom : 1})` }}
                  />
                ) : (
                  (fullName || "D").charAt(0).toUpperCase()
                )}
              </div>

              {isEditing && (
                <label className="absolute bottom-0 right-0 p-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white rounded-full text-white dark:text-zinc-900 shadow-md cursor-pointer transition transform hover:scale-105">
                  <HiOutlineCamera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="space-y-1 text-center sm:text-left flex-1">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {fullName || user?.username || "User"}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {email || user?.email || "No email available"}
              </p>
              {isEditing ? (
                <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium pt-1">
                  Click the camera icon to select a new avatar for Cloudinary
                  upload.
                </p>
              ) : (
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-bold">
                  {user?.role === "ROLE_ADMIN"
                    ? "Administrator"
                    : user?.role === "ROLE_USER"
                      ? "User"
                      : user?.role || "Member"}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-[#09090b] text-sm text-zinc-900 dark:text-white disabled:opacity-75 outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 transition"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Role
                </label>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                  Read-only
                </span>
              </div>
              <input
                type="text"
                readOnly
                disabled
                value={
                  user?.role === "ROLE_ADMIN"
                    ? "Administrator"
                    : user?.role === "ROLE_USER"
                      ? "User"
                      : user?.role?.replace("ROLE_", "") || "User"
                }
                className="w-full px-4 py-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-[#09090b]/50 text-sm text-zinc-400 dark:text-zinc-500 cursor-not-allowed select-none"
              />
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                Account roles cannot be modified.
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                disabled={!isEditing}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-[#09090b] text-sm text-zinc-900 dark:text-white disabled:opacity-75 outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 transition"
              />
            </div>
          </div>
        </div>

        <hr className="border-zinc-100 dark:border-zinc-800" />

        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Interface Appearance
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Customize theme mode for the application interface.
            </p>
          </div>

          <div className="p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-[#09090b] flex gap-2 max-w-xs">
            <button
              onClick={() => handleThemeChange("light")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                theme === "light"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <HiOutlineSun size={16} /> Light
            </button>

            <button
              onClick={() => handleThemeChange("dark")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                theme === "dark"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <HiOutlineMoon size={16} /> Dark
            </button>
          </div>
        </div>

        <hr className="border-zinc-100 dark:border-zinc-800" />

        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Security & Passwords
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Manage login credentials for your account.
            </p>
          </div>

          <div>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              <HiOutlineLockClosed size={16} /> Change Account Password
            </button>
          </div>
        </div>

        <hr className="border-zinc-100 dark:border-zinc-800" />

        <div className="space-y-3 pt-2">
          <h2 className="text-base font-bold text-red-600 dark:text-red-400">
            Danger Zone
          </h2>
          <div className="p-5 rounded-2xl border border-red-200 dark:border-red-950/60 bg-red-50/40 dark:bg-red-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">
                Delete Account
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Permanently delete your profile and remove all stored extraction
                history.
              </p>
            </div>
            <button
              onClick={() =>
                alert(
                  "Please contact system administrator to purge database account records.",
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition shrink-0 cursor-pointer shadow-xs"
            >
              <HiOutlineTrash size={16} /> Delete Account
            </button>
          </div>
        </div>
      </div>

      {showCropModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121215] rounded-3xl p-6 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Adjust & Zoom Profile Photo
              </h3>
              <button
                onClick={() => setShowCropModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
              >
                <HiX size={20} />
              </button>
            </div>

            <div className="flex justify-center py-2">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-zinc-900 dark:border-zinc-100 shadow-md flex items-center justify-center bg-zinc-950">
                <img
                  src={tempAvatar}
                  alt="Crop Preview"
                  className="w-full h-full object-cover transition-transform duration-100"
                  style={{ transform: `scale(${cropZoom})` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-500 font-medium">
                <span>Zoom Out</span>
                <span>{Math.round(cropZoom * 100)}%</span>
                <span>Zoom In</span>
              </div>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.05"
                value={cropZoom}
                onChange={(e) => setCropZoom(Number(e.target.value))}
                className="w-full accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <ChangePasswordModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
