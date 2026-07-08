export interface WishlistItem {
    title: string;
    imdb_code: string;
    year: string;
    rating: number;
    poster: string;
    genres: string[];
    summary: string;
    runtime: number;
}

export interface WatchlistHeaderProps {
    totalCount: number;
    sortType: "title" | "year" | "rating";
    sortOrder: "asc" | "desc";
    onSortTypeChange: (type: "title" | "year" | "rating") => void;
    onSortOrderToggle: () => void;
}

export interface WatchlistGridProps {
    movies: WishlistItem[];
    onRemoveFromWishlist: (e: React.MouseEvent, imdbCode: string) => void;
}
