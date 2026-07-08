"use client";

import Image from "next/image";
import Link from "next/link";
import { Film, ListVideo } from "lucide-react";
import { WishListSectionProps } from "@/core/types/profile";
import { MovieGridSkeleton } from "./ProfileSkeletons";

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

export default function WishListSection({
    wishlist,
    isLoadingWishlist,
    isMine,
}: WishListSectionProps) {
    return (
        <div className="w-full flex flex-col gap-4 mt-6">
            <div className="flex gap-2 items-center border-b border-white/10 pb-2">
                <ListVideo size={20} className="text-[#EC4949]" />
                <h3 className="text-base font-semibold text-white">The WishList</h3>
                <div className="bg-[#1c1b22] border border-[#F8E9A1]/20 px-2.5 py-1 rounded-[10px] ml-1 font-medium text-[#F8E9A1] text-xs">
                    {isLoadingWishlist ? "..." : wishlist.length}
                </div>
            </div>

            {isLoadingWishlist ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <MovieGridSkeleton key={idx} />
                    ))}
                </div>
            ) : wishlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full pb-10">
                    {wishlist.map((movie) => (
                        <Link
                            href={`/library/${movie.imdb_code}`}
                            key={movie.imdb_code}
                            className="group flex flex-col gap-2 rounded-xl cursor-pointer transition-all duration-300 relative hover:no-underline"
                        >
                            <div className="relative aspect-4/5 w-full rounded-lg overflow-hidden shadow-md bg-white/5">
                                <Image
                                    src={getPosterUrl(movie.poster)}
                                    alt={movie.title}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    unoptimized
                                />

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
            ) : (
                <div className="flex flex-col items-center justify-center p-24 text-gray-400 gap-4 w-full">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400">
                        <Film className="w-8 h-8 opacity-60" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-white/80">
                            {isMine ? "Your watchlist is empty" : "Watchlist is empty"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            {isMine
                                ? "Explore movies and click 'Add to Wishlist' to save them here."
                                : "This user has no movies saved in their watchlist."}
                        </p>
                    </div>
                    {isMine && (
                        <Link
                            href="/library"
                            className="px-6 py-2.5 bg-[#EC4949] hover:bg-[#d43f3f] text-white rounded-full text-sm font-semibold transition-colors mt-2 hover:no-underline"
                        >
                            Go to Library
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
