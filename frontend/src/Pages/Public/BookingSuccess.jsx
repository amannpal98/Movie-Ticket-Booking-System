import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { CheckCircle2, Download, Share2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import API from "../../config/api";
import toast from "react-hot-toast";

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const tran_id = searchParams.get("tran_id");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const ticketRef = useRef(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!tran_id) return;
        const { data } = await API.get(`/bookings/transaction/${tran_id}`);
        setBooking(data);
      } catch (error) {
        console.error("Failed to fetch booking:", error);
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [tran_id]);

  const handleDownload = async () => {
    if (!ticketRef.current || !booking) return;
    const toastId = toast.loading("Preparing your ticket...");
    try {
      const ResolvedHtml2canvas = html2canvas.default || html2canvas;
      const canvas = await ResolvedHtml2canvas(ticketRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: "#020617",
        onclone: (clonedDoc) => {
          const ticket = clonedDoc.getElementById("ticket-to-capture");
          if (ticket) {
            ticket.style.backdropFilter = "none";
            ticket.style.backgroundColor = "#1a1a1a";
            ticket.style.transition = "none";
            ticket.style.transform = "none";

            // Fix children
            const children = ticket.querySelectorAll("*");
            children.forEach((el) => {
              const style = window.getComputedStyle(el);
              if (el.style.backdropFilter) el.style.backdropFilter = "none";
              if (el.style.filter) el.style.filter = "none";
            });

            // Ensure the top section has its background
            const topSection = ticket.querySelector(".ticket-top-section");
            if (topSection) {
              topSection.style.background =
                "linear-gradient(to bottom right, #e11d48, #9f1239)";
            }
          }
        },
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const JsPDFConstructor = jsPDF.default || jsPDF;
      const pdf = new JsPDFConstructor("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ticket-${booking.transactionId || "movie"}.pdf`);
      toast.success("Ticket downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download ticket", { id: toastId });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Movie Ticket",
          text: `Check out my movie ticket for ${booking?.show?.movie?.title}!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-4">Booking Not Found</h1>
        <Link to="/" className="text-rose-500 hover:text-rose-400">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-rose-500/30">
      <Navbar />

      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="flex flex-col items-center justify-center py-24 px-6 relative">
        <div className="flex flex-col items-center mb-12 animate-float">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30 mb-6 group transition-all duration-500 hover:scale-110">
            <CheckCircle2
              size={40}
              className="text-green-500 transition-transform duration-500 group-hover:rotate-12"
            />
          </div>
          <h1 className="text-5xl font-black mb-3 text-gradient text-glow text-center">
            Booking Confirmed!
          </h1>
          <p className="text-gray-400 font-medium tracking-wide text-center">
            Your cinematic journey begins soon. Tickets are ready.
          </p>
        </div>

        {/* Cinematic Digital Ticket */}
        <div className="w-full max-w-[480px] group" ref={ticketRef}>
          <div
            id="ticket-to-capture"
            style={{
              backgroundColor: "rgba(18, 18, 18, 0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            className="rounded-[40px] overflow-hidden shadow-2xl relative transition-all duration-500 group-hover:shadow-rose-500/10 group-hover:-translate-y-2"
          >
            {/* Ticket Top Section */}
            <div
              className="ticket-top-section"
              style={{
                background:
                  "linear-gradient(to bottom right, #e11d48, #9f1239)",
                padding: "40px",
                color: "#ffffff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "128px",
                  height: "128px",
                  filter: "blur(48px)",
                  borderRadius: "9999px",
                  transform: "translate(48px, -48px)",
                }}
              ></div>
              <div className="flex justify-between items-center mb-8 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
                  Official Entry Pass
                </span>
                <span
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    padding: "4px 12px",
                    borderRadius: "9999px",
                  }}
                >
                  {booking.transactionId}
                </span>
              </div>
              <h2 className="text-4xl font-black mb-2 font-heading tracking-tight leading-none">
                {booking.show?.movie?.title}
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "rgba(255, 255, 255, 0.7)",
                  textTransform: "uppercase",
                  fontSize: "10px",
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                }}
              >
                <span>{booking.show?.screen?.cinema?.name}</span>
                <span
                  style={{
                    width: "4px",
                    height: "4px",
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderRadius: "9999px",
                  }}
                ></span>
                <span>{booking.show?.screen?.name}</span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                padding: "40px",
                position: "relative",
                backdropFilter: "blur(48px)",
              }}
            >
              {/* Ticket Perforation Simulation */}
              <div
                style={{
                  position: "absolute",
                  left: "-20px",
                  top: "-20px",
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#020617",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  right: "-20px",
                  top: "-20px",
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#020617",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
                }}
              ></div>

              <div className="grid grid-cols-2 gap-y-10 mb-12">
                <div>
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      fontWeight: 900,
                      marginBottom: "8px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Date
                  </p>
                  <p className="font-bold text-lg text-white">
                    {new Date(booking.show?.startTime).toLocaleDateString(
                      undefined,
                      {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      fontWeight: 900,
                      marginBottom: "8px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Time
                  </p>
                  <p className="font-bold text-lg text-white">
                    {new Date(booking.show?.startTime).toLocaleTimeString(
                      undefined,
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      fontWeight: 900,
                      marginBottom: "8px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Seats
                  </p>
                  <p
                    style={{
                      color: "#f43f5e",
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                    className="font-black text-xl"
                  >
                    {booking.seats?.join(", ")}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      fontWeight: 900,
                      marginBottom: "8px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Price
                  </p>
                  <p className="font-bold text-lg text-white">
                    ₹ {booking.totalPrice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-6">
          <button
            onClick={handleDownload}
            className="flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <Download
              size={18}
              className="text-rose-500 transition-transform group-hover:-translate-y-1"
            />{" "}
            Download PDF
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <Share2
              size={18}
              className="text-rose-500 transition-transform group-hover:rotate-12"
            />{" "}
            Share
          </button>
          <Link
            to="/dashboard"
            className="btn-premium flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-rose-600/20"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
