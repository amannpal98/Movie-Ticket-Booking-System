import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../config/api";
import { Play, Calendar, Clock, MapPin } from "lucide-react";
import Navbar from "../../Components/Navbar";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, showsRes] = await Promise.all([
          API.get(`/movies/${id}`),
          API.get(`/shows?movieId=${id}`),
        ]);
        setMovie(movieRes.data);
        setShows(showsRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load movie details");
      }
    };
    fetchData();
  }, [id]);

  if (!movie) return <div className="p-10 text-center">Loading...</div>;

  // Group shows by cinema - with safety checks
  const groupedShows = shows.reduce((acc, show) => {
    if (show?.screen?.cinema?.name) {
      const cinemaName = show.screen.cinema.name;
      if (!acc[cinemaName]) acc[cinemaName] = [];
      acc[cinemaName].push(show);
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      {/* Immersive Backdrop Section */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={movie.posterUrl}
            className="w-full h-full object-cover blur-2xl opacity-30 scale-125"
            alt="Backdrop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-12 flex items-center gap-16 pt-20">
          <div className="group relative hidden lg:block">
            <img
              src={movie.posterUrl}
              className="w-[350px] h-[520px] object-cover rounded-[48px] shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-700"
              alt={movie.title}
            />
            <div className="absolute inset-0 rounded-[48px] border-2 border-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap gap-3 mb-10">
              <span className="px-6 py-2 glass-light text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-rose-500/20">
                {movie.category?.name || "Uncategorized"}
              </span>
            </div>

            <h1 className="text-[7vw] font-black tracking-tighter leading-[0.9] text-gradient mb-8 font-heading">
              {movie.title.toUpperCase()}
            </h1>

            <div className="flex items-center gap-10 text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-12">
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-rose-500" />
                <span>{movie.duration} MINUTES</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-rose-500" />
                <span>{new Date(movie.releaseDate).getFullYear()}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded bg-white/10 text-white font-black">
                  ★ {movie.rating}
                </span>
                <span>RATING</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information & Showtimes Section */}
      <div className="max-w-7xl mx-auto px-12 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-20">
            {/* Storyline */}
            <section>
              <h2 className="text-4xl font-black mb-8 font-heading italic text-gradient">
                STORYLINE
              </h2>
              <p className="text-2xl text-gray-400 leading-relaxed font-medium">
                {movie.description}
              </p>
            </section>

            {/* Showtimes */}
            <section>
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl font-black font-heading italic text-gradient">
                  SELECT YOUR SHOW
                </h2>
                <div className="h-px flex-1 bg-white/5 mx-8"></div>
                <div className="text-rose-500 text-[10px] font-black uppercase tracking-widest">
                  Available Today
                </div>
              </div>

              <div className="space-y-12">
                {Object.entries(groupedShows).map(([cinema, cinemaShows]) => (
                  <div
                    key={cinema}
                    className="glass rounded-[40px] p-10 border-white/5 relative overflow-hidden group"
                  >
                    <div className="flex items-center gap-3 mb-10">
                      <div className="p-3 bg-rose-600/10 rounded-2xl text-rose-500">
                        <MapPin size={24} />
                      </div>
                      <h3 className="text-3xl font-black font-heading tracking-tight">
                        {cinema}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {cinemaShows.map((show) => (
                        <Link
                          key={show._id}
                          to={`/book/${show._id}`}
                          className="group/time relative p-6 rounded-[28px] glass-light border border-white/5 hover:border-rose-500/30 transition-all duration-500 text-center flex flex-col items-center justify-center gap-2 hover:-translate-y-2"
                        >
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover/time:text-rose-400 transition-colors">
                            {new Date(show.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="text-xl font-black text-white">
                            ₹{show.price}
                          </span>
                          <div className="absolute inset-0 bg-rose-600/5 opacity-0 group-hover/time:opacity-100 transition-opacity rounded-[28px]"></div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                {shows.length === 0 && (
                  <div className="py-20 text-center glass rounded-[40px] border-dashed border-2 border-white/5">
                    <p className="text-gray-600 font-medium italic text-xl">
                      No screening schedules found for this cinematic journey.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-12">
            <div className="glass rounded-[40px] p-10 border-white/5 sticky top-32">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">
                Details
              </h3>

              <div className="space-y-8">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">
                    Language
                  </span>
                  <p className="text-xl font-bold mt-2 text-white">
                    {movie.language}
                  </p>
                </div>
                <div className="h-px bg-white/5"></div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">
                    Format
                  </span>
                  <p className="text-xl font-bold mt-2 text-white">
                    IMAX 3D, 4DX
                  </p>
                </div>
                <div className="h-px bg-white/5"></div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">
                    Hall Experience
                  </span>
                  <p className="text-xl font-bold mt-2 text-white">
                    Platinum Recliner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
