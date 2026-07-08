"use client";

import Image from "next/image";
import { MoveRight } from "lucide-react";
import { Movie } from "./HeroSection";

interface PopularWeekSectionProps {
    shuffledWeek: Movie[];
    handleMovieClick: (movieId: string | undefined) => void;
}

export default function PopularWeekSection({ shuffledWeek, handleMovieClick }: PopularWeekSectionProps) {
    return (
        <section
            id="movies"
            className="flex flex-col gap-4 max-w-[1330px] mx-auto p-5 font-outfit"
        >
            <div className="flex justify-between items-center">
                <h1 className="text-base sm:text-xl md:text-2xl font-bold">
                    Popular This week
                </h1>
                <button 
                    onClick={() => handleMovieClick(shuffledWeek[0]?.id)}
                    className="bg-[#F8E9A1] px-4 py-1.5 rounded-xl flex items-center gap-1 text-[#000000] text-xs underline cursor-pointer"
                >
                    View All{" "}
                    <MoveRight
                        color="#000000"
                        size={15}
                        strokeWidth={1.5}
                    />
                </button>
            </div>

            {shuffledWeek.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse flex flex-col gap-3">
                            <div className="aspect-4.5/5 w-full bg-white/5 rounded-[24px] border border-white/5" />
                            <div className="h-4 bg-white/5 rounded-md w-3/4" />
                            <div className="h-3 bg-white/5 rounded-md w-1/2" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {shuffledWeek.map((category, index) => (
                        <div
                            key={category.title + index}
                            onClick={() => handleMovieClick(category.id)}
                            className={`group cursor-pointer flex flex-col gap-3 ${index < 2
                                ? "flex"
                                : index < 4
                                    ? "hidden sm:flex"
                                    : index < 6
                                        ? "hidden md:flex"
                                        : index < 8
                                            ? "hidden lg:flex"
                                            : index < 10
                                                ? "hidden xl:flex"
                                                : "hidden"
                                }`}
                        >
                            {/* Poster container with high rounding */}
                            <div className="relative aspect-4.5/5 w-full rounded-[24px] overflow-hidden">
                                <Image
                                    src={typeof category.imgUrl === "string" ? category.imgUrl : category.imgUrl.src}
                                    alt={category.title}
                                    width={200}
                                    height={320}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    priority={true}
                                />
                                {/* Description Overlay on hover */}
                                <div className="absolute inset-0 bg-black/70 flex items-end justify-start p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <h3 className="text-white text-xs text-left line-clamp-3 leading-relaxed font-inter">
                                        {category.description}
                                    </h3>
                                </div>
                            </div>

                            {/* Details text under the image */}
                            <div className="flex flex-col gap-1 px-1">
                                <h2 className="text-white text-md font-semibold truncate group-hover:text-[#F8E9A1] transition-colors duration-200">
                                    {category.title}
                                </h2>
                                <div className="flex justify-between items-center text-[10px] text-[#BABABA] font-inter">
                                    <span>
                                        {category.year} —{" "}
                                        {category.duration}
                                    </span>
                                    <span className="text-white flex items-center">
                                        {category.rating}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
