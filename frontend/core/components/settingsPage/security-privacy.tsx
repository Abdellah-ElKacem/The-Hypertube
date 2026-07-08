"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Pencil,
  BadgeCheck,
  X,
  ShieldOff,
  BadgeAlert,
} from "lucide-react";
import { useAuth } from "@/core/contexts/AuthContext";
import { updateUser, updatePassword } from "@/core/lib/users";
import { clearTokens } from "@/core/lib/auth";
import PasswordConfirmationModal from "../../../core/components/settingsPage/PasswordConfirmationModal";

export default function SecurityPrivacy() {
  const { user, refreshUser } = useAuth();

  // Derived: is this an OAuth user?
  const isOAuth = !!user?.oauthProvider;
  const oauthLabel =
    user?.oauthProvider === "42"
      ? "42 Intra"
      : user?.oauthProvider === "google"
        ? "Google"
        : (user?.oauthProvider ?? "OAuth");

  // ── Email ──────────────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);

  // ── Modal (password confirmation for email change) ──────────────────
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [toggle2faLoading, setToggle2faLoading] = useState(false);
  const [editing2FA, setEditing2FA] = useState(false);
  const [temp2FAEnabled, setTemp2FAEnabled] = useState(false);

  // ── Password ───────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ── Toast ──────────────────────────────────────────────────────────
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Sync user data
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
    }
  }, [user]);

  // Auto-dismiss toasts
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(""), 6000);
      return () => clearTimeout(t);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 6000);
      return () => clearTimeout(t);
    }
  }, [error]);

  // ── Email handlers ─────────────────────────────────────────────────
  const handleEmailCancel = () => {
    setEmail(user?.email || "");
    setEditingEmail(false);
    setError("");
  };

  const handleEmailSaveClick = () => {
    if (!email.trim()) {
      setError("Email cannot be empty.");
      return;
    }
    if (email === user?.email) {
      setEditingEmail(false);
      return;
    }
    setModalError("");
    setShowPasswordModal(true);
  };

  const handleEmailConfirm = async (modalPassword: string) => {
    if (!modalPassword) {
      setModalError("Please enter your current password.");
      return;
    }
    setEmailLoading(true);
    setModalError("");
    try {
      await updateUser({ email, currentPassword: modalPassword });
      clearTokens();
      setShowPasswordModal(false);
      setEditingEmail(false);
      setSuccess("Email updated! Redirecting to verification page...");
      setTimeout(() => {
        window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
      }, 1500);
    } catch (err: any) {
      const responseData =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response
          ? (err.response.data as { message?: string; error?: string })
          : undefined;

      setModalError(
        responseData?.message ||
        responseData?.error ||
        "Failed to update profile. Please try again."
      );
    } finally {
      setEmailLoading(false);
    }
  };

  const handle2FAToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemp2FAEnabled(e.target.checked);
  };

  const handle2FACancel = () => {
    setEditing2FA(false);
  };

  // ── Password handlers ──────────────────────────────────────────────
  const handlePasswordCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setEditingPassword(false);
    setError("");
  };

  const handlePasswordSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (currentPassword === newPassword) {
      setError("New password cannot be the same as the current password.");
      return;
    }
    setPasswordLoading(true);
    setError("");
    try {
      await updatePassword({ oldPassword: currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setEditingPassword(false);
      setSuccess("Password updated successfully!");
    } catch (err: any) {
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
        "Failed to update profile. Please try again."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      {/* ── Password-confirmation modal ─────────────────────────── */}
      <PasswordConfirmationModal
        isOpen={showPasswordModal}
        newEmail={email}
        loading={emailLoading}
        error={modalError}
        onConfirm={handleEmailConfirm}
        onClose={() => {
          setShowPasswordModal(false);
          setModalError("");
        }}
      />

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="flex flex-col h-full w-full min-h-0">
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2 p-5">
          <h1 className="text-white text-xl font-medium mb-4">
            Security &amp; Privacy
          </h1>

          {/* OAuth notice banner */}
          {isOAuth && (
            <div className="flex items-center gap-3 bg-[#343041] border border-[#454359] rounded-xl px-4 py-3 mb-4">
              <ShieldOff size={16} className="text-[#EC4949] shrink-0" />
              <p className="text-[#C2C2C2] text-xs">
                Your account is managed by{" "}
                <span className="text-white font-medium">{oauthLabel}</span>.
                Email and password changes are not available for OAuth accounts.
              </p>
            </div>
          )}

          {/* Toasts */}
          {success && (
            <div
              onClick={() => setSuccess("")}
              className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex flex-row justify-between cursor-pointer mb-2"
            >
              <p className="text-green-400 text-[11px]">{success}</p>
              <X className="text-green-400 shrink-0" size={16} />
            </div>
          )}
          {error && !showPasswordModal && (
            <div
              onClick={() => setError("")}
              className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex flex-row justify-between cursor-pointer mb-2"
            >
              <p className="text-red-400 text-[11px]">{error}</p>
              <X className="text-red-400 shrink-0" size={16} />
            </div>
          )}

          {/* ─── E-mail address ─────────────────────────────── */}
          <div className="flex flex-col gap-5 py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-white text-[15px] font-regular">
                  E-mail address
                </p>
                <p className="text-[#C2C2C2] text-xs font-regular">
                  The email address associated with your account
                </p>
              </div>
              {!isOAuth &&
                (!editingEmail ? (
                  <button
                    onClick={() => setEditingEmail(true)}
                    className="flex items-center gap-1.5 text-white text-sm px-4 py-2.5 rounded-xl border border-[#343041] hover:bg-white/5 transition-colors duration-200 shrink-0"
                  >
                    Edit <Pencil size={13} />
                  </button>
                ) : (
                  <div className="flex sm:items-center justify-end gap-2 shrink-0">
                    <button
                      onClick={handleEmailCancel}
                      className="rounded-xl border border-[#EC4949] text-[#EC4949] text-sm px-4 py-2.5 font-medium hover:bg-[#EC4949]/10 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEmailSaveClick}
                      className="rounded-xl bg-[#EC4949] text-white text-sm px-4 py-2.5 font-medium hover:bg-[#d63f3f] transition-colors duration-200"
                    >
                      Save
                    </button>
                  </div>
                ))}
            </div>

            <div className="flex items-center gap-3 w-full xl:max-w-[50%]">
              <div className="relative flex-1 flex items-center">
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={!editingEmail || isOAuth}
                  className="w-full text-white text-[13px] placeholder:text-[#4a4a5a] rounded-xl px-4 py-2.5 outline-none border border-[#343041] focus:border-white/20 transition-colors duration-200 bg-transparent"
                />
                {user?.isVerified && email === user?.email ? (
                  <span className="absolute right-3 flex items-center gap-1 text-[#22c55e] text-xs font-medium">
                    <BadgeCheck size={13} />
                    Verified
                  </span>
                ) : (
                  <span className="absolute right-3 flex items-center gap-1 text-[#EC4949] text-xs font-medium">
                    <BadgeAlert size={13} />
                    Unverified
                  </span>
                )}
              </div>
            </div>
          </div>

          <hr className="border-[#454359]" />

          {/* ─── Password ──────────────────────────────────── */}
          <div className="flex flex-col gap-5 py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-white text-[15px] font-regular">Password</p>
                <p className="text-[#C2C2C2] text-xs font-regular">
                  Set a unique password to protect your account
                </p>
              </div>
              {!isOAuth &&
                (!editingPassword ? (
                  <button
                    onClick={() => setEditingPassword(true)}
                    className="flex items-center gap-1.5 text-white text-sm px-4 py-2.5 rounded-xl border border-[#343041] hover:bg-white/5 transition-colors duration-200 shrink-0"
                  >
                    Edit <Pencil size={13} />
                  </button>
                ) : (
                  <div className="flex sm:items-center justify-end gap-2 shrink-0">
                    <button
                      onClick={handlePasswordCancel}
                      className="rounded-xl border border-[#EC4949] text-[#EC4949] text-sm px-4 py-2.5 font-medium hover:bg-[#EC4949]/10 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePasswordSave}
                      disabled={passwordLoading}
                      className="rounded-xl bg-[#EC4949] text-white text-sm px-4 py-2.5 font-medium hover:bg-[#d63f3f] transition-colors duration-200 disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                ))}
            </div>

            <div className="flex flex-col gap-4">
              {/* Current password */}
              <div className="flex flex-col gap-2 md:w-[49.3%] w-full">
                <label className="text-white text-xs font-regular pl-3">
                  Current password
                </label>
                <div className="relative flex items-center">
                  <input
                    name="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    readOnly={!editingPassword || isOAuth}
                    onPaste={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                    className="w-full text-white text-[13px] placeholder:text-[#4a4a5a] rounded-xl px-4 py-2.5 outline-none border border-[#343041] focus:border-white/20 transition-colors duration-200 bg-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 text-[#56536E] hover:text-white transition-colors"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New password & Re-write */}
              <div className="flex md:flex-row flex-col gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-white text-xs font-regular pl-3">
                    New password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="newPassword"
                      type={showNew ? "text" : "password"}
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      readOnly={!editingPassword || isOAuth}
                      onPaste={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      className="w-full text-white text-[13px] placeholder:text-[#4a4a5a] rounded-xl px-4 py-2.5 outline-none border border-[#343041] focus:border-white/20 transition-colors duration-200 bg-transparent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 text-[#56536E] hover:text-white transition-colors"
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-white text-xs font-regular pl-3">
                    Re-write new password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      readOnly={!editingPassword || isOAuth}
                      onPaste={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      className="w-full text-white text-[13px] placeholder:text-[#4a4a5a] rounded-xl px-4 py-2.5 outline-none border border-[#343041] focus:border-white/20 transition-colors duration-200 bg-transparent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 text-[#56536E] hover:text-white transition-colors"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}