"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function FaqSection() {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const faqData = [
        {
            question: "What is LeetStream?",
            answer: "LeetStream is a modern streaming platform that lets you search and watch movies and series directly in your browser with high quality and custom subtitle options.",
        },
        {
            question: "Is LeetStream free to use?",
            answer: "Yes, LeetStream provides free streaming access. Premium features (such as ad-free viewing or HD/4K quality) may be available in the future.",
        },
        {
            question: "Does LeetStream offer movie reviews and ratings?",
            answer: "Yes! You can view rating details (such as IMDb scores), read user reviews, and leave your own feedback and Ten-star rating directly on the movie's page.",
        },
        {
            question: "Can I request a movie that is not available?",
            answer: "Yes! If a movie or show is missing, you can submit a request through the account panel and we will notify you once it's added to the database. All of that will be coming in the next updates.",
        },
        {
            question: "Do I need an account to watch movies on LeetStream?",
            answer: "Yes, an account is required to browse or watch movies, with a free account you can keep a watch history, save favorites, write reviews, and request new titles.",
        },
    ];

    return (
        <section id="faq" className="flex flex-col gap-6 max-w-[1330px] mx-auto p-5 mt-10 mb-20 text-white font-outfit">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-4 font-inter">
                {faqData.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                        <div
                            key={index}
                            className="bg-[#18171D] border border-white/5 rounded-[20px] p-5 md:p-6 transition-all duration-300"
                        >
                            <div
                                onClick={() => toggleFaq(index)}
                                className="flex justify-between items-center cursor-pointer select-none"
                            >
                                <h3 className="text-sm md:text-base font-semibold">
                                    {faq.question}
                                </h3>
                                <button className="shrink-0">
                                    <Plus
                                        size={24}
                                        strokeWidth={1.5}
                                        className={`text-white transition-transform duration-300 ${isOpen
                                            ? "rotate-45"
                                            : "rotate-0"
                                            }`}
                                    />
                                </button>
                            </div>
                            <div
                                className={`grid transition-all duration-300 ease-in-out ${isOpen
                                    ? "grid-rows-[1fr] opacity-100 mt-3"
                                    : "grid-rows-[0fr] opacity-0"
                                    }`}
                            >
                                <div className="overflow-hidden">
                                    <p className="text-xs md:text-sm text-[#BABABA] leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
