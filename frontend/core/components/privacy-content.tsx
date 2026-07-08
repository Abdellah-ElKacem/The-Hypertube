"use client";

import React, { useState } from "react";
import { Shield, Eye, Lock, Globe, Server, AlertCircle, Calendar } from "lucide-react";

interface PrivacyContentProps {
    menuTopClass?: string;
}

export default function PrivacyContent({ menuTopClass = "lg:top-28" }: PrivacyContentProps) {
    const [activeSection, setActiveSection] = useState("collect");

    const sections = [
        { id: "collect", label: "1. Information We Collect", icon: Eye },
        { id: "usage", label: "2. How We Use It", icon: Shield },
        { id: "sharing", label: "3. Sharing Policies", icon: Globe },
        { id: "cookies", label: "4. Cookies & Trackers", icon: Server },
        { id: "security", label: "5. Data Security", icon: Lock },
        { id: "rights", label: "6. Your Rights", icon: AlertCircle },
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
                        <h2 className="text-xl font-bold text-white tracking-wide">Privacy Policy</h2>
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
                        LeetStream Safety
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-lg leading-relaxed text-[#D2CEDE]">
                        We value your privacy. This policy outlines how LeetStream collects, uses, protects, and discloses your personal data.
                    </p>
                </div>

                <div className="h-px bg-white/10 w-full" />

                {/* Section 1 */}
                <article id="collect" className="flex flex-col gap-4 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-6 bg-[#F8E9A1] rounded-full" />
                        1. Information We Collect
                    </h2>
                    <div className="flex flex-col gap-4 leading-relaxed text-sm md:text-base text-[#BABABA]">
                        <p>
                            We collect information that you voluntarily provide to us when registering, such as your username, email address, first name, last name, and preferences.
                        </p>
                        <p>
                            We also collect usage data automatically during platform interaction, including IP addresses, browser agents, details about streaming times, watch history, and client interactions.
                        </p>
                    </div>
                </article>

                {/* Section 2 */}
                <article id="usage" className="flex flex-col gap-4 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-6 bg-[#F8E9A1] rounded-full" />
                        2. How We Use Your Information
                    </h2>
                    <div className="flex flex-col gap-4 leading-relaxed text-sm md:text-base text-[#BABABA]">
                        <p>
                            LeetStream uses your information for operational purposes, which include:
                        </p>
                        <ul className="list-disc pl-6 flex flex-col gap-2 text-sm md:text-base text-[#BABABA]">
                            <li>Maintaining and personalizing your user dashboard.</li>
                            <li>Tracking search terms and watch lists to provide custom recommendations.</li>
                            <li>Detecting, preventing, and addressing security breaches or platform abuse.</li>
                            <li>Sending password recovery links, verify-email OTPs, and account announcements.</li>
                        </ul>
                    </div>
                </article>

                {/* Section 3 */}
                <article id="sharing" className="flex flex-col gap-4 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-6 bg-[#F8E9A1] rounded-full" />
                        3. Sharing Your Information
                    </h2>
                    <div className="flex flex-col gap-4 leading-relaxed text-sm md:text-base text-[#BABABA]">
                        <p>
                            We do not sell, trade, rent, or monetize your personal user profiles to third-party advertising brokers.
                        </p>
                        <p>
                            We may share data under legal request if forced to comply with governing court orders, active subpoenas, or regulatory enforcement actions.
                        </p>
                    </div>
                </article>

                {/* Section 4 */}
                <article id="cookies" className="flex flex-col gap-4 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-6 bg-[#F8E9A1] rounded-full" />
                        4. Cookies & Tracking Technologies
                    </h2>
                    <div className="flex flex-col gap-4 leading-relaxed text-sm md:text-base text-[#BABABA]">
                        <p>
                            LeetStream uses cookies and local storage tokens to store secure session information, such as your authentication tokens and active interface theme selections.
                        </p>
                        <p>
                            You can disable cookies directly through your individual browser settings; however, doing so will prevent you from staying logged into the platform.
                        </p>
                    </div>
                </article>

                {/* Section 5 */}
                <article id="security" className="flex flex-col gap-4 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-6 bg-[#F8E9A1] rounded-full" />
                        5. Data Security & Storage
                    </h2>
                    <div className="flex flex-col gap-4 leading-relaxed text-sm md:text-base text-[#BABABA]">
                        <p>
                            We utilize secure database protocols and transport layer encryption (SSL/TLS) to store and transit user passwords and email records securely.
                        </p>
                        <p>
                            While we follow strict industry guidelines to safeguard your data, no method of transmission or electronic storage is 100% immune to breaches, and we cannot guarantee complete security.
                        </p>
                    </div>
                </article>

                {/* Section 6 */}
                <article id="rights" className="flex flex-col gap-4 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-6 bg-[#F8E9A1] rounded-full" />
                        6. Your Rights & Choices
                    </h2>
                    <div className="flex flex-col gap-4 leading-relaxed text-sm md:text-base text-[#BABABA]">
                        <p>
                            You have the right to request a copy of the information stored under your profile, ask for corrections, or request complete deletion of your account and watch history.
                        </p>
                        <p>
                            To exercise any of these options under GDPR/CCPA guidelines, please access your profile settings panel or write to our support desk.
                        </p>
                    </div>
                </article>
            </section>
        </div>
    );
}
