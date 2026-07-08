"use client";

import { useState } from "react";
import { ArrowUpAZ, ArrowDownAZ, ChevronDown, ChevronUp } from "lucide-react";
import { WatchlistHeaderProps } from "@/core/types/watchlist";

const sortOptions = [
    { label: "Title", value: "title" },
    { label: "Year", value: "year" },
    { label: "Rating", value: "rating" },
];

export default function WatchlistHeader({
    totalCount,
    sortType,
    sortOrder,
    onSortTypeChange,
    onSortOrderToggle,
}: WatchlistHeaderProps) {
    const [openSortDropDown, setOpenSortDropDown] = useState<boolean>(false);

    return (
        <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/5 pb-6">
            <div className="flex gap-3 items-center">
                <h1 className="font-bold text-2xl md:text-3xl text-white">My Watchlist</h1>
                <div className="flex justify-center items-center bg-white/10 border border-[#F8E9A1]/20 px-3 py-1 rounded-[10px] text-xs text-[#F8E9A1] font-bold">
                    {totalCount}
                </div>
            </div>
            
            <div className="flex gap-3 items-center">
                {/* Sort Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setOpenSortDropDown(!openSortDropDown)}
                        className="bg-white/5 border border-white/10 flex gap-2 items-center px-4 py-2 rounded-full hover:bg-white/10 transition-colors text-white text-xs md:text-sm cursor-pointer"
                    >
                        <span>Sort: {sortOptions.find(o => o.value === sortType)?.label || "Title"}</span>
                        {openSortDropDown ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    {openSortDropDown && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenSortDropDown(false)} />
                            <div className="absolute right-0 mt-2 w-40 bg-[#18171d] border border-white/10 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            onSortTypeChange(option.value as any);
                                            setOpenSortDropDown(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-xs md:text-sm transition-colors cursor-pointer ${
                                            sortType === option.value
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
                    onClick={onSortOrderToggle}
                    className="bg-white/5 border border-white/10 flex items-center justify-center p-2.5 rounded-full hover:bg-white/10 transition-colors text-white cursor-pointer"
                    title={sortOrder === "asc" ? "Sort Ascending" : "Sort Descending"}
                >
                    {sortOrder === "asc" ? (
                        <ArrowUpAZ className="w-4.5 h-4.5 text-[#EC4949]" />
                    ) : (
                        <ArrowDownAZ className="w-4.5 h-4.5 text-[#EC4949]" />
                    )}
                </button>
            </div>
        </div>
    );
}
