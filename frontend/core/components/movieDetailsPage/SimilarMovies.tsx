"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SimilarMovie } from "@/core/types/library";

interface SimilarMoviesProps {
    similarMovies: SimilarMovie[];
    isSimilarLoading: boolean;
    queryString: string;
}

export default function SimilarMovies({
    similarMovies,
    isSimilarLoading,
    queryString,
}: SimilarMoviesProps) {
    return (
        <div className="flex flex-col gap-6 w-full lg:max-w-[300px] shrink-0 mt-8 lg:mt-0">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                You May Also Like
            </h2>
            {isSimilarLoading ? (
                <div className="flex lg:flex-col gap-4 lg:gap-6 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col lg:flex-row gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 animate-pulse shrink-0 w-[140px] lg:w-auto h-[220px] lg:h-auto"
                        >
                            <div className="w-full aspect-2/3 lg:w-20 lg:h-28 bg-white/5 rounded-xl flex-shrink-0" />
                            <div className="flex flex-col gap-2 grow py-1 w-full">
                                <div className="h-4 bg-white/5 rounded w-3/4" />
                                <div className="h-3 bg-white/5 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : similarMovies.length > 0 ? (
                <div className="flex lg:flex-col gap-4 lg:gap-6 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {similarMovies.slice(0, 10).map((simMovie: SimilarMovie) => (
                        <Link
                            key={simMovie.imdb_code}
                            href={`/library/${simMovie.imdb_code}${queryString ? `?${queryString}` : ""}`}
                            className="group flex flex-col lg:flex-row gap-3 lg:gap-4 items-start cursor-pointer shrink-0 w-[140px] lg:w-auto"
                        >
                            {/* Poster */}
                            <div className="relative w-full aspect-2/3 lg:w-20 lg:h-28 flex-shrink-0 overflow-hidden rounded-xl bg-white/5 shadow-md">
                                <Image
                                    src={
                                        simMovie.poster
                                            ? simMovie.poster.startsWith("http")
                                                ? simMovie.poster
                                                : `https://image.tmdb.org/t/p/w185${simMovie.poster}`
                                            : "/no-poster.png"
                                    }
                                    alt={simMovie.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    unoptimized
                                />
                            </div>

                            {/* Movie Details */}
                            <div className="flex flex-col gap-1 min-w-0 justify-between py-0.5 w-full">
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <h3 className="font-semibold text-xs lg:text-sm truncate text-white group-hover:text-[#EC4949] transition-colors duration-300">
                                        {simMovie.title}
                                    </h3>
                                    <p className="text-[10px] text-gray-400 truncate">
                                        {simMovie.genres && simMovie.genres.length > 0
                                            ? simMovie.genres.join(", ")
                                            : "No Genre"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-x-2 text-[10px] text-gray-400 mt-1">
                                    <span className="flex items-center gap-0.5 text-white/90">
                                        ⭐ {simMovie.rating ? Number(simMovie.rating).toFixed(1) : "0.0"}
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {simMovie.year ? simMovie.year.toString().split("-")[0] : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="py-10 text-center text-xs text-gray-500 font-light bg-white/5 border border-white/5 rounded-2xl">
                    No similar movies found.
                </div>
            )}
        </div>
    );
}
