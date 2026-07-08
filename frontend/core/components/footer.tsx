import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <div className="flex justify-center items-center p-10 bg-linear-to-b from-[#201F24] via-[#0E0D11] to-[#18171D]">
            <div className="flex justify-center flex-col items-center max-w-[1440px] w-full mx-auto gap-6">
                <div className="flex justify-between flex-col md:flex-row gap-4 w-full max-w-[1204px] pb-4 md:pb-15">
                    <div className="flex flex-col gap-2">
                        <Image
                            src="/logo.svg"
                            alt="Footer Logo"
                            width={124}
                            height={46}
                        />
                        <p className="text-[#BABABA] max-w-[215px] text-xs">
                            Your ultimate destination for movies. Stream
                            anytime, anywhere.
                        </p>
                    </div>
                    <div className="flex gap-8 w-full md:w-1/2 flex-wrap justify-between">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-white font-semibold pt-2">Movies</h3>
                            <ul className="flex flex-col gap-4 text-[#BABABA] text-xs">
                                <li>New Releases</li>
                                <li>Popular Movies</li>
                                <li>Top Viewed</li>
                                <li>Top Rated</li>
                                <li>All Genres</li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-white font-semibold pt-2">
                                Community
                            </h3>
                            <ul className="flex flex-col gap-4 text-[#BABABA] text-xs">
                                <li>About</li>
                                <li>My Account</li>
                                <li>My list</li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-white font-semibold pt-2">
                                Support
                            </h3>
                            <ul className="flex flex-col gap-4 text-[#BABABA] text-xs">
                                <li>Help Center</li>
                                <li>Contact Us</li>
                                <li>FAQs</li>
                                <li>Report an issue</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="border-[#BABABA] w-full" />
                <div className="flex justify-between items-center w-full text-[#BABABA] gap-2 text-[10px] flex-wrap">
                    <p className="">
                        Copyright &copy; {new Date().getFullYear()} —
                        LeetStream. All rights reserved.
                    </p>
                    <Image
                        src="/logo_footer.svg"
                        alt="Footer Logo"
                        width={64}
                        height={59}
                        unoptimized
                        priority

                    />
                    <div className="flex items-center gap-2">
                        <Link href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link>
                        <h3>|</h3>
                        <Link href="/terms" className="underline hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
