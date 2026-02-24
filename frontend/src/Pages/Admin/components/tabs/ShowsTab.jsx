import React from "react";
import { Plus, Search, Clock } from "lucide-react";

const ShowsTab = ({
  shows,
  movies,
  screens,
  onAddClick,
  onCinemaChange,
  showModal,
  onCloseModal,
  newShow,
  setNewShow,
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
          placeholder="Search shows..."
          className="bg-[#121212] border border-white/5 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-[#f5c518]/50 transition-all w-full text-sm font-bold"
        />
      </div>
      <button
        onClick={onAddClick}
        className="btn-fill-gold flex items-center gap-2 !px-8 !py-4 text-xs font-black uppercase tracking-widest w-full md:w-auto"
      >
        <Plus size={18} /> Create Show
      </button>
    </div>

    <div className="bg-[#121212] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
      <table className="w-full text-left font-bold text-sm">
        <thead className="bg-white/5 text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] border-b border-white/5">
          <tr>
            <th className="px-10 py-6">Movie</th>
            <th className="px-10 py-6">Cinema</th>
            <th className="px-10 py-6">Time</th>
            <th className="px-10 py-6">Price</th>
            <th className="px-10 py-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {shows.map((show) => (
            <tr
              key={show._id}
              className="hover:bg-white/5 transition-colors group"
            >
              <td className="px-10 py-6 font-black text-white uppercase tracking-tighter truncate max-w-[200px]">
                {show.movie?.title}
              </td>
              <td className="px-10 py-6 text-gray-400">
                {show.screen?.cinema?.name}
              </td>
              <td className="px-10 py-6 text-gray-400">
                {new Date(show.startTime).toLocaleDateString()}{" "}
                <span className="text-[#f5c518]">
                  {new Date(show.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </td>
              <td className="px-10 py-6 text-[#f5c518] font-black">
                ₹ {show.price}
              </td>
              <td className="px-10 py-6 text-right">
                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-500/20">
                  Active
                </span>
              </td>
            </tr>
          ))}
          {shows.length === 0 && (
            <tr>
              <td
                colSpan="5"
                className="px-10 py-20 text-center text-gray-600 italic"
              >
                No shows scheduled. Create one to get started!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <Modal isOpen={showModal} onClose={onCloseModal} title="Create New Show">
      <form onSubmit={onSubmit} className="space-y-6 font-bold">
        <div className="relative">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-2.5 left-5 bg-[#121212] px-2 z-10">
            Select Movie
          </label>
          <select
            value={newShow.movie}
            onChange={(e) => setNewShow({ ...newShow, movie: e.target.value })}
            required
            className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f5c518]/50 text-sm text-white [&>option]:bg-[#1a1a1a] [&>option]:text-white"
          >
            <option value="">Choose a movie</option>
            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-2.5 left-5 bg-[#121212] px-2 z-10">
            Select Screen
          </label>
          <select
            value={newShow.screen}
            onChange={(e) => setNewShow({ ...newShow, screen: e.target.value })}
            required
            className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f5c518]/50 text-sm text-white [&>option]:bg-[#1a1a1a] [&>option]:text-white"
          >
            <option value="">Choose a screen</option>
            {screens.map((screen) => (
              <option key={screen._id} value={screen._id}>
                {screen.cinema?.name} - {screen.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="relative">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-2.5 left-5 bg-[#121212] px-2 z-10">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={newShow.startTime}
              onChange={(e) =>
                setNewShow({ ...newShow, startTime: e.target.value })
              }
              required
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f5c518]/50 text-sm"
            />
          </div>
          <div className="relative">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-2.5 left-5 bg-[#121212] px-2 z-10">
              End Time
            </label>
            <input
              type="datetime-local"
              value={newShow.endTime}
              onChange={(e) =>
                setNewShow({ ...newShow, endTime: e.target.value })
              }
              required
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f5c518]/50 text-sm"
            />
          </div>
        </div>
        <div className="relative">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-2.5 left-5 bg-[#121212] px-2 z-10">
            Ticket Price (INR)
          </label>
          <input
            type="number"
            value={newShow.price}
            onChange={(e) => setNewShow({ ...newShow, price: e.target.value })}
            required
            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f5c518]/50 text-sm"
          />
        </div>
        <button
          type="submit"
          className="btn-fill-gold w-full py-5 uppercase tracking-widest text-[10px] font-black"
        >
          Create Show
        </button>
      </form>
    </Modal>
  </div>
);

export default ShowsTab;
