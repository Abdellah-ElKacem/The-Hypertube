"use client";

import Link from "next/link";
import { Bookmark, ChevronRight } from "lucide-react";
import MovieCarousel from "./MovieCarousel";
import { MyListProps } from "@/core/types/movie";

export default function MyListSection({
    watchlist,
    itemsPerPage,
    onMovieClick,
    onToggleWatchlist,
}: MyListProps) {
    if (watchlist.length > 0) {
        return (
            <MovieCarousel
                title="My list"
                moviesList={watchlist}
                itemsPerPage={itemsPerPage}
                onMovieClick={onMovieClick}
                watchlist={watchlist}
                onToggleWatchlist={onToggleWatchlist}
                viewAllHref="/my-watchlist"
            />
        );
    }

    return (
        <section className="flex flex-col gap-4">
            <h3 className="text-xl font-medium text-white">My list</h3>
            <div className="w-full flex flex-col items-center justify-center py-10 px-6 rounded-2xl bg-linear-to-b from-white/5 to-transparent border border-white/5 backdrop-blur-md text-center gap-4">
                <div className="p-4 rounded-full bg-[#EC4949]/10 border border-[#EC4949]/20 text-[#EC4949] animate-bounce">
                    <Bookmark size={32} />
                </div>
                <div className="flex flex-col gap-1 max-w-sm">
                    <h4 className="text-white font-semibold text-base">
                        Your Watchlist is empty
                    </h4>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                        You haven't added any movies to your list yet.
                        Start exploring and build your perfect stream
                        queue!
                    </p>
                </div>
                <Link
                    href="/library"
                    className="px-6 py-2 bg-[#EC4949] hover:bg-[#ff5a5a] text-white rounded-full text-xs font-semibold tracking-wider transition-all duration-300 transform active:scale-95 shadow-lg shadow-[#EC4949]/20 flex items-center gap-1.5 cursor-pointer mt-1"
                >
                    <span>Browse Movies</span>
                    <ChevronRight size={14} />
                </Link>
            </div>
        </section>
    );
}
