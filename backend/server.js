require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const http = require("http");
const { Server } = require("socket.io");

const connectDB =
require("./src/config/db");

const socketHandler =
require("./src/sockets/socket");

const authRoutes =
require("./src/routes/authRoutes");

const userRoutes =
require("./src/routes/userRoutes");

const eventRoutes =
require("./src/routes/eventRoutes");

const mediaRoutes =
require("./src/routes/mediaRoutes");

const commentRoutes =
require("./src/routes/commentRoutes");

const likeRoutes =
require("./src/routes/likeRoutes");

const favouriteRoutes =
require("./src/routes/favouriteRoutes");

const albumRoutes =
require("./src/routes/albumRoutes");

const searchRoutes =
require("./src/routes/searchRoutes");

const notificationRoutes =
require("./src/routes/notificationRoutes");

const downloadRoutes =
require("./src/routes/downloadRoutes");

const shareRoutes =
require("./src/routes/shareRoutes");

const facialRoutes =
require("./src/routes/facialRoutes");

const activityRoutes =
require("./src/routes/activityRoutes");

const adminRoutes =
require("./src/routes/adminRoutes");

const dashboardRoutes =
require("./src/routes/dashboardRoutes");

const moderationRoutes =
require("./src/routes/moderationRoutes");

connectDB();

const app = express();

const server =
http.createServer(app);

const io =
new Server(
  server,
  {
    cors:{
      origin:"*"
    }
  }
);

socketHandler(io);

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(compression());

app.use(
  "/uploads",
  express.static("uploads")
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/events",
  eventRoutes
);

app.use(
  "/api/media",
  mediaRoutes
);

app.use(
  "/api/comments",
  commentRoutes
);

app.use(
  "/api/likes",
  likeRoutes
);

app.use(
  "/api/favourites",
  favouriteRoutes
);

app.use(
  "/api/albums",
  albumRoutes
);

app.use(
  "/api/search",
  searchRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/download",
  downloadRoutes
);

app.use(
  "/api/share",
  shareRoutes
);

app.use(
  "/api/facial",
  facialRoutes
);

app.use(
  "/api/activities",
  activityRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/moderation",
  moderationRoutes
);

app.get(
  "/",
  (req,res)=>{

    res.send(
      "Event Media Platform API Running"
    );

  }
);

const PORT =
process.env.PORT || 5000;

server.listen(
  PORT,
  ()=>{

    console.log(
      `Server running on port ${PORT}`
    );

  }
);