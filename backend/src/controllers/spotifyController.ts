import type { Request, Response } from "express";
import { prisma } from "../index.js";
import { verifyToken } from "../jwt.js";

export async function linkSpotifyAccount(req: Request, res: Response) {
  // Linking Spotify account
}

export async function unlinkSpotifyAccount(req: Request, res: Response) {
  // Unlinking Spotify account
}

export async function spotifyAuthCallback(req: Request, res: Response) {
  console.log("=== Spotify Callback Debug ===");
  console.log("req.cookies:", req.cookies);
  console.log("req.user:", req.user);
  console.log("req.headers.cookie:", req.headers.cookie);

  const { accessToken, refreshToken, expires_in, profile } = req.user as any;
  const token = req.cookies.token;
  if (!token) {
    console.log("No token found in cookies!");
    return res.redirect("http://localhost:5173/login?error=not_authenticated");
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid token" });
  }
  const userId = decoded.id;
  // Calculate expiration date
  const expiresAt = new Date(Date.now() + expires_in * 1000);
  try {
    await prisma.spotifyData.upsert({
      where: { userId: Number(userId) },
      update: {
        spotifyId: profile.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
        username: profile.username || profile.displayName,
      },
      create: {
        userId: Number(userId),
        spotifyId: profile.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
        username: profile.username || profile.displayName,
      },
    });

    res.redirect("http://localhost:5173/profile");
  } catch (error) {
    console.error("Error saving Spotify data:", error);
    res.redirect("http://localhost:5173/profile?error=spotify_link_failed");
  }
}
