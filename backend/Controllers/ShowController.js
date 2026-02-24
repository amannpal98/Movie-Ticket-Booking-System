const Show = require("../Models/Show");

exports.getShows = async (req, res) => {
  try {
    const { movieId, cinemaId } = req.query;
    let query = {};
    if (movieId) query.movie = movieId;
    if (cinemaId) query.cinema = cinemaId; // Note: Screen has cinema ref, but Show schema has screen ref. Might need populate or screen filter.

    const shows = await Show.find(query)
      .populate("movie")
      .populate({
        path: "screen",
        populate: { path: "cinema" },
      });
    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate("movie")
      .populate({
        path: "screen",
        populate: { path: "cinema" },
      });
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addShow = async (req, res) => {
  try {
    const show = new Show(req.body);
    await show.save();
    res.status(201).json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteShow = async (req, res) => {
  try {
    await Show.findByIdAndDelete(req.params.id);
    res.json({ message: "Show deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
