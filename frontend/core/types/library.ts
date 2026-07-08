export interface CastMember {
    src: string;
    alt: string;
}

export interface ProductionCompany {
    src: string;
    alt: string;
}

export interface Movie {
    id: string;
    title: string;
    posterUrl: string;
    rating: string;
    votes: string;
    language: string;
    year: string;
    duration: string;
    description: string;
    genres: string[];
    cast: CastMember[];
    productionCompanies: ProductionCompany[];
}

export interface DetailedMovie extends Movie {
    tmdbId?: string;
    imdbId?: string;
    magnetLinks?: string | string[] | Record<string, any>;
    popularity?: string;
    ratingCount?: number;
    director?: { name: string; picture: string | null } | null;
    producer?: { name: string; picture: string | null } | null;
}

export interface SimilarMovie {
    imdb_code: string;
    poster: string | null;
    title: string;
    genres?: string[];
    rating?: string | number;
    year?: string | number;
}

export interface CommentUser {
    _id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar: string | null;
}

export interface CommentItem {
    _id: string;
    userId: CommentUser | null;
    content: string;
    createdAt: string;
    likes?: string[];
    dislikes?: string[];
    replies?: CommentItem[];
}

export interface LibraryHeaderProps {
    query: string;
    selectedGenre: string;
    selectedYear: string;
    sortType: string;
    sortOrder: "asc" | "desc";
    onFilterChange: (updates: Record<string, string | undefined>) => void;
}

export interface LibraryGridProps {
    movies: Movie[];
    wishlistIds: Set<string>;
    queryString: string;
    onToggleWishlist: (e: React.MouseEvent, movieId: string) => void;
}
