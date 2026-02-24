import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movie/${movie._id}`}
      className="group relative block transition-all duration-300 active:scale-95"
    >
      <div className="aspect-[2/3] relative rounded-3xl overflow-hidden shadow-2xl bg-[#121212]">
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
          <Star size={14} className="text-[#f5c518] fill-[#f5c518]" />
          <span className="text-sm font-black text-white">{movie.rating}</span>
        </div>

        {/* Poster Image */}
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Info Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 pt-20 bg-gradient-to-t from-black via-black/40 to-transparent">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-lg group-hover:text-[#f5c518] transition-colors line-clamp-2">
            {movie.title}
          </h3>
          <div className="flex items-center gap-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {movie.category?.name || "Uncategorized"}
            </span>
            <div className="h-1 w-1 bg-white/20 rounded-full"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {movie.duration} min
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
