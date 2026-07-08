"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Clapperboard, User, Bell, Settings2, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/core/contexts/AuthContext";
import LogoMini from "@/public/logo-mini.svg";
import api from "@/core/lib/axios";

interface SearchResultMovie {
    id: string;
    title: string;
    posterUrl: string;
    rating: string;
    year: string;
}

interface ApiSearchMovie {
    imdb_code?: string;
    title?: string;
    poster?: string;
    rating?: number | string;
    year?: string | number;
}

interface TopBarProps {
    onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
    const { user, logout, loading } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const q = searchParams ? searchParams.get("q") || "" : "";
    const [searchQuery, setSearchQuery] = useState(q);

    const [searchResults, setSearchResults] = useState<SearchResultMovie[]>([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [hasMoreResults, setHasMoreResults] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Sync input with search query in URL
    useEffect(() => {
        setSearchQuery(q);
    }, [q]);

    // Fetch search results on search query changes (debounced)
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setHasMoreResults(false);
            return;
        }

        const fetchSearch = async () => {
            setIsSearchLoading(true);
            try {
                const res = await api.get("/search", {
                    params: { q: searchQuery.trim(), page: 1 }
                });

                if (res.data?.success) {
                    const apiMovies = res.data.data || [];
                    const totalPages = res.data.totalpages || 1;

                    const mapped = apiMovies.map((m: ApiSearchMovie) => ({
                        id: m.imdb_code || String(Math.random()),
                        title: m.title || "Untitled",
                        posterUrl: m.poster
                            ? (m.poster.startsWith("http")
                                ? m.poster
                                : `https://image.tmdb.org/t/p/w500${m.poster}`)
                            : "/no-poster.png",
                        rating: m.rating?.toString() || "0.0",
                        year: m.year ? m.year.toString().split("-")[0] : "N/A",
                    }));

                    setSearchResults(mapped);
                    setHasMoreResults(totalPages > 1 || apiMovies.length > 10);
                } else {
                    setSearchResults([]);
                    setHasMoreResults(false);
                }
            } catch (error) {
                console.error("Error fetching search suggestions:", error);
                setSearchResults([]);
                setHasMoreResults(false);
            } finally {
                setIsSearchLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchSearch();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Close user profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    // Close search results dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Close dropdowns on escape key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsDropdownOpen(false);
                setShowResults(false);
            }
        };

        if (isDropdownOpen || showResults) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isDropdownOpen, showResults]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowResults(false);
        if (searchQuery.trim()) {
            router.push(`/library?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push("/library");
        }
    };

    return (
        <div className="w-full flex items-center justify-between gap-3">
            {/* Mini Logo on mobile viewports acting as the drawer trigger */}
            <div className="md:hidden shrink-0 cursor-pointer" onClick={onMenuClick}>
                <Image
                    src={LogoMini}
                    alt="LeetStream logo mini"
                    width={32}
                    height={32}
                />
            </div>

            {/* Search Input Bar */}
            <div className="flex items-center justify-center grow z-50">
                <div ref={searchRef} className="relative w-full max-w-[350px] md:max-w-[550px]">
                    <form onSubmit={handleSearchSubmit} className="w-full">
                        <div className="w-full flex items-center justify-center gap-2 md:gap-3 bg-[#2d2d37] px-3 md:px-4 py-1 rounded-xl">
                            <Clapperboard size={18} className="hidden sm:block text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for movies..."
                                value={searchQuery}
                                maxLength={50}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowResults(true);
                                }}
                                onFocus={() => setShowResults(true)}
                                className="w-full px-2 md:px-4 py-1.5 rounded-[10px] text-xs md:text-sm border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-white/10 text-white"
                            />
                            <button type="submit" className="focus:outline-none cursor-pointer flex items-center justify-center">
                                <Search size={18} className="text-gray-400 hover:text-white transition-colors" />
                            </button>
                        </div>
                    </form>

                    {/* Autocomplete Search Dropdown */}
                    {showResults && searchQuery.trim() && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#18171d] border border-[#454359]/40 rounded-xl shadow-2xl z-50 overflow-hidden p-2 flex flex-col gap-1 w-full max-h-[500px] overflow-y-auto custom-scrollbar">
                            {isSearchLoading ? (
                                <div className="flex items-center justify-center py-6 text-xs text-gray-400 gap-2">
                                    <div className="w-4 h-4 border-2 border-[#EC4949] border-t-transparent rounded-full animate-spin" />
                                    <span>Searching...</span>
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="py-6 text-center text-xs text-gray-400">
                                    No movies found
                                </div>
                            ) : (
                                <>
                                    {searchResults.slice(0, 10).map((movie) => (
                                        <Link
                                            key={movie.id}
                                            href={`/library/${movie.id}?q=${encodeURIComponent(searchQuery.trim())}`}
                                            onClick={() => setShowResults(false)}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-200 cursor-pointer text-left"
                                        >
                                            <div className="relative w-9 h-12 rounded bg-white/5 shrink-0 overflow-hidden">
                                                <Image
                                                    src={movie.posterUrl}
                                                    alt={movie.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="36px"
                                                    unoptimized
                                                />
                                            </div>
                                            <div className="flex flex-col min-w-0 grow">
                                                <span className="text-xs font-semibold text-white truncate hover:text-[#EC4949] transition-colors">
                                                    {movie.title}
                                                </span>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                                                    <span>{movie.year}</span>
                                                    <span>•</span>
                                                    <span>⭐ {parseFloat(movie.rating).toFixed(1)} / 10</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}

                                    {hasMoreResults && (
                                        <Link
                                            href={`/library?q=${encodeURIComponent(searchQuery.trim())}`}
                                            onClick={() => setShowResults(false)}
                                            className="block text-center py-2 text-xs font-semibold text-[#EC4949] hover:text-white hover:bg-[#EC4949]/10 rounded-lg transition-colors border-t border-[#454359]/20 mt-1"
                                        >
                                            See more
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* User Profile Avatar with Dropdown */}
            <div className="relative shrink-0 mr-2" ref={dropdownRef}>
                {!mounted || loading ? (
                    <div className="w-[35px] h-[35px] bg-[#EC4949] rounded-full p-1 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-[#18171d] rounded-full border-t-transparent animate-spin" />
                    </div>
                ) : (<button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#EC4949]/50 focus:ring-offset-2 focus:ring-offset-[#1f1e25] cursor-pointer"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                >
                    {mounted && user && user.avatar ? (
                        <img
                            src={user.avatar}
                            alt="User avatar"
                            width={35}
                            height={35}
                            className="rounded-full w-[35px] h-[35px] object-cover border border-[#454359]/30"
                        />
                    ) : (
                        <div className="w-[35px] h-[35px] bg-[#EC4949] rounded-full flex items-center justify-center text-xs font-bold text-[#18171d] shadow-md">
                            {mounted && user?.firstName?.[0]?.toUpperCase()}
                        </div>
                    )}
                </button>)}

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div
                        className="absolute right-0 mt-3 w-64 bg-[#18171d]/95 backdrop-blur-md border border-[#454359]/40 rounded-2xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all duration-200 animate-in fade-in slide-in-from-top-2"
                        role="menu"
                        aria-orientation="vertical"
                    >
                        {/* User Profile Summary Header */}
                        <div className="px-4 py-4 flex items-center gap-3 bg-linear-to-b from-white/5 to-transparent border-b border-[#454359]/30">
                            {user && user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="User avatar large"
                                    width={42}
                                    height={42}
                                    className="rounded-full w-[42px] h-[42px] object-cover border-2 border-[#EC4949]"
                                />
                            ) : (
                                <div className="w-[42px] h-[42px] bg-[#EC4949] rounded-full flex items-center justify-center text-sm font-bold text-[#18171d] border-2 border-[#EC4949]/35 shadow-md">
                                    {user?.firstName?.[0]?.toUpperCase()}
                                </div>
                            )}
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-white truncate">
                                    {user ? `${user.firstName} ${user.lastName}` : "Guest User"}
                                </span>
                                <span className="text-[11px] text-gray-400 truncate">
                                    {user?.email || "guest@leetstream.com"}
                                </span>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 flex flex-col gap-1">
                            <Link
                                href={`/profile/${user?._id}`}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                                role="menuitem"
                            >
                                <User size={16} className="text-[#EC4949]" />
                                <span>Profile</span>
                            </Link>

                            <Link
                                href="/settings"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                                role="menuitem"
                            >
                                <Settings2 size={16} className="text-[#EC4949]" />
                                <span>Settings</span>
                            </Link>
                        </div>

                        {/* Divider */}
                        <hr className="border-[#454359]/30 my-1 mx-2" />

                        {/* Logout Section */}
                        <div className="p-2">
                            <button
                                onClick={async () => {
                                    setIsDropdownOpen(false);
                                    await logout();
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[#EC4949]/90 hover:text-white hover:bg-[#EC4949]/10 transition-all duration-200 cursor-pointer"
                                role="menuitem"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
