"use client";

import React from "react";
import PrivacyContent from "@/core/components/privacy-content";

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-[#080616] text-[#BABABA] relative pt-24 pb-20 px-6">
            {/* Ambient Background Light Effects */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-[#F8E9A1]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-[1200px] mx-auto relative z-10">
                <PrivacyContent />
            </div>
        </main>
    );
}
