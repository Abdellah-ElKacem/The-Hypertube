"use client";

import Image from "next/image";
import Link from "next/link";
import imdb from "@/public/imdb.png";
import {
    Bookmark,
    Info,
    ChevronsRight,
    Play,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";
import { Movie, HomeHeroProps } from "@/core/types/movie";

export default function HomeHero({
    heroMovies,
    currentMovieIndex,
    handlePrev,
    handleNext,
    watchlist,
    toggleMovieWatchlist,
}: HomeHeroProps) {
    if (!heroMovies || heroMovies.length === 0) return null;

    const activeMovie = heroMovies[currentMovieIndex];
    const isInWatchlist = activeMovie
        ? watchlist.some((m) => m.id === activeMovie.id)
        : false;

    const toggleWatchlist = () => {
        if (activeMovie) {
            toggleMovieWatchlist(activeMovie);
        }
    };

    return (
        <section className="relative rounded-xl h-[800px] md:h-[700px] w-full flex md:justify-between justify-end md:flex-row flex-col items-end pb-10 px-8 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden z-0">
                <div
                    className="flex w-full h-full transition-transform duration-700 ease-in-out"
                    style={{
                        transform: `translateX(-${currentMovieIndex * 100}%)`,
                    }}
                >
                    {heroMovies.map((movie, idx) => (
                        <div
                            key={movie.id}
                            className="relative w-full h-full shrink-0"
                        >
                            <Image
                                src={movie.bgUrl}
                                alt=""
                                fill
                                priority={idx === 0}
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    ))}
                </div>
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent z-10"></div>

            {/* Left Column: Movie Info & Cast */}
            <div className="flex flex-col gap-8 z-10 self-start md:self-end">
                <div className="flex flex-col gap-4">
                    <h3 className="text-5xl font-medium shadow-2xl transition-all duration-500">
                        {activeMovie?.title}
                    </h3>
                    <div className="flex gap-2 items-center text-sm shadow-2xl">
                        <Image
                            src={imdb}
                            alt="logo imdb"
                            width={30}
                            height={30}
                            priority
                        />
                        <div className="flex items-center gap-2">
                            <span>{activeMovie?.rating} / 10 </span>
                            <span className="h-5 w-px bg-gray-400" />
                            <span className="text-[#9C9C9C] hidden md:block">
                                ( {activeMovie?.votes} )
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>{activeMovie?.year}</span>
                            <span>—</span>
                            <span>{activeMovie?.duration}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 md:hidden">
                        <div className="flex gap-2 font-semibold tracking-wider text-sm">
                            {activeMovie?.genres?.map(
                                (genre: string, idx: number) => (
                                    <span
                                        key={genre}
                                        className="flex items-center gap-2"
                                    >
                                        <span>{genre}</span>
                                        {idx <
                                            (activeMovie?.genres?.length || 0) -
                                                1 && <span>•</span>}
                                    </span>
                                ),
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-xs w-full line-clamp-3 text-gray-300">
                                {activeMovie?.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                        <button
                            onClick={toggleWatchlist}
                            className="p-2 rounded-full bg-white/10 backdrop-blur-xs md:w-12 md:h-12 w-10 h-10 flex justify-center items-center cursor-pointer hover:bg-white/20 active:scale-95 transition-all border-0 focus:outline-hidden"
                            aria-label="Toggle Watchlist"
                        >
                            <Bookmark
                                size={24}
                                className="w-5 text-white"
                                fill={isInWatchlist ? "white" : "none"}
                            />
                        </button>
                        <Link
                            href={`/library/${activeMovie?.id}`}
                            className="hidden md:flex p-2 px-8 rounded-full bg-white/10 backdrop-blur-xs w-fit h-12 justify-center items-center gap-3 text-lg cursor-pointer hover:bg-white/20 active:scale-95 transition-all text-white hover:text-[#EC4949] hover:no-underline"
                        >
                            <Info size={24} />
                            <p>Details</p>
                        </Link>
                        <Link
                            href={`/library/${activeMovie?.id}`}
                            className="md:hidden p-2 rounded-full bg-white/10 backdrop-blur-xs md:w-12 md:h-12 w-10 h-10 flex justify-center items-center gap-3 text-lg cursor-pointer hover:bg-white/20 active:scale-95 transition-all text-white"
                        >
                            <Info size={24} className="w-5" />
                        </Link>
                        <Link
                            href={`/library/${activeMovie?.id}`}
                            className="md:hidden p-2 px-6 rounded-full bg-white/10 backdrop-blur-xs w-fit h-10 flex justify-center items-center gap-3 text-xs cursor-pointer hover:bg-white/20 active:scale-95 transition-all text-white hover:no-underline"
                        >
                            <Play size={24} className="w-5" />
                            <p>Watch Now</p>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm">Cast & Crew</h3>
                    <div className="flex items-center -space-x-3">
                        {activeMovie?.cast
                            ?.slice(0, 5)
                            .map(
                                (
                                    profile: { src: string; alt: string },
                                    idx: number,
                                ) => (
                                    <Image
                                        key={idx}
                                        src={profile.src}
                                        alt={profile.alt}
                                        width={48}
                                        height={48}
                                        className="rounded-full md:w-12 md:h-12 w-10 h-10 object-cover shadow-xl"
                                        unoptimized
                                    />
                                ),
                            )}
                        <div className="md:w-12 md:h-12 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xs flex justify-center items-center shadow-xl cursor-pointer hover:bg-white/20 transition-colors">
                            <ChevronsRight size={20} strokeWidth={1.5} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Watch Now & Description */}
            <div className="w-full md:max-w-[45%] lg:max-w-[500px] flex flex-col gap-4 z-10">
                <Link
                    href={`/library/${activeMovie?.id}`}
                    className="md:flex items-center justify-end gap-2 group cursor-pointer hidden text-white hover:text-red-500 hover:no-underline"
                >
                    <div className="flex flex-col items-end text-sm font-semibold tracking-wide drop-shadow-2xl group-hover:text-red-500 transition-colors">
                        <p>Watch</p>
                        <p>Now</p>
                    </div>
                    <Play
                        size={70}
                        strokeWidth={0.5}
                        className="group-hover:text-red-500 group-hover:scale-105 drop-shadow-2xl active:scale-95 transition-all duration-300"
                    />
                </Link>
                <div className="flex flex-col gap-2 hidden md:flex">
                    <div className="flex gap-2 font-semibold tracking-wider text-sm">
                        {activeMovie?.genres?.map(
                            (genre: string, idx: number) => (
                                <span
                                    key={genre}
                                    className="flex items-center gap-2"
                                >
                                    <span>{genre}</span>
                                    {idx <
                                        (activeMovie?.genres?.length || 0) -
                                            1 && <span>•</span>}
                                </span>
                            ),
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-xs w-[70%] h-[140px] line-clamp-4 text-gray-300">
                            {activeMovie?.description}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 items-center justify-end md:pr-10">
                    <button
                        onClick={handlePrev}
                        className="p-2 rounded-full bg-white/10 backdrop-blur-xs md:w-12 md:h-12 w-10 h-10 flex justify-center items-center cursor-pointer hover:bg-white/20 active:scale-95 transition-all focus:outline-none border border-white/5"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="p-2 rounded-full bg-white/10 backdrop-blur-xs md:w-12 md:h-12 w-10 h-10 flex justify-center items-center cursor-pointer hover:bg-white/20 active:scale-95 transition-all focus:outline-none border border-white/5"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
}
