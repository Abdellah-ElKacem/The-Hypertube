"use client";

import React, { useState } from "react";
import { Scale, ShieldCheck, HelpCircle, FileText, Calendar } from "lucide-react";

interface TermsContentProps {
    menuTopClass?: string;
}

export default function TermsContent({ menuTopClass = "lg:top-28" }: TermsContentProps) {
    const [activeSection, setActiveSection] = useState("introduction");

    const sections = [
        { id: "introduction", label: "1. Acceptance of Terms", icon: Scale },
        { id: "accounts", label: "2. User Accounts", icon: ShieldCheck },
        { id: "streaming", label: "3. Streaming & Copyright", icon: FileText },
        { id: "conduct", label: "4. User Conduct", icon: HelpCircle },
        { id: "liability", label: "5. Disclaimers & Liability", icon: FileText },
        { id: "governing", label: "6. Governing Law", icon: Scale },
    ];

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-12 relative z-10 w-full">
            {/* Left column: Sticky Menu */}
            <aside className={`w-full lg:w-[320px] shrink-0 lg:sticky ${menuTopClass} h-fit`}>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold text-white tracking-wide">Terms of Service</h2>
                        <div className="flex items-center gap-1.5 text-xs text-[#9C9C9C]">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Last Updated: July 2026</span>
                        </div>
                    </div>

                    <div className="h-px bg-white/10 w-full" />

                    <nav className="flex flex-col gap-1.5">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? "bg-[#F8E9A1] text-black shadow-lg shadow-[#F8E9A1]/10"
                                            : "hover:bg-white/5 text-[#BABABA] hover:text-white"
                                    }`}
                                >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    <span>{section.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Right column: Content */}
            <section className="flex-1 flex flex-col gap-10">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <span className="text-[#F8E9A1] text-xs font-semibold uppercase tracking-widest bg-[#F8E9A1]/10 px-3 py-1.5 rounded-full w-fit">
                        LeetStream Policies
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        Terms & Conditions
                    </h1>
                    <p className="text-lg leading-relaxed text-[#D2CEDE]">
                        Please read these Terms of Service carefully before accessing or using the LeetStream website and services.
                    </p>
                </div>

                <div className="h-px bg-white/10 w-full" />

                {/* Section 1 */}
                <article id="introduction" className="flex flex-col gap-4 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-6 bg-[#F8E9A1] rounded-full" />
                        1. Acceptance of Terms
                    </h2>
                    <div className="flex flex-col gap-4 leading-relaxed text-sm md:text-base text-[#BABABA]">
                        <p>
                            By accessing or using the website located at LeetStream (the &quot;Site&quot;), or by purchasing, downloading, or streaming content through our service, you agree to comply with and be bound by these Terms of Service (&quot;Terms&quot;).
                        </p>
                        <p>
                            If you do not agree to these Terms, you must immediately cease accessing and using the platform. We reserve the right to modify, amend, or change these Terms at any time without prior individual notice.
                        </p>
                    </div>
                </article>

                {/* Section 2 */}
                <article id="accounts" className="flex flex-col gap-4 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-6 bg-[#F8E9A1] rounded-full" />
                        2. User Accounts & Registration
                    </h2>
                    <div className="flex flex-col gap-4 leading-relaxed text-sm md:text-base text-[#BABABA]">
                        <p>
                            To access certain features of LeetStream (such as watch history, ratings, and custom layouts), you may be required to register for a free account. You agree to provide accurate, current, and complete registration info.
                        </p>
                        <p>
                            You are solely responsible for maintaining the confidentiality of your username and password, and you are fully responsible for all activities that occur under your account. Notify LeetStream immediately of any unauthorized account activity.
                        </p>
                    </div>
                </article>

                {/* Section 3 */}
                <article id="streaming" className="flex flex-col gap-4 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-6 bg-[#F8E9A1] rounded-full" />
                        3. Streaming Content & Copyright
                    </h2>
                    <div className="flex flex-col gap-4 leading-relaxed text-sm md:text-base text-[#BABABA]">
                        <p>
                            LeetStream uses decentralized bittorrent peer-to-peer streaming technology to deliver high-quality media directly to the browser.
                        </p>
                        <p>
                            All movie info, subtitles, and visual posters are sourced from public APIs. If you believe any content on the Site violates copyright law (DMCA), please send a formal notice detailing the infringement to our contact address, and we will take immediate action to address it.
                        </p>
                    </div>
                </article>

                {/* Section 4 */}
                <article id="conduct" className="flex flex-col gap-4 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-6 bg-[#F8E9A1] rounded-full" />
                        4. User Conduct
                    </h2>
                    <div className="flex flex-col gap-4 leading-relaxed text-sm md:text-base text-[#BABABA]">
                        <p>
                            You agree to use the platform only for lawful purposes. You are prohibited from:
                        </p>
                        <ul className="list-disc pl-6 flex flex-col gap-2 text-sm md:text-base text-[#BABABA]">
                            <li>Circumventing or attempting to bypass security or DRM controls.</li>
                            <li>Using bots, scrapers, or automation scripts to access content.</li>
                            <li>Distributing malware, spyware, or launching DDoS attacks against our servers.</li>
                            <li>Engaging in harassing, abusive, or discriminatory behavior in comments and review sections.</li>
                        </ul>
                    </div>
                </article>

                {/* Section 5 */}
                <article id="liability" className="flex flex-col gap-4 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-6 bg-[#F8E9A1] rounded-full" />
                        5. Disclaimers & Limitation of Liability
                    </h2>
                    <div className="flex flex-col gap-4 leading-relaxed text-sm md:text-base text-[#BABABA]">
                        <p>
                            LeetStream is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express or implied.
                        </p>
                        <p>
                            We do not warrant that the website will be uninterrupted, error-free, or entirely secure. In no event shall LeetStream or its developers be held liable for any damages, loss of data, or network interruptions arising from the use of peer-to-peer protocols.
                        </p>
                    </div>
                </article>

                {/* Section 6 */}
                <article id="governing" className="flex flex-col gap-4 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-6 bg-[#F8E9A1] rounded-full" />
                        6. Governing Law
                    </h2>
                    <div className="flex flex-col gap-4 leading-relaxed text-sm md:text-base text-[#BABABA]">
                        <p>
                            These Terms shall be governed by, construed, and enforced in accordance with the laws of the jurisdiction of the hosting servers, without giving effect to conflicts of law principles.
                        </p>
                        <p>
                            If any provision of these Terms is deemed unlawful or unenforceable, that provision will be deemed severable and will not affect the validity of any remaining provisions.
                        </p>
                    </div>
                </article>
            </section>
        </div>
    );
}
