"use client";

import React, { useState, useEffect, useRef } from "react";
import { getAccessToken } from "@/core/lib/auth";
import { useAuth } from "@/core/contexts/AuthContext";
import { Loader2, RotateCcw } from "lucide-react";

interface VideoPlayerProps {
    tmdbId: string;
    defaultLang: string;
    posterUrl: string;
}

interface language {
    label: string;
    language: string;
}

const languages: language[] = [
    { label: "English", language: "en" },
    { label: "French", language: "fr" },
    { label: "Spanish", language: "es" },
    { label: "Arabic", language: "ar" },
    { label: "German", language: "de" },
    { label: "Italian", language: "it" },
    { label: "Portuguese", language: "pt" },
    { label: "Russian", language: "ru" },
    { label: "Chinese", language: "zh" },
    { label: "Japanese", language: "ja" },
    { label: "Korean", language: "ko" },
    { label: "Dutch", language: "nl" },
];

const VideoPlayer = React.memo(
    ({ tmdbId, defaultLang, posterUrl }: VideoPlayerProps) => {
        const [token, setToken] = useState<string | null>(null);
        const [isMounted, setIsMounted] = useState<boolean>(false);
        const [hasStarted, setHasStarted] = useState<boolean>(false);
        const [errorType, setErrorType] = useState<"no_peers" | "other" | null>(
            null,
        );
        const [errorMessage, setErrorMessage] = useState<string | null>(null);

        const videoRef = useRef<HTMLVideoElement>(null);
        const { user } = useAuth();
        const lang = user?.subtitlePreference;

        useEffect(() => {
            setToken(getAccessToken());
            setIsMounted(true);
            setHasStarted(false);
            setErrorType(null);
            setErrorMessage(null);
        }, [tmdbId]);

        if (!isMounted) {
            return (
                <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center text-white/60">
                    Loading player...
                </div>
            );
        }

        const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : "";
        const subTokenQuery = token
            ? `&token=${encodeURIComponent(token)}`
            : "";
        const videoUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/stream/${tmdbId}${tokenQuery}`;
        const handleVideoError = (
            e: React.SyntheticEvent<HTMLVideoElement, Event>,
        ) => {
            setErrorType("no_peers");
            setErrorMessage(
                "We couldn't load the video stream. This usually means no peers were found for this torrent, or the connection timed out.",
            );
        };

        const handleReload = () => {
            setErrorType(null);
            setErrorMessage(null);
            setHasStarted(false);

            if (videoRef.current) {
                const separator = videoUrl.includes("?") ? "&" : "?";
                const newSrc = `${videoUrl}${separator}ts=${Date.now()}`;
                videoRef.current.src = newSrc;
                videoRef.current.load();
                videoRef.current
                    .play()
                    .catch((err) => console.log("Play failed: ", err));
            }
        };

        return (
            <div className="relative w-full h-full flex items-center justify-center">
                <video
                    ref={videoRef}
                    src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/stream/${tmdbId}${tokenQuery}`}
                    controls
                    autoPlay={true}
                    crossOrigin="anonymous"
                    className="w-full h-full rounded-2xl object-contain bg-black"
                    onPlay={() => setHasStarted(true)}
                    onPlaying={() => setHasStarted(true)}
                    onLoadedData={() => setHasStarted(true)}
                    onError={handleVideoError}
                >
                    <track
                        key="sub-en"
                        kind="subtitles"
                        src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/subtitles/${tmdbId}?lang=en${subTokenQuery}`}
                        srcLang="en"
                        label="English"
                        default={defaultLang === "en"}
                    />
                    {lang && lang !== "en" && (
                        <track
                            key={`sub-${lang}`}
                            kind="subtitles"
                            src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/subtitles/${tmdbId}?lang=${lang}${subTokenQuery}`}
                            srcLang={lang}
                            label={
                                languages.find(
                                    (language) => language.language === lang,
                                )?.label || lang.toUpperCase()
                            }
                            default={defaultLang === lang}
                        />
                    )}
                </video>
                {!hasStarted && !errorType && posterUrl && (
                    <div className="absolute inset-0 z-10 pointer-events-none rounded-2xl overflow-hidden flex items-center justify-center bg-black">
                        <div
                            className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-30 scale-105"
                            style={{ backgroundImage: `url(${posterUrl})` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/20">
                            <Loader2 className="w-10 h-10 text-[#EC4949] animate-spin" />
                        </div>
                    </div>
                )}
                {errorType && (
                    <div className="absolute inset-0 z-20 rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-black/90 backdrop-blur-md border border-white/10 p-6 text-center">
                        <div
                            className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-20 scale-105 pointer-events-none"
                            style={{ backgroundImage: `url(${posterUrl})` }}
                        />
                        <div className="z-10 max-w-md flex flex-col items-center gap-4">
                            {errorType === "no_peers" ? (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30 text-red-400">
                                        <RotateCcw className="w-6 h-6 animate-pulse" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">
                                        Movie is not available
                                    </h3>
                                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                                        We couldn't find any streamable links
                                        for this movie at the moment.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/30 text-yellow-400">
                                        <RotateCcw className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">
                                        Playback Error
                                    </h3>
                                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                                        {errorMessage ||
                                            "Failed to load video stream. Please try again."}
                                    </p>
                                </>
                            )}

                            <button
                                onClick={handleReload}
                                className="mt-2 flex items-center gap-2 px-6 py-2.5 bg-[#EC4949] hover:bg-[#ff5a5a] active:scale-95 text-white rounded-full text-xs font-semibold tracking-wide shadow-lg shadow-[#EC4949]/20 transition-all duration-200 cursor-pointer"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reload Video</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    },
);

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
