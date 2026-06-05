const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email");

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(
      req.params.id
    ).populate(
      "createdBy",
      "name email"
    );

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event =
      await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(event);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {

    await Event.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Event deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};