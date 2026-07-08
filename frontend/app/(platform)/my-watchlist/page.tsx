"use client";

import React, { useState, useEffect } from "react";
import api from "@/core/lib/axios";
import { useAuth } from "@/core/contexts/AuthContext";
import { WishlistItem } from "@/core/types/watchlist";
import MovieSkeleton from "@/core/components/watchlistPage/MovieSkeleton";
import WatchlistEmpty from "@/core/components/watchlistPage/WatchlistEmpty";
import WatchlistHeader from "@/core/components/watchlistPage/WatchlistHeader";
import WatchlistGrid from "@/core/components/watchlistPage/WatchlistGrid";

export default function WatchlistPage() {
    const { user, loading: authLoading } = useAuth();
    const [movies, setMovies] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [sortType, setSortType] = useState<"title" | "year" | "rating">(
        "title",
    );
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const fetchWatchlist = async () => {
        if (!user?._id) return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await api.get(`/wishlist/${user._id}`);
            if (res.data?.success && Array.isArray(res.data.data)) {
                setMovies(res.data.data);
            } else {
                setError("Failed to fetch watchlist.");
            }
        } catch (err) {
            console.error("Watchlist fetch error:", err);
            const responseData =
                err &&
                typeof err === "object" &&
                "response" in err &&
                err.response &&
                typeof err.response === "object" &&
                "data" in err.response
                    ? (err.response.data as {
                          message?: string;
                          error?: string;
                      })
                    : undefined;

            setError(
                responseData?.message ||
                    responseData?.error ||
                    "Failed to load watchlist.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (user?._id) {
                fetchWatchlist();
            } else {
                setIsLoading(false);
                setError("Please log in to view your watchlist.");
            }
        }
    }, [user?._id, authLoading]);

    const handleRemoveFromWishlist = async (
        e: React.MouseEvent,
        imdbCode: string,
    ) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const res = await api.delete(`/movies/${imdbCode}/wishlist`);
            if (res.data?.success) {
                setMovies((prev) =>
                    prev.filter((m) => m.imdb_code !== imdbCode),
                );
            }
        } catch (err) {
            console.error("Error removing from watchlist:", err);
        }
    };

    const getYear = (yearStr: string) => {
        if (!yearStr) return "N/A";
        if (!isNaN(Number(yearStr)) && yearStr.length === 4) return yearStr;
        const parsedDate = new Date(yearStr);
        return isNaN(parsedDate.getTime())
            ? yearStr
            : parsedDate.getFullYear().toString();
    };

    // Sort movies
    const sortedMovies = [...movies].sort((a, b) => {
        let fieldA: string | number = "";
        let fieldB: string | number = "";

        if (sortType === "title") {
            fieldA = a.title?.toLowerCase() || "";
            fieldB = b.title?.toLowerCase() || "";
        } else if (sortType === "year") {
            fieldA = Number(getYear(a.year)) || 0;
            fieldB = Number(getYear(b.year)) || 0;
        } else if (sortType === "rating") {
            fieldA = Number(a.rating) || 0;
            fieldB = Number(b.rating) || 0;
        }

        if (typeof fieldA === "string" && typeof fieldB === "string") {
            return sortOrder === "asc"
                ? fieldA.localeCompare(fieldB)
                : fieldB.localeCompare(fieldA);
        }
        const numA = Number(fieldA);
        const numB = Number(fieldB);
        if (numA < numB) return sortOrder === "asc" ? -1 : 1;
        if (numA > numB) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    return (
        <div className="flex flex-col w-full gap-8 pb-6">
            <WatchlistHeader
                totalCount={movies.length}
                sortType={sortType}
                sortOrder={sortOrder}
                onSortTypeChange={setSortType}
                onSortOrderToggle={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
            />

            {error && (
                <div className="w-full bg-[#EC4949]/10 border border-[#EC4949]/30 rounded-xl p-4 text-[#EC4949] text-xs md:text-sm">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <MovieSkeleton key={i} />
                    ))}
                </div>
            ) : sortedMovies.length === 0 ? (
                <WatchlistEmpty />
            ) : (
                <WatchlistGrid
                    movies={sortedMovies}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                />
            )}
        </div>
    );
}
