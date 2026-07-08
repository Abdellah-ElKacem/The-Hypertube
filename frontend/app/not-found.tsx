import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[#080616] text-white px-6 text-center select-none">
      <div className="relative flex flex-col items-center max-w-md gap-6">
        {/* Large stylized 404 */}
        <h1 className="text-9xl font-bold tracking-widest text-[#EC4949] font-anton drop-shadow-[0_0_20px_rgba(236,73,73,0.3)] animate-pulse">
          404
        </h1>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold font-grotesk tracking-wide">
            Page Not Found
          </h2>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>
        </div>

        <Link
          href="/home"
          className="mt-4 px-8 py-3 bg-[#EC4949] hover:bg-[#d43f3f] text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#EC4949]/20 hover:no-underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
