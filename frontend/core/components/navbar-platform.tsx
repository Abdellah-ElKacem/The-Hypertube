"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    PanelLeftDashed,
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

import Logo from "@/public/logo.svg";
import LogoMini from "@/public/logo-mini.svg";

export default function NavbarPlatform() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showFooterModal, setShowFooterModal] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsCollapsed(true);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navItems = [
        { name: "Home", href: "/home", Icon: House },
        { name: "Top Movies", href: "/top-movies", Icon: Earth },
        { name: "Library", href: "/library", Icon: Library },
        { name: "My Watchlist", href: "/my-watchlist", Icon: Clapperboard },
        { name: "History", href: "/history", Icon: History },
    ];

    return (
        <div
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden relative z-40 md:flex flex-col bg-[#18171d] rounded-2xl p-5 transition-all duration-300 ${isCollapsed ? "w-20 items-center px-3 cursor-w-resize" : "w-[250px] cursor-w-resize"} gap-6`}
        >
            <div
                className={`flex gap-4 items-center ${isCollapsed ? "justify-center" : "justify-between"} w-full`}
            >
                {isCollapsed ? (
                    <Image
                        src={LogoMini}
                        alt="LeetStream logo mini"
                        width={30}
                        height={30}
                        className="cursor-pointer"
                        onClick={() => setIsCollapsed(false)}
                    />
                ) : (
                    <>
                        <Image
                            src={Logo}
                            alt="LeetStream logo"
                            width={100}
                            height={100}
                        />
                        <PanelLeftDashed
                            size={20}
                            className="mt-2 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsCollapsed(true);
                            }}
                        />
                    </>
                )}
            </div>
            <hr className="border-[#454359] w-full" />
            <nav className="grow flex gap-4 flex-col text-sm w-full">
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
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className={`group relative flex gap-3 items-center ${isCollapsed ? "justify-center" : ""} cursor-pointer`}
                        >
                            <div
                                className={`flex justify-center items-center p-3 rounded-[12px] transition-colors ${
                                    isActive
                                        ? "bg-[#EC4949]"
                                        : " hover:bg-[#1f1e25]"
                                }`}
                            >
                                <Icon
                                    size={18}
                                    color={
                                        isActive ? "#18171d" : "currentColor"
                                    }
                                />
                            </div>
                            {!isCollapsed ? (
                                <p
                                    className={` text-nowrap ${isActive ? "font-bold" : ""} `}
                                >
                                    {item.name}
                                </p>
                            ) : (
                                <div className="hidden group-hover:block absolute left-full ml-1 top-1/2 -translate-y-1/2 bg-[#121116] text-white text-xs px-4 py-2 rounded-md whitespace-nowrap shadow-lg z-50">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>
            <hr className="border-[#454359] w-full" />
            <div
                className={`flex gap-2 ${isCollapsed ? "flex-col items-center" : "justify-between"} w-full`}
            >
                <div className={`flex gap-2 ${isCollapsed ? "flex-col" : ""}`}>
                    <Link
                        href="/home/privacy"
                        onClick={(e) => e.stopPropagation()}
                        className="group relative hover:bg-[#1f1e25] flex justify-center items-center p-2 rounded-[12px] cursor-pointer"
                    >
                        <HeartHandshake size={18} />
                        <div className="hidden group-hover:block">
                            <span className="absolute bottom-7 left-7 px-4 py-2 bg-[#121116] rounded-md whitespace-nowrap text-xs shadow-lg">
                                Privacy Policy
                            </span>
                        </div>
                    </Link>
                    <Link
                        href="/home/terms"
                        onClick={(e) => e.stopPropagation()}
                        className="group relative hover:bg-[#1f1e25] flex justify-center items-center p-2 rounded-[12px] cursor-pointer"
                    >
                        <EarthLock size={18} />
                        <div className="hidden group-hover:block">
                            <span className="absolute bottom-7 left-7 px-4 py-2 bg-[#121116] rounded-md whitespace-nowrap text-xs shadow-lg">
                                Term of Service
                            </span>
                        </div>
                    </Link>
                </div>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowFooterModal(!showFooterModal);
                    }}
                    className="group relative hover:bg-[#1f1e25] flex justify-center items-center p-2 rounded-[12px] cursor-pointer"
                >
                    <Ellipsis size={18} />
                    {!showFooterModal && (
                        <div className="hidden group-hover:block">
                            <span className="absolute bottom-7 left-7 px-4 py-2 bg-[#121116] rounded-md whitespace-nowrap text-xs shadow-lg">
                                More Options
                            </span>
                        </div>
                    )}

                    {showFooterModal && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute left-full bottom-0 ml-4 z-50 bg-[#18171d] border border-[#454359] rounded-2xl p-6 w-[500px] shadow-2xl text-white flex flex-col gap-5 cursor-default text-left"
                        >
                            <div
                                className="grid grid-cols-3 gap-4 mt-1"
                                onClick={() => setShowFooterModal(false)}
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
                                        <li className="hover:text-white cursor-pointer transition-colors block w-full">Help Center</li>
                                        <li className="hover:text-white cursor-pointer transition-colors block w-full">Contact Us</li>
                                        <li className="hover:text-white cursor-pointer transition-colors block w-full">FAQs</li>
                                        <li className="hover:text-white cursor-pointer transition-colors block w-full">Report an Issue</li>
                                        <li>
                                            <Link
                                                href="/home/privacy"
                                                onClick={() => setShowFooterModal(false)}
                                                className="hover:text-white cursor-pointer transition-colors block w-full"
                                            >
                                                Privacy Policy
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/home/terms"
                                                onClick={() => setShowFooterModal(false)}
                                                className="hover:text-white cursor-pointer transition-colors block w-full"
                                            >
                                                Terms of Service
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <hr className="border-[#454359] w-full mt-2" />
                            <div className="text-[10px] text-[#8c8a9e]">
                                Copyright © {new Date().getFullYear()} —
                                LeetStream. All rights reserved.
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Click-outside backdrop to close the popover */}
            {showFooterModal && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowFooterModal(false);
                    }}
                    className="fixed inset-0 z-40 cursor-default"
                />
            )}
        </div>
    );
}
