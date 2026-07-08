"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { LibraryHeaderProps } from "@/core/types/library";

const genres = [
    "All Genres",
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
];
const years = [
    "All Years",
    ...Array.from({ length: 2026 - 1800 + 1 }, (_, i) => String(2026 - i)),
];
const sortOptions = [
    { label: "Popularity", value: "download_count" },
    { label: "Rating", value: "rating" },
    { label: "Year", value: "year" },
    { label: "Title", value: "title" },
];

export default function LibraryHeader({
    query,
    selectedGenre,
    selectedYear,
    sortType,
    sortOrder,
    onFilterChange,
}: LibraryHeaderProps) {
    const [openDropDown, setOpenDropDown] = useState<boolean>(false);
    const [openYearDropDown, setOpenYearDropDown] = useState<boolean>(false);
    const [openSortDropDown, setOpenSortDropDown] = useState<boolean>(false);

    return (
        <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <h1 className="text-md md:text-4xl font-semibold">
                {query ? `Search Results for "${query}"` : "Library"}
            </h1>
            {!query && (<div className="flex items-center gap-2">
                {/* Genres Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setOpenDropDown(!openDropDown)}
                        className="bg-white/5 backdrop-blur-2xl flex gap-2 items-center px-3 py-1.5 rounded-full text-xs md:text-sm hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <p>
                            {selectedGenre === "All Genres"
                                ? "Genres"
                                : selectedGenre}
                        </p>
                        {openDropDown ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>
                    {openDropDown && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenDropDown(false)}
                            />
                            <div className="absolute left-0 md:right-0 md:left-auto mt-2 w-48 max-h-60 overflow-y-auto bg-[#18181B] border border-white/10 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200 custom-scrollbar">
                                {genres.map((genre) => (
                                    <button
                                        key={genre}
                                        onClick={() => {
                                            onFilterChange({ genre });
                                            setOpenDropDown(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-xs md:text-sm transition-colors cursor-pointer ${selectedGenre === genre
                                                ? "text-[#EC4949] bg-white/5 font-medium"
                                                : "text-gray-300 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Years Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setOpenYearDropDown(!openYearDropDown)}
                        className="bg-white/5 backdrop-blur-2xl flex gap-2 items-center px-3 py-1.5 rounded-full text-xs md:text-sm hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <p>
                            {selectedYear === "All Years"
                                ? "Year"
                                : selectedYear}
                        </p>
                        {openYearDropDown ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>
                    {openYearDropDown && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenYearDropDown(false)}
                            />
                            <div className="absolute left-0 md:right-0 md:left-auto mt-2 w-48 max-h-60 overflow-y-auto bg-[#18181B] border border-white/10 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200 custom-scrollbar">
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => {
                                            onFilterChange({ year });
                                            setOpenYearDropDown(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-xs md:text-sm transition-colors cursor-pointer ${selectedYear === year
                                                ? "text-[#EC4949] bg-white/5 font-medium"
                                                : "text-gray-300 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setOpenSortDropDown(!openSortDropDown)}
                        className="bg-white/5 backdrop-blur-2xl flex gap-2 items-center px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-white text-xs md:text-sm cursor-pointer"
                        title="Sort library"
                    >
                        <p>
                            Sort:{" "}
                            {sortOptions.find((o) => o.value === sortType)
                                ?.label || "Popularity"}
                        </p>
                        {openSortDropDown ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>
                    {openSortDropDown && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenSortDropDown(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-[#18181B] border border-white/10 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200 custom-scrollbar">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            onFilterChange({
                                                sort: option.value,
                                            });
                                            setOpenSortDropDown(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-xs md:text-sm transition-colors cursor-pointer ${sortType === option.value
                                                ? "text-[#EC4949] bg-white/5 font-medium"
                                                : "text-gray-300 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Sort Order Direction Toggle */}
                <button
                    onClick={() =>
                        onFilterChange({
                            order_by: sortOrder === "asc" ? "desc" : "asc",
                        })
                    }
                    className="bg-white/5 backdrop-blur-2xl flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors text-white cursor-pointer"
                    title={
                        sortOrder === "asc"
                            ? "Sort Ascending"
                            : "Sort Descending"
                    }
                >
                    {sortOrder === "asc" ? (
                        <ArrowUpAZ className="w-4.5 h-4.5 text-[#EC4949]" />
                    ) : (
                        <ArrowDownAZ className="w-4.5 h-4.5 text-[#EC4949]" />
                    )}
                </button>
            </div>)}
        </div>
    );
}
