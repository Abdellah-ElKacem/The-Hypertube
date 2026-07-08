"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail, resendOtp } from "@/core/lib/auth";
import { ArrowLeft, X } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [email] = useState(emailFromQuery);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCooldown]);

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

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // digits only
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    // Auto-focus next box
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasteData) return;

    const next = [...otp];
    pasteData.split("").forEach((char, i) => {
      next[i] = char;
    });
    setOtp(next);

    // Focus the next empty input or the last digit
    const nextIndex = pasteData.length < 6 ? pasteData.length : 5;
    const targetInput = document.getElementById(`otp-${nextIndex}`);
    targetInput?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await verifyEmail({ email, otp: code });
      setSuccessMsg(res.message);
      setTimeout(() => (window.location.href = "/login"), 2000);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response
      ) {
        const data = err.response.data as { message?: string, error?: string };
        setError(data.message || data.error || "Invalid or expired code.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await resendOtp(email);
      setSuccessMsg(res.message);
      setResendCooldown(60);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response
      ) {
        const data = err.response.data as { message?: string, error?: string };
        setError(data.message || data.error || "Could not resend code.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h1 className="text-white text-3xl font-bold">Check your email</h1>
        <p className="text-white text-base leading-snug">
          Enter the code we&apos;ve just sent to your email inbox
        </p>
        <p className="text-[#D4D4D4] text-sm leading-snug">
          We&apos;ve sent a sign-in code for LeetStream link to{" "}
          <span className="text-white font-medium underline">{email}</span>
        </p>
      </div>

      {/* Success */}
      {successMsg && (
        <div onClick={() => setSuccessMsg('')} className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex flex-row justify-between cursor-pointer">
          <p className="text-green-400 text-[11px]">{successMsg}</p>
          <X className="text-green-400" size={20} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div onClick={() => setError('')} className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex flex-row justify-between cursor-pointer">
          <p className="text-red-400 text-[11px]">{error}</p>
          <X className="text-red-400" size={20} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <p className="text-white text-xs px-3">The OTP Code</p>
        {/* OTP boxes */}
        <div className="flex gap-2 sm:gap-3 justify-start w-full">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              onPaste={handlePaste}
              className="w-full max-w-11.25 sm:max-w-14 h-12 sm:h-14 text-white text-2xl font-bold text-center rounded-xl border border-[#D6D6D6] focus:border-[#EC4949] focus:text-[#EC4949] outline-none transition-colors duration-200 caret-transparent"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#EC4949] hover:bg-[#c94430] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-black text-sm font-bold tracking-widest uppercase rounded-xl py-3"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>

      {/* Resend */}
      <p className="text-[#BABABA] text-xs text-start">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || resendCooldown > 0}
          className="text-[#E5533D] hover:underline disabled:opacity-50 disabled:no-underline"
        >
          {isResending
            ? "Sending..."
            : resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Click to resend"}
        </button>
      </p>
      <button
        onClick={() => (window.location.href = "/login")}
        className="w-full text-white text-sm font-bold border border-[#D6D6D6] rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-[#1A1828] transition-colors"
      >
        <ArrowLeft size={16} color="white" strokeWidth={2} /> Back to Login
      </button>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
