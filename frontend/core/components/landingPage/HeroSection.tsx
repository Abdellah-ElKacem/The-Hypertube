"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, ChevronRight } from "lucide-react";
import { StaticImageData } from "next/image";

export interface Movie {
    id?: string;
    imgUrl: StaticImageData | string;
    title: string;
    rating: string;
    year: string;
    duration: string;
    genre: string;
    description: string;
}

interface HeroSectionProps {
    heroMovies: Movie[];
    handleMovieClick: (movieId: string | undefined) => void;
}

const getImgSrc = (img: StaticImageData | string) => {
    if (!img) return "";
    return typeof img === "string" ? img : img.src;
};

export default function HeroSection({ heroMovies, handleMovieClick }: HeroSectionProps) {
    const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
    const [carouselStart, setCarouselStart] = useState(0);

    const handleNextChoices = () => {
        setCarouselStart((prev) => {
            const nextStart = (prev + 1) % (heroMovies.length - 2);
            setSelectedHeroIndex(nextStart);
            return nextStart;
        });
    };

    // Autoplay timer to advance to the next movie every 6 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setSelectedHeroIndex((prev) => (prev + 1) % heroMovies.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [selectedHeroIndex, heroMovies.length]);

    // Keep carouselStart in sync with selectedHeroIndex to make sure the active movie card is always visible
    useEffect(() => {
        if (selectedHeroIndex < carouselStart) {
            setCarouselStart(selectedHeroIndex);
        } else if (selectedHeroIndex > carouselStart + 2) {
            setCarouselStart(
                Math.min(selectedHeroIndex - 2, heroMovies.length - 3),
            );
        }
    }, [selectedHeroIndex, carouselStart, heroMovies.length]);

    if (heroMovies.length === 0) return null;

    return (
        <div className="w-full relative overflow-hidden bg-[#080616]">
            {/* Netflix-style background poster grid */}
            <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden select-none z-0">
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-4 p-4 -rotate-6 scale-110 origin-center">
                    {Array.from({ length: 6 }).flatMap(() => heroMovies).map((movie, index) => (
                        <div
                            key={index}
                            className="aspect-[2/3] w-full rounded-md overflow-hidden bg-gray-900 border border-white/5 shadow-lg"
                        >
                            <Image
                                src={getImgSrc(movie.imgUrl)}
                                alt=""
                                width={150}
                                height={225}
                                className="w-full h-full object-cover"
                                priority={true}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {/* Subtle dark overlay and radial vignette to fade out the poster grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,6,22,0.45)_0%,#080616_85%)] pointer-events-none z-0" />
            <div className="absolute inset-0 bg-linear-to-b from-[#080616]/50 via-transparent to-[#080616] pointer-events-none z-0" />

            <section id="home"
                className="relative max-w-[1680px] w-full mx-auto h-[750px] md:p-10 p-5 flex justify-center items-end transition-all duration-500 z-10"
            >
                {/* Background Hero Image */}
                <div className="absolute inset-0 -z-10 select-none pointer-events-none">
                    {heroMovies[selectedHeroIndex] && (
                        <Image
                            src={getImgSrc(heroMovies[selectedHeroIndex].imgUrl)}
                            alt={heroMovies[selectedHeroIndex].title || ""}
                            fill
                            priority
                            className="object-cover object-top transition-opacity duration-500"
                            sizes="(max-width: 1680px) 100vw, 1680px"
                        />
                    )}
                </div>
                {/* Side gradient overlays to fade the crisp poster edges into the dark background on large screens */}
                <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-[#080616] to-transparent pointer-events-none hidden min-[1680px]:block" />
                <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-[#080616] to-transparent pointer-events-none hidden min-[1680px]:block" />

                <div className="absolute inset-x-0 bottom-0 h-200 bg-linear-to-t from-[#080616] to-transparent pointer-events-none" />
                <div className="w-full max-w-[1330px] p-5 flex gap-5 justify-between z-10 items-end">
                <div className="flex flex-col gap-6">
                    <h2 className="lg:text-7xl sm:text-6xl text-4xl font-medium text-white text-shadow-lg font-outfit">
                        {heroMovies[selectedHeroIndex]?.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm text-white text-shadow-lg font-inter">
                        <Image
                            src="/imdb.png"
                            alt="Star"
                            width={36}
                            height={16}
                            className="object-contain"
                            priority
                        />
                        <p>
                            {heroMovies[selectedHeroIndex]?.rating
                                ?.replace("⭐", "")
                                ?.trim()}
                        </p>
                        <p className="text-[#9C9C9C]">(10.341)</p>
                        <span className="text-white">|</span>
                        <p>{heroMovies[selectedHeroIndex]?.year}</p>
                        <span className="text-white">—</span>
                        <p>{heroMovies[selectedHeroIndex]?.duration}</p>
                        <span className="text-white">—</span>
                        <p>{heroMovies[selectedHeroIndex]?.genre}</p>
                    </div>
                    <p className="lg:text-sm text-xs md:w-[450px] w-full leading-4 text-white font-inter">
                        {heroMovies[selectedHeroIndex]?.description}
                    </p>
                    <div className="flex gap-3 md:gap-4 flex-wrap text-sm md:text-base font-medium font-inter">
                        <div
                            onClick={() => handleMovieClick(heroMovies[selectedHeroIndex]?.id)}
                            className="flex -space-x-1 hover:scale-105 transition-transform duration-300 cursor-pointer"
                        >
                            <div className="bg-[#F8E9A1] px-6 py-2.5 md:px-8 md:py-3 text-black rounded-full flex items-center font-medium">
                                Watch Now
                            </div>
                            <div className="bg-[#F8E9A1] w-11 h-11 md:w-[50px] md:h-[50px] flex items-center justify-center rounded-full self-center">
                                <Play
                                    color="black"
                                    strokeWidth={1.5}
                                    className="w-4 h-4 md:w-5 md:h-5"
                                />
                            </div>
                        </div>
                        <div
                            onClick={() => handleMovieClick(heroMovies[selectedHeroIndex]?.id)}
                            className="bg-white/5 backdrop-blur-[10px] px-12 py-2.5 md:px-18 md:py-3 rounded-full hover:scale-105 transition-transform duration-300 cursor-pointer flex items-center justify-center text-white"
                        >
                            Trailer
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex flex-col gap-2 font-outfit">
                    <h3 className="pl-5 text-white">Best Choices</h3>
                    <div className="flex items-center justify-start gap-3">
                        <div className="w-[489px] overflow-hidden">
                            <div
                                className="flex gap-3 transition-transform duration-500 ease-in-out"
                                style={{
                                    transform: `translateX(-${carouselStart * 167}px)`,
                                }}
                            >
                                {heroMovies.map((category, movieIndex) => {
                                    const isSelected = selectedHeroIndex === movieIndex;
                                    return (
                                        <div
                                            key={category.title + movieIndex}
                                            onClick={() => setSelectedHeroIndex(movieIndex)}
                                            className={`relative group w-[155px] h-[100px] rounded-[15px] overflow-hidden shrink-0 cursor-pointer transition-all duration-200 border-2 ${isSelected
                                                ? "border-[#F8E9A1] scale-95"
                                                : "border-transparent"
                                                }`}
                                        >
                                            <Image
                                                src={getImgSrc(category.imgUrl)}
                                                alt={category.title}
                                                width={155}
                                                height={100}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/70 flex flex-col justify-end p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <h4 className="text-sm font-semibold text-white truncate font-outfit">
                                                    {category.title}
                                                </h4>
                                                <div className="flex justify-between items-center text-[10px] text-[#BABABA] mt-0.5 font-inter">
                                                    <span className="flex items-center gap-0.5">
                                                        {category.rating}
                                                    </span>
                                                    <span>
                                                        {category.year}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <button
                            onClick={handleNextChoices}
                            className="w-8 h-8 border-[0.5px] rounded-full flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                        >
                            <ChevronRight
                                color="#BABABA"
                                size={20}
                                strokeWidth={1.5}
                            />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 self-center pt-2">
                        {heroMovies.map((_, dotIndex) => {
                            const isActive = selectedHeroIndex === dotIndex;
                            return (
                                <div
                                    key={dotIndex}
                                    onClick={() => setSelectedHeroIndex(dotIndex)}
                                    className={`transition-all duration-300 h-[7px] rounded-full cursor-pointer ${isActive
                                        ? "w-[25px] bg-[#F8E9A1]"
                                        : "w-[7px] bg-[#A4A4A4]"
                                        }`}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
        </div>
    );
}
