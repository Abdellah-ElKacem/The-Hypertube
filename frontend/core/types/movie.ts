export interface CastMember {
    src: string;
    alt: string;
}

export interface Movie {
    id: string;
    title: string;
    rating: string;
    votes: string;
    year: string;
    duration: string;
    bgUrl: string;
    genres: string[];
    description: string;
    cast?: CastMember[];
}

export interface MovieCarouselProps {
    title: string;
    moviesList: Movie[];
    itemsPerPage: number;
    onMovieClick: (movie: Movie) => void;
    watchlist: Movie[];
    onToggleWatchlist: (movie: Movie) => void;
    viewAllHref?: string;
}

export interface HomeHeroProps {
    heroMovies: Movie[];
    currentMovieIndex: number;
    handlePrev: () => void;
    handleNext: () => void;
    watchlist: Movie[];
    toggleMovieWatchlist: (movie: Movie) => void;
}

export interface MyListProps {
    watchlist: Movie[];
    itemsPerPage: number;
    onMovieClick: (movie: Movie) => void;
    onToggleWatchlist: (movie: Movie) => void;
}

export interface ApiMovie {
    imdb_code?: string;
    id?: string;
    title?: string;
    rating?: number | string;
    votes?: string | number;
    year?: string | number;
    runtime?: number;
    poster?: string;
    genres?: string[];
    summary?: string;
    popularity?: string | number;
}

export interface ApiHistoryMovie {
    imdb_code?: string;
    id?: string;
    title?: string;
    poster?: string;
    posterUrl?: string;
    rating?: string | number;
    year?: string | number;
    runtime?: number;
    summary?: string;
    description?: string;
}

export interface ApiHistoryItem extends ApiHistoryMovie {
    movie?: ApiHistoryMovie;
    watchedAt?: string;
}
