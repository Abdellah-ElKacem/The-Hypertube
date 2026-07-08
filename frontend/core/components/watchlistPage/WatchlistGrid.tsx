"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark } from "lucide-react";
import { WatchlistGridProps } from "@/core/types/watchlist";
import { useAuth } from "@/core/contexts/AuthContext";

const getPosterUrl = (poster: string) => {
    if (!poster) return "/no-poster.png";
    return poster.startsWith("http") ? poster : `https://image.tmdb.org/t/p/w500${poster}`;
};

const getYear = (yearStr: string) => {
    if (!yearStr) return "N/A";
    if (!isNaN(Number(yearStr)) && yearStr.length === 4) return yearStr;
    const parsedDate = new Date(yearStr);
    return isNaN(parsedDate.getTime()) ? yearStr : parsedDate.getFullYear().toString();
};

const formatRuntime = (runtime: number | string) => {
    const minutes = Number(runtime);
    if (isNaN(minutes) || minutes <= 0) return "N/A";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export default function WatchlistGrid({
    movies,
    onRemoveFromWishlist,
}: WatchlistGridProps) {
    const { watchedMovieIds } = useAuth();

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
                <Link
                    key={movie.imdb_code}
                    href={`/library/${movie.imdb_code}`}
                    className="group flex flex-col gap-2 rounded-xl cursor-pointer transition-all duration-300 relative hover:no-underline"
                >
                    {/* Movie Poster */}
                    <div className="relative aspect-4/5 w-full rounded-lg overflow-hidden shadow-md bg-white/5">
                        <Image
                            src={getPosterUrl(movie.poster)}
                            alt={movie.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized
                        />
                        {watchedMovieIds?.has(movie.imdb_code) && (
                            <div className="absolute top-2 left-2 flex gap-1.5 items-center bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium px-2.5 py-0.5 rounded-full border border-white/5 shadow-md z-20">
                                <div className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full animate-pulse" />
                                <span>Watched</span>
                            </div>
                        )}
                        
                        {/* Quick Actions Overlay (Remove button) */}
                        <button
                            onClick={(e) => onRemoveFromWishlist(e, movie.imdb_code)}
                            className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-[#EC4949] text-white rounded-full transition-colors z-20 backdrop-blur-sm opacity-0 group-hover:opacity-100 duration-200 shadow-md border border-white/5 cursor-pointer"
                            title="Remove from Watchlist"
                        >
                            <Bookmark size={14} fill="white" className="text-white" />
                        </button>

                        {/* Description Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/65 flex items-end justify-start p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 select-none">
                            <p className="text-xs text-gray-200 line-clamp-4 text-start leading-relaxed font-light">
                                {movie.summary || "No overview available."}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 px-1">
                        <h4 className="font-semibold text-xs truncate text-white group-hover:text-[#EC4949] transition-colors duration-300">
                            {movie.title}
                        </h4>
                        <div className="flex items-center justify-between gap-1.5 text-[10px] text-gray-400">
                            <div className="flex items-center gap-1 truncate">
                                <span>{getYear(movie.year)}</span>
                                <span>—</span>
                                <span className="truncate">
                                    {formatRuntime(movie.runtime)}
                                </span>
                            </div>
                            <span className="text-nowrap text-[10px] font-medium">
                                <span>⭐</span> {movie.rating ? Number(movie.rating).toFixed(1) : "0.0"} / 10
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
