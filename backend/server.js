require("dotenv").config();
const path = require("path");
const fs = require("fs");

const cors = require("cors");
const express = require("express");
const passport = require("passport");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const moviesRoutes = require("./routes/movies.routes")
const commentsRoutes = require("./routes/comments.routes")
const streamRoutes = require("./routes/stream.routes")
const { cleanupUnwatchedMovies } = require("./services/cleanup.service");


const app = express();

fs.mkdirSync("uploads/avatars", { recursive: true });

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(passport.initialize());

app.use(
  "/uploads/avatars",
  express.static(path.join(__dirname, "uploads/avatars")),
);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/stream", streamRoutes);
app.use('/api/subtitles', require('./routes/subtitle.routes'));
app.use("/api", moviesRoutes);
app.use("/api", commentsRoutes);


console.log("✅ Stream routes registered");

connectDB().then(() => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  cleanupUnwatchedMovies().catch(err => console.log("❌ Cleanup error:", err.message));
  setInterval(() => {
    cleanupUnwatchedMovies().catch(err => console.log("❌ Cleanup error:", err.message));
  }, ONE_DAY_MS);
});

app.listen(3000, () => console.log("Server running on port 3000"));
