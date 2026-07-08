"use client";

import { use, useState, useEffect } from "react";
import { useAuth } from "@/core/contexts/AuthContext";
import api from "@/core/lib/axios";
import { ProfileMovie, GenreRating, BadgeData } from "@/core/types/profile";
import ProfileHeader from "@/core/components/profilePage/ProfileHeader";
import TopRatedGenres from "@/core/components/profilePage/TopRatedGenres";
import TopMovies from "@/core/components/profilePage/TopMovies";
import WishListSection from "@/core/components/profilePage/WishListSection";
import { User } from "@/core/lib/users";

export default function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { user: authUser, refreshUser } = useAuth();
    const { slug: id } = use(params);
    const isMine = authUser?._id === id;


    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

    const [topMovies, setTopMovies] = useState<ProfileMovie[]>([]);
    const [isLoadingMovies, setIsLoadingMovies] = useState<boolean>(true);

    const [genreRatings, setGenreRatings] = useState<GenreRating[]>([]);
    const [isLoadingGenres, setIsLoadingGenres] = useState<boolean>(true);

    const [badges, setBadges] = useState<BadgeData[]>([]);
    const [isLoadingBadges, setIsLoadingBadges] = useState<boolean>(true);

    const [wishlist, setWishlist] = useState<ProfileMovie[]>([]);
    const [isLoadingWishlist, setIsLoadingWishlist] = useState<boolean>(true);

    const [selectedCoverId, setSelectedCoverId] = useState<string>("default");

    useEffect(() => {
        if (profileUser?.coverPicturePreference) {
            setSelectedCoverId(profileUser.coverPicturePreference);
        }
    }, [profileUser]);

    const handleSelectCover = async (presetId: string) => {
        try {
            setSelectedCoverId(presetId);
            const res = await api.patch("/users/cover-picture", { coverPicture: presetId });
            if (res.data?.success) {
                setProfileUser((prev) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        coverPicturePreference: presetId,
                    };
                });
                await refreshUser();
            }
        } catch (err) {
            console.error("Error saving cover picture:", err);
        }
    };

    useEffect(() => {
        if (!id) return;

        // Fetch User Profile details
        const fetchUserProfile = async () => {
            setIsLoadingUser(true);
            try {
                const res = await api.get(`/users/${id}`);
                if (res.data?.success && res.data.user) {
                    setProfileUser(res.data.user);
                }
            } catch (err) {
                console.error("Error fetching user profile:", err);
            } finally {
                setIsLoadingUser(false);
            }
        };

        if (isMine && authUser) {
            setProfileUser(authUser);
            setIsLoadingUser(false);
        } else {
            fetchUserProfile();
        }
    }, [id, isMine, authUser]);

    useEffect(() => {
        if (!id) return;

        // Fetch Top 3 Movies
        const fetchTopMovies = async () => {
            setIsLoadingMovies(true);
            try {
                const res = await api.get(`/movies/top3movies/${id}`);
                if (res.data?.success && Array.isArray(res.data.data)) {
                    setTopMovies(res.data.data);
                } else if (Array.isArray(res.data)) {
                    setTopMovies(res.data);
                }
            } catch (err) {
                console.error("Error fetching top movies:", err);
            } finally {
                setIsLoadingMovies(false);
            }
        };

        fetchTopMovies();
    }, [id]);

    useEffect(() => {
        if (!id) return;

        // Fetch Genre Ratings
        const fetchGenreRatings = async () => {
            setIsLoadingGenres(true);
            try {
                const res = await api.get(`/genresRating/${id}`);
                if (res.data?.success && Array.isArray(res.data.data)) {
                    setGenreRatings(res.data.data.map(mapGenreRating));
                } else if (Array.isArray(res.data)) {
                    setGenreRatings(res.data.map(mapGenreRating));
                }
            } catch (err) {
                console.error("Error fetching genre ratings:", err);
            } finally {
                setIsLoadingGenres(false);
            }
        };

        fetchGenreRatings();
    }, [id]);

    useEffect(() => {
        if (!id) return;

        // Fetch User Badges
        const fetchUserBadges = async () => {
            setIsLoadingBadges(true);
            try {
                const res = await api.get(`/users/${id}/badges`);
                if (res.data?.success && Array.isArray(res.data.data)) {
                    setBadges(res.data.data);
                } else if (Array.isArray(res.data)) {
                    setBadges(res.data);
                }
            } catch (err) {
                console.error("Error fetching user badges:", err);
            } finally {
                setIsLoadingBadges(false);
            }
        };

        fetchUserBadges();
    }, [id]);

    useEffect(() => {
        if (!id) return;

        // Fetch User Wishlist
        const fetchWishlist = async () => {
            setIsLoadingWishlist(true);
            try {
                const res = await api.get(`/wishlist/${id}`);
                if (res.data?.success && Array.isArray(res.data.data)) {
                    setWishlist(res.data.data);
                } else if (Array.isArray(res.data)) {
                    setWishlist(res.data);
                }
            } catch (err) {
                console.error("Error fetching wishlist:", err);
            } finally {
                setIsLoadingWishlist(false);
            }
        };

        fetchWishlist();
    }, [id]);

    interface ApiGenreRating {
        genre?: string;
        _id?: string;
        name?: string;
        averageRating?: number | string;
        rating?: number | string;
        movieCount?: number | string;
        count?: number | string;
    }

    const mapGenreRating = (item: ApiGenreRating): GenreRating => {
        return {
            genre: item.genre || item._id || item.name || "Unknown",
            rating: item.averageRating !== undefined && item.averageRating !== null
                ? Number(item.averageRating)
                : (item.rating !== undefined && item.rating !== null ? Number(item.rating) : 0),
            count: item.movieCount !== undefined && item.movieCount !== null
                ? Number(item.movieCount)
                : (item.count !== undefined && item.count !== null ? Number(item.count) : 0),
        };
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <ProfileHeader
                profileUser={profileUser}
                isMine={isMine}
                badges={badges}
                selectedCoverId={selectedCoverId}
                onSelectCover={handleSelectCover}
                isLoadingUser={isLoadingUser}
            />

            <div className="flex flex-col lg:flex-row gap-8 mt-4 w-full">
                <TopRatedGenres
                    genreRatings={genreRatings}
                    isLoadingGenres={isLoadingGenres}
                />
                <TopMovies
                    topMovies={topMovies}
                    isLoadingMovies={isLoadingMovies}
                    isMine={isMine}
                />
            </div>

            <WishListSection
                wishlist={wishlist}
                isLoadingWishlist={isLoadingWishlist}
                isMine={isMine}
            />
        </div>
    );
}