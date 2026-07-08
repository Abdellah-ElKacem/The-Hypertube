"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/core/lib/axios";
import HeroSection, { Movie } from "@/core/components/landingPage/HeroSection";
import PopularWeekSection from "@/core/components/landingPage/PopularWeekSection";
import PopularLeetSection from "@/core/components/landingPage/PopularLeetSection";
import FeaturesSection from "@/core/components/landingPage/FeaturesSection";
import FaqSection from "@/core/components/landingPage/FaqSection";

interface ApiLandingMovie {
    imdb_code?: string;
    tmdb_id?: string | number;
    id?: string | number;
    poster?: string;
    title?: string;
    rating?: string | number;
    year?: string | number;
    runtime?: number;
    genres?: string[];
    summary?: string;
}

const mapLandingMovie = (m: ApiLandingMovie) => ({
    id: m.imdb_code || String(m.tmdb_id || m.id || Math.random()),
    imgUrl: m.poster
        ? (m.poster.startsWith("http") ? m.poster : `https://image.tmdb.org/t/p/w500${m.poster}`)
        : "/movie01_poster.png",
    title: m.title || "Untitled",
    rating: m.rating ? `⭐ ${Number(m.rating).toFixed(1)} / 10` : "⭐ 0.0/10",
    year: m.year ? String(m.year).split("-")[0] || String(m.year) : "N/A",
    duration: m.runtime ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m` : "N/A",
    genre: m.genres && m.genres.length > 0 ? m.genres[0] : "N/A",
    description: m.summary || "No description available."
});

export default function Home() {
    const router = useRouter();
    const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
    const [shuffledWeek, setShuffledWeek] = useState<Movie[]>([]);
    const [shuffledLeet, setShuffledLeet] = useState<Movie[]>([]);

    const handleMovieClick = (movieId: string | undefined) => {
        if (!movieId) return;
        router.push(`/login?redirectTo=/library/${movieId}`);
    };

    useEffect(() => {
        const fetchHeroMovies = async () => {
            try {
                const res = await api.get("/movies/landing");
                if (res.data?.success && res.data.data) {
                    const mapped = res.data.data.map(mapLandingMovie);
                    if (mapped.length > 0) {
                        setHeroMovies(mapped);
                    }
                }
            } catch (err) {
                console.error("Error fetching landing/hero movies:", err);
            }
        };
        fetchHeroMovies();
    }, []);

    useEffect(() => {
        const fetchPopularThisWeek = async () => {
            try {
                const res = await api.get("/movies/topThisWeek");
                if (res.data?.success && res.data.data) {
                    const mapped = res.data.data.map(mapLandingMovie);
                    if (mapped.length > 0) {
                        setShuffledWeek(mapped);
                    }
                }
            } catch (err) {
                console.error("Error fetching popular this week movies:", err);
            }
        };
        fetchPopularThisWeek();
    }, []);

    useEffect(() => {
        const fetchPopularMovies = async () => {
            try {
                const res = await api.get("/movies/popular");
                if (res.data?.success && res.data.data) {
                    const dataObj = res.data.data;
                    const moviesArray = Array.isArray(dataObj)
                        ? dataObj
                        : (Array.isArray(dataObj.movies) ? dataObj.movies : []);
                    const mapped = moviesArray.map(mapLandingMovie);
                    if (mapped.length > 0) {
                        setShuffledLeet(mapped);
                    }
                }
            } catch (err) {
                console.error("Error fetching popular movies:", err);
            }
        };
        fetchPopularMovies();
    }, []);

    if (heroMovies.length === 0) {
        return (
            <div className="w-full h-screen bg-[#080616] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#F8E9A1] border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm font-medium">Loading LeetStream...</p>
                </div>
            </div>
        );
    }

    return (
        <section className="w-full h-full -mt-14 flex flex-col gap-6">
            <HeroSection 
                heroMovies={heroMovies} 
                handleMovieClick={handleMovieClick} 
            />
            <PopularWeekSection 
                shuffledWeek={shuffledWeek} 
                handleMovieClick={handleMovieClick} 
            />
            <PopularLeetSection 
                shuffledLeet={shuffledLeet} 
                handleMovieClick={handleMovieClick} 
            />
            <FeaturesSection />
            <FaqSection />
        </section>
    );
}
