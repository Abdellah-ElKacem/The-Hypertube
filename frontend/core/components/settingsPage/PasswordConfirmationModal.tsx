"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, X } from "lucide-react";

interface PasswordConfirmationModalProps {
    isOpen: boolean;
    newEmail: string;
    loading?: boolean;
    error?: string;
    onConfirm: (password: string) => void;
    onClose: () => void;
}

export default function PasswordConfirmationModal({
    isOpen,
    newEmail,
    loading = false,
    error = "",
    onConfirm,
    onClose,
}: PasswordConfirmationModalProps) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        setPassword("");
        setShowPassword(false);
        onClose();
    };

    const handleConfirm = () => {
        onConfirm(password);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative bg-[#161618] border border-[#2a2a2e] rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2a2e]">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#EC4949]/15 text-[#EC4949] shrink-0">
                            <Lock size={16} />
                        </div>
                        <div>
                            <h2 className="text-white text-base font-semibold leading-tight">
                                Confirm your password
                            </h2>
                            <p className="text-[#8e8d9c] text-xs mt-0.5">
                                Verify it&apos;s you before we update your email
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-[#8e8d9c] hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition-colors duration-200"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 flex flex-col gap-5">
                    {/* New email card */}
                    <div className="flex items-center justify-between gap-3 bg-[#1e1e22] border border-[#2a2a2e] rounded-xl px-4 py-3">
                        <p className="text-[#8e8d9c] text-[11px] uppercase tracking-wide font-medium">
                            New email
                        </p>
                        <p className="text-white text-sm font-medium truncate">{newEmail}</p>
                    </div>

                    {/* Password input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-white text-xs font-regular pl-1">
                            Current password
                        </label>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your current password"
                                className="w-full text-white text-[13px] placeholder:text-[#4a4a52] rounded-xl px-4 py-2.5 outline-none border border-[#2a2a2e] focus:border-[#EC4949]/50 transition-colors duration-200 bg-[#1e1e22] pr-10"
                                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-[#56536E] hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                            <p className="text-red-400 text-[11px]">{error}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#2a2a2e]">
                    <button
                        onClick={handleClose}
                        className="rounded-xl px-5 py-2 border border-[#343041] text-[#C2C2C2] text-sm hover:bg-white/5 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="rounded-xl px-5 py-2 bg-[#EC4949] text-white text-sm font-medium hover:bg-[#d63f3f] transition-colors duration-200 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Confirm & Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
