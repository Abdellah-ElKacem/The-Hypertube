import { User } from "@/core/lib/users";

export interface ProfileMovie {
    title: string;
    imdb_code: string;
    year?: string | number;
    rating?: number;
    poster?: string;
    genres?: string[];
    summary?: string;
    runtime?: number;
}

export interface GenreRating {
    genre: string;
    rating: number;
    count?: number;
}

export interface BadgeData {
    name: string;
    description: string;
}

export interface ProfileHeaderProps {
    profileUser: User | null;
    isMine: boolean;
    badges: BadgeData[];
    selectedCoverId: string;
    onSelectCover: (presetId: string) => void;
    isLoadingUser: boolean;
}

export interface TopRatedGenresProps {
    genreRatings: GenreRating[];
    isLoadingGenres: boolean;
}

export interface TopMoviesProps {
    topMovies: ProfileMovie[];
    isLoadingMovies: boolean;
    isMine: boolean;
}

export interface WishListSectionProps {
    wishlist: ProfileMovie[];
    isLoadingWishlist: boolean;
    isMine: boolean;
}
