"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark } from "lucide-react";
import { LibraryGridProps } from "@/core/types/library";
import { useAuth } from "@/core/contexts/AuthContext";

const formatDuration = (duration: string) => {
    return duration
        .replace(/hours?/gi, "h")
        .replace(/minutes?\.?/gi, "min")
        .trim();
};

export default function LibraryGrid({
    movies,
    wishlistIds,
    queryString,
    onToggleWishlist,
}: LibraryGridProps) {
    const { watchedMovieIds } = useAuth();

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((movie) => (
                    <Link
                        key={movie.id}
                        href={`/library/${movie.id}${queryString ? `?${queryString}` : ""}`}
                        className="group flex flex-col gap-2 rounded-xl cursor-pointer transition-all duration-300 hover:no-underline"
                    >
                        {/* Movie Poster */}
                        <div className="relative aspect-4/5 w-full rounded-lg overflow-hidden shadow-md bg-white/5">
                            <Image
                                src={movie.posterUrl}
                                alt={movie.title}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                unoptimized
                            />
                            {watchedMovieIds?.has(movie.id) && (
                                <div className="absolute top-2 left-2 flex gap-1.5 items-center bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium px-2.5 py-0.5 rounded-full border border-white/5 shadow-md z-20">
                                    <div className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full animate-pulse" />
                                    <span>Watched</span>
                                </div>
                            )}
                            {/* Wishlist Toggle Button */}
                            <button
                                onClick={(e) => onToggleWishlist(e, movie.id)}
                                className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-[#EC4949] text-white rounded-full transition-colors z-20 backdrop-blur-sm opacity-0 group-hover:opacity-100 duration-200 shadow-md border border-white/5 cursor-pointer"
                                title={wishlistIds.has(movie.id) ? "Remove from Watchlist" : "Add to Watchlist"}
                            >
                                <Bookmark size={14} fill={wishlistIds.has(movie.id) ? "white" : "none"} className="text-white" />
                            </button>
                            {/* Description Overlay on Hover */}
                            <div className="absolute inset-0 bg-black/60 flex items-end justify-start p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 select-none">
                                <p className="text-xs text-gray-200 line-clamp-4 text-start leading-relaxed font-light">
                                    {movie.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 px-1">
                            <h4 className="font-semibold text-[12px] md:text-sm truncate text-white group-hover:text-[#EC4949] transition-colors duration-300">
                                {movie.title}
                            </h4>
                            <div className="flex items-center justify-between gap-1.5 text-[10px] md:text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                    <span>{movie.year}</span>
                                    <span>—</span>
                                    <span className="truncate">
                                        {formatDuration(movie.duration)}
                                    </span>
                                </div>
                                <span className="text-nowrap text-[10px] md:text-xs">⭐ {parseFloat(movie.rating).toFixed(1)} / 10</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
