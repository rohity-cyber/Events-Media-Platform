const Event = require("../models/Event");
const Media = require("../models/Media");
const User = require("../models/User");

exports.searchEvents = async (req, res) => {
  try {

    const keyword =
      req.query.keyword || "";

    const events =
      await Event.find({
        name: {
          $regex: keyword,
          $options: "i"
        }
      });

    res.json(events);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.searchMediaByTags = async (req, res) => {

  try {

    const keyword =
      req.query.keyword || "";

    const media =
      await Media.find({
        tags: {
          $regex: keyword,
          $options: "i"
        }
      })
      .populate("uploader", "name")
      .populate("event", "name");

    res.json(media);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.searchMediaByDate = async (req, res) => {

  try {

    const date =
      req.query.date;

    const media =
      await Media.find({
        createdAt: {
          $gte: new Date(date),
          $lte: new Date(
            new Date(date)
            .setHours(
              23,59,59,999
            )
          )
        }
      });

    res.json(media);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.searchMediaByUser = async (req, res) => {

  try {

    const username =
      req.query.username || "";

    const users =
      await User.find({
        name: {
          $regex: username,
          $options: "i"
        }
      });

    const userIds =
      users.map(
        user => user._id
      );

    const media =
      await Media.find({
        uploader: {
          $in: userIds
        }
      })
      .populate("uploader", "name")
      .populate("event", "name");

    res.json(media);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};