import React from "react";
import { Plus, Search, Trash2 } from "lucide-react";

const MoviesTab = ({
  movies,
  categories,
  onAddClick,
  onDelete,
  showModal,
  onCloseModal,
  newMovie,
  setNewMovie,
  posterFile,
  setPosterFile,
  onSubmit,
  Modal,
}) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="relative group w-full md:w-96">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#f5c518] transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Search movies..."
          className="bg-[#121212] border border-white/5 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-[#f5c518]/50 transition-all w-full text-sm font-bold"
        />
      </div>
      <button
        onClick={onAddClick}
        className="btn-fill-gold flex items-center gap-2 !px-8 !py-4 text-xs font-black uppercase tracking-widest w-full md:w-auto"
      >
        <Plus size={18} /> Add Movie
      </button>
    </div>

    <div className="bg-[#121212] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
      <table className="w-full text-left font-bold">
        <thead className="bg-white/5 text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] border-b border-white/5">
          <tr>
            <th className="px-10 py-6">Movie</th>
            <th className="px-10 py-6">Genre</th>
            <th className="px-10 py-6">Duration</th>
            <th className="px-10 py-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {movies.map((movie) => (
            <tr
              key={movie._id}
              className="hover:bg-white/5 transition-colors group"
            >
              <td className="px-10 py-6">
                <div className="flex items-center gap-6">
                  <img
                    src={movie.posterUrl}
                    className="w-12 h-16 object-cover rounded-xl shadow-lg"
                    alt=""
                  />
                  <span className="font-black text-white uppercase tracking-tighter text-lg group-hover:text-[#f5c518] transition-colors">
                    {movie.title}
                  </span>
                </div>
              </td>
              <td className="px-10 py-6 text-gray-400 text-sm">
                {movie.genre?.join(", ")}
              </td>
              <td className="px-10 py-6 text-gray-400 text-sm">
                {movie.duration} min
              </td>
              <td className="px-10 py-6">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => onDelete(movie._id)}
                    className="p-3 hover:bg-rose-500/10 rounded-2xl text-gray-600 hover:text-rose-500 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {movies.length === 0 && (
            <tr>
              <td
                colSpan="4"
                className="px-10 py-20 text-center text-gray-600 italic"
              >
                No movies found in database.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <Modal isOpen={showModal} onClose={onCloseModal} title="Add New Movie">
      <form onSubmit={onSubmit} className="space-y-6 font-bold">
        <div className="grid grid-cols-2 gap-6">
          <div className="relative">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-2.5 left-5 bg-[#121212] px-2 z-10">
              Title
            </label>
            <input
              type="text"
              value={newMovie.title}
              onChange={(e) =>
                setNewMovie({ ...newMovie, title: e.target.value })
              }
              required
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f5c518]/50 text-sm"
            />
          </div>
          <div className="relative">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-2.5 left-5 bg-[#121212] px-2 z-10">
              Category
            </label>
            <select
              value={newMovie.category}
              onChange={(e) =>
                setNewMovie({ ...newMovie, category: e.target.value })
              }
              required
              className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f5c518]/50 text-sm text-white [&>option]:bg-[#1a1a1a] [&>option]:text-white"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="relative">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-2.5 left-5 bg-[#121212] px-2 z-10">
              Duration (min)
            </label>
            <input
              type="number"
              value={newMovie.duration}
              onChange={(e) =>
                setNewMovie({ ...newMovie, duration: e.target.value })
              }
              required
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f5c518]/50 text-sm"
            />
          </div>
          <div className="relative">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-2.5 left-5 bg-[#121212] px-2 z-10">
              Rating
            </label>
            <input
              type="text"
              value={newMovie.rating}
              onChange={(e) =>
                setNewMovie({ ...newMovie, rating: e.target.value })
              }
              placeholder="8.5"
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f5c518]/50 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="relative">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-2.5 left-5 bg-[#121212] px-2 z-10">
              Poster File
            </label>
            <input
              type="file"
              onChange={(e) => setPosterFile(e.target.files[0])}
              accept="image/*"
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f5c518]/50 text-sm file:bg-[#f5c518] file:border-none file:px-4 file:py-1 file:rounded-lg file:text-[10px] file:font-black file:uppercase file:mr-4 file:cursor-pointer"
            />
          </div>
          <div className="relative">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-2.5 left-5 bg-[#121212] px-2 z-10">
              OR Poster URL
            </label>
            <input
              type="url"
              value={newMovie.posterUrl}
              onChange={(e) =>
                setNewMovie({ ...newMovie, posterUrl: e.target.value })
              }
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f5c518]/50 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="relative">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-2.5 left-5 bg-[#121212] px-2 z-10">
              Release Date
            </label>
            <input
              type="date"
              value={newMovie.releaseDate}
              onChange={(e) =>
                setNewMovie({ ...newMovie, releaseDate: e.target.value })
              }
              required
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f5c518]/50 text-sm"
            />
          </div>
          <div className="relative">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-2.5 left-5 bg-[#121212] px-2 z-10">
              Language
            </label>
            <input
              type="text"
              value={newMovie.language}
              onChange={(e) =>
                setNewMovie({ ...newMovie, language: e.target.value })
              }
              required
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f5c518]/50 text-sm"
            />
          </div>
        </div>
        <div className="relative">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-2.5 left-5 bg-[#121212] px-2 z-10">
            Description
          </label>
          <textarea
            value={newMovie.description}
            onChange={(e) =>
              setNewMovie({ ...newMovie, description: e.target.value })
            }
            required
            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f5c518]/50 text-sm h-32 resize-none"
          />
        </div>
        <button
          type="submit"
          className="btn-fill-gold w-full py-5 uppercase tracking-widest text-[10px] font-black"
        >
          Publish Movie
        </button>
      </form>
    </Modal>
  </div>
);

export default MoviesTab;
