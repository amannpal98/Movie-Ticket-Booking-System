import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../config/api";
import { Armchair, ChevronRight, Info, MapPin } from "lucide-react";
import Navbar from "../../Components/Navbar";

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [showRes, bookedRes] = await Promise.all([
          API.get(`/shows/${showId}`),
          API.get(`/bookings/booked-seats/${showId}`),
        ]);
        setShow(showRes.data);
        setBookedSeats(bookedRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load show details");
      }
    };
    fetchData();
  }, [showId]);

  const handleSeatClick = (seat) => {
    if (bookedSeats.includes(seat)) return;
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0)
      return toast.error("Select at least one seat");

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to book tickets");
      return navigate("/login");
    }

    const loadingToast = toast.loading("Initiating booking...");
    try {
      // 1. Lock seats
      await API.post("/bookings/lock", { showId, seats: selectedSeats });

      // 2. Initiate booking
      const { data } = await API.post("/bookings/initiate", {
        showId,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * show.price,
        movieTitle: show.movie.title,
      });

      if (data.url) {
        toast.success("Redirecting to payment gateway...", {
          id: loadingToast,
        });
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed", {
        id: loadingToast,
      });
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading Hall Layout...</div>;

  const rows = ["A", "B", "C", "D", "E", "F", "G"];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-12 pt-32 flex flex-col lg:flex-row gap-16">
        {/* Seat Selection Area */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
            <div>
              <span className="text-rose-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">
                Hall Experience • Platinum
              </span>
              <h1 className="text-5xl font-black text-gradient font-heading tracking-tighter mb-2 italic">
                {show.movie.title.toUpperCase()}
              </h1>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} className="text-rose-600" />
                {show.screen.cinema.name} •{" "}
                {new Date(show.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="flex gap-8 glass-light p-4 rounded-[24px] border-white/5">
              {[
                { label: "Available", color: "bg-slate-800" },
                {
                  label: "Selected",
                  color: "bg-rose-600 shadow-lg shadow-rose-600/40",
                },
                { label: "Booked", color: "bg-slate-700 opacity-50" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-md ${item.color}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Immersive Screen Projection */}
          <div className="relative mb-32 max-w-2xl mx-auto">
            <div className="h-2 w-full bg-rose-600/30 blur-3xl absolute -top-8"></div>
            <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-rose-600 to-transparent rounded-full shadow-[0_0_30px_rgba(225,29,72,0.4)]"></div>
            <p className="text-center text-[10px] uppercase font-black tracking-[1.5em] text-gray-500 mt-8 select-none">
              SCREEN FIELD OF VIEW
            </p>
          </div>

          {/* Seat Grid with Modern Layout */}
          <div className="overflow-x-auto pb-8 -mx-4 px-4 custom-scrollbar">
            <div className="space-y-6 max-w-3xl mx-auto min-w-[340px]">
              {rows.map((row) => (
                <div
                  key={row}
                  className="flex justify-center gap-2 md:gap-5 items-center"
                >
                  <span className="w-4 md:w-8 text-[10px] font-black text-gray-700 uppercase tracking-widest text-center">
                    {row}
                  </span>
                  <div className="flex gap-2.5 md:gap-4">
                    {cols.map((col) => {
                      const seat = `${row}${col}`;
                      const isBooked = bookedSeats.includes(seat);
                      const isSelected = selectedSeats.includes(seat);

                      return (
                        <button
                          key={seat}
                          onClick={() => handleSeatClick(seat)}
                          disabled={isBooked}
                          className={`
                            relative w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 group
                            ${
                              isBooked
                                ? "bg-slate-900 border border-white/5 text-slate-800 cursor-not-allowed opacity-20"
                                : isSelected
                                ? "bg-rose-600 text-white shadow-xl shadow-rose-600/50 scale-110 -translate-y-1"
                                : "bg-white/5 border border-white/5 hover:bg-white/10 text-gray-600 hover:text-white hover:-translate-y-1 hover:border-rose-500/20"
                            }
                          `}
                        >
                          <Armchair
                            className={`w-4 h-4 md:w-5 md:h-[18px] ${
                              isSelected ? "animate-pulse" : ""
                            }`}
                          />
                          <span
                            className={`absolute -top-8 bg-rose-600 text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap ${
                              isSelected ? "opacity-100" : ""
                            }`}
                          >
                            {seat}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <span className="w-4 md:w-8 text-[10px] font-black text-gray-700 uppercase tracking-widest text-center">
                    {row}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modern Sidebar Summary */}
        <div className="w-full lg:w-[450px]">
          <div className="glass rounded-[40px] p-12 sticky top-32 border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/10 blur-[80px] rounded-full group-hover:bg-rose-600/20 transition-all"></div>

            <h3 className="text-2xl font-black mb-10 flex items-center gap-4 font-heading italic text-gradient">
              <div className="w-10 h-px bg-rose-600"></div>
              RESERVATION
            </h3>

            <div className="space-y-10 mb-12">
              <div className="flex justify-between items-center group/item">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
                    Total Seats
                  </span>
                  <span className="text-xl font-black text-white">
                    {selectedSeats.length || "0"} SEATS
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 justify-end max-w-[200px]">
                  {selectedSeats.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-rose-600 text-[10px] font-black rounded-lg shadow-lg shadow-rose-600/30"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/5"></div>

              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                    Total Investment
                  </span>
                  <span className="text-6xl font-black text-rose-600 text-glow leading-none tracking-tighter">
                    ₹{selectedSeats.length * show.price}
                  </span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 pb-1">
                  VAT Included
                </div>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="w-full btn-premium py-6 flex items-center justify-center gap-4 group/btn"
              disabled={selectedSeats.length === 0}
            >
              <span className="text-sm font-black tracking-[0.3em]">
                INITIATE BOOKING
              </span>
              <ChevronRight
                size={20}
                className="transition-transform group-hover/btn:translate-x-2"
              />
            </button>

            <div className="mt-10 flex items-start gap-4 p-4 glass-light rounded-2xl border-white/5">
              <Info size={20} className="text-rose-500 shrink-0" />
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                Tickets on this screen are strictly non-refundable once
                confirmed via SSLCommerz secure gateway.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
