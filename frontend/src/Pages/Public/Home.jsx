import React, { useState, useEffect } from "react";
import API from "../../config/api";
import MovieCard from "../../Components/MovieCard";
import Navbar from "../../Components/Navbar";
import { Link, useSearchParams } from "react-router-dom";
import {
  Star,
  Clock,
  Play,
  Film,
  Ticket,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Home = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filter, setFilter] = useState("All");
  const [categories, setCategories] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const query = searchParams.get("search");
    if (query !== null) {
      setSearch(query);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/categories");
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const categoryParam = filter === "All" ? "" : filter;
        const { data } = await API.get(
          `/movies?search=${search}&category=${categoryParam}`
        );
        setMovies(data);
        // Reset heroIndex when movies change to avoid out-of-bounds access
        setHeroIndex(0);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      }
    };
    fetchMovies();
  }, [search, filter]);

  // Auto-rotate hero slider
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [movies]);

  const nextHero = () => {
    setHeroIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
  };

  const prevHero = () => {
    setHeroIndex(
      (prev) =>
        (prev - 1 + Math.min(movies.length, 5)) % Math.min(movies.length, 5)
    );
  };

  // Get the current hero movie safely
  const heroMovie = movies.length > 0 ? movies[heroIndex % movies.length] : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Dynamic Hero Section */}
      {heroMovie && (
        <div className="relative min-h-[500px] lg:h-[85vh] w-full overflow-hidden group/hero flex flex-col justify-center">
          {/* Hero Background Image */}
          <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
            <img
              key={heroMovie._id}
              src={heroMovie.posterUrl}
              className="w-full h-full object-cover blur-sm animate-pulse-slow scale-105"
              alt="Hero"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 md:px-12 py-10 lg:py-0">
            <div className="max-w-3xl animate-float">
              <div className="inline-flex items-center gap-2 border border-[#f5c518]/30 rounded-full px-4 py-1 mb-6 bg-black/40 backdrop-blur-md">
                <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></span>
                <span className="text-[10px] uppercase font-black tracking-widest text-[#f5c518]">
                  Now Showing
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-6 tracking-tighter leading-[0.9] text-white text-glow line-clamp-2">
                {heroMovie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8 text-xs md:text-sm font-bold tracking-wide">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-[#f5c518] fill-[#f5c518]" />
                  <span className="text-white">
                    {heroMovie.rating || "N/A"}
                  </span>
                  <span className="text-gray-500">/10</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={16} />
                  <span>{heroMovie.duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-[#f5c518]">
                  <span>
                    {heroMovie.category?.name || "Uncategorized"}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 text-sm md:text-lg max-w-xl mb-10 leading-relaxed font-medium line-clamp-3">
                {heroMovie.description}
              </p>

              <div className="flex items-center gap-4 md:gap-6">
                <Link
                  to={`/movie/${heroMovie._id}`}
                  className="btn-fill-gold flex items-center gap-2 !px-6 md:!px-8 !py-3 md:!py-4 shadow-lg shadow-[#f5c518]/20 text-xs md:text-sm"
                >
                  <Ticket size={20} />
                  Book Tickets
                </Link>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="absolute right-6 md:right-12 bottom-10 lg:bottom-32 flex gap-4 hidden md:flex">
              <button
                onClick={prevHero}
                className="p-3 md:p-4 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextHero}
                className="p-3 md:p-4 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 flex gap-3">
              {movies.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    heroIndex === idx
                      ? "w-12 bg-[#f5c518]"
                      : "w-4 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="w-full max-w-screen-2xl mx-auto px-6 md:px-12 relative z-20 mt-8 lg:-mt-20 lg:mb-12">
        <div className="glass rounded-[40px] p-8 grid grid-cols-2 lg:grid-cols-4 gap-8 shadow-2xl shadow-black/50">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left group">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-400/10 rounded-2xl flex items-center justify-center text-[#f5c518] group-hover:bg-[#f5c518] group-hover:text-black transition-all duration-500">
              <Film size={24} />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-black text-white">500+</p>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                Movies
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left group lg:border-l border-white/5 lg:pl-8">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-rose-400/10 rounded-2xl flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
              <Ticket size={24} />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-black text-white">1M+</p>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                Tickets Sold
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left group lg:border-l border-white/5 lg:pl-8">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-400/10 rounded-2xl flex items-center justify-center text-[#f5c518] group-hover:bg-[#f5c518] group-hover:text-black transition-all duration-500">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-black text-white">24/7</p>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                Booking
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left group lg:border-l border-white/5 lg:pl-8">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-rose-400/10 rounded-2xl flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
              <Star size={24} />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-black text-white">4.9</p>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                User Rating
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Movie List Section */}
      <div
        id="movies-section"
        className="max-w-screen-2xl mx-auto px-12 pb-24 scroll-mt-32"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-2 font-heading">
              Now <span className="text-[#f5c518]">Showing</span>
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              {movies.length} movies available
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#f5c518] transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search movies..."
                value={search}
                className="bg-[#121212] border border-white/5 rounded-2xl py-3 pl-12 pr-6 outline-none focus:border-[#f5c518]/50 transition-all w-64 text-sm font-bold text-white placeholder:text-gray-600"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="bg-[#1a1a1a] border border-white/5 rounded-2xl py-3 px-6 outline-none hover:border-white/20 transition-all text-sm font-bold text-white cursor-pointer [&>option]:bg-[#1a1a1a] [&>option]:text-white">
              <option>All Cities</option>
              <option>Lucknow</option>
              <option>Jaunpur</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => setFilter("All")}
            className={`px-6 py-2 rounded-full text-[10px] uppercase font-black tracking-widest transition-all ${
              filter === "All"
                ? "bg-[#f5c518] text-black shadow-lg shadow-[#f5c518]/20 scale-105"
                : "bg-[#121212] text-gray-500 hover:text-white border border-white/5 hover:border-white/20"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setFilter(cat._id)}
              className={`px-6 py-2 rounded-full text-[10px] uppercase font-black tracking-widest transition-all ${
                filter === cat._id
                  ? "bg-[#f5c518] text-black shadow-lg shadow-[#f5c518]/20 scale-105"
                  : "bg-[#121212] text-gray-500 hover:text-white border border-white/5 hover:border-white/20"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
          {movies.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-600 font-bold uppercase tracking-widest italic border border-dashed border-white/10 rounded-3xl">
              No movies found match your search
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#050505]">
        <div className="max-w-screen-2xl mx-auto px-12 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 group opacity-50 hover:opacity-100 transition-opacity"
          >
            <div className="bg-[#f5c518] p-1 rounded">
              <Film size={16} className="text-black" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              CINE<span className="text-[#f5c518]">BOOK</span>
            </span>
          </Link>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact Us
            </a>
          </div>
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 CINEBOOK. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
