"use client";

import { useState } from "react";

export default function EnterEmailPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h1 className="text-white text-3xl font-bold">Email Verification</h1>
        <p className="text-white text-sm leading-snug">
          Enter your email address to receive a verification code.
        </p>
      </div>


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
          className="w-full bg-[#EC4949] hover:bg-[#c94430] transition-colors text-black text-[11px] font-bold tracking-widest uppercase rounded-xl py-3"
        >
          Next
        </button>
      </form>
    </div>
  );
}
