"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { Eye, EyeOff, X } from "lucide-react";
import { resetPassword } from "@/core/lib/auth";

function ResetPasswordContent() {
  const params = useParams();
  const token = params.token as string;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 6000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!newPassword) newErrors.newPassword = "Password is required.";
    else if (newPassword.length < 8)
      newErrors.newPassword = "Min 8 characters.";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(newPassword))
      newErrors.newPassword =
        "Must include uppercase, lowercase, number and special character.";

    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await resetPassword({ token, newPassword });
      setSuccessMsg(res.message);
      setTimeout(() => (window.location.href = "/login"), 2500);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response
      ) {
        const data = err.response.data as { message?: string; error?: string };
        setError(
          data.message ||
            data.error ||
            "Something went wrong. Please try again.",
        );
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h1 className="text-white text-3xl font-bold">Recovery Password</h1>
        <p className="text-white text-sm leading-snug">
          Enter the new password
        </p>
      </div>

      {/* Success */}
      {successMsg && (
        <div
          onClick={() => setSuccessMsg("")}
          className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex flex-row justify-between cursor-pointer"
        >
          <p className="text-green-400 text-[11px]">
            {successMsg} Redirecting to login...
          </p>
          <X className="text-green-400" size={20} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          onClick={() => setError("")}
          className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex flex-row justify-between cursor-pointer"
        >
          <p className="text-red-400 text-[11px]">{error}</p>
          <X className="text-red-400" size={20} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-9">
        {/* New password */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[#56536E] text-xs font-medium tracking-widest uppercase pl-3">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onPaste={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword)
                    setErrors((p) => ({ ...p, newPassword: undefined }));
                }}
                className={`w-full bg-[#1A1828] text-white text-[13px] placeholder:text-[#4a4a5a] rounded-xl px-4 py-3 pr-11 outline-none border transition-colors duration-200 ${
                  errors.newPassword
                    ? "border-red-500/60 focus:border-red-500"
                    : "border-transparent focus:border-white/10"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BABABA] hover:text-white transition-colors"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-400 text-[11px]">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1">
            <label className="text-[#56536E] text-xs font-medium tracking-widest uppercase pl-3">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onPaste={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((p) => ({ ...p, confirmPassword: undefined }));
                }}
                className={`w-full bg-[#1A1828] text-white text-[13px] placeholder:text-[#4a4a5a] rounded-xl px-4 py-3 pr-11 outline-none border transition-colors duration-200 ${
                  errors.confirmPassword
                    ? "border-red-500/60 focus:border-red-500"
                    : "border-transparent focus:border-white/10"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BABABA] hover:text-white transition-colors"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-[11px]">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#EC4949] hover:bg-[#c94430] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-black text-base font-bold tracking-widest rounded-xl py-3"
        >
          {isLoading ? "Confirming..." : "Confirm"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
