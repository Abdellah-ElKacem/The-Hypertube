"use client";

import { Star } from "lucide-react";
import { TopRatedGenresProps } from "@/core/types/profile";
import { GenreSkeleton } from "./ProfileSkeletons";

export default function TopRatedGenres({
    genreRatings,
    isLoadingGenres,
}: TopRatedGenresProps) {
    return (
        <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <Star className="text-[#EC4949] w-5 h-5 fill-[#EC4949]/20" />
                <h3 className="text-base font-semibold text-white">Top-Rated Genres</h3>
            </div>

            {isLoadingGenres ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <GenreSkeleton />
                    <GenreSkeleton />
                    <GenreSkeleton />
                    <GenreSkeleton />
                </div>
            ) : genreRatings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 p-4 sm:p-5 w-full">
                    {genreRatings.map((item, idx) => {
                        const percentage = Math.min(100, Math.max(0, (item.rating / 10) * 100));
                        return (
                            <div key={idx} className="flex items-center gap-2 w-full">
                                <span className="w-24 text-xs font-medium text-gray-200 shrink-0 truncate">{item.genre}</span>
                                <div className="flex-1 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#EC4949] rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400 shrink-0 justify-end font-semibold">
                                    <Star size={14} className="text-yellow-500 fill-yellow-500 shrink-0" />
                                    <span className="text-white">{item.rating.toFixed(1)}</span>
                                    <span>/ 10</span>
                                    <span className="text-gray-600">•</span>
                                    <span>({item.count || 0})</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-dashed border-white/10 rounded-xl text-center gap-2">
                    <p className="text-sm text-gray-400">
                        No genre rating data available.
                    </p>
                </div>
            )}
        </div>
    );
}
