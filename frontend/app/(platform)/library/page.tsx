"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import api from "@/core/lib/axios";
import { useAuth } from "@/core/contexts/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import { Movie } from "@/core/types/library";
import { WishlistItem } from "@/core/types/watchlist";
import { ApiMovie } from "@/core/types/movie";
import LibraryHeader from "@/core/components/libraryPage/LibraryHeader";
import MovieSkeleton from "@/core/components/libraryPage/MovieSkeleton";
import LibraryGrid from "@/core/components/libraryPage/LibraryGrid";

function LibraryContent() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams ? searchParams.get("q") || "" : "";
    const queryString = searchParams ? searchParams.toString() : "";

    const selectedGenre = searchParams ? searchParams.get("genre") || "All Genres" : "All Genres";
    const selectedYear = searchParams ? searchParams.get("year") || "All Years" : "All Years";
    const sortType = searchParams ? searchParams.get("sort") || "download_count" : "download_count";
    const sortOrder = searchParams ? (searchParams.get("order_by") as "asc" | "desc") || "desc" : "desc";

    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

    const observerTargetRef = useRef<HTMLDivElement | null>(null);

    const handleFilterChange = (updates: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === "" || value.includes("All ")) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        router.push(`/library?${params.toString()}`);
    };

    // Fetch watchlist IDs on mount to show bookmarks
    useEffect(() => {
        if (authLoading || !user?._id) return;
        const fetchWishlist = async () => {
            try {
                const res = await api.get(`/wishlist/${user._id}`);
                if (res.data?.success && Array.isArray(res.data.data)) {
                    setWishlistIds(new Set(res.data.data.map((m: WishlistItem) => m.imdb_code)));
                }
            } catch (err) {
                console.error("Error fetching wishlist:", err);
            }
        };
        fetchWishlist();
    }, [user?._id, authLoading]);

    const handleToggleWishlist = async (e: React.MouseEvent, movieId: string) => {
        e.preventDefault();
        e.stopPropagation();
        const inWishlist = wishlistIds.has(movieId);
        try {
            if (inWishlist) {
                const res = await api.delete(`/movies/${movieId}/wishlist`);
                if (res.data?.success) {
                    setWishlistIds(prev => {
                        const updated = new Set(prev);
                        updated.delete(movieId);
                        return updated;
                    });
                }
            } else {
                const res = await api.post(`/movies/${movieId}/wishlist`);
                if (res.data?.success) {
                    setWishlistIds(prev => {
                        const updated = new Set(prev);
                        updated.add(movieId);
                        return updated;
                    });
                }
            }
        } catch (err) {
            console.error("Error toggling wishlist:", err);
        }
    };

    // Reset list and pagination when query, filters, or sort order change
    useEffect(() => {
        setMovies([]);
        setPage(1);
        setHasMore(true);
        setError(null);
        setIsLoading(true);
    }, [query, selectedGenre, selectedYear, sortType, sortOrder]);

    // Fetch movies from API
    useEffect(() => {
        let isCancelled = false;

        const loadMovies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let res;
                if (query) {
                    res = await api.get("/search", {
                        params: { q: query, page }
                    });
                } else {
                    res = await api.get("/movies", {
                        params: {
                            page,
                            genre: selectedGenre === "All Genres" ? undefined : selectedGenre,
                            year: selectedYear === "All Years" ? undefined : selectedYear,
                            sort: sortType,
                            order_by: sortOrder,
                        }
                    });
                }

                if (isCancelled) return;

                if (res.data?.success) {
                    const apiMovies = res.data.data || [];
                    const totalPages = res.data.totalpages || 1;

                    const mapped: Movie[] = apiMovies.map((m: ApiMovie) => ({
                        id: m.imdb_code || String(Math.random()),
                        title: m.title || "Untitled",
                        posterUrl: m.poster
                            ? (m.poster.startsWith("http")
                                ? m.poster
                                : `https://image.tmdb.org/t/p/w500${m.poster}`)
                            : "/no-poster.png",
                        rating: m.rating ? Number(m.rating).toFixed(1) : "0.0",
                        votes: "N/A",
                        language: "EN",
                        year: m.year ? m.year.toString().split("-")[0] : "N/A",
                        duration: m.runtime ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m` : "N/A",
                        description: m.summary || "",
                        genres: m.genres || [],
                        cast: [],
                        productionCompanies: [],
                    }));

                    setMovies((prev) => {
                        if (page === 1) return mapped;
                        const existingIds = new Set(prev.map(p => p.id));
                        const filteredNew = mapped.filter((n) => !existingIds.has(n.id));
                        return [...prev, ...filteredNew];
                    });
                    setHasMore(page < totalPages && apiMovies.length > 0);
                } else {
                    setError("Failed to load movies from API.");
                }
            } catch (err) {
                if (isCancelled) return;
                console.error("API error fetching movies:", err);
                const responseData =
                    err &&
                    typeof err === "object" &&
                    "response" in err &&
                    err.response &&
                    typeof err.response === "object" &&
                    "data" in err.response
                        ? (err.response.data as { message?: string; error?: string })
                        : undefined;

                setError(
                    responseData?.message ||
                        responseData?.error ||
                        "An error occurred while fetching movies.",
                );
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        };

        loadMovies();

        return () => {
            isCancelled = true;
        };
    }, [page, query, selectedGenre, selectedYear, sortType, sortOrder]);

    // Intersection Observer for infinite scrolling
    useEffect(() => {
        const currentTarget = observerTargetRef.current;
        if (!currentTarget) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading && movies.length > 0) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(currentTarget);

        return () => {
            if (currentTarget) observer.unobserve(currentTarget);
        };
    }, [hasMore, isLoading, movies.length]);

    return (
        <div className="w-full flex flex-col gap-8 pb-10">
            <LibraryHeader
                query={query}
                selectedGenre={selectedGenre}
                selectedYear={selectedYear}
                sortType={sortType}
                sortOrder={sortOrder}
                onFilterChange={handleFilterChange}
            />

            {error && (
                <div className="w-full bg-[#EC4949]/10 border border-[#EC4949]/30 rounded-xl p-4 text-[#EC4949] text-xs md:text-sm">
                    {error}
                </div>
            )}

            {movies.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <p className="text-lg font-light">No movies found matching these filters</p>
                </div>
            ) : (
                <LibraryGrid
                    movies={movies}
                    wishlistIds={wishlistIds}
                    queryString={queryString}
                    onToggleWishlist={handleToggleWishlist}
                />
            )}

            {/* Loading skeletons for infinite scroll */}
            {isLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <MovieSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Intersection Observer load trigger point */}
            <div ref={observerTargetRef} className="h-10 w-full" />
        </div>
    );
}

export default function LibraryPage() {
    return (
        <Suspense fallback={<div className="h-40 w-full flex items-center justify-center text-gray-400">Loading library...</div>}>
            <LibraryContent />
        </Suspense>
    );
}