"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    House,
    Earth,
    Library,
    Clapperboard,
    History,
    HeartHandshake,
    EarthLock,
    Ellipsis,
    X,
} from "lucide-react";

interface MobileNavbarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileNavbar({ isOpen, onClose }: MobileNavbarProps) {
    const pathname = usePathname();
    const [showFooterModal, setShowFooterModal] = useState(false);

    const navItems = [
        { name: "Home", href: "/home", Icon: House },
        { name: "Top Movies", href: "/top-movies", Icon: Earth },
        { name: "Library", href: "/library", Icon: Library },
        { name: "My Watchlist", href: "/my-watchlist", Icon: Clapperboard },
        { name: "History", href: "/history", Icon: History },
    ];

    return (
        <>
            {/* Backdrop Blur Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
                    isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
            />

            {/* Sliding Drawer from the Left */}
            <div
                className={`fixed top-0 left-0 bottom-0 z-50 w-[260px] bg-[#18171d] border-r border-[#454359]/30 p-6 flex flex-col gap-6 transition-transform duration-300 ease-out md:hidden shadow-2xl ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Header with Close Button */}
                <div className="flex justify-between items-center">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={100}
                        height={100}
                    />
                    <button
                        onClick={onClose}
                        className="text-[#454359] hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                </div>

                <hr className="border-[#454359]/30" />

                {/* Navigation Links */}
                <nav className="flex flex-col gap-4 text-sm w-full">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href === "/library" &&
                                pathname.startsWith("/library/"));
                        const Icon = item.Icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`flex gap-3 items-center p-3 rounded-xl transition-all cursor-pointer ${
                                    isActive
                                        ? "bg-[#EC4949] text-[#18171d] font-bold"
                                        : "text-gray-400 hover:text-white hover:bg-[#1f1e25]"
                                }`}
                            >
                                <div
                                    className={`p-1 rounded-lg ${isActive ? "text-[#18171d]" : "text-gray-400"}`}
                                >
                                    <Icon
                                        size={18}
                                        color={
                                            isActive
                                                ? "#18171d"
                                                : "currentColor"
                                        }
                                    />
                                </div>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <hr className="border-[#454359]/30 w-full mt-auto" />

                {/* Bottom Footer Buttons */}
                <div className="flex justify-between items-center w-full">
                    <div className="flex gap-2">
                        <Link
                            href="/privacy"
                            onClick={onClose}
                            className="group relative hover:bg-[#1f1e25] flex justify-center items-center p-2 rounded-[12px] cursor-pointer"
                        >
                            <HeartHandshake size={18} />
                            <div className="hidden group-hover:block">
                                <span className="absolute bottom-7 left-0 px-4 py-2 bg-[#121116] rounded-md whitespace-nowrap text-xs shadow-lg">
                                    Privacy Policy
                                </span>
                            </div>
                        </Link>
                        <Link
                            href="/terms"
                            onClick={onClose}
                            className="group relative hover:bg-[#1f1e25] flex justify-center items-center p-2 rounded-[12px] cursor-pointer"
                        >
                            <EarthLock size={18} />
                            <div className="hidden group-hover:block">
                                <span className="absolute bottom-7 left-0 px-4 py-2 bg-[#121116] rounded-md whitespace-nowrap text-xs shadow-lg">
                                    Term of Service
                                </span>
                            </div>
                        </Link>
                    </div>
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowFooterModal(true);
                        }}
                        className="group relative hover:bg-[#1f1e25] flex justify-center items-center p-2 rounded-[12px] cursor-pointer text-gray-400 hover:text-white"
                    >
                        <Ellipsis size={18} />
                        <div className="hidden group-hover:block">
                            <span className="absolute bottom-7 right-0 px-4 py-2 bg-[#121116] rounded-md whitespace-nowrap text-xs shadow-lg">
                                More Options
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Modal Pop-up overlay for mobile screens */}
            {showFooterModal && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowFooterModal(false);
                    }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 cursor-default md:hidden"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#18171d] border border-[#454359] rounded-2xl p-6 max-w-sm w-full shadow-2xl relative text-white flex flex-col gap-5 text-left"
                    >
                        {/* Content grid - vertical list for mobile screens */}
                        <div
                            className="flex flex-col gap-4 mt-1 max-h-[60vh] overflow-y-auto pr-1"
                            onClick={() => {
                                setShowFooterModal(false);
                                onClose();
                            }}
                        >
                            <div>
                                <h4 className="font-bold text-sm mb-2 pb-1 border-b border-[#454359]">
                                    Movies
                                </h4>
                                <ul className="flex flex-col gap-1.5 text-xs text-[#8c8a9e]">
                                    <li>
                                        <Link
                                            href="/library"
                                            className="hover:text-white cursor-pointer transition-colors block w-full"
                                        >
                                            New Releases
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/top-movies"
                                            className="hover:text-white cursor-pointer transition-colors block w-full"
                                        >
                                            Popular Movies
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/library"
                                            className="hover:text-white cursor-pointer transition-colors block w-full"
                                        >
                                            Top Viewed
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/top-movies"
                                            className="hover:text-white cursor-pointer transition-colors block w-full"
                                        >
                                            Top Rated
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/library"
                                            className="hover:text-white cursor-pointer transition-colors block w-full"
                                        >
                                            All Genres
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-2 pb-1 border-b border-[#454359]">
                                    Community
                                </h4>
                                <ul className="flex flex-col gap-1.5 text-xs text-[#8c8a9e]">
                                    <li>
                                        <Link
                                            href="/home"
                                            className="hover:text-white cursor-pointer transition-colors block w-full"
                                        >
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/settings"
                                            className="hover:text-white cursor-pointer transition-colors block w-full"
                                        >
                                            My Account
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/my-watchlist"
                                            className="hover:text-white cursor-pointer transition-colors block w-full"
                                        >
                                            My list
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-2 pb-1 border-b border-[#454359]">
                                    Support
                                </h4>
                                <ul className="flex flex-col gap-1.5 text-xs text-[#8c8a9e]">
                                    <li className="hover:text-white cursor-pointer transition-colors block w-full">
                                        Help Center
                                    </li>
                                    <li className="hover:text-white cursor-pointer transition-colors block w-full">
                                        Contact Us
                                    </li>
                                    <li className="hover:text-white cursor-pointer transition-colors block w-full">
                                        FAQs
                                    </li>
                                    <li className="hover:text-white cursor-pointer transition-colors block w-full">
                                        Report an Issue
                                    </li>
                                    <li>
                                        <Link
                                            href="/home/privacy"
                                            onClick={onClose}
                                            className="hover:text-white cursor-pointer transition-colors block w-full"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/home/terms"
                                            onClick={onClose}
                                            className="hover:text-white cursor-pointer transition-colors block w-full"
                                        >
                                            Terms of Service
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <hr className="border-[#454359] w-full mt-1" />

                        {/* Copyright bottom text */}
                        <div className="text-[10px] text-[#8c8a9e]">
                            Copyright © {new Date().getFullYear()} — LeetStream.
                            All rights reserved.
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
