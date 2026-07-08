"use client";

import { AtSign, Upload } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { updateUser } from "@/core/lib/users";
import { useAuth } from "@/core/contexts/AuthContext";
import { X } from "lucide-react";

export default function MyProfile() {
  const { user, refreshUser, loading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [deleteAvatar, setDeleteAvatar] = useState(false);

  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sync state with user context on load/update
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPreview(user.avatar);
    }
  }, [user]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 6000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChangePicture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setDeleteAvatar(false);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleDeletePicture = () => {
    setPreview(null);
    setAvatarFile(null);
    setDeleteAvatar(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasChanges =
    ((user?.username || "") !== username ||
      (user?.firstName || "") !== firstName ||
      (user?.lastName || "") !== lastName ||
      !!avatarFile ||
      deleteAvatar) &&
    username.trim() !== "" &&
    firstName.trim() !== "" &&
    lastName.trim() !== "";

  const handleSave = async () => {
    if (!hasChanges) return;

    setLoadingSave(true);
    setError("");
    setSuccess("");

    try {
      const payload: any = {};

      if (username !== (user?.username || "")) {
        payload.username = username;
      }
      if (firstName !== (user?.firstName || "")) {
        payload.firstName = firstName;
      }
      if (lastName !== (user?.lastName || "")) {
        payload.lastName = lastName;
      }

      // Signal avatar deletion explicitly
      if (deleteAvatar && !avatarFile) {
        payload.avatar = "delete";
      }

      await updateUser(payload, avatarFile || undefined);
      await refreshUser();
      setSuccess("Profile updated successfully!");
      setAvatarFile(null);
      setDeleteAvatar(false);
    } catch (err) {
      const responseData =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response
          ? (err.response.data as { message?: string; error?: string })
          : undefined;

      setError(
        responseData?.message ||
          responseData?.error ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setLoadingSave(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setUsername(user.username || "");
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPreview(user.avatar || null);
      setAvatarFile(null);
      setDeleteAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    setError("");
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center p-10 bg-transparent min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#EC4949] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full min-h-0">
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-8 p-5">
        <h1 className="text-white text-xl font-medium">My Profile</h1>
        <div className="flex flex-col gap-6">
          {/* Messages */}
          {success && (
            <div
              onClick={() => setSuccess("")}
              className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex flex-row justify-between cursor-pointer"
            >
              <p className="text-green-400 text-[11px]">{success}</p>
              <X className="text-green-400" size={20} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              onClick={() => setError("")}
              className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 cursor-pointer flex flex-row justify-between"
            >
              <p className="text-red-400 text-[11px]">{error}</p>
              <X className="text-red-400" size={20} />
            </div>
          )}
          {/* Profile Picture Row */}
          <div className="flex flex-col xl:flex-row xl:justify-between gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-white text-[15px] font-regular">
                Profile picture
              </p>
              <p className="text-[#C2C2C2] text-xs font-regular">
                Choose a new profile photo or avatar to personalize your public
                presence.
              </p>
            </div>

            <div className="flex items-center sm:flex-row flex-col gap-6">
              {/* Circular image wrapper */}
              <div
                className="relative group w-[70px] h-[70px] rounded-full overflow-hidden shrink-0 cursor-pointer"
                onClick={handleChangePicture}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    width={70}
                    height={70}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50"
                  />
                ) : (
                  <div className="w-full h-full bg-[#EC4949] rounded-full flex items-center justify-center text-xl font-bold text-[#18171d] shadow-md">
                    {!loading && user?.firstName?.[0]?.toUpperCase()}
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Upload size={18} className="text-white" />
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex gap-3">
                <button
                  onClick={handleChangePicture}
                  className="rounded-2xl bg-[#343041] text-white px-6 py-2 text-sm font-regular hover:bg-[#3e3b50] transition-colors duration-200"
                >
                  Change picture
                </button>
                <button
                  onClick={handleDeletePicture}
                  className="rounded-2xl bg-[#EC4949]/15 border border-[#EC4949]/60 text-[#EC4949] px-6 py-2 text-sm font-regular hover:bg-[#4a2020] transition-colors duration-200"
                >
                  Delete picture
                </button>
              </div>
            </div>
          </div>

          <hr className="border-[#454359]" />

          {/* Basic Infos Row */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-white text-[15px] font-regular">Basic infos</p>
              <p className="text-[#C2C2C2] text-xs font-regular">
                Update your basic information to personalize your profile and
                account settings.
              </p>
            </div>

            <div className="flex flex-col gap-5 w-full">
              {/* Username */}
              <div className="flex flex-col gap-2 md:w-[49.3%] w-full">
                <label className="text-white text-xs font-regular tracking-widest  pl-3">
                  Username
                </label>
                <div className="relative flex items-center">
                  <AtSign
                    size={14}
                    className="absolute left-3 text-[#56536E]"
                  />
                  <input
                    name="username"
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-white text-[13px] placeholder:text-[#4a4a5a] rounded-xl pl-8 pr-4 py-2.5 outline-none border border-[#343041] focus:border-white border-1 transition-colors duration-200"
                  />
                </div>
              </div>

              {/* First name & Last name */}
              <div className="flex md:flex-row flex-col gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-white text-xs font-regular tracking-widest  pl-3">
                    First name
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-white text-[13px] placeholder:text-[#4a4a5a] rounded-xl px-4 py-2.5 outline-none border border-[#343041] focus:border-white transition-colors duration-200"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-white text-xs font-regular tracking-widest  pl-3">
                    Last name
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-white text-[13px] placeholder:text-[#4a4a5a] rounded-xl px-4 py-2.5 outline-none border border-[#343041] focus:border-white transition-colors duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel & Save Buttons */}
      <div className="flex flex-col justify-end shrink-0">
        <hr className="border-[#454359] w-full" />
        <div className="flex justify-end gap-3 p-5">
          <button
            onClick={handleCancel}
            disabled={loadingSave}
            className="rounded-xl w-[133px] py-2 border border-[#EC4949] text-[#EC4949]  text-sm font-regular hover:bg-[#EC4949]/10 transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loadingSave || !hasChanges}
            className="rounded-xl w-[133px] bg-[#EC4949] text-white  text-sm font-medium hover:bg-[#d63f3f] transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
          >
            {loadingSave ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
