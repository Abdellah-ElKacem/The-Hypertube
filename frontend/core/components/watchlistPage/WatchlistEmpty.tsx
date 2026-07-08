"use client";

import Link from "next/link";
import { Film } from "lucide-react";

export default function WatchlistEmpty() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-4">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400">
                <Film className="w-8 h-8 opacity-60" />
            </div>
            <div className="text-center">
                <p className="text-lg font-medium text-white/80">Your watchlist is empty</p>
                <p className="text-sm text-gray-500 mt-1">Explore movies and click "Add to Wishlist" to save them here.</p>
            </div>
            <Link
                href="/library"
                className="px-6 py-2.5 bg-[#EC4949] hover:bg-[#d43f3f] text-white rounded-full text-sm font-semibold transition-colors mt-2 hover:no-underline"
            >
                Go to Library
            </Link>
        </div>
    );
}
