"use client";

import { useState, useEffect } from "react";
import { forgotPassword } from "@/core/lib/auth";
import { X } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
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
    if (!email.trim()) {
      setEmailError("Email is required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setEmailError("Enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await forgotPassword({ email });
      setSuccessMsg(res.message);
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
        setError(data.message || data.error || "Something went wrong. Please try again.");
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
          Enter your email to recover your password.
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
        <div onClick={() => setError('')} className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 cursor-pointer flex flex-row justify-between">
          <p className="text-red-400 text-[11px]">{error}</p>
          <X className="text-red-400" size={20} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-[#56536E] text-xs font-medium tracking-widest uppercase pl-3">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your e-mail address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            className={`w-full bg-[#1A1828] text-white text-[13px] placeholder:text-[#4a4a5a] placeholder:bg-transparent rounded-xl px-4 py-3 outline-none border transition-colors duration-200 ${
              emailError
                ? "border-red-500/60 focus:border-red-500"
                : "border-transparent focus:border-white/10"
            }`}
          />
          {emailError && (
            <p className="text-red-400 text-[11px]">{emailError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#EC4949] hover:bg-[#c94430] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-black text-[11px] font-bold tracking-widest uppercase rounded-xl py-3"
        >
          {isLoading ? "Next..." : "Next"}
        </button>
      </form>
    </div>
  );
}
