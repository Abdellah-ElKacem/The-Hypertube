"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/core/lib/axios";
import { useAuth } from "@/core/contexts/AuthContext";
import { DetailedMovie, SimilarMovie, CommentItem } from "@/core/types/library";

interface ApiCastMember {
    picture?: string;
    name?: string;
}

interface ApiProductionCompanyLogo {
    logo_path?: string;
    name?: string;
}

import MovieDetailSkeleton from "@/core/components/movieDetailsPage/MovieDetailSkeleton";
import MovieMainInfo from "@/core/components/movieDetailsPage/MovieMainInfo";
import CommentsSection from "@/core/components/movieDetailsPage/CommentsSection";
import SimilarMovies from "@/core/components/movieDetailsPage/SimilarMovies";
import { ChevronRight, Clapperboard, Home, Library } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function MovieDetailPage({ params }: PageProps) {
    const { slug } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryString = searchParams ? searchParams.toString() : "";

    const [movie, setMovie] = useState<DetailedMovie | null>(null);
    const [posterSrc, setPosterSrc] = useState<string>("/no-poster.png");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [wishlist, setWishlist] = useState<boolean>(false);
    const [userRating, setUserRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);

    const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
    const [isSimilarLoading, setIsSimilarLoading] = useState<boolean>(true);

    const { user, refreshWatchHistory, watchedMovieIds } = useAuth();
    const isWatched = watchedMovieIds?.has(slug);

    const [comments, setComments] = useState<CommentItem[]>([]);
    const [commentsLoading, setCommentsLoading] = useState<boolean>(true);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isTrailerModalOpen, setIsTrailerModalOpen] =
        useState<boolean>(false);
    const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
    const [trailerError, setTrailerError] = useState<string | null>(null);
    const [isTrailerLoading, setIsTrailerLoading] = useState<boolean>(false);

    const [isStreaming, setIsStreaming] = useState<boolean>(false);

    const defaultSubtitleLang = useRef<string | null>(null);
    if (!defaultSubtitleLang.current && user) {
        defaultSubtitleLang.current = user.subtitlePreference || "en";
    }

    useEffect(() => {
        if (movie?.posterUrl) {
            setPosterSrc(movie.posterUrl);
        }
    }, [movie?.posterUrl]);

    const hasMagnets = !!(
        movie?.magnetLinks &&
        (Array.isArray(movie.magnetLinks)
            ? movie.magnetLinks.length > 0
            : typeof movie.magnetLinks === "string"
              ? movie.magnetLinks.trim().length > 0
              : Object.keys(movie.magnetLinks).length > 0)
    );

    const handleWatchNow = () => {
        if (hasMagnets) {
            setIsStreaming(true);
            if (refreshWatchHistory) {
                setTimeout(() => {
                    refreshWatchHistory();
                }, 2000);
            }
        }
    };

    const handleOpenTrailer = async () => {
        setTrailerError(null);
        if (trailerUrl) {
            setIsTrailerModalOpen(true);
            return;
        }
        setIsTrailerLoading(true);
        try {
            const res = await api.get(`/movies/${slug}/trailer`);
            if (res.data?.success && res.data.data) {
                setTrailerUrl(res.data.data);
                setIsTrailerModalOpen(true);
            } else {
                setTrailerError("Trailer not found for this movie.");
                setIsTrailerModalOpen(true);
            }
        } catch (err) {
            console.error("Error fetching movie trailer:", err);
            setTrailerError("Failed to load trailer. Please try again later.");
            setIsTrailerModalOpen(true);
        } finally {
            setIsTrailerLoading(false);
        }
    };

    const fetchComments = async (showSkeleton = false) => {
        if (!movie || !movie.id) return;
        if (showSkeleton) setCommentsLoading(true);
        try {
            const res = await api.get(`/comments`, {
                params: { movieId: movie.id },
            });
            if (res.data?.success) {
                setComments(res.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching comments:", err);
        } finally {
            if (showSkeleton) setCommentsLoading(false);
        }
    };

    const handleAddComment = async (content: string, parentId?: string) => {
        if (!movie || !movie.id) return;
        try {
            const res = await api.post("/comments", {
                movieId: movie.id,
                content: content.trim(),
                parentId: parentId || undefined,
            });

            if (res.data?.success) {
                await fetchComments();
            }
        } catch (err) {
            console.error("Error adding comment:", err);
            throw err;
        }
    };

    const handleEditComment = async (content: string, commentId: string) => {
        try {
            const res = await api.patch(`/comments/${commentId}`, {
                content: content.trim(),
            });

            if (res.data?.success) {
                await fetchComments();
            }
        } catch (err) {
            console.error("Error updating comment:", err);
            throw err;
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;
        try {
            const res = await api.delete(`/comments/${commentId}`);
            if (res.data?.success) {
                await fetchComments();
            }
        } catch (err) {
            console.error("Error deleting comment:", err);
        }
    };

    const handleLikeComment = async (commentId: string) => {
        try {
            const res = await api.post(`/comments/${commentId}/like`);
            if (res.data?.success) {
                await fetchComments();
            }
        } catch (err) {
            console.error("Error liking comment:", err);
        }
    };

    const handleDislikeComment = async (commentId: string) => {
        try {
            const res = await api.post(`/comments/${commentId}/dislike`);
            if (res.data?.success) {
                await fetchComments();
            }
        } catch (err) {
            console.error("Error disliking comment:", err);
        }
    };

    useEffect(() => {
        if (movie?.id) {
            fetchComments(true);
        }
    }, [movie?.id]);

    const handleRateMovie = async (ratingVal: number) => {
        if (!movie || !movie.id) return;
        try {
            const res = await api.post("/movies/rate", {
                movieId: movie.id,
                ratingValue: ratingVal,
            });

            if (res.data?.success) {
                setUserRating(ratingVal);
                setMovie((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        rating:
                            res.data.averageRating?.toFixed(1) || prev.rating,
                        ratingCount:
                            res.data.totalRatings !== undefined
                                ? res.data.totalRatings
                                : prev.ratingCount,
                    };
                });
            }
        } catch (error) {
            console.error("Error rating movie:", error);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsModalOpen(false);
                setIsTrailerModalOpen(false);
            }
        };

        if (isModalOpen || isTrailerModalOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isModalOpen, isTrailerModalOpen]);

    useEffect(() => {
        let isCancelled = false;

        const fetchMovieDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await api.get(`/movies/${slug}`);
                if (isCancelled) return;

                if (res.data?.success && res.data.data) {
                    const data = res.data.data;
                    const mapped = {
                        id: data._id,
                        tmdbId: data.tmdbId,
                        imdbId: data.imdbId,
                        title: data.movieName || "Untitled",
                        posterUrl: data.posterPath
                            ? data.posterPath.startsWith("http")
                                ? data.posterPath
                                : `https://image.tmdb.org/t/p/w500${data.posterPath}`
                            : "/no-poster.png",
                        rating:
                            data.ratingCount > 0 &&
                            data.globalRating !== undefined
                                ? data.globalRating.toFixed(1)
                                : "0.0",
                        magnetLinks: data.magnetLinks,
                        popularity: data.popularity
                            ? Number(data.popularity).toFixed(3)
                            : "0.0",
                        votes: data.voteAverage
                            ? data.voteAverage.toFixed(1)
                            : "0.0",
                        ratingCount: data.ratingCount || 0,
                        language: data.language?.toUpperCase() || "EN",
                        year: data.releaseDate
                            ? new Date(data.releaseDate)
                                  .getFullYear()
                                  .toString()
                            : "N/A",
                        duration: data.duration
                            ? `${Math.floor(data.duration / 60)}h ${data.duration % 60}m`
                            : "N/A",
                        genres: data.genres || [],
                        description: data.overview || "",
                        cast: data.cast
                            ? data.cast.map((c: ApiCastMember) => ({
                                  src: c.picture
                                      ? c.picture.startsWith("http")
                                          ? c.picture
                                          : `https://image.tmdb.org/t/p/w185${c.picture}`
                                      : null,
                                  alt: c.name || "Actor",
                              }))
                            : [],
                        director: data.director
                            ? {
                                  name:
                                      typeof data.director === "string"
                                          ? data.director
                                          : data.director.name || "Unknown",
                                  picture: data.director.picture
                                      ? data.director.picture.startsWith("http")
                                          ? data.director.picture
                                          : `https://image.tmdb.org/t/p/w185${data.director.picture}`
                                      : null,
                              }
                            : null,
                        producer: data.producer
                            ? {
                                  name:
                                      typeof data.producer === "string"
                                          ? data.producer
                                          : data.producer.name || "Unknown",
                                  picture: data.producer.picture
                                      ? data.producer.picture.startsWith("http")
                                          ? data.producer.picture
                                          : `https://image.tmdb.org/t/p/w185${data.producer.picture}`
                                      : null,
                              }
                            : null,
                        productionCompanies: data.production_companies
                            ? data.production_companies.map((pc: ApiProductionCompanyLogo) => ({
                                  src: pc.logo_path
                                      ? pc.logo_path.startsWith("http")
                                          ? pc.logo_path
                                          : `https://image.tmdb.org/t/p/w185${pc.logo_path}`
                                      : null,
                                  alt: pc.name || "Company",
                              }))
                            : [],
                    };
                    setMovie(mapped);
                    if (res.data.userRating !== undefined) {
                        setUserRating(res.data.userRating);
                    }
                } else {
                    setError("Movie not found.");
                }
            } catch (err: unknown) {
                if (isCancelled) return;
                console.error("Error fetching movie details:", err);
                const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
                setError(
                    axiosError?.response?.data?.message ||
                        axiosError?.message ||
                        "Failed to load movie details.",
                );
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        };

        const checkWishlist = async () => {
            if (!user?._id) return;
            try {
                const res = await api.get(`/wishlist/${user._id}`);
                if (res.data?.success && Array.isArray(res.data.data)) {
                    const inWishlist = res.data.data.some(
                        (m: { imdb_code: string; imdbId?: string }) => m.imdb_code === slug || m.imdbId === slug,
                    );
                    setWishlist(inWishlist);
                }
            } catch (err) {
                console.error("Error checking wishlist:", err);
            }
        };

        if (slug) {
            fetchMovieDetails();
            checkWishlist();
        }

        return () => {
            isCancelled = true;
        };
    }, [user?._id, slug]);

    useEffect(() => {
        let isCancelled = false;
        const fetchSimilarMovies = async () => {
            setIsSimilarLoading(true);
            try {
                const res = await api.get(`/movies/${slug}/similar`);
                if (isCancelled) return;
                if (res.data?.success) {
                    setSimilarMovies(res.data.data || []);
                }
            } catch (err) {
                console.error("Error fetching similar movies:", err);
            } finally {
                if (!isCancelled) setIsSimilarLoading(false);
            }
        };

        if (slug) {
            fetchSimilarMovies();
        }

        return () => {
            isCancelled = true;
        };
    }, [slug]);

    const handleToggleWishlist = async () => {
        try {
            if (wishlist) {
                const res = await api.delete(`/movies/${slug}/wishlist`);
                if (res.data?.success) {
                    setWishlist(false);
                }
            } else {
                const res = await api.post(`/movies/${slug}/wishlist`);
                if (res.data?.success) {
                    setWishlist(true);
                }
            }
        } catch (err) {
            console.error("Error toggling wishlist:", err);
        }
    };

    if (isLoading) {
        return <MovieDetailSkeleton />;
    }

    if (error || !movie) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-gray-400 bg-platform">
                <p className="text-xl font-light">
                    {error || "Movie not found"}
                </p>
                <Link
                    href="/library"
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm transition-colors text-white"
                >
                    Back to Library
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-10 pb-10">
                        <div className="sticky top-0 w-full bg-[#1f1e25] z-30 pb-4 p-6 flex gap-2 items-center text-sm">
                            <button
                                onClick={() => router.push("/home")}
                                className="group flex gap-2 items-center cursor-pointer"
                            >
                                <Home size={15} />
                            </button>
                            <ChevronRight size={15} className="text-gray-400" />
                            <button
                                onClick={() => {
                                    if (queryString) {
                                        router.push(`/library?${queryString}`);
                                    } else {
                                        router.push("/library");
                                    }
                                }}
                                className="group flex gap-2 items-center cursor-pointer"
                            >
                                <Library size={15} />
                                <span className="font-medium">Library</span>
                            </button>
                            <ChevronRight size={15} className="text-gray-400" />
                            <Clapperboard size={15} className="text-gray-400" />
                            <span className="font-medium text-xs md:text-sm truncate text-white">
                                {movie.title}
                            </span>
                        </div>
            {/* Core Info & Video Player Section */}
            <MovieMainInfo
                movie={movie}
                posterSrc={posterSrc}
                setPosterSrc={setPosterSrc}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                userRating={userRating}
                hoverRating={hoverRating}
                onRateMovie={handleRateMovie}
                onHoverRating={setHoverRating}
                isWatched={!!isWatched}
                hasMagnets={hasMagnets}
                isStreaming={isStreaming}
                onWatchNow={handleWatchNow}
                defaultSubtitleLang={defaultSubtitleLang.current || "en"}
                isTrailerLoading={isTrailerLoading}
                onOpenTrailer={handleOpenTrailer}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                isTrailerModalOpen={isTrailerModalOpen}
                setIsTrailerModalOpen={setIsTrailerModalOpen}
                trailerUrl={trailerUrl}
                trailerError={trailerError}
                queryString={queryString}
                similarMovies={similarMovies}
            />

            {/* Comments & Recommendations Section */}
            <div className="flex flex-col lg:flex-row w-full gap-8 px-2">
                <CommentsSection
                    comments={comments}
                    commentsLoading={commentsLoading}
                    onAddComment={handleAddComment}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
                    onLikeComment={handleLikeComment}
                    onDislikeComment={handleDislikeComment}
                    user={user}
                />
                <SimilarMovies
                    similarMovies={similarMovies}
                    isSimilarLoading={isSimilarLoading}
                    queryString={queryString}
                />
            </div>
        </div>
    );
}
