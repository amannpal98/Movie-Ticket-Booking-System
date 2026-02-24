import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../../config/api";
import Navbar from "../../Components/Navbar";
import TabButton from "./components/TabButton";
import BookingsTab from "./components/tabs/BookingsTab";
import CategoriesTab from "./components/tabs/CategoriesTab";
import MoviesTab from "./components/tabs/MoviesTab";
import CinemasTab from "./components/tabs/CinemasTab";
import ShowsTab from "./components/tabs/ShowsTab";
import {
  BarChart3,
  Film,
  MapPin,
  Calendar,
  Ticket,
  Plus,
  TrendingUp,
} from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#121212] w-full max-w-xl rounded-[40px] border border-white/5 p-12 relative shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-[#f5c518] mb-8">
          {title}
        </h2>
        {children}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
        >
          <Plus size={32} className="rotate-45" />
        </button>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  // State
  const [activeTab, setActiveTab] = useState("overview");
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [shows, setShows] = useState([]);
  const [screens, setScreens] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showMovieModal, setShowMovieModal] = useState(false);
  const [showCinemaModal, setShowCinemaModal] = useState(false);
  const [showShowModal, setShowShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [newMovie, setNewMovie] = useState({
    title: "",
    category: "",
    duration: "",
    rating: "",
    posterUrl: "",
    description: "",
    releaseDate: "",
    language: "English",
  });
  const [posterFile, setPosterFile] = useState(null);
  const [newCinema, setNewCinema] = useState({
    name: "",
    city: "",
    address: "",
  });
  const [newShow, setNewShow] = useState({
    movie: "",
    screen: "",
    startTime: "",
    endTime: "",
    price: "",
  });
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  // Fetch Data
  const fetchData = async () => {
    const fetchers = [
      { key: "movies", url: "/movies", setter: setMovies },
      { key: "bookings", url: "/bookings/all", setter: setBookings },
      { key: "cinemas", url: "/cinemas", setter: setCinemas },
      { key: "shows", url: "/shows", setter: setShows },
      { key: "categories", url: "/categories", setter: setCategories },
      { key: "screens", url: "/screens", setter: setScreens },
    ];

    await Promise.all(
      fetchers.map(async (f) => {
        try {
          const { data } = await API.get(f.url);
          f.setter(data);
        } catch (error) {
          console.error(`Failed to fetch ${f.key}:`, error);
          toast.error(`Failed to load ${f.key}`);
        }
      })
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleAddMovie = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Publishing movie...");
    try {
      const formData = new FormData();
      Object.keys(newMovie).forEach((key) => {
        if (key !== "posterUrl") {
          let value = newMovie[key];
          if ((key === "duration" || key === "rating") && value === "") {
            value = key === "rating" ? "0" : value;
          }
          formData.append(key, value);
        }
      });
      if (posterFile) {
        formData.append("poster", posterFile);
      } else if (newMovie.posterUrl) {
        formData.append("posterUrl", newMovie.posterUrl);
      }

      if (!posterFile && !newMovie.posterUrl) {
        toast.error("Please provide either a poster file or a poster URL", {
          id: loadingToast,
        });
        return;
      }

      await API.post("/movies", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Movie published successfully!", { id: loadingToast });
      setShowMovieModal(false);
      setNewMovie({
        title: "",
        category: "",
        duration: "",
        rating: "",
        posterUrl: "",
        description: "",
        releaseDate: "",
        language: "English",
      });
      setPosterFile(null);
      fetchData();
    } catch (error) {
      console.error("Failed to add movie:", error);
      toast.error(error.response?.data?.message || "Failed to add movie", {
        id: loadingToast,
      });
    }
  };

  const handleAddCinema = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Registering cinema...");
    try {
      const { data } = await API.post("/cinemas", newCinema);
      await API.post("/screens", {
        cinema: data._id,
        name: "Screen 1",
        totalSeats: 80,
      });
      toast.success("Cinema hub registered!", { id: loadingToast });
      setShowCinemaModal(false);
      setNewCinema({ name: "", city: "", address: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to add cinema", { id: loadingToast });
    }
  };

  const handleAddShow = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating show...");
    try {
      await API.post("/shows", newShow);
      toast.success("Show created successfully!", { id: loadingToast });
      setShowShowModal(false);
      setNewShow({
        movie: "",
        screen: "",
        startTime: "",
        endTime: "",
        price: "",
      });
      fetchData();
    } catch (error) {
      toast.error("Failed to create show", { id: loadingToast });
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    const loadingToast = toast.loading("Deleting movie...");
    try {
      await API.delete(`/movies/${id}`);
      toast.success("Movie deleted successfully!", { id: loadingToast });
      fetchData();
    } catch (error) {
      toast.error("Failed to delete movie", { id: loadingToast });
    }
  };

  const handleDeleteCinema = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cinema?")) return;
    const loadingToast = toast.loading("Deleting cinema...");
    try {
      await API.delete(`/cinemas/${id}`);
      toast.success("Cinema deleted successfully!", { id: loadingToast });
      fetchData();
    } catch (error) {
      toast.error("Failed to delete cinema", { id: loadingToast });
    }
  };

  const fetchScreensForCinema = async (cinemaId) => {
    try {
      const { data } = await API.get(`/screens?cinemaId=${cinemaId}`);
      setScreens(data);
    } catch (error) {
      console.error("Failed to fetch screens");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Adding category...");
    try {
      await API.post("/categories", newCategory);
      toast.success("Category added successfully!", { id: loadingToast });
      setShowCategoryModal(false);
      setNewCategory({ name: "", description: "" });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category", {
        id: loadingToast,
      });
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    const loadingToast = toast.loading("Deleting category...");
    try {
      await API.delete(`/categories/${id}`);
      toast.success("Category deleted successfully!", { id: loadingToast });
      fetchData();
    } catch (error) {
      toast.error("Failed to delete category", { id: loadingToast });
    }
  };

  // Render Functions
  const renderOverview = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Movies",
            value: movies.length,
            icon: Film,
            color: "text-[#f5c518]",
            bg: "bg-yellow-400/10",
          },
          {
            label: "Total Cinemas",
            value: cinemas.length,
            icon: MapPin,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Active Shows",
            value: shows.length,
            icon: Calendar,
            color: "text-green-500",
            bg: "bg-green-500/10",
          },
          {
            label: "Total Bookings",
            value: bookings.length,
            icon: Ticket,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#121212] p-8 rounded-[32px] border border-white/5 flex items-center gap-6 group hover:border-white/10 transition-all"
          >
            <div
              className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}
            >
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-[#121212] p-10 rounded-[40px] border border-white/5">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">
                Revenue Overview
              </p>
              <h3 className="text-4xl font-black text-[#f5c518]">
                INR{" "}
                {bookings
                  .reduce((acc, b) => acc + (b.totalPrice || 0), 0)
                  .toFixed(0)}
              </h3>
              <p className="text-sm font-bold text-green-500 flex items-center gap-1 mt-1">
                <TrendingUp size={14} /> +12%{" "}
                <span className="text-gray-500 font-medium">This week</span>
              </p>
            </div>
          </div>
          <div className="flex items-end gap-3 h-48">
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-[#f5c518]/20 rounded-t-xl group relative cursor-pointer hover:bg-[#f5c518]/40 transition-all"
              >
                <div
                  className="absolute bottom-0 left-0 right-0 bg-[#f5c518] rounded-t-xl transition-all"
                  style={{ height: `${h}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#121212] p-10 rounded-[40px] border border-white/5">
          <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-8">
            Recent Bookings
          </p>
          <div className="space-y-6">
            {bookings
              .slice(-3)
              .reverse()
              .map((booking, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-white/5 rounded-xl flex items-center justify-center text-[#f5c518]">
                      <Ticket size={24} />
                    </div>
                    <div>
                      <p className="font-black text-white uppercase tracking-tighter truncate max-w-[150px]">
                        {booking.show?.movie?.title || "Booking"}
                      </p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        {booking.seats?.length} seats • INR {booking.totalPrice}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-500/20">
                    Confirmed
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMovies = () => (
    <MoviesTab
      movies={movies}
      categories={categories}
      onAddClick={() => setShowMovieModal(true)}
      onDelete={handleDeleteMovie}
      showModal={showMovieModal}
      onCloseModal={() => setShowMovieModal(false)}
      newMovie={newMovie}
      setNewMovie={setNewMovie}
      posterFile={posterFile}
      setPosterFile={setPosterFile}
      onSubmit={handleAddMovie}
      Modal={Modal}
    />
  );

  const renderCinemas = () => (
    <CinemasTab
      cinemas={cinemas}
      onAddClick={() => setShowCinemaModal(true)}
      onDelete={handleDeleteCinema}
      showModal={showCinemaModal}
      onCloseModal={() => setShowCinemaModal(false)}
      newCinema={newCinema}
      setNewCinema={setNewCinema}
      onSubmit={handleAddCinema}
      Modal={Modal}
    />
  );

  const renderShows = () => (
    <ShowsTab
      shows={shows}
      movies={movies}
      screens={screens}
      onAddClick={() => setShowShowModal(true)}
      onCinemaChange={fetchScreensForCinema}
      showModal={showShowModal}
      onCloseModal={() => setShowShowModal(false)}
      newShow={newShow}
      setNewShow={setNewShow}
      onSubmit={handleAddShow}
      Modal={Modal}
    />
  );

  const renderBookings = () => <BookingsTab bookings={bookings} />;

  const renderCategories = () => (
    <CategoriesTab
      categories={categories}
      onAddClick={() => setShowCategoryModal(true)}
      onDelete={handleDeleteCategory}
    />
  );

  // Category Modal
  const renderCategoryModal = () => (
    <Modal
      isOpen={showCategoryModal}
      onClose={() => setShowCategoryModal(false)}
      title="Add New Category"
    >
      <form onSubmit={handleAddCategory} className="space-y-6 font-bold">
        <div className="relative">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-2.5 left-5 bg-[#121212] px-2 z-10">
            Category Name
          </label>
          <input
            type="text"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            required
            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f5c518]/50 text-sm"
          />
        </div>
        <div className="relative">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-2.5 left-5 bg-[#121212] px-2 z-10">
            Description
          </label>
          <textarea
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f5c518]/50 text-sm h-24 resize-none"
          />
        </div>
        <button
          type="submit"
          className="btn-fill-gold w-full py-5 uppercase tracking-widest text-[10px] font-black"
        >
          Add Category
        </button>
      </form>
    </Modal>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-heading">
      <Navbar />
      <div className="max-w-screen-2xl mx-auto px-12 pt-32">
        <header className="mb-12">
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-3">
            Admin <span className="text-[#f5c518]">Dashboard</span>
          </h1>
          <p className="text-gray-500 font-bold">
            Manage your cinema empire from here.
          </p>
        </header>

        <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
          <TabButton
            id="overview"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={BarChart3}
            label="Overview"
          />
          <TabButton
            id="movies"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={Film}
            label="Movies"
          />
          <TabButton
            id="cinemas"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={MapPin}
            label="Cinemas"
          />
          <TabButton
            id="shows"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={Calendar}
            label="Shows"
          />
          <TabButton
            id="bookings"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={Ticket}
            label="Bookings"
          />
          <TabButton
            id="categories"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={Film}
            label="Categories"
          />
        </div>

        <div>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "movies" && renderMovies()}
          {activeTab === "cinemas" && renderCinemas()}
          {activeTab === "shows" && renderShows()}
          {activeTab === "bookings" && renderBookings()}
          {activeTab === "categories" && renderCategories()}
        </div>
      </div>

      {renderCategoryModal()}
    </div>
  );
};

export default AdminDashboard;
