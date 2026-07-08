"use client";

import Image from "next/image";
import Link from "next/link";
import { Film } from "lucide-react";
import { TopMoviesProps } from "@/core/types/profile";
import { MovieSkeleton } from "./ProfileSkeletons";

const getPosterUrl = (poster: string | null | undefined) => {
    if (!poster) return "/no-poster.png";
    return poster.startsWith("http") ? poster : `https://image.tmdb.org/t/p/w500${poster}`;
};

const getYear = (yearStr: string | number | null | undefined) => {
    if (!yearStr) return "N/A";
    const str = String(yearStr);
    if (!isNaN(Number(str)) && str.length === 4) return str;
    const parsedDate = new Date(str);
    return isNaN(parsedDate.getTime()) ? str : parsedDate.getFullYear().toString();
};

const formatRuntime = (runtime: number | string | null | undefined) => {
    const minutes = Number(runtime);
    if (isNaN(minutes) || minutes <= 0) return "N/A";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export default function TopMovies({
    topMovies,
    isLoadingMovies,
    isMine,
}: TopMoviesProps) {
    return (
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4 min-w-0">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <Film className="text-[#EC4949] w-5 h-5" />
                <h3 className="text-base font-semibold text-white">Top 3 Movies</h3>
            </div>

            {isLoadingMovies ? (
                <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                    <MovieSkeleton />
                    <MovieSkeleton />
                    <MovieSkeleton />
                </div>
            ) : topMovies.length > 0 ? (
                <div className="relative flex flex-col sm:flex-row lg:flex-col gap-3 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                    {topMovies.map((movie, index) => (
                        <Link
                            href={`/library/${movie.imdb_code}`}
                            key={movie.imdb_code}
                            className="group relative overflow-hidden flex gap-4 p-2 transition-all duration-300 hover:bg-white/5 rounded-xl flex-1 min-w-[220px] lg:w-full shrink-0 lg:min-w-0 items-center hover:no-underline"
                        >
                            <span className="absolute -top-1.5 md:-top-4 right-0 text-8xl font-black text-white/5 select-none w-12 text-center shrink-0">
                                {index + 1}
                            </span>
                            <div className="w-23 h-28 relative rounded-lg overflow-hidden bg-black/40 shrink-0">
                                <Image
                                    src={getPosterUrl(movie.poster)}
                                    alt={movie.title}
                                    fill
                                    sizes="64px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    unoptimized
                                />
                            </div>
                            <div className="flex flex-col justify-between py-1 min-w-0 flex-1 h-28">
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <h4 className="font-semibold text-sm text-white group-hover:text-[#A989D2] transition-colors truncate">
                                        {movie.title}
                                    </h4>
                                    <p className="text-[10px] text-gray-400">
                                        {getYear(movie.year)} • {formatRuntime(movie.runtime)}
                                    </p>
                                </div>
                                <div className="w-fit border border-yellow-500/25 px-2 py-0.5 rounded-full text-[10px] font-bold text-yellow-500 flex items-center gap-1">
                                    ★<span className="text-white font-normal">{(movie.rating !== undefined && movie.rating !== null) ? Number(movie.rating).toFixed(1) : "0.0"} / 10</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-dashed border-white/10 rounded-xl text-center gap-2">
                    <p className="text-xs text-gray-400">
                        {isMine
                            ? "You haven't set your top 3 movies yet."
                            : "This user hasn't added any top movies yet."}
                    </p>
                    {isMine && (
                        <Link
                            href="/library"
                            className="text-[11px] px-4 py-1.5 bg-[#A989D2] hover:bg-[#A989D2]/90 text-white font-medium rounded-full shadow-md transition-all hover:no-underline"
                        >
                            Explore Movies
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
