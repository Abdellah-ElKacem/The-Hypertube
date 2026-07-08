"use client";

export const MovieSkeleton = () => (
    <div className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-2 animate-pulse flex-1 min-w-[220px] lg:w-full shrink-0 lg:min-w-0">
        <div className="w-16 h-24 bg-white/5 rounded-lg shrink-0" />
        <div className="flex flex-col gap-2 justify-center flex-1">
            <div className="h-4 bg-white/5 rounded-md w-3/4" />
            <div className="h-3 bg-white/5 rounded-md w-1/2" />
            <div className="h-4 bg-white/5 rounded-md w-12 mt-1" />
        </div>
    </div>
);

export const GenreSkeleton = () => (
    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-white/5 rounded-md w-24 shrink-0" />
        <div className="flex-1 h-1.5 bg-white/5 rounded-full" />
        <div className="h-4 bg-white/5 rounded-md w-24 shrink-0" />
    </div>
);

export const MovieGridSkeleton = () => (
    <div className="flex flex-col gap-2 rounded-xl animate-pulse">
        <div className="aspect-4/5 w-full bg-[#1c1b22]/5 rounded-lg" />
        <div className="h-4 bg-white/5 rounded-md w-3/4 mt-1" />
        <div className="flex justify-between items-center mt-1">
            <div className="h-3 bg-white/5 rounded-md w-1/2" />
            <div className="h-3 bg-white/5 rounded-md w-1/4" />
        </div>
    </div>
);
