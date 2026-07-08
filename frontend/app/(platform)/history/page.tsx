"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/core/lib/axios";
import { useAuth } from "@/core/contexts/AuthContext";
import { Film, Trash2, Calendar, Clock, Star } from "lucide-react";
import { ApiHistoryItem } from "@/core/types/movie";

interface HistoryItem {
    id: string;
    title: string;
    poster: string;
    rating: string;
    year: string;
    duration: string;
    summary: string;
    watchedAt: string | null;
}

const MovieSkeleton = () => (
    <div className="w-full flex flex-col sm:flex-row gap-4 bg-white/2 rounded-2xl p-4 animate-pulse border border-white/5 items-start sm:items-stretch">
        <div className="aspect-4/6 w-20 sm:w-30 bg-white/5 rounded-xl shrink-0" />
        <div className="flex flex-col justify-between gap-2 grow">
            <div className="flex flex-col gap-2">
                <div className="h-5 bg-white/5 rounded-md w-1/3" />
                <div className="h-3.5 bg-white/5 rounded-md w-1/4 mt-1" />
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
                <div className="h-3 bg-white/5 rounded-md w-5/6" />
                <div className="h-3 bg-white/5 rounded-md w-2/3" />
            </div>
        </div>
        <div className="flex sm:flex-col gap-2 shrink-0 mt-2 sm:mt-0 justify-between items-start sm:items-end">
            <div className="h-4 bg-white/5 rounded-md w-20" />
            <div className="h-4 bg-white/5 rounded-md w-16" />
        </div>
    </div>
);

export default function HistoryPage() {
    const { user, loading: authLoading } = useAuth();
    const [movies, setMovies] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isClearing, setIsClearing] = useState<boolean>(false);

    const fetchHistory = async () => {
        if (!user?._id) return;
        setIsLoading(true);
        setError(null);
        try {
            let res;
            try {
                // Try plural route first
                res = await api.get("/movies/history");
            } catch (err: unknown) {
                // Fallback to singular route if plural returns 404
                const axiosError = err as { response?: { status?: number } };
                if (axiosError?.response?.status === 404) {
                    res = await api.get("/movie/history");
                } else {
                    throw err;
                }
            }

            if (res.data?.success && res.data.data) {
                const dataObj = res.data.data;
                const list = Array.isArray(dataObj)
                    ? dataObj
                    : Array.isArray(dataObj.movies)
                      ? dataObj.movies
                      : [];

                const mapped = list.map((item: ApiHistoryItem): HistoryItem => {
                    const m = item.movie || item;
                    const dateObj = item.watchedAt
                        ? new Date(item.watchedAt)
                        : null;
                    const formattedDate = dateObj
                        ? dateObj.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                          })
                        : "";
                    const formattedTime = dateObj
                        ? dateObj.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                          })
                        : "";
                    return {
                        id: m.imdb_code || m.id || String(Math.random()),
                        title: m.title || "Untitled",
                        poster: m.poster || m.posterUrl || "",
                        rating: m.rating ? Number(m.rating).toFixed(1) : "0.0",
                        year: m.year ? m.year.toString().split("-")[0] : "N/A",
                        duration: m.runtime
                            ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m`
                            : "N/A",
                        summary:
                            m.summary ||
                            m.description ||
                            "No overview available.",
                        watchedAt: dateObj
                            ? `${formattedDate} | ${formattedTime}`
                            : null,
                    };
                });
                setMovies(mapped.reverse());
            } else {
                setError("Failed to fetch watch history.");
            }
        } catch (err: unknown) {
            console.error("Watch history fetch error:", err);
            const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
            setError(
                axiosError?.response?.data?.message ||
                    axiosError?.message ||
                    "Failed to load watch history.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (user?._id) {
                fetchHistory();
            } else {
                setIsLoading(false);
                setError("Please log in to view your watch history.");
            }
        }
    }, [user?._id, authLoading]);

    // const handleClearHistory = async () => {
    //     if (!confirm("Are you sure you want to clear your entire watch history?")) return;
    //     setIsClearing(true);
    //     try {
    //         try {
    //             await api.delete("/movies/history");
    //         } catch (err: any) {
    //             if (err?.response?.status === 404) {
    //                 await api.delete("/movie/history");
    //             } else {
    //                 throw err;
    //             }
    //         }
    //         setMovies([]);
    //     } catch (err) {
    //         console.error("Error clearing watch history:", err);
    //         alert("Failed to clear watch history. Please try again.");
    //     } finally {
    //         setIsClearing(false);
    //     }
    // };

    const getPosterUrl = (poster: string) => {
        if (!poster) return "/no-poster.png";
        return poster.startsWith("http")
            ? poster
            : `https://image.tmdb.org/t/p/w500${poster}`;
    };

    return (
        <div className="flex flex-col w-full gap-8 pb-6">
            <div className="flex sticky top-0 z-30 justify-between items-center flex-wrap gap-4 border-b border-white/5 pb-6 bg-[#1f1e25]">
                <div className="flex gap-3 items-center w-full">
                    <h1 className="font-bold text-2xl md:text-3xl text-white w-full">
                        Watch History
                    </h1>
                    {/* <div className="flex justify-center items-center bg-white/10 border border-[#F8E9A1]/20 px-3 py-1 rounded-[10px] text-xs text-[#F8E9A1] font-bold">
                        {movies.length}
                    </div> */}
                </div>

                {/* {movies.length > 0 && (
                    <button
                        onClick={handleClearHistory}
                        disabled={isClearing}
                        className="bg-white/5 border border-white/10 flex gap-2 items-center px-4 py-2 rounded-full hover:bg-[#EC4949]/20 hover:border-[#EC4949]/30 hover:text-[#EC4949] transition-all text-white text-xs md:text-sm cursor-pointer disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>{isClearing ? "Clearing..." : "Clear History"}</span>
                    </button>
                )} */}
            </div>

            {error && (
                <div className="w-full bg-[#EC4949]/10 border border-[#EC4949]/30 rounded-xl p-4 text-[#EC4949] text-xs md:text-sm">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <MovieSkeleton key={i} />
                    ))}
                </div>
            ) : movies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-4">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400">
                        <Film className="w-8 h-8 opacity-60" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-white/80">
                            Your watch history is empty
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Start watching movies from the library to build your
                            history.
                        </p>
                    </div>
                    <Link
                        href="/library"
                        className="px-6 py-2.5 bg-[#EC4949] hover:bg-[#d43f3f] text-white rounded-full text-sm font-semibold transition-colors mt-2 hover:no-underline"
                    >
                        Go to Library
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-6 h-full">
                    {movies.map((movie, index) => (
                        <Link
                            key={`${movie.id}-${index}`}
                            href={`/library/${movie.id}`}
                            className="group flex flex-row gap-4 hover:bg-[#1f1e25]/90 transition-all duration-300 items-start sm:items-stretch hover:no-underline animate-fadeIn"
                        >
                            {/* Movie Poster */}
                            <div className="relative aspect-4/6 w-20 sm:w-30 rounded-xl shrink-0 overflow-hidden ">
                                <Image
                                    src={getPosterUrl(movie.poster)}
                                    alt={movie.title}
                                    fill
                                    sizes="80px"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    unoptimized
                                />
                            </div>

                            {/* Movie Details */}
                            <div className="flex flex-col h-full justify-between gap-1.5 grow min-w-0">
                                <h3 className="font-semibold text-sm md:text-lg text-white group-hover:text-[#EC4949] transition-colors duration-300 truncate text-start">
                                    {movie.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                                    <span>{movie.year}</span>
                                    <span>•</span>
                                    <span>{movie.duration}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 text-[#F8E9A1]">
                                        <span>⭐</span> {movie.rating} / 10
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 md:line-clamp-3 leading-relaxed mt-4 md:mt-12 font-light max-w-3xl text-start">
                                    {movie.summary || "No overview available."}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
