"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Home,
    Library,
    Clapperboard,
    Bookmark,
    Star,
    Play,
    Users,
    Building2,
    X,
    AlertTriangle,
    Share2,
    Smile,
    Copy,
    Check,
    Sparkles,
    Gift,
} from "lucide-react";
import imdbLogo from "@/public/imdb.png";
import VideoPlayer from "./VideoPlayer";
import {
    DetailedMovie,
    SimilarMovie,
    CastMember,
    ProductionCompany,
} from "@/core/types/library";

interface MovieMainInfoProps {
    movie: DetailedMovie;
    posterSrc: string;
    setPosterSrc: (src: string) => void;
    wishlist: boolean;
    onToggleWishlist: () => void;
    userRating: number;
    hoverRating: number;
    onRateMovie: (rating: number) => void;
    onHoverRating: (rating: number) => void;
    isWatched: boolean;
    hasMagnets: boolean;
    isStreaming: boolean;
    onWatchNow: () => void;
    defaultSubtitleLang: string;
    isTrailerLoading: boolean;
    onOpenTrailer: () => void;
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    isTrailerModalOpen: boolean;
    setIsTrailerModalOpen: (open: boolean) => void;
    trailerUrl: string | null;
    trailerError: string | null;
    queryString: string;
    similarMovies?: SimilarMovie[];
}

const getYoutubeEmbedUrl = (url: string | null) => {
    if (!url) return null;
    let videoId = "";
    try {
        if (url.includes("youtube.com/watch")) {
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get("v") || "";
        } else if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
        } else if (url.includes("youtube.com/embed/")) {
            videoId = url.split("youtube.com/embed/")[1]?.split("?")[0] || "";
        }
    } catch (e) {
        console.error("Failed to parse trailer URL:", e);
    }
    return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
        : null;
};

const POPULAR_FALLBACKS = [
    {
        title: "The Dark Knight",
        year: "2008",
        rating: "9.0",
        poster: "/qJ2tWwOR0rJy36OUmSbgkL85dcl.jpg",
        genres: ["Action", "Crime", "Drama"],
        imdb_code: "tt0468569",
    },
    {
        title: "Inception",
        year: "2010",
        rating: "8.8",
        poster: "/o01vCoZNMj5f0nU4eR6k1UkO6OH.jpg",
        genres: ["Action", "Sci-Fi", "Adventure"],
        imdb_code: "tt1375666",
    },
    {
        title: "Interstellar",
        year: "2014",
        rating: "8.7",
        poster: "/gEU2QvJWzIF7ef3m3tZs7Oa4VwA.jpg",
        genres: ["Sci-Fi", "Drama", "Adventure"],
        imdb_code: "tt0816692",
    },
    {
        title: "Pulp Fiction",
        year: "1994",
        rating: "8.9",
        poster: "/d5i251m3JjgVnUNg2tcBGdgR2rV.jpg",
        genres: ["Thriller", "Crime"],
        imdb_code: "tt0110912",
    },
    {
        title: "Spirited Away",
        year: "2001",
        rating: "8.6",
        poster: "/393mh1e064q6w1v6FDmfi352u6c.jpg",
        genres: ["Animation", "Fantasy", "Family"],
        imdb_code: "tt0245429",
    },
    {
        title: "Gladiator",
        year: "2000",
        rating: "8.5",
        poster: "/ty8haG6OsRwqeh05n7gL1fsptmM.jpg",
        genres: ["Action", "Adventure", "Drama"],
        imdb_code: "tt0172495",
    },
    {
        title: "Parasite",
        year: "2019",
        rating: "8.5",
        poster: "/7IiTTjV7Ja6zkR7dOFhqBiUsiUr.jpg",
        genres: ["Drama", "Thriller", "Comedy"],
        imdb_code: "tt6751668",
    },
];

export default function MovieMainInfo({
    movie,
    posterSrc,
    setPosterSrc,
    wishlist,
    onToggleWishlist,
    userRating,
    hoverRating,
    onRateMovie,
    onHoverRating,
    isWatched,
    hasMagnets,
    isStreaming,
    onWatchNow,
    defaultSubtitleLang,
    isTrailerLoading,
    onOpenTrailer,
    isModalOpen,
    setIsModalOpen,
    isTrailerModalOpen,
    setIsTrailerModalOpen,
    trailerUrl,
    trailerError,
    queryString,
    similarMovies,
}: MovieMainInfoProps) {
    const router = useRouter();

    const [spinnerModalOpen, setSpinnerModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<any>(null);
    const [isSpinning, setIsSpinning] = useState(false);

    const getMoviesPool = () => {
        return similarMovies && similarMovies.length > 0
            ? similarMovies
            : POPULAR_FALLBACKS;
    };

    const handleShareClick = () => {
        setIsSpinning(true);
        setSpinnerModalOpen(true);
        const pool = getMoviesPool();

        let counter = 0;
        const maxSteps = 15; // Number of items it cycles through
        const intervalTime = 80; // Speed of cycle in ms

        const timer = setInterval(() => {
            const tempMovie = pool[Math.floor(Math.random() * pool.length)];
            setSelectedMovie(tempMovie);
            counter++;

            if (counter >= maxSteps) {
                clearInterval(timer);
                setIsSpinning(false);
            }
        }, intervalTime);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSpinnerModalOpen(false);
            }
        };

        if (spinnerModalOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [spinnerModalOpen]);

    return (
        <div className="w-full flex flex-col gap-10">
            {/* Movie details display area */}
            <div className="relative w-full pb-10 flex -mt-8">
                <div
                    className="absolute w-full h-full flex justify-center bg-cover bg-center bg-no-repeat opacity-20 rounded-t-2xl mb-10"
                    style={{ backgroundImage: `url(${posterSrc})` }}
                >
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#201F24]/60 to-[#201F24] z-0" />
                </div>
                <div className="w-full flex justify-between gap-6 px-6 pt-6 md:mb-25 z-10">
                    <div className="flex flex-col grow gap-6">
                        <div className="flex justify-between items-center gap-4">
                            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                                {movie.title}
                            </h1>
                            <div className="flex-shrink-0">
                                <button
                                    onClick={onToggleWishlist}
                                    className="flex px-3.5 md:px-5 py-2.5 items-center gap-2 rounded-full bg-white/5 backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-colors text-white"
                                >
                                    <Bookmark
                                        size={18}
                                        fill={wishlist ? "white" : "none"}
                                    />
                                    <span className="hidden md:block text-xs font-semibold">
                                        {wishlist
                                            ? "Added to Wishlist"
                                            : "Add to Wishlist"}
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2 md:gap-4 items-center text-xs md:text-sm flex-wrap text-white/90">
                                <Image
                                    src={imdbLogo}
                                    alt="imdb"
                                    width={25}
                                    height={15}
                                    priority
                                    className="md:w-[45px] md:h-[27px]"
                                />
                                <span className="text-white/30">|</span>
                                <p className="font-semibold">
                                    {movie.votes} / 10
                                </p>
                                <span className="text-white/30">|</span>
                                <p className="uppercase">{movie.language}</p>
                                <span className="text-white/30">|</span>
                                <p className="text-white/70">
                                    ({movie.popularity})
                                </p>
                                {isWatched && (
                                    <>
                                        <span className="text-white/30">|</span>
                                        <div className="flex gap-1.5 items-center bg-[#4ADE80]/15 text-[#4ADE80] font-semibold px-2.5 py-0.5 rounded-full border border-[#4ADE80]/20 text-[10px] md:text-[11px] shadow-sm select-none">
                                            <div className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full animate-pulse" />
                                            <span>Watched</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="flex gap-4 items-center text-xs md:text-sm flex-wrap py-3 w-fit">
                                <p className="font-medium text-white/95">
                                    Community:{" "}
                                    <span className="font-bold">
                                        {movie.rating}
                                    </span>{" "}
                                    / 10 ({movie.ratingCount})
                                </p>
                                <span className="text-white/20 hidden sm:inline">
                                    |
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-white/70">Rate:</span>
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(10)].map((_, i) => {
                                            const starValue = i + 1;
                                            return (
                                                <button
                                                    key={starValue}
                                                    onClick={() =>
                                                        onRateMovie(starValue)
                                                    }
                                                    onMouseEnter={() =>
                                                        onHoverRating(starValue)
                                                    }
                                                    onMouseLeave={() =>
                                                        onHoverRating(0)
                                                    }
                                                    className="focus:outline-none transition-transform duration-100 hover:scale-125 cursor-pointer flex items-center justify-center"
                                                    title={`Rate ${starValue} / 10`}
                                                >
                                                    <Star
                                                        size={13}
                                                        className={`transition-colors duration-150 ${
                                                            starValue <=
                                                            (hoverRating ||
                                                                userRating)
                                                                ? "text-[#EC4949] fill-[#EC4949]"
                                                                : "text-gray-500 fill-none"
                                                        }`}
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 items-center text-xs md:text-sm flex-wrap text-white/80">
                            <p>{movie.year}</p>
                            <span>—</span>
                            <p>{movie.duration}</p>
                            <span>—</span>
                            <div className="flex gap-2 items-center flex-wrap">
                                {movie.genres.map(
                                    (genre: string, i: number) => (
                                        <span
                                            key={i}
                                            className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/70"
                                        >
                                            {genre}
                                        </span>
                                    ),
                                )}
                            </div>
                        </div>
                        <hr className="border-white/10 w-[93%]" />
                        <div className="flex flex-col gap-4">
                            <p className="text-lg md:text-2xl font-bold text-white">
                                Storyline
                            </p>
                            <p className="text-sm md:text-md w-[93%] leading-relaxed font-light text-white/70">
                                {movie.description}
                            </p>
                        </div>

                        <div className="flex gap-2 md:items-center flex-col md:flex-row w-full md:w-auto">
                            <button
                                onClick={onWatchNow}
                                disabled={!hasMagnets}
                                className={`w-full md:w-auto flex items-center -space-x-2 group ${
                                    !hasMagnets
                                        ? "opacity-50 cursor-not-allowed"
                                        : "cursor-pointer"
                                }`}
                            >
                                <span
                                    className={`flex w-full md:w-auto justify-center px-7 py-2.5 rounded-full font-medium transition-colors ${
                                        !hasMagnets
                                            ? "bg-[#323232] text-white/50"
                                            : "bg-[#EC4949] text-white group-hover:bg-[#ff5a5a]"
                                    }`}
                                >
                                    {hasMagnets ? "Watch now" : "Unavailable"}
                                </span>
                                <div
                                    className={`hidden md:flex px-3 py-3 rounded-full transition-colors ${
                                        !hasMagnets
                                            ? "bg-[#323232] text-white/50"
                                            : "bg-[#EC4949] text-white group-hover:bg-[#ff5a5a]"
                                    }`}
                                >
                                    <Play size={18} />
                                </div>
                            </button>
                            <button
                                onClick={onOpenTrailer}
                                disabled={isTrailerLoading}
                                className="w-full md:w-auto flex px-15 py-2.5 justify-center items-center gap-2 rounded-full bg-white/5 backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>
                                    {isTrailerLoading
                                        ? "Loading..."
                                        : "Trailer"}
                                </span>
                            </button>
                        </div>

                        <div className="flex flex-col gap-4 md:flex-row md:gap-14">
                            {movie.cast && movie.cast.length > 0 && (
                                <div
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex flex-col gap-2 cursor-pointer group"
                                >
                                    <div className="flex gap-2 items-center group-hover:text-[#EC4949] transition-colors text-white">
                                        <Users size={15} />
                                        <p className="text-sm font-medium">
                                            Cast & Crew
                                        </p>
                                    </div>
                                    <div className="flex -space-x-2 items-center">
                                        {movie.cast
                                            .slice(0, 5)
                                            .map(
                                                (
                                                    castMember: CastMember,
                                                    index: number,
                                                ) =>
                                                    castMember.src ? (
                                                        <Image
                                                            key={index}
                                                            src={castMember.src}
                                                            alt={castMember.alt}
                                                            width={48}
                                                            height={48}
                                                            className="rounded-full object-cover w-12 h-12 shadow-md group-hover:scale-105 transition-all duration-200 border border-[#201F24]"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div
                                                            key={index}
                                                            className="rounded-full w-12 h-12 shadow-md border border-[#201F24] bg-linear-to-tr from-[#2A2836] to-[#3F3D52] text-white flex items-center justify-center font-bold text-sm uppercase select-none group-hover:scale-105 transition-all duration-200"
                                                            title={
                                                                castMember.alt
                                                            }
                                                        >
                                                            {castMember.alt
                                                                ? castMember.alt
                                                                      .charAt(0)
                                                                      .toUpperCase()
                                                                : "A"}
                                                        </div>
                                                    ),
                                            )}
                                        {movie.cast.length > 5 && (
                                            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-xs text-white border border-[#201F24] group-hover:bg-white/30 transition-colors font-semibold">
                                                +{movie.cast.length - 5}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {movie.productionCompanies &&
                                movie.productionCompanies.length > 0 && (
                                    <div
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex flex-col gap-2 cursor-pointer group"
                                    >
                                        <div className="flex gap-2 items-center group-hover:text-[#EC4949] transition-colors text-white">
                                            <Building2 size={15} />
                                            <p className="text-sm font-medium">
                                                Production Companies
                                            </p>
                                        </div>
                                        <div className="flex -space-x-2 items-center">
                                            {movie.productionCompanies
                                                .slice(0, 3)
                                                .map(
                                                    (
                                                        company: ProductionCompany,
                                                        index: number,
                                                    ) =>
                                                        company.src ? (
                                                            <Image
                                                                key={index}
                                                                src={
                                                                    company.src
                                                                }
                                                                alt={
                                                                    company.alt
                                                                }
                                                                width={48}
                                                                height={48}
                                                                className="rounded-full object-cover w-12 h-12 shadow-md border bg-white border-[#201F24] group-hover:scale-105 transition-all duration-200"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <div
                                                                key={index}
                                                                className="rounded-full w-12 h-12 shadow-md border border-[#201F24] bg-[#2A2836] text-white flex items-center justify-center font-bold text-sm uppercase select-none group-hover:scale-105 transition-all duration-200"
                                                                title={
                                                                    company.alt
                                                                }
                                                            >
                                                                {company.alt
                                                                    ? company.alt
                                                                          .charAt(
                                                                              0,
                                                                          )
                                                                          .toUpperCase()
                                                                    : "C"}
                                                            </div>
                                                        ),
                                                )}
                                            {movie.productionCompanies.length >
                                                3 && (
                                                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-xs text-white border border-[#201F24] group-hover:bg-white/30 transition-colors font-semibold">
                                                    +
                                                    {movie.productionCompanies
                                                        .length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                    <div className="hidden lg:block relative aspect-2/3 w-[200px] h-[300px] lg:w-[300px] lg:h-[460px] shadow-2xl">
                        <Image
                            src={posterSrc}
                            alt={movie.title}
                            fill
                            className="object-cover rounded-2xl animate-fadeIn"
                            unoptimized
                            onError={() => setPosterSrc("/no-poster.png")}
                        />
                        {isWatched && (
                            <div className="absolute top-4 left-4 flex gap-1.5 items-center bg-black/60 backdrop-blur-xs text-xs text-white font-medium px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg z-10 animate-fadeIn">
                                <div className="w-2 h-2 bg-[#4ADE80] rounded-full animate-pulse" />
                                <span>Watched</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Video Player Display Container */}
            <div className="w-full aspect-video max-h-[720px] rounded-[20px] p-2 relative overflow-hidden bg-[#2E2C39] border border-white/5 shadow-2xl flex items-center justify-center">
                {isStreaming && hasMagnets ? (
                    <VideoPlayer
                        tmdbId={movie.tmdbId || ""}
                        defaultLang={defaultSubtitleLang || "en"}
                        posterUrl={posterSrc}
                    />
                ) : (
                    <>
                        <Image
                            src={posterSrc}
                            alt={movie.title}
                            fill
                            className="object-cover opacity-60 p-2 rounded-2xl"
                            unoptimized
                            onError={() => setPosterSrc("/no-poster.png")}
                        />
                        <div className="absolute inset-0 bg-black/65 flex flex-col justify-center items-center gap-4">
                            {!hasMagnets ? (
                                <div className="flex flex-col items-center gap-3 px-6 text-center animate-fadeIn">
                                    <AlertTriangle className="w-16 h-16 text-[#EC4949] animate-pulse" />
                                    <h3 className="text-xl md:text-2xl font-bold text-white">
                                        Movie is not available
                                    </h3>
                                    <p className="text-sm text-white/60 max-w-md">
                                        We couldn't find any streamable links
                                        for this movie at the moment.
                                    </p>
                                </div>
                            ) : (
                                <div
                                    onClick={onWatchNow}
                                    className="p-7 rounded-full bg-black/10 backdrop-blur-lg cursor-pointer hover:bg-[#EC4949]/30 hover:scale-105 hover:border-[#EC4949]/50 border border-white/10 transition-all duration-300"
                                >
                                    <Play
                                        className="w-12 h-12"
                                        color="white"
                                        fill="white"
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Movie Title Header and Share details */}
            <div className="flex justify-between items-center px-4 gap-4 -mt-4">
                <h2 className="text-xl md:text-3xl font-medium truncate max-w-[70%] text-white">
                    {movie.title}
                </h2>
                <button
                    onClick={handleShareClick}
                    className="shrink-0 flex px-5 md:px-7 py-2.5 justify-center items-center gap-2 rounded-full bg-linear-to-r from-[#EC4949] via-[#EC4949]/80 to-[#EC4949]/40 hover:from-[#ff5a5a] hover:to-[#ff5a5a]/70 cursor-pointer active:scale-95 hover:scale-105 hover:shadow-lg hover:shadow-[#ff5a5a]/25 transition-all duration-300 text-white font-semibold border border-white/10 relative group overflow-hidden"
                >
                    <div className="absolute inset-0 w-full h-full bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <Gift
                        size={15}
                        className="group-hover:animate-bounce z-10"
                    />
                    <span className="z-10 tracking-wide text-xs md:text-sm">
                        Surprise Me!
                    </span>
                </button>
            </div>
            <div className="flex w-full items-center justify-center -mt-4">
                <hr className="border-white/10 w-[93%]" />
            </div>

            {/* Movie Info Modal (Cast & Crew + Production Companies) */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 transition-all duration-300 animate-in fade-in"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-[#18171d] border border-[#454359]/40 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden transform transition-all duration-300 scale-in-95 animate-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                            <h3 className="text-sm md:text-lg font-bold text-white flex items-center gap-2">
                                <Clapperboard className="text-[#EC4949] w-5 h-5" />
                                <span>Cast, Crew & Companies</span>
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 custom-scrollbar">
                            {/* Left Side: Cast & Crew */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                                    <Users className="text-[#EC4949] w-4 h-4" />
                                    <h4 className="text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                                        Cast & Crew
                                    </h4>
                                    <span className="text-[10px] md:text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full ml-auto font-semibold">
                                        {(movie.cast?.length || 0) +
                                            (movie.director ? 1 : 0) +
                                            (movie.producer ? 1 : 0)}
                                    </span>
                                </div>

                                {(movie.cast && movie.cast.length > 0) ||
                                movie.director ||
                                movie.producer ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                        {/* Director */}
                                        {movie.director && (
                                            <div className="flex items-center gap-3 bg-[#EC4949]/10 p-2 rounded-xl border border-[#EC4949]/20">
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#EC4949]/30 flex-shrink-0">
                                                    {movie.director.picture ? (
                                                        <Image
                                                            src={
                                                                movie.director
                                                                    .picture
                                                            }
                                                            alt={
                                                                movie.director
                                                                    .name
                                                            }
                                                            fill
                                                            className="object-cover"
                                                            sizes="40px"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-linear-to-tr from-[#EC4949] to-[#FF7878] text-white flex items-center justify-center font-bold text-sm uppercase select-none">
                                                            {movie.director.name
                                                                ? movie.director.name
                                                                      .charAt(0)
                                                                      .toUpperCase()
                                                                : "?"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-xs font-bold text-white truncate">
                                                        {movie.director.name}
                                                    </span>
                                                    <span className="text-[10px] text-[#EC4949] font-semibold">
                                                        Director
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Producer */}
                                        {movie.producer && (
                                            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                                                    {movie.producer.picture ? (
                                                        <Image
                                                            src={
                                                                movie.producer
                                                                    .picture
                                                            }
                                                            alt={
                                                                movie.producer
                                                                    .name
                                                            }
                                                            fill
                                                            className="object-cover"
                                                            sizes="40px"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-linear-to-tr from-[#3F3D52] to-[#56546A] text-white flex items-center justify-center font-bold text-sm uppercase select-none">
                                                            {movie.producer.name
                                                                ? movie.producer.name
                                                                      .charAt(0)
                                                                      .toUpperCase()
                                                                : "?"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-xs font-bold text-white truncate">
                                                        {movie.producer.name}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">
                                                        Producer
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Cast Members */}
                                        {movie.cast.map(
                                            (
                                                castMember: CastMember,
                                                index: number,
                                            ) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5"
                                                >
                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                                                        {castMember.src ? (
                                                            <Image
                                                                src={
                                                                    castMember.src
                                                                }
                                                                alt={
                                                                    castMember.alt
                                                                }
                                                                fill
                                                                className="object-cover"
                                                                sizes="40px"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-linear-to-tr from-[#2A2836] to-[#3F3D52] text-white flex items-center justify-center font-semibold text-sm uppercase select-none">
                                                                {castMember.alt
                                                                    ? castMember.alt
                                                                          .charAt(
                                                                              0,
                                                                          )
                                                                          .toUpperCase()
                                                                    : "?"}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-xs font-semibold text-white truncate">
                                                            {castMember.alt}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400">
                                                            Actor
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 py-4 text-center">
                                        No cast info available
                                    </p>
                                )}
                            </div>

                            {/* Right Side: Production Companies */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                                    <Building2 className="text-[#EC4949] w-4 h-4" />
                                    <h4 className="text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                                        Production Companies
                                    </h4>
                                    <span className="text-[10px] md:text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full ml-auto font-semibold">
                                        {movie.productionCompanies?.length || 0}
                                    </span>
                                </div>

                                {movie.productionCompanies &&
                                movie.productionCompanies.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                        {movie.productionCompanies.map(
                                            (
                                                company: ProductionCompany,
                                                index: number,
                                            ) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5"
                                                >
                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border bg-white border-white/10 flex-shrink-0 flex items-center justify-center">
                                                        {company.src ? (
                                                            <Image
                                                                src={
                                                                    company.src
                                                                }
                                                                alt={
                                                                    company.alt
                                                                }
                                                                fill
                                                                className="object-contain p-1"
                                                                sizes="40px"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-[#2A2836] text-white flex items-center justify-center font-bold text-sm uppercase select-none">
                                                                {company.alt
                                                                    ? company.alt
                                                                          .charAt(
                                                                              0,
                                                                          )
                                                                          .toUpperCase()
                                                                    : "C"}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-xs font-semibold text-white truncate">
                                                            {company.alt}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400">
                                                            Production
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 py-4 text-center">
                                        No production companies available
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Trailer Modal overlay */}
            {isTrailerModalOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in"
                    onClick={() => setIsTrailerModalOpen(false)}
                >
                    <div
                        className="bg-[#141318] border border-white/10 rounded-2xl w-full max-w-4xl shadow-xl flex flex-col overflow-hidden transform transition-all duration-300 scale-in-95 animate-in relative z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Bar */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
                            <h3 className="text-xs md:text-sm font-bold text-white flex items-center gap-2 tracking-wide uppercase">
                                <Clapperboard className="text-[#EC4949] w-4 h-4 animate-pulse" />
                                <span>{movie.title} — Official Trailer</span>
                            </h3>
                            <button
                                onClick={() => setIsTrailerModalOpen(false)}
                                className="text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 border border-white/5"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Video Aspect Container */}
                        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                            {trailerError ? (
                                <div className="flex flex-col items-center justify-center p-6 text-center max-w-md z-10">
                                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4 text-[#EC4949]">
                                        <AlertTriangle size={30} />
                                    </div>
                                    <h4 className="text-white text-sm font-bold mb-2">
                                        Trailer Unavailable
                                    </h4>
                                    <p className="text-gray-400 text-xs leading-relaxed mb-6">
                                        {trailerError}
                                    </p>
                                    <button
                                        onClick={() =>
                                            setIsTrailerModalOpen(false)
                                        }
                                        className="px-6 py-2 bg-[#EC4949] hover:bg-[#ff5a5a] text-white rounded-full text-xs font-semibold transition-colors cursor-pointer"
                                    >
                                        Close Player
                                    </button>
                                </div>
                            ) : (
                                <iframe
                                    src={
                                        getYoutubeEmbedUrl(trailerUrl) ||
                                        undefined
                                    }
                                    title={`${movie.title} Trailer`}
                                    className="w-full h-full border-none z-10"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {spinnerModalOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 transition-all duration-300 animate-in fade-in"
                    onClick={() => !isSpinning && setSpinnerModalOpen(false)}
                >
                    <div
                        className="bg-[#18171d] border border-[#EC4949]/30 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden transform transition-all duration-300 scale-in-95 animate-in relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative top gradient bar */}
                        <div className="h-1.5 w-full bg-linear-to-r from-[#EC4949] via-[#dd4848] to-[#dd4848]" />

                        {/* Close button */}
                        {!isSpinning && (
                            <button
                                onClick={() => setSpinnerModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer z-10 animate-in fade-in"
                            >
                                <X size={18} />
                            </button>
                        )}

                        {/* Content */}
                        <div className="p-6 md:p-8 flex flex-col items-center text-center gap-6">
                            {/* Animated icon container */}
                            <div className="relative p-4 rounded-full bg-[#EC4949]/10 border border-[#EC4949]/20 text-[#EC4949]">
                                <Gift
                                    size={32}
                                    className={
                                        isSpinning
                                            ? "animate-spin"
                                            : "animate-bounce"
                                    }
                                />
                                <Sparkles className="absolute -top-1 -right-1 text-purple-400 w-4 h-4 animate-pulse" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-bold text-white leading-snug">
                                    {isSpinning
                                        ? "Selecting a Surprise Movie..."
                                        : "Your Surprise Recommendation!"}
                                </h3>
                                <p className="text-xs text-gray-400">
                                    {isSpinning
                                        ? "Shuffling the cinema reels..."
                                        : "The reels have aligned on this recommendation:"}
                                </p>
                            </div>

                            {/* Selection Card */}
                            {selectedMovie && (
                                <div
                                    className={`w-full bg-white/5 border rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center sm:items-start transition-all duration-300 ${
                                        isSpinning
                                            ? "border-[#EC4949]/50 scale-98 blur-[0.5px] opacity-80"
                                            : "border-white/10 shadow-2xl scale-100"
                                    }`}
                                >
                                    {/* Poster */}
                                    <div className="relative w-28 h-40 shrink-0 rounded-xl overflow-hidden bg-white/5 shadow-md">
                                        <Image
                                            src={
                                                selectedMovie.poster
                                                    ? selectedMovie.poster.startsWith(
                                                          "http",
                                                      )
                                                        ? selectedMovie.poster
                                                        : `https://image.tmdb.org/t/p/w342${selectedMovie.poster}`
                                                    : "/no-poster.png"
                                            }
                                            alt={selectedMovie.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                        {isSpinning && (
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                                                <div className="w-8 h-8 border-4 border-t-[#EC4949] border-white/20 rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="grow flex flex-col gap-2 min-w-0 text-center sm:text-left w-full self-center">
                                        <div className="flex justify-center sm:justify-start">
                                            <span className="text-[10px] bg-linear-to-r from-[#EC4949] to-purple-600 text-white font-bold px-2.5 py-0.5 rounded-full select-none">
                                                {isSpinning
                                                    ? "ROLLING..."
                                                    : "LUCKY PICK"}
                                            </span>
                                        </div>
                                        <h4 className="text-base md:text-lg font-bold text-white truncate">
                                            {selectedMovie.title}
                                        </h4>
                                        <div className="flex justify-center sm:justify-start items-center gap-2 text-xs text-gray-400">
                                            <span className="text-white font-semibold flex items-center gap-0.5">
                                                ⭐{" "}
                                                {selectedMovie.rating
                                                    ? Number(
                                                          selectedMovie.rating,
                                                      ).toFixed(1)
                                                    : "0.0"}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {selectedMovie.year
                                                    ? selectedMovie.year
                                                          .toString()
                                                          .split("-")[0]
                                                    : "N/A"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 truncate">
                                            {selectedMovie.genres &&
                                            selectedMovie.genres.length > 0
                                                ? selectedMovie.genres.join(
                                                      ", ",
                                                  )
                                                : "No Genre"}
                                        </p>
                                        {!isSpinning && (
                                            <p className="text-[11px] text-[#EC4949] font-medium italic mt-2 animate-pulse">
                                                🍿 Grab your popcorn and watch
                                                it!
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 w-full mt-2">
                                <button
                                    onClick={handleShareClick}
                                    disabled={isSpinning}
                                    className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 border border-white/10 text-white rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer active:scale-98"
                                >
                                    <span>Spin Again 🔄</span>
                                </button>
                                <button
                                    onClick={() => {
                                        if (selectedMovie) {
                                            router.push(
                                                `/library/${selectedMovie.imdb_code}${queryString ? `?${queryString}` : ""}`,
                                            );
                                            setSpinnerModalOpen(false);
                                        }
                                    }}
                                    disabled={isSpinning}
                                    className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 bg-[#EC4949] hover:bg-[#ff5a5a] disabled:opacity-50 disabled:hover:bg-[#EC4949] text-white rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-98 shadow-lg shadow-[#EC4949]/20"
                                >
                                    <span>Watch This! 🍿</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Simple internal helper component for breadcrumb Chevron
function ChevronRight({
    size,
    className,
}: {
    size?: number;
    className?: string;
}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
