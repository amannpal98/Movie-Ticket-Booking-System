const Movie = require("../Models/Movie");

exports.getMovies = async (req, res) => {
  try {
    const { genre, category, search } = req.query;
    let query = {};
    // Support both 'genre' and 'category' parameters
    if (category) query.category = category;
    else if (genre) query.category = genre;

    if (search) query.title = { $regex: search, $options: "i" };

    const movies = await Movie.find(query).populate("category");
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate("category");
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMovie = async (req, res) => {
  try {
    const movieData = { ...req.body };
    if (req.file) {
      movieData.posterUrl = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
    }

    const movie = new Movie(movieData);
    await movie.save();
    const populatedMovie = await Movie.findById(movie._id).populate("category");
    res.status(201).json(populatedMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movieData = { ...req.body };
    if (req.file) {
      movieData.posterUrl = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, movieData, {
      new: true,
    }).populate("category");
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
