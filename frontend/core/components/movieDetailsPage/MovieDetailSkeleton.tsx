"use client";

import React from "react";

const MovieDetailSkeleton = () => (
    <div className="w-full flex flex-col gap-10 pb-10 animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="sticky top-0 bg-platform z-30 pb-4 p-6 flex gap-4 items-center">
            <div className="h-4 bg-white/5 rounded w-16" />
            <div className="h-4 bg-white/5 rounded w-20" />
            <div className="h-4 bg-white/5 rounded w-24" />
        </div>
        <div className="w-full flex flex-col lg:flex-row justify-between gap-10 px-6 md:px-10 -mt-4">
            <div className="flex flex-col grow gap-6">
                <div className="flex justify-between items-center">
                    <div className="h-12 bg-white/5 rounded-md w-2/3" />
                    <div className="h-10 bg-white/5 rounded-full w-36" />
                </div>
                <div className="h-6 bg-white/5 rounded w-1/2" />
                <div className="h-6 bg-white/5 rounded w-1/3" />
                <hr className="border-white/10 w-[93%]" />
                <div className="flex flex-col gap-4 w-[93%]">
                    <div className="h-6 bg-white/5 rounded w-28" />
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-4 bg-white/5 rounded w-5/6" />
                    <div className="h-4 bg-white/5 rounded w-4/5" />
                </div>
                <div className="flex gap-4">
                    <div className="h-12 bg-white/5 rounded-full w-40" />
                    <div className="h-12 bg-white/5 rounded-full w-28" />
                </div>
            </div>
            <div className="hidden lg:block relative aspect-2/3 w-[300px] h-[460px] bg-white/5 rounded-2xl shrink-0" />
        </div>
    </div>
);

export default MovieDetailSkeleton;
