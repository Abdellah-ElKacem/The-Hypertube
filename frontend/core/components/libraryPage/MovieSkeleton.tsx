"use client";

export default function MovieSkeleton() {
    return (
        <div className="flex flex-col gap-2 rounded-xl animate-pulse">
            <div className="aspect-4/5 w-full bg-white/5 rounded-lg" />
            <div className="h-4 bg-white/5 rounded-md w-3/4 mt-1" />
            <div className="flex justify-between items-center mt-1">
                <div className="h-3 bg-white/5 rounded-md w-1/2" />
                <div className="h-3 bg-white/5 rounded-md w-1/4" />
            </div>
        </div>
    );
}
