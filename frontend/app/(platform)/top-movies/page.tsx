"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/core/lib/axios";
import { useAuth } from "@/core/contexts/AuthContext";
import { Movie } from "@/core/types/movie";
import GenreNavigation from "@/core/components/top3Page/GenreNavigation";
import MovieRankShowcase from "@/core/components/top3Page/MovieRankShowcase";
import RankPreviewList from "@/core/components/top3Page/RankPreviewList";
import { genres } from "@/core/constants/consts";
import { ApiMovie } from "@/core/types/movie";
import { ProfileMovie } from "@/core/types/profile";

export default function TopMoviesPage() {
    const { user, loading: authLoading } = useAuth();
    const [selectedGenre, setSelectedGenre] = useState("Popular on LeetStream");
    const [movies, setMovies] = useState<Movie[]>([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [watchlist, setWatchlist] = useState<(Movie | ProfileMovie)[]>([]);

    const mapTopMovie = (m: ApiMovie): Movie => ({
        id: m.imdb_code || m.id || String(Math.random()),
        title: m.title || "Untitled",
        rating: m.rating ? Number(m.rating).toFixed(1) : "0.0",
        votes: m.votes !== undefined && m.votes !== null ? String(m.votes) : "0",
        year: m.year ? m.year.toString().split("-")[0] : "N/A",
        duration: m.runtime
            ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m`
            : "N/A",
        bgUrl: m.poster
            ? m.poster.startsWith("http")
                ? m.poster
                : `https://image.tmdb.org/t/p/w500${m.poster}`
            : "/movie01_poster.png",
        genres: m.genres || [],
        description: m.summary || "No description available.",
    });

    // Fetch watchlist to sync bookmarks
    useEffect(() => {
        if (authLoading || !user?._id) return;
        const fetchWatchlist = async () => {
            try {
                const res = await api.get(`/wishlist/${user._id}`);
                if (res.data?.success && res.data.data) {
                    setWatchlist(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching watchlist:", err);
            }
        };
        fetchWatchlist();
    }, [user?._id, authLoading]);

    // Fetch top 10 movies for the selected genre
    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            try {
                const queryGenre =
                    selectedGenre === "Sci-Fi"
                        ? "Science Fiction"
                        : selectedGenre;
                const endpoint =
                    selectedGenre === "Popular on LeetStream"
                        ? "/movies/popular"
                        : `/movies/top/${queryGenre}`;
                const res = await api.get(endpoint);
                if (res.data?.success && res.data.data) {
                    const dataObj = res.data.data;
                    const moviesArray = Array.isArray(dataObj)
                        ? dataObj
                        : Array.isArray(dataObj.movies)
                          ? dataObj.movies
                          : [];
                    const mapped = moviesArray.map(mapTopMovie);
                    setMovies(mapped.slice(0, 10)); // guarantee limit of 10
                } else {
                    setMovies([]);
                }
            } catch (err) {
                console.error("Error fetching top movies:", err);
                setMovies([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovies();
    }, [selectedGenre]);

    const handleNext = () => {
        if (movies.length === 0) return;
        setActiveIdx((prev) => (prev + 1) % movies.length);
    };

    const handlePrev = () => {
        if (movies.length === 0) return;
        setActiveIdx((prev) => (prev - 1 + movies.length) % movies.length);
    };

    const activeMovie = movies[activeIdx];
    const isInWatchlist = activeMovie
        ? watchlist.some((m) => {
              const itemId = "id" in m ? (m as Movie).id : (m as ProfileMovie).imdb_code;
              return itemId === activeMovie.id;
          })
        : false;

    const handleToggleWatchlist = async () => {
        if (!activeMovie) return;
        const movieId = activeMovie.id;
        try {
            if (isInWatchlist) {
                const res = await api.delete(`/movies/${movieId}/wishlist`);
                if (res.data?.success) {
                    setWatchlist((prev) =>
                        prev.filter((m) => {
                            const itemId = "id" in m ? (m as Movie).id : (m as ProfileMovie).imdb_code;
                            return itemId !== movieId;
                        }),
                    );
                }
            } else {
                const res = await api.post(`/movies/${movieId}/wishlist`);
                if (res.data?.success) {
                    setWatchlist((prev) => [...prev, activeMovie]);
                }
            }
        } catch (err) {
            console.error("Error toggling watchlist:", err);
        }
    };

    return (
        <div className="h-full w-full flex flex-col gap-6 md:gap-8 pb-10">
            {/* Genre Navigation Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest text-[#EC4949] font-semibold">
                        Rankings
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Top 10 Rankings
                    </h1>
                </div>
                <GenreNavigation
                    genres={genres}
                    selectedGenre={selectedGenre}
                    onSelectGenre={(g) => {
                        setSelectedGenre(g);
                        setActiveIdx(0);
                    }}
                />
            </div>

            {isLoading ? (
                /* Loading State skeleton */
                <div className="w-full h-[450px] bg-white/5 rounded-2xl animate-pulse flex items-center justify-center">
                    <p className="text-gray-400">Loading top movies...</p>
                </div>
            ) : movies.length === 0 ? (
                /* Empty State */
                <div className="w-full h-[400px] flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
                    <p className="text-gray-500">
                        No movies found in this category.
                    </p>
                </div>
            ) : (
                /* Main Interactive Rank Showcase */
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-lg md:text-xl font-medium text-white flex items-center gap-2">
                            {selectedGenre === "Popular on LeetStream" ? (
                                <>
                                    Top 10 on{" "}
                                    <span className="text-[#EC4949]">
                                        LeetStream
                                    </span>
                                </>
                            ) : (
                                <>
                                    Top 10{" "}
                                    <span className="text-[#EC4949]">
                                        {selectedGenre}
                                    </span>{" "}
                                    Movies
                                </>
                            )}
                        </h2>
                        {/* Navigation controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrev}
                                className="p-2 rounded-full bg-white/5 hover:bg-white/15 w-9 h-9 flex justify-center items-center cursor-pointer active:scale-95 transition-all focus:outline-none border border-white/5"
                                aria-label="Previous movie"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm font-semibold text-gray-400 w-12 text-center">
                                {activeIdx + 1} / {movies.length}
                            </span>
                            <button
                                onClick={handleNext}
                                className="p-2 rounded-full bg-white/5 hover:bg-white/15 w-9 h-9 flex justify-center items-center cursor-pointer active:scale-95 transition-all focus:outline-none border border-white/5"
                                aria-label="Next movie"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Detailed movie display */}
                    <MovieRankShowcase
                        activeMovie={activeMovie}
                        activeIdx={activeIdx}
                        isInWatchlist={isInWatchlist}
                        onToggleWatchlist={handleToggleWatchlist}
                    />

                    {/* Bottom slider preview list */}
                    <RankPreviewList
                        movies={movies}
                        activeIdx={activeIdx}
                        onSelectActive={(idx) => setActiveIdx(idx)}
                    />
                </div>
            )}
        </div>
    );
}
