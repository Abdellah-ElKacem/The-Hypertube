import type { Metadata } from "next";
import { Space_Grotesk, Anton } from "next/font/google";
import "./globals.css";
// import { AuthProvider } from "@/core/contexts/AuthContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  preload: false,
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

export const metadata: Metadata = {
  title: "HyperTube",
  description: "Stream movies seamlessly",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${anton.variable} antialiased`}>
      <body className="min-h-full w-full flex flex-col">
        {/* <AuthProvider> */}
          {children}
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}