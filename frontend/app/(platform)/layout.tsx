"use client";

import React, { useState, Suspense } from "react";
import NavbarPlatform from "@/core/components/navbar-platform";
import TopBar from "@/core/components/top-bar";
import MobileNavbar from "@/core/components/mobile-navbar";
import { AuthProvider } from "@/core/contexts/AuthContext";

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <AuthProvider>
            <div className="h-screen w-full flex gap-3 md:p-3 md:pb-3 overflow-hidden">
                <NavbarPlatform />
                <div className="flex flex-col gap-6 flex-1 min-w-0 bg-[#1f1e25] md:rounded-2xl px-5 pt-5 overflow-hidden h-full">
                    <Suspense
                        fallback={
                            <div className="h-10 w-full animate-pulse bg-white/5 rounded-xl" />
                        }
                    >
                        <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
                    </Suspense>
                    <div className="flex-1 w-full overflow-y-auto flex justify-center pb-5 scroll-smooth no-scrollbar">
                        <div className="w-full max-w-[1600px]">{children}</div>
                    </div>
                </div>

                {/* Mobile Drawer (slides in from the right) */}
                <MobileNavbar
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                />
            </div>
        </AuthProvider>
    );
}
