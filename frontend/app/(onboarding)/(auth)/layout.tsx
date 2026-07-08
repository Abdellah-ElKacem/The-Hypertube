"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";


const quotes = [
  {
    text: "Every great film should seem new every time you see it.",
    author: "Roger Ebert",
    image: "/auth-cinema1.png",
  },
  {
    text: "Cinema is a mirror by which we often see ourselves.",
    author: "Martin Scorsese",
    image: "/auth-cinema2.png",
  },
  {
    text: "A film is never really good unless the camera is an eye in the head of a poet.",
    author: "Orson Welles",
    image: "/auth-cinema3.jpg",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen bg-[#080616] flex flex-col overflow-hidden">
      {/* ── TOP BAR: full width, logo left + nav right ── */}
      <header className="w-full px-6 py-1 h-12 shrink-0">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="LeetStream"
              width={124}
              height={46}
              unoptimized
              className="w-20 md:w-[124px]"
              priority
            />
          </Link>

          {/* Sign Up / Log In */}
          <div className="flex items-center gap-8">
            <Link
              href="/sign-up"
              className={`text-white text-xs md:text-base font-medium py-1.5 hover:text-[#E5533D] transition-colors ${pathname === "/sign-up" ? "underline underline-offset-4" : ""
                }`}
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className={`text-white text-xs md:text-base font-medium py-1.5 hover:text-[#E5533D] transition-colors ${pathname === "/login" ? "underline underline-offset-4" : ""
                }`}
            >
              Log in
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 w-full px-6 md:px-16 lg:px-6 flex items-stretch pt-3 min-h-0 overflow-hidden">
        <div className="max-w-[1440px] md:max-w-2xl lg:max-w-[1440px] mx-auto w-full flex gap-4 h-full min-h-0">
          {/* LEFT — cinematic image panel */}
          <div className="hidden lg:flex w-[52%] h-full relative rounded-[20px] overflow-hidden shrink-0">
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center grayscale transition-all duration-700 scale-113"
              style={{ backgroundImage: `url('${quotes[quoteIndex].image}')` }}
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/90 to-transparent" />

            {/* Quote at the bottom */}
            <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-5">
              <div key={quoteIndex} className="flex flex-col gap-2">
                <p className="text-white text-3xl font-bold leading-tight max-w-[420px]">
                  {quotes[quoteIndex].text}
                </p>
                <p className="text-[#BABABA] text-sm self-end">
                  — {quotes[quoteIndex].author} .
                </p>
              </div>

              {/* Slide dots */}
              <div className="flex items-center gap-2 pl-10 pr-10">
                {quotes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setQuoteIndex(i)}
                    className={`transition-all duration-300 h-[2px] w-1/3 rounded-full ${quoteIndex === i ? "bg-white" : "bg-white/40"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — form panel */}
          <div className="flex-1 flex flex-col gap-1 h-full min-h-0">
            {/* Back to Home */}
            <div className="shrink-0">
              <Link href="/" className="flex items-center group w-fit">
                <div className="md:w-9 md:h-9 w-7 h-7 rounded-full bg-[#E5533D] flex items-center justify-center group-hover:bg-[#c94430] transition-colors shrink-0">
                  <ArrowLeft className="md:size-4 size-3" color="white" strokeWidth={2} />
                </div>
                <span className="bg-[#696969] text-[#F8E9A1] text-xs md:text-sm font-medium px-6 py-2 rounded-full tracking-widest uppercase">
                  BACK TO HOME
                </span>
              </Link>
            </div>

            {/* Page content (sign-up or login) */}
            <div className="flex-1 flex flex-col justify-start w-full min-h-0 overflow-y-auto no-scrollbar">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="w-full px-6 py-1 pt-2 pb-4 shrink-0">
        <div className="max-w-[1440px] mx-auto text-[#BABABA] text-[10px]">
          Copyright © 2026 — LeetStream. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
