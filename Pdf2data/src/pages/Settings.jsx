import { useState } from "react";
import {
  HiOutlinePencil,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineLockClosed,
  HiOutlineCamera,
  HiOutlineTrash,
  HiCheck,
  HiX
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Settings() {
  const { user } = useAuth();
  const toast = useToast();

  // Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.username || "Diksha");
  const [email, setEmail] = useState(user?.email || "dikshakarpe06@gmail.com");

  // Photo & Cropping States
  const [savedAvatar, setSavedAvatar] = useState(null);
  const [tempAvatar, setTempAvatar] = useState(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [showCropModal, setShowCropModal] = useState(false);

  // Preference States
  const [theme, setTheme] = useState("light");

  // Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  // 1. Handle File Selection for Avatar
  const handlePhotoSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setTempAvatar(objectUrl);
      setCropZoom(1);
      setShowCropModal(true);
    }
  };

  // 2. Commit Profile Changes
  const handleSaveProfile = () => {
    if (tempAvatar) {
      setSavedAvatar(tempAvatar);
    }
    setIsEditing(false);
    toast?.success ? toast.success("Profile saved successfully!") : alert("Profile saved!");
  };

  // 3. Cancel Profile Changes
  const handleCancelProfile = () => {
    setFullName(user?.username || "Diksha");
    setEmail(user?.email || "dikshakarpe06@gmail.com");
    setTempAvatar(savedAvatar);
    setIsEditing(false);
  };

  // 4. Theme Switcher (Light / Dark)
  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    const root = document.documentElement;
    if (selectedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    toast?.info ? toast.info(`Theme set to ${selectedTheme}`) : null;
  };

  return (
    <div className="p-8 w-full space-y-8 animate-fadeIn">
      {/* Main Full-Width Settings Box */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[28px] p-8 shadow-sm space-y-10 w-full">
        
        {/* SECTION 1: PROFILE INFORMATION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Profile Information
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Update your personal details and display photo.
              </p>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 text-[#6139ff] text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition"
              >
                <HiOutlinePencil size={15} /> Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveProfile}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#6139ff] text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-200 dark:shadow-none"
                >
                  <HiCheck size={16} /> Save Changes
                </button>
                <button
                  onClick={handleCancelProfile}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >
                  <HiX size={16} /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Photo Layout */}
          <div className="flex flex-col sm:flex-row items-center gap-8 py-4 px-6 bg-gray-50/50 dark:bg-slate-950/40 rounded-2xl border border-gray-100 dark:border-slate-800/60">
            <div className="relative group shrink-0">
              <div className="w-28 h-28 rounded-full bg-[#6139ff] flex items-center justify-center text-white font-bold text-4xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-md">
                {tempAvatar || savedAvatar ? (
                  <img
                    src={tempAvatar || savedAvatar}
                    alt="Profile"
                    className="w-full h-full object-cover transition duration-200"
                    style={{ transform: `scale(${isEditing ? cropZoom : 1})` }}
                  />
                ) : (
                  (fullName || "S").charAt(0).toUpperCase()
                )}
              </div>

              {isEditing && (
                <label className="absolute bottom-1 right-1 p-2.5 bg-[#6139ff] hover:bg-indigo-700 rounded-full text-white shadow-lg cursor-pointer transition transform hover:scale-110">
                  <HiOutlineCamera size={18} />
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
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {fullName}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {email}
              </p>
              {isEditing ? (
                <p className="text-xs text-[#6139ff] font-medium pt-1">
                  Click the camera icon to upload and adjust your new avatar.
                </p>
              ) : (
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-[#6139ff] text-xs font-semibold">
                  Administrator
                </span>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/40 text-sm text-gray-900 dark:text-white disabled:opacity-75 outline-none focus:border-[#6139ff] transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                Role
              </label>
              <input
                type="text"
                disabled
                value="Administrator"
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 dark:border-slate-800/80 bg-gray-100/50 dark:bg-slate-950/20 text-sm text-gray-400 dark:text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                disabled={!isEditing}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/40 text-sm text-gray-900 dark:text-white disabled:opacity-75 outline-none focus:border-[#6139ff] transition"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-100 dark:border-slate-800" />

        {/* SECTION 2: APPEARANCE (LIGHT / DARK ONLY) */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Interface Appearance
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Customize theme mode for the application interface.
            </p>
          </div>

          <div className="p-1.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/40 flex gap-2 max-w-xs">
            <button
              onClick={() => handleThemeChange("light")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition ${
                theme === "light"
                  ? "bg-white dark:bg-slate-800 text-[#6139ff] shadow-sm"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-900"
              }`}
            >
              <HiOutlineSun size={16} /> Light
            </button>

            <button
              onClick={() => handleThemeChange("dark")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition ${
                theme === "dark"
                  ? "bg-white dark:bg-slate-800 text-[#6139ff] shadow-sm"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-900"
              }`}
            >
              <HiOutlineMoon size={16} /> Dark
            </button>
          </div>
        </div>

        <hr className="border-gray-100 dark:border-slate-800" />

        {/* SECTION 3: SECURITY */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Security & Passwords
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Manage login credentials for your account.
            </p>
          </div>

          <div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 text-[#6139ff] text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition"
            >
              <HiOutlineLockClosed size={16} /> Change Account Password
            </button>
          </div>
        </div>

        <hr className="border-gray-100 dark:border-slate-800" />

        {/* SECTION 4: DANGER ZONE */}
        <div className="space-y-3 pt-2">
          <h2 className="text-lg font-bold text-red-600 dark:text-red-400">
            Danger Zone
          </h2>
          <div className="p-6 rounded-2xl border border-red-200 dark:border-red-950/60 bg-red-50/30 dark:bg-red-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Delete Account
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Permanently delete your profile and remove all stored extraction history.
              </p>
            </div>
            <button
              onClick={() => alert("Please contact system administrator to purge database account records.")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition shrink-0 shadow-md shadow-red-200 dark:shadow-none"
            >
              <HiOutlineTrash size={16} /> Delete Account
            </button>
          </div>
        </div>

      </div>

      {/* CROP & PREVIEW PHOTO MODAL */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-gray-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Adjust & Zoom Profile Photo
              </h3>
              <button
                onClick={() => setShowCropModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-900"
              >
                <HiX size={20} />
              </button>
            </div>

            {/* Circular Preview Container */}
            <div className="flex justify-center py-4">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#6139ff] shadow-lg flex items-center justify-center bg-slate-950">
                <img
                  src={tempAvatar}
                  alt="Crop Preview"
                  className="w-full h-full object-cover transition-transform duration-100"
                  style={{ transform: `scale(${cropZoom})` }}
                />
              </div>
            </div>

            {/* Zoom Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 font-medium">
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
                className="w-full accent-[#6139ff] cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-gray-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Change Account Password
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-900"
              >
                <HiX size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current Password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-sm outline-none focus:border-[#6139ff]"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-sm outline-none focus:border-[#6139ff]"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-sm outline-none focus:border-[#6139ff]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  toast?.success ? toast.success("Password updated successfully!") : alert("Password updated!");
                }}
                className="px-5 py-2.5 rounded-xl bg-[#6139ff] text-white text-xs font-semibold hover:bg-indigo-700"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 dark:text-slate-600">
        © 2026 PDF2DATA. All rights reserved.
      </div>
    </div>
  );
}