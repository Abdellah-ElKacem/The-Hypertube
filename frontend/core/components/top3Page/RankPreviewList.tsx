"use client";

import Image from "next/image";
import { RankPreviewListProps } from "@/core/types/topMovies";

export default function RankPreviewList({
    movies,
    activeIdx,
    onSelectActive,
}: RankPreviewListProps) {
    if (!movies || movies.length === 0) return null;

    return (
        <div className="flex flex-col gap-3 w-full mt-4 pb-10 px-4">
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Rankings Overview
            </span>
            <div className="grid grid-cols-5 xl:grid-cols-10 gap-4 w-full">
                {movies.map((m, idx) => (
                    <button
                        key={m.id}
                        onClick={() => onSelectActive(idx)}
                        className={`relative aspect-4/5 w-full rounded-lg overflow-hidden border transition-all cursor-pointer ${
                            activeIdx === idx
                                ? "border-[#EC4949] scale-105 ring-2 ring-[#EC4949]/25 shadow-lg shadow-[#EC4949]/15"
                                : "border-white/5 opacity-40 hover:opacity-80"
                        }`}
                    >
                        <Image
                            src={m.bgUrl}
                            alt={m.title}
                            fill
                            sizes="10vw"
                            className="object-cover"
                            unoptimized
                        />
                        <div className="absolute top-1 left-1 bg-black/70 text-white font-anton text-[10px] w-4 h-4 flex items-center justify-center rounded-sm">
                            {idx + 1}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
