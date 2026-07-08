"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/core/components/navbar";
import Footer from "@/core/components/footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showFooter = pathname !== "/terms" && pathname !== "/privacy";

  return (
    <>
      <Navbar />
      {children}
      {showFooter && <Footer />}
    </>
  );
}