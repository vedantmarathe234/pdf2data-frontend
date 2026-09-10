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
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#F8F8FC] dark:bg-[#0B0A10] text-[#2D2A4A] dark:text-[#E9E7F5] px-4 sm:px-6 py-4 transition-colors duration-200">
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#1A1635] border border-[#E2E8F0] dark:border-[#332C57] rounded-2xl p-5 sm:p-6 shadow-md space-y-6 w-full transition-colors duration-200">
        
        {/* Header Title */}
        <div>
          <h1 className="text-lg font-bold text-[#1E1B4B] dark:text-white">
            Account Settings
          </h1>
          <p className="text-xs text-gray-500 dark:text-[#A5A1C4] mt-0.5">
            Manage your account preferences, appearance, and security options.
          </p>
        </div>

        <hr className="border-[#E2E8F0] dark:border-[#332C57]" />

        {/* Profile Information Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#1E1B4B] dark:text-white">
                Profile Information
              </h2>
              <p className="text-xs text-gray-500 dark:text-[#A5A1C4]">
                Update your personal details and display photo.
              </p>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#332C57] text-gray-800 dark:text-[#E9E7F5] text-xs font-medium hover:bg-gray-50 dark:hover:bg-[#251F47] transition cursor-pointer self-start sm:self-auto"
              >
                <HiOutlinePencil size={14} /> Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-medium hover:opacity-90 transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <HiCheck size={14} />{" "}
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancelProfile}
                  disabled={saving}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#332C57] text-gray-600 dark:text-[#A5A1C4] text-xs font-medium hover:bg-gray-50 dark:hover:bg-[#251F47] transition cursor-pointer disabled:opacity-50"
                >
                  <HiX size={14} /> Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50/60 dark:bg-[#251F47] rounded-xl border border-gray-200 dark:border-[#332C57]">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#A78BFA] to-[#7C3AED] text-white font-bold text-2xl flex items-center justify-center overflow-hidden border-2 border-white dark:border-[#1A1635] shadow-xs">
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
                <label className="absolute bottom-0 right-0 p-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-full text-white shadow-xs cursor-pointer transition transform hover:scale-105">
                  <HiOutlineCamera size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="space-y-0.5 text-center sm:text-left flex-1">
              <h3 className="text-sm font-bold text-[#1E1B4B] dark:text-white">
                {fullName || user?.username || "User"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-[#A5A1C4]">
                {email || user?.email || "No email available"}
              </p>
              {isEditing ? (
                <p className="text-[11px] text-gray-500 dark:text-[#A5A1C4]">
                  Click camera to upload new avatar.
                </p>
              ) : (
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-[#7C3AED]/20 text-purple-700 dark:text-[#C084FC] text-[10px] font-bold">
                  {user?.role === "ROLE_ADMIN"
                    ? "Administrator"
                    : user?.role === "ROLE_USER"
                    ? "User"
                    : user?.role || "Member"}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 dark:text-[#A5A1C4] uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#332C57] bg-gray-50 dark:bg-[#251F47] text-xs text-gray-900 dark:text-white disabled:opacity-75 outline-none focus:border-[#8B5CF6] transition"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-gray-500 dark:text-[#A5A1C4] uppercase tracking-wider">
                  Role
                </label>
                <span className="text-[10px] text-gray-400 dark:text-[#A5A1C4]/50">
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
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#332C57] bg-gray-100 dark:bg-[#251F47]/50 text-xs text-gray-400 dark:text-[#A5A1C4]/50 cursor-not-allowed select-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-[11px] font-bold text-gray-500 dark:text-[#A5A1C4] uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                disabled={!isEditing}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#332C57] bg-gray-50 dark:bg-[#251F47] text-xs text-gray-900 dark:text-white disabled:opacity-75 outline-none focus:border-[#8B5CF6] transition"
              />
            </div>
          </div>
        </div>

        <hr className="border-[#E2E8F0] dark:border-[#332C57]" />

        {/* Interface Appearance Section */}
        <div className="space-y-3">
          <div>
            <h2 className="text-sm font-bold text-[#1E1B4B] dark:text-white">
              Interface Appearance
            </h2>
            <p className="text-xs text-gray-500 dark:text-[#A5A1C4]">
              Customize theme mode for the application.
            </p>
          </div>

          <div className="p-1 rounded-xl border border-gray-200 dark:border-[#332C57] bg-gray-50 dark:bg-[#251F47] flex gap-2 max-w-xs">
            <button
              onClick={() => handleThemeChange("light")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                theme === "light"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 dark:text-[#A5A1C4] hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <HiOutlineSun size={15} /> Light
            </button>

            <button
              onClick={() => handleThemeChange("dark")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                theme === "dark"
                  ? "bg-[#120F24] text-white shadow-xs"
                  : "text-gray-500 dark:text-[#A5A1C4] hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <HiOutlineMoon size={15} /> Dark
            </button>
          </div>
        </div>

        <hr className="border-[#E2E8F0] dark:border-[#332C57]" />

        {/* Security & Passwords Section */}
        <div className="space-y-3">
          <div>
            <h2 className="text-sm font-bold text-[#1E1B4B] dark:text-white">
              Security & Passwords
            </h2>
            <p className="text-xs text-gray-500 dark:text-[#A5A1C4]">
              Manage login credentials and passwords.
            </p>
          </div>

          <div>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#332C57] text-gray-800 dark:text-[#E9E7F5] text-xs font-medium hover:bg-gray-50 dark:hover:bg-[#251F47] transition cursor-pointer"
            >
              <HiOutlineLockClosed size={15} /> Change Account Password
            </button>
          </div>
        </div>

        <hr className="border-[#E2E8F0] dark:border-[#332C57]" />

        {/* Danger Zone Section */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
            Danger Zone
          </h2>
          <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/40 dark:bg-red-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#1E1B4B] dark:text-white">
                Delete Account
              </p>
              <p className="text-[11px] text-gray-500 dark:text-[#A5A1C4]">
                Permanently delete profile and extraction records.
              </p>
            </div>
            <button
              onClick={() =>
                alert(
                  "Please contact system administrator to purge database account records.",
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition shrink-0 cursor-pointer shadow-xs"
            >
              <HiOutlineTrash size={15} /> Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Crop/Zoom Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1635] rounded-2xl p-5 max-w-sm w-full border border-gray-200 dark:border-[#332C57] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1E1B4B] dark:text-white">
                Adjust Profile Photo
              </h3>
              <button
                onClick={() => setShowCropModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
              >
                <HiX size={18} />
              </button>
            </div>

            <div className="flex justify-center py-1">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#7C3AED] shadow-xs flex items-center justify-center bg-gray-950">
                <img
                  src={tempAvatar}
                  alt="Crop Preview"
                  className="w-full h-full object-cover transition-transform duration-100"
                  style={{ transform: `scale(${cropZoom})` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-gray-500 dark:text-[#A5A1C4]">
                <span>Zoom</span>
                <span>{Math.round(cropZoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.05"
                value={cropZoom}
                onChange={(e) => setCropZoom(Number(e.target.value))}
                className="w-full accent-[#7C3AED] cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowCropModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white hover:opacity-90 transition cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}