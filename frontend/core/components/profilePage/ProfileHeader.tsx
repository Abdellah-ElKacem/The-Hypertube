"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Film, Clapperboard, Ticket, Sparkles, Award } from "lucide-react";
import { ProfileHeaderProps } from "@/core/types/profile";

const COVER_PRESETS = [
    {
        id: "default",
        name: "Sunset Dream",
        value: "bg-linear-to-bl from-[#A989D2] to-[#0C74C5]",
        type: "gradient"
    },
    {
        id: "cyber",
        name: "Neon Cyber",
        value: "bg-linear-to-r from-[#EC4949] via-fuchsia-600 to-purple-600",
        type: "gradient"
    },
    {
        id: "cinema",
        name: "Midnight Cinema",
        value: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
        type: "image"
    },
    {
        id: "cosmic",
        name: "Cosmic Red",
        value: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200&auto=format&fit=crop",
        type: "image"
    },
    {
        id: "marquee",
        name: "Vintage Marquee",
        value: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop",
        type: "image"
    }
];

const getBadgeStyles = (name: string) => {
    switch (name) {
        case "First-Cut Critic":
            return {
                bg: "bg-[#94A3B8]/10",
                border: "border-[#94A3B8]/20",
                text: "text-[#94A3B8]",
                icon: Film
            };
        case "Indie Reviewer":
            return {
                bg: "bg-[#14B8A6]/10",
                border: "border-[#14B8A6]/20",
                text: "text-[#14B8A6]",
                icon: Clapperboard
            };
        case "Feature Critic":
            return {
                bg: "bg-[#6366F1]/10",
                border: "border-[#6366F1]/20",
                text: "text-[#6366F1]",
                icon: Ticket
            };
        case "Box Office Expert":
            return {
                bg: "bg-[#A855F7]/10",
                border: "border-[#A855F7]/20",
                text: "text-[#A855F7]",
                icon: Sparkles
            };
        case "Cinema Connoisseur":
            return {
                bg: "bg-[#F43F5E]/10",
                border: "border-[#F43F5E]/20",
                text: "text-[#F43F5E]",
                icon: Award
            };
        default:
            return {
                bg: "bg-[#94A3B8]/10",
                border: "border-[#94A3B8]/20",
                text: "text-[#94A3B8]",
                icon: Film
            };
    }
};

export default function ProfileHeader({
    profileUser,
    isMine,
    badges,
    selectedCoverId,
    onSelectCover,
    isLoadingUser,
}: ProfileHeaderProps) {
    const [showCoverPicker, setShowCoverPicker] = useState<boolean>(false);
    const currentCover = COVER_PRESETS.find(p => p.id === selectedCoverId) || COVER_PRESETS[0];

    return (
        <div className="flex flex-col">
            <div
                className="relative w-full md:h-70 h-40 rounded-xl overflow-hidden bg-cover bg-center transition-all duration-500 bg-zinc-900 border border-white/5 shadow-inner"
                style={
                    currentCover.type === "image"
                        ? { backgroundImage: `url(${currentCover.value})` }
                        : {}
                }
            >
                {currentCover.type === "gradient" && (
                    <div className={`absolute inset-0 ${currentCover.value}`} />
                )}
                {isMine && (
                    <div className="absolute top-3 right-3 flex gap-2 z-30">
                        <button
                            onClick={() => setShowCoverPicker(!showCoverPicker)}
                            className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg cursor-pointer hover:bg-white/20 transition-all text-white flex items-center justify-center border border-white/5 active:scale-95"
                            title="Customize Cover"
                        >
                            <Camera size={18} className="drop-shadow-md" />
                        </button>

                        {showCoverPicker && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowCoverPicker(false)} />
                                <div className="absolute right-0 mt-2 w-48 bg-[#1f1e25]/95 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl flex flex-col gap-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                        Choose Cover
                                    </p>
                                    <div className="grid grid-cols-5 gap-1.5 mt-1">
                                        {COVER_PRESETS.map((preset) => (
                                            <button
                                                key={preset.id}
                                                onClick={() => {
                                                    onSelectCover(preset.id);
                                                    setShowCoverPicker(false);
                                                }}
                                                className={`w-7 h-7 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                                                    selectedCoverId === preset.id
                                                        ? "border-[#EC4949] scale-105"
                                                        : "border-white/10 hover:border-white/30"
                                                }`}
                                                title={preset.name}
                                            >
                                                {preset.type === "gradient" ? (
                                                    <div className={`w-full h-full ${preset.value}`} />
                                                ) : (
                                                    <img
                                                        src={preset.value}
                                                        alt={preset.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-end sm:-mt-10 -mt-8 z-10 px-4 sm:px-6">
                <div className="flex gap-4 text-sm items-center">
                    <div className="bg-[#1f1e25] rounded-full p-1.5 sm:p-2 sm:ml-8 mt-2">
                        {isLoadingUser ? (
                            <div className="rounded-full sm:w-24 sm:h-24 w-20 h-20 bg-white/5 animate-pulse" />
                        ) : profileUser?.avatar ? (
                            <Image
                                src={profileUser.avatar}
                                alt={profileUser.username || "Avatar"}
                                width={120}
                                height={120}
                                className="rounded-full sm:w-24 sm:h-24 w-20 h-20 object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="rounded-full sm:w-24 sm:h-24 w-20 h-20 bg-[#EC4949] flex items-center justify-center text-2xl font-bold text-[#18171d] shadow-md">
                                {profileUser?.firstName?.[0]?.toUpperCase() || "G"}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col pt-9 sm:pt-11.5">
                        {isLoadingUser ? (
                            <>
                                <div className="h-5 w-32 bg-white/5 animate-pulse rounded-md" />
                                <div className="h-3 w-20 bg-white/5 animate-pulse rounded-md mt-1" />
                            </>
                        ) : (
                            <div className="flex flex-col gap-0.5 w-53 md:w-full">
                                <h2 className="font-bold text-white text-base truncate">
                                    {profileUser?.firstName} {profileUser?.lastName}
                                </h2>
                                <p className="text-gray-400 text-xs truncate">@{profileUser?.username}</p>
                            </div>
                        )}
                    </div>
                </div>
                {badges.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-4 justify-center sm:justify-end">
                        {badges.map((badge, index) => {
                            const styles = getBadgeStyles(badge.name);
                            const IconComponent = styles.icon;
                            return (
                                <div
                                    key={index}
                                    className={`bg-[#1f1e25]/60 ${styles.bg} backdrop-blur-sm border ${styles.border} px-3 py-1.5 h-fit rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs font-medium ${styles.text}`}
                                    title={badge.description}
                                >
                                    <IconComponent size={16} />
                                    <span>{badge.name}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
