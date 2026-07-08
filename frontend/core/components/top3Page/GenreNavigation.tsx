"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GenreNavigationProps } from "@/core/types/topMovies";

export default function GenreNavigation({
    genres,
    selectedGenre,
    onSelectGenre,
}: GenreNavigationProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollState, setScrollState] = useState({
        showLeft: false,
        showRight: false,
    });

    const updateScrollState = () => {
        const target = scrollContainerRef.current;
        if (!target) return;
        const showLeft = target.scrollLeft > 5;
        const showRight =
            target.scrollLeft <
            target.scrollWidth - target.clientWidth - 5;
        setScrollState({ showLeft, showRight });
    };

    const handleScroll = () => {
        updateScrollState();
    };

    useEffect(() => {
        // Initial check on mount
        updateScrollState();
        
        // Listen to window resize to update navigation buttons
        window.addEventListener("resize", updateScrollState);
        return () => window.removeEventListener("resize", updateScrollState);
    }, [genres]);

    // Scroll function for buttons
    const handleScrollClick = (direction: "left" | "right") => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const scrollAmount = 220; // smooth scroll amount
        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative w-full group/nav">
            {/* Left Scroll Button */}
            <button
                onClick={() => handleScrollClick("left")}
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-[#EC4949] text-white p-2 rounded-full border border-white/10 shadow-lg cursor-pointer transition-all duration-300 backdrop-blur-md flex items-center justify-center ${
                    scrollState.showLeft
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-90 pointer-events-none"
                }`}
                aria-label="Scroll left"
            >
                <ChevronLeft size={16} />
            </button>

            {/* Left Fade Indicator */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-[#1f1e25] to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
                    scrollState.showLeft ? "opacity-100" : "opacity-0"
                }`}
            />

            {/* Right Scroll Button */}
            <button
                onClick={() => handleScrollClick("right")}
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-[#EC4949] text-white p-2 rounded-full border border-white/10 shadow-lg cursor-pointer transition-all duration-300 backdrop-blur-md flex items-center justify-center ${
                    scrollState.showRight
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-90 pointer-events-none"
                }`}
                aria-label="Scroll right"
            >
                <ChevronRight size={16} />
            </button>

            {/* Right Fade Indicator */}
            <div
                className={`absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-[#1f1e25] to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
                    scrollState.showRight ? "opacity-100" : "opacity-0"
                }`}
            />

            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-3 overflow-x-auto no-scrollbar w-full py-1"
            >
                {genres.map((g) => (
                    <button
                        key={g}
                        onClick={() => onSelectGenre(g)}
                        className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border border-white/5 cursor-pointer whitespace-nowrap ${
                            selectedGenre === g
                                ? "bg-[#EC4949] text-white shadow-lg shadow-[#EC4949]/20"
                                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                        {g}
                    </button>
                ))}
            </div>
        </div>
    );
}
