import { Movie } from "./movie";

export interface GenreNavigationProps {
    genres: string[];
    selectedGenre: string;
    onSelectGenre: (genre: string) => void;
}

export interface MovieRankShowcaseProps {
    activeMovie: Movie;
    activeIdx: number;
    isInWatchlist: boolean;
    onToggleWatchlist: () => void;
}

export interface RankPreviewListProps {
    movies: Movie[];
    activeIdx: number;
    onSelectActive: (idx: number) => void;
}
