"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/core/contexts/AuthContext";
import api from "@/core/lib/axios";
import { useRouter } from "next/navigation";
import { Movie, ApiMovie } from "@/core/types/movie";

interface ApiCastActor {
    picture?: string;
    name?: string;
}

interface ApiLandingMovie {
    imdb_code?: string;
    tmdb_id?: string | number;
    title?: string;
    rating?: string | number;
    popularity?: string | number;
    year?: string;
    runtime?: number;
    backdrop?: string;
    genres?: string[];
    summary?: string;
    cast?: ApiCastActor[];
}
import HomeHero from "@/core/components/homePage/HomeHero";
import MyListSection from "@/core/components/homePage/MyListSection";
import MovieCarousel from "@/core/components/homePage/MovieCarousel";

export default function HomePage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
    const [watchlist, setWatchlist] = useState<Movie[]>([]);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const [popularweek, setPopularweek] = useState<Movie[]>([]);
    const [topRated, setTopRated] = useState<Movie[]>([]);
    const [libraryMovies, setLibraryMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const updateItemsPerPage = () => {
            const width = window.innerWidth;
            if (width >= 1024) setItemsPerPage(5);
            else if (width >= 768) setItemsPerPage(4);
            else setItemsPerPage(2);
        };
        updateItemsPerPage();
        if (typeof window !== "undefined") {
            window.addEventListener("resize", updateItemsPerPage);
        }
        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", updateItemsPerPage);
            }
        };
    }, []);

    // Helper to map standard API movie items
    const mapApiMovie = (m: ApiMovie): Movie => ({
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

    // Fetch hero / landing movies
    useEffect(() => {
        const fetchLandingMovies = async () => {
            try {
                const res = await api.get("/movies/landing");
                if (res.data?.success && res.data.data) {
                    const mapped = res.data.data.map((m: ApiLandingMovie): Movie => ({
                        id: m.imdb_code || String(m.tmdb_id || Math.random()),
                        title: m.title || "Untitled",
                        rating: m.rating ? Number(m.rating).toFixed(1) : "0.0",
                        votes: m.popularity
                            ? Number(m.popularity).toFixed(3)
                            : "0.000",
                        year: m.year ? m.year.split("-")[0] : "N/A",
                        duration: m.runtime
                            ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m`
                            : "N/A",
                        bgUrl: m.backdrop
                            ? `https://image.tmdb.org/t/p/original${m.backdrop}`
                            : "/movie01_poster.png",
                        genres: m.genres || [],
                        description: m.summary || "No description available.",
                        cast: (m.cast || []).map((actor: ApiCastActor) => ({
                            src: `https://image.tmdb.org/t/p/w185${actor.picture}`,
                            alt: actor.name || "Cast member",
                        })),
                    }));
                    if (mapped.length > 0) {
                        setHeroMovies(mapped);
                    }
                }
            } catch (err) {
                console.error("Error fetching landing movies:", err);
            }
        };
        fetchLandingMovies();
    }, []);

    // Fetch user-specific watchlist
    useEffect(() => {
        if (authLoading || !user?._id) return;
        const fetchWatchlist = async () => {
            try {
                const resWatchlist = await api.get(`/wishlist/${user._id}`);
                if (resWatchlist.data?.success && resWatchlist.data.data) {
                    setWatchlist(resWatchlist.data.data.map(mapApiMovie));
                }
            } catch (err) {
                console.error("Error fetching watchlist:", err);
            }
        };
        fetchWatchlist();
    }, [user?._id, authLoading]);

    // Fetch other lists
    useEffect(() => {
        const fetchOtherMovies = async () => {
            try {
                // 2. Recommendations (We Think You'll Love These)
                const resRecs = await api.get("/movies/recommendations");
                if (resRecs.data?.success && resRecs.data.data) {
                    setRecommendations(resRecs.data.data.map(mapApiMovie));
                }
            } catch (err) {
                console.error("Error fetching recommendations:", err);
            }

            try {
                // 3. Popular this week (Top movie week)
                const resPopularWeek = await api.get("/movies/topThisWeek");
                if (resPopularWeek.data?.success && resPopularWeek.data.data) {
                    setPopularweek(resPopularWeek.data.data.map(mapApiMovie));
                }
            } catch (err) {
                console.error("Error fetching popular movies:", err);
            }

            try {
                // 4. We Think You'll Love (Top3 Rated)
                const resTopRated = await api.get("/movies", {
                    params: { rating: 8, sort: "rating" },
                });
                if (resTopRated.data?.success && resTopRated.data.data) {
                    setTopRated(resTopRated.data.data.map(mapApiMovie));
                }
            } catch (err) {
                console.error("Error fetching top rated movies:", err);
            }

            try {
                // 5. Library movies
                const resLib = await api.get("/movies", {
                    params: { page: 1 },
                });
                if (resLib.data?.success && resLib.data.data) {
                    setLibraryMovies(resLib.data.data.map(mapApiMovie));
                }
            } catch (err) {
                console.error("Error fetching library movies:", err);
            }
        };
        fetchOtherMovies();
    }, []);

    // Autoplay hero movies every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMovieIndex((prev) =>
                heroMovies.length > 0 ? (prev + 1) % heroMovies.length : 0,
            );
        }, 5000);
        return () => clearInterval(interval);
    }, [currentMovieIndex, heroMovies.length]);

    const handleNext = () => {
        setCurrentMovieIndex((prev) =>
            heroMovies.length > 0 ? (prev + 1) % heroMovies.length : 0,
        );
    };

    const handlePrev = () => {
        setCurrentMovieIndex((prev) =>
            heroMovies.length > 0
                ? (prev - 1 + heroMovies.length) % heroMovies.length
                : 0,
        );
    };

    const toggleMovieWatchlist = async (movie: Movie) => {
        if (!movie) return;
        const movieId = movie.id;
        const inWatchlist = watchlist.some((m) => m.id === movieId);
        try {
            if (inWatchlist) {
                const res = await api.delete(`/movies/${movieId}/wishlist`);
                if (res.data?.success) {
                    setWatchlist((prev) =>
                        prev.filter((m) => m.id !== movieId),
                    );
                }
            } else {
                const res = await api.post(`/movies/${movieId}/wishlist`);
                if (res.data?.success) {
                    setWatchlist((prev) => [...prev, movie]);
                }
            }
        } catch (err) {
            console.error("Error toggling watchlist:", err);
        }
    };

    const getListWithFallback = (list: Movie[]) => {
        return list && list.length > 0 ? list : [];
    };

    return (
        <div className="w-full flex flex-col gap-8 pb-10">
            <HomeHero
                heroMovies={heroMovies}
                currentMovieIndex={currentMovieIndex}
                handlePrev={handlePrev}
                handleNext={handleNext}
                watchlist={watchlist}
                toggleMovieWatchlist={toggleMovieWatchlist}
            />

            <MyListSection
                watchlist={watchlist}
                itemsPerPage={itemsPerPage}
                onMovieClick={(movie) => {
                    router.push(`/library/${movie.id}`);
                }}
                onToggleWatchlist={toggleMovieWatchlist}
            />

            <MovieCarousel
                title="Popular This Week"
                moviesList={getListWithFallback(popularweek)}
                itemsPerPage={itemsPerPage}
                onMovieClick={(movie) => {
                    router.push(`/library/${movie.id}`);
                }}
                watchlist={watchlist}
                onToggleWatchlist={toggleMovieWatchlist}
            />

            <MovieCarousel
                title="Top Movies"
                moviesList={getListWithFallback(topRated)}
                itemsPerPage={itemsPerPage}
                onMovieClick={(movie) => {
                    router.push(`/library/${movie.id}`);
                }}
                watchlist={watchlist}
                onToggleWatchlist={toggleMovieWatchlist}
                viewAllHref="/top-movies"
            />

            <MovieCarousel
                title="We Think You’ll Love These"
                moviesList={getListWithFallback(recommendations)}
                itemsPerPage={itemsPerPage}
                onMovieClick={(movie) => {
                    router.push(`/library/${movie.id}`);
                }}
                watchlist={watchlist}
                onToggleWatchlist={toggleMovieWatchlist}
            />

            <MovieCarousel
                title="Library"
                moviesList={getListWithFallback(libraryMovies)}
                itemsPerPage={itemsPerPage}
                onMovieClick={(movie) => {
                    router.push(`/library/${movie.id}`);
                }}
                watchlist={watchlist}
                onToggleWatchlist={toggleMovieWatchlist}
                viewAllHref="/library"
            />
        </div>
    );
}