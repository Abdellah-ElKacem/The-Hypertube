"use client";

import { Eye, Heart, List, Star, FileText, Hd } from "lucide-react";

export default function FeaturesSection() {
    return (
        <section id="about" className="flex flex-col gap-6 max-w-[1330px] mx-auto p-5 mt-10 font-outfit">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                LeetStream Lets you...
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 text-white font-inter">
                {/* Feature 1 */}
                <div className="bg-[#18171D] rounded-[20px] p-6 flex items-center gap-4 min-h-[80px] flex-col md:flex-row">
                    <div className="shrink-0">
                        <Hd size={24} strokeWidth={1.5} />
                    </div>
                    <p className="text-xs leading-relaxed">
                        See your movies in high quality.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-[#18171D] rounded-[20px] p-6 flex items-center gap-4 min-h-[80px] flex-col md:flex-row">
                    <div className="shrink-0">
                        <Eye size={24} strokeWidth={1.5} />
                    </div>
                    <p className="text-xs leading-relaxed">
                        Track your movies and keep a history of every movie
                        you've watched and mark the ones you want to see.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-[#18171D] rounded-[20px] p-6 flex items-center gap-4 min-h-[80px] flex-col md:flex-row">
                    <div className="shrink-0">
                        <Heart size={24} strokeWidth={1.5} fill="white" />
                    </div>
                    <p className="text-xs leading-relaxed">
                        Like and save favorites and show love for your
                        favorite films, and reviews with a simple tap.
                    </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-[#18171D] rounded-[20px] p-6 flex items-center gap-4 min-h-[80px] flex-col md:flex-row">
                    <div className="shrink-0">
                        <List size={24} strokeWidth={1.5} />
                    </div>
                    <p className="text-xs leading-relaxed">
                        Write or rate a review or reviews your favorite
                        movies.
                    </p>
                </div>

                {/* Feature 5 */}
                <div className="bg-[#18171D] rounded-[20px] p-6 flex items-center gap-4 min-h-[80px] flex-col md:flex-row">
                    <div className="shrink-0">
                        <Star size={24} strokeWidth={1.5} />
                    </div>
                    <p className="text-xs leading-relaxed">
                        Rate your favorite movies in your way, give movies a
                        rating on five star scale.
                    </p>
                </div>

                {/* Feature 6 */}
                <div className="bg-[#18171D] rounded-[20px] p-6 flex items-center gap-4 min-h-[80px] flex-col md:flex-row">
                    <div className="shrink-0">
                        <FileText size={24} strokeWidth={1.5} />
                    </div>
                    <p className="text-xs leading-relaxed">
                        Keep a movie journal. Log your movie, watching
                        habits and depth stats.
                    </p>
                </div>
            </div>
        </section>
    );
}
