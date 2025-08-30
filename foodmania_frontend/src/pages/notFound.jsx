// React is not directly used in this component, so we can remove the import
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d327b] text-white font-fancy flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">

      {/* Giant backdrop text */}
      <h1 className="absolute text-[14rem] md:text-[18rem] font-main text-white/5 top-[-6rem] left-1/2 -translate-x-1/2 z-0 select-none pointer-events-none">
        404
      </h1>

      {/* Foreground Content */}
      <div className="z-10 max-w-xl text-center">
        <h2 className="text-yellow-400 text-6xl md:text-7xl font-main mb-6">
          Oops!
        </h2>

        <p className="text-gray-300 text-xl md:text-2xl mb-8">
          The page you're looking for doesn't exist or has been removed.
        </p>

        <Link
          to="/"
          className="inline-block mt-4 px-6 py-3 bg-yellow-400 text-[#0d327b] font-bold rounded-xl hover:bg-yellow-300 transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
