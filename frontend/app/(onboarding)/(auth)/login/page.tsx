"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, X } from "lucide-react";
import { login, oauthRedirect } from "@/core/lib/auth";

interface FormState {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  rightElement,
  onPaste,
  onCut,
  onCopy,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  rightElement?: React.ReactNode;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onCut?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onCopy?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[#56536E] text-xs font-medium tracking-widest uppercase pl-3">
        {label}
      </label>
      <div className="relative">
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onPaste={onPaste}
          onCut={onCut}
          onCopy={onCopy}
          className={`w-full bg-[#1A1828] text-white text-[13px] placeholder:text-[#4a4a5a] rounded-xl px-4 py-2.5 outline-none border transition-colors duration-200 ${
            error
              ? "border-red-500/60 focus:border-red-500"
              : "border-transparent focus:border-white/10"
          } ${rightElement ? "pr-11" : ""}`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-[11px]">{error}</p>}
    </div>
  );
}

export default function LoginPage() {
  const [form, setForm] = useState<FormState>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (generalError) {
      const timer = setTimeout(() => setGeneralError(""), 6000);
      return () => clearTimeout(timer);
    }
  }, [generalError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.username.trim()) newErrors.username = "Username is required.";
    if (!form.password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setGeneralError("");
    try {
      await login({ username: form.username, password: form.password });
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get("redirectTo") || "/home";
      window.location.href = redirectTo;
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
        if (data.message === "Please verify your email before logging in.") {
          window.location.href = "/enter-email";
          return;
        }
        setGeneralError(
          data.message || data.error || "Invalid username or password.",
        );
      } else {
        setGeneralError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-10">
      {/* Heading */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-white text-3xl font-bold">Welcome Back</h1>
        <p className="text-white text-xs">
          Log in to continue watching your best movies.
        </p>
        <p className="text-white text-xs">
          Don&apos;t have an account?{" "}
          <Link
            href={`/sign-up${typeof window !== "undefined" ? window.location.search : ""}`}
            className="text-[#E5533D] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* General API error */}
      {generalError && (
        <div
          onClick={() => setGeneralError("")}
          className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex flex-row justify-between cursor-pointer"
        >
          <p className="text-red-400 text-sm">{generalError}</p>
          <button className="cursor-pointer">
            <X className="text-red-400" size={20} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* OAuth Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              const searchParams = new URLSearchParams(window.location.search);
              const redirectTo = searchParams.get("redirectTo");
              oauthRedirect.google(redirectTo || undefined);
            }}
            className="flex-1 bg-[#18171D] hover:bg-[#1f1e26] transition-colors text-[#ACA6DB] text-xs rounded-xl py-2 flex items-center justify-center gap-1.5"
          >
            <div>
              <Image
                src="/google.png"
                alt="google logo"
                width={18}
                height={13}
                priority
              />
            </div>
            <p className="hidden sm:block text-sm">Sign in with Google</p>
          </button>
          <button
            type="button"
            onClick={() => {
              const searchParams = new URLSearchParams(window.location.search);
              const redirectTo = searchParams.get("redirectTo");
              oauthRedirect.fortyTwo(redirectTo || undefined);
            }}
            className="flex-1 bg-[#18171D] hover:bg-[#1f1e26] transition-colors text-[#ACA6DB] text-xs rounded-xl py-3 flex items-center justify-center gap-1.5"
          >
            <div>
              <Image
                src="/42.png"
                alt="42 logo"
                width={24}
                height={18}
                priority
              />
            </div>
            <p className="hidden sm:block text-sm">Sign in with Intra 42</p>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-0.5 bg-[#ACA6DB]/10" />
          <span className="text-[#BABABA] text-xs">or</span>
          <div className="flex-1 h-0.5 bg-[#ACA6DB]/10" />
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-4">
          <FormInput
            label="Username"
            name="username"
            placeholder="Enter your username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
          />

          <FormInput
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            onPaste={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="text-[#BABABA] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
        </div>

        {/* Forgot password */}
        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-[#E5533D] text-xs hover:underline"
          >
            FORGET PASSWORD?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#EC4949] hover:bg-[#c94430] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-black text-[13px] font-bold tracking-widest rounded-xl py-2.5"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-[#56536E]">
        <Link
          href={`/privacy${typeof window !== "undefined" ? window.location.search : ""}`}
          className="hover:underline hover:text-white transition-colors"
        >
          Privacy Policy
        </Link>
        <span>•</span>
        <Link
          href={`/terms${typeof window !== "undefined" ? window.location.search : ""}`}
          className="hover:underline hover:text-white transition-colors"
        >
          Terms of Service
        </Link>
      </div>
    </div>
  );
}
