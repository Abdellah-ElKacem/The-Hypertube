"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Home as HomeIcon, Film, Info, User, HelpCircle, LogIn, UserPlus } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const id = targetId.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
        setIsOpen(false);
    };

    return (
        <>
            <nav className="bg-linear-to-b from-[#080616] via-[#080616]/90 to-[#080616]/0 sticky top-0 z-50 px-6 py-3 h-15 w-full">
                <div className="flex w-full max-w-[1440px] mx-auto justify-between items-center">
                    <div className=" flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div>
                                <Image
                                    src="/logo.svg"
                                    alt="Logo"
                                    width={124}
                                    height={46}
                                    // unoptimized
                                    priority
                                />
                            </div>
                            <div className="hidden md:flex items-center gap-6 pt-2 font-medium">
                                <a
                                    href="#home"
                                    onClick={(e) => handleScroll(e, "#home")}
                                    className="text-[#BABABA] hover:text-white transition-colors duration-200"
                                >
                                    Home
                                </a>
                                <a
                                    href="#movies"
                                    onClick={(e) => handleScroll(e, "#movies")}
                                    className="text-[#BABABA] hover:text-white transition-colors duration-200"
                                >
                                    Tranding
                                </a>
                                <a
                                    href="#popular"
                                    onClick={(e) => handleScroll(e, "#popular")}
                                    className="text-[#BABABA] hover:text-white transition-colors duration-200"
                                >
                                    Popular
                                </a>
                                <a
                                    href="#about"
                                    onClick={(e) => handleScroll(e, "#about")}
                                    className="text-[#BABABA] hover:text-white transition-colors duration-200"
                                >
                                    About
                                </a>
                                <a
                                    href="#faq"
                                    onClick={(e) => handleScroll(e, "#faq")}
                                    className="text-[#BABABA] hover:text-white transition-colors duration-200"
                                >
                                    FAQ
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex justify-between items-center gap-4 text-medium">
                        <Link
                            href="/login"
                            className="border rounded-[12px] px-6 py-1.5 transition-colors duration-200"
                        >
                            Login
                        </Link>
                        <Link
                            href="/sign-up"
                            className="text-nowrap bg-[#EC4949] rounded-[10px] px-6 py-1.5 text-shadow-xs"
                        >
                            Sign Up
                        </Link>
                    </div>
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(true)}
                            aria-label="Toggle menu"
                            className="text-white hover:text-white/80 transition-colors p-1"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Navigation Overlay */}
            <div
                className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 z-50 w-72 bg-[#080616]/95 backdrop-blur-md border-l border-white/10 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={100}
                            height={37}
                            // unoptimized
                            priority
                        />
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close menu"
                            className="text-[#BABABA] hover:text-white transition-colors p-1"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <div className="flex flex-col gap-6 mt-10 font-medium text-lg">
                        <a
                            href="#home"
                            onClick={(e) => handleScroll(e, "#home")}
                            className="flex items-center gap-4 text-[#BABABA] hover:text-white transition-all hover:translate-x-1 duration-200"
                        >
                            <HomeIcon size={20} />
                            <span>Home</span>
                        </a>
                        <a
                            href="#movies"
                            onClick={(e) => handleScroll(e, "#movies")}
                            className="flex items-center gap-4 text-[#BABABA] hover:text-white transition-all hover:translate-x-1 duration-200"
                        >
                            <Film size={20} />
                            <span>Movies</span>
                        </a>
                        <a
                            href="#about"
                            onClick={(e) => handleScroll(e, "#about")}
                            className="flex items-center gap-4 text-[#BABABA] hover:text-white transition-all hover:translate-x-1 duration-200"
                        >
                            <Info size={20} />
                            <span>About</span>
                        </a>
                        <a
                            href="#account"
                            onClick={(e) => handleScroll(e, "#account")}
                            className="flex items-center gap-4 text-[#BABABA] hover:text-white transition-all hover:translate-x-1 duration-200"
                        >
                            <User size={20} />
                            <span>Account</span>
                        </a>
                        <a
                            href="#faq"
                            onClick={(e) => handleScroll(e, "#faq")}
                            className="flex items-center gap-4 text-[#BABABA] hover:text-white transition-all hover:translate-x-1 duration-200"
                        >
                            <HelpCircle size={20} />
                            <span>FAQ</span>
                        </a>
                    </div>
                </div>

                {/* Bottom Auth Actions */}
                <div className="flex flex-col gap-4 mt-auto">
                    <div className="h-px bg-white/10 w-full my-2" />
                    <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 border border-white/20 rounded-[12px] py-2.5 text-medium hover:bg-white/5 transition-colors duration-200"
                    >
                        <LogIn size={18} />
                        <span>Login</span>
                    </Link>
                    <Link
                        href="/sign-up"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 bg-[#EC4949] rounded-[10px] py-2.5 text-medium text-shadow-xs hover:bg-[#EC4949]/90 transition-colors"
                    >
                        <UserPlus size={18} />
                        <span>Sign Up</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
