import express from "express";
import dotenv from "dotenv";
import {
  register,
  login,
  getCurrentUser,
  logout,
  linkSpotifyAccount,
  unlinkSpotifyAccount,
} from "./controllers/authController.js";
import { authMiddleware } from "./middleware/auth.js";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createPlaylist } from "./controllers/playlistController.js";

console.log("Starting server...");

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  console.log("Root route accessed");
  res.send("Hello World!");
});

// Auth
app.get("/api/user", authMiddleware, getCurrentUser);
app.post("/api/login", login);
app.post("/api/register", register);
app.post("/api/logout", authMiddleware, logout);
app.post("/api/spotify/link", authMiddleware, linkSpotifyAccount);
app.post("/api/spotify/callback", authMiddleware, callbackSpotify);
app.post("/api/spotify/unlink", authMiddleware, unlinkSpotifyAccount);

// Playlists
app.post("/api/generate-playlist", authMiddleware, createPlaylist);

app.listen(port, () => {
  console.log(`ChatAUX app listening on port ${port}`);
});

console.log("Script finished executing");
