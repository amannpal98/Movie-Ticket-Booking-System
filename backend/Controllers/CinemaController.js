const Cinema = require("../Models/Cinema");
const Screen = require("../Models/Screen");

exports.getCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.find();
    res.json(cinemas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addCinema = async (req, res) => {
  try {
    const cinema = new Cinema(req.body);
    await cinema.save();
    res.status(201).json(cinema);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(cinema);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCinema = async (req, res) => {
  try {
    const cinemaId = req.params.id;
    // Also delete associated screens and shows
    await Screen.deleteMany({ cinema: cinemaId });
    await Cinema.findByIdAndDelete(cinemaId);
    res.json({ message: "Cinema and its dependencies deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
