"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, Star, Info } from "lucide-react";
import { MovieRankShowcaseProps } from "@/core/types/topMovies";

export default function MovieRankShowcase({
    activeMovie,
    activeIdx,
    isInWatchlist,
    onToggleWatchlist,
}: MovieRankShowcaseProps) {
    if (!activeMovie) return null;

    return (
        <div className="relative w-full min-h-[480px] bg-[#1a191f] border border-white/5 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center md:items-stretch gap-8 overflow-hidden">
            {/* Background Poster with Opacity and Gradient */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <Image
                    src={activeMovie.bgUrl}
                    alt="Poster background"
                    fill
                    className="object-cover opacity-15"
                    unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-r from-[#1a191f] via-[#1a191f]/70 to-[#1a191f]" />
            </div>

            {/* Big Rank Number Background */}
            <div className="absolute right-6 md:right-70 bottom-[-20px] md:bottom-[-50px] select-none pointer-events-none z-0">
                <h1 className="font-anton font-black text-[150px] md:text-[450px] leading-none text-white/3">
                    {activeIdx + 1}
                </h1>
            </div>

            {/* Left Side: Movie details & Description */}
            <div className="flex-1 flex flex-col justify-between z-10 w-full">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        {/* Big ranking Badge */}
                        <div className="flex items-center justify-center bg-[#EC4949] text-white font-anton text-2xl md:text-3xl px-4 py-1.5 rounded-xl shadow-lg shadow-[#EC4949]/30">
                            #{activeIdx + 1}
                        </div>
                        <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-semibold">
                            <Star size={14} className="fill-yellow-500" />
                            <span>{activeMovie.rating} / 10</span>
                        </div>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                        {activeMovie.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-400 font-medium">
                        <span>{activeMovie.year}</span>
                        <span>•</span>
                        <span>{activeMovie.duration}</span>
                        <span>•</span>
                        <div className="flex gap-1.5">
                            {activeMovie.genres?.slice(0, 3).map((g: string) => (
                                <span
                                    key={g}
                                    className="bg-white/5 px-2 py-0.5 rounded-md text-gray-300 text-xs"
                                >
                                    {g}
                                </span>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs md:text-sm text-gray-300 max-w-xl leading-relaxed font-light mt-2 line-clamp-5">
                        {activeMovie.description}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-6">
                    <button
                        onClick={onToggleWatchlist}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white cursor-pointer active:scale-95 transition-all border border-white/5"
                        title={
                            isInWatchlist
                                ? "Remove from Watchlist"
                                : "Add to Watchlist"
                        }
                    >
                        <Bookmark
                            size={20}
                            fill={isInWatchlist ? "white" : "none"}
                        />
                    </button>
                    <Link
                        href={`/library/${activeMovie.id}`}
                        className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-full text-sm md:text-base font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/15 hover:no-underline"
                    >
                        <Info size={20} />
                        <span>Details</span>
                    </Link>
                </div>
            </div>

            {/* Right Side: Beautiful Poster Display */}
            <div className="w-[200px] md:w-[280px] shrink-0 z-10 shadow-2xl relative aspect-4/5 rounded-xl overflow-hidden group border border-white/5">
                <Image
                    src={activeMovie.bgUrl}
                    alt={activeMovie.title}
                    fill
                    sizes="(max-width: 768px) 200px, 280px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                />
            </div>
        </div>
    );
}
