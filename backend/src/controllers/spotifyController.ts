import type { Request, Response } from "express";
import { prisma } from "../index.js";
import { calculateSpotifyTokenExpiry } from "@utils/spotify.js";

export async function linkSpotifyAccount(req: Request, res: Response) {
  // Linking Spotify account
}

export async function unlinkSpotifyAccount(req: Request, res: Response) {
  // Unlinking Spotify account
}

export async function spotifyAuthCallback(req: Request, res: Response) {
  const { accessToken, refreshToken, expires_in, profile } = req.user as any;

  // Decode userId from OAuth state parameter
  const encodedState = req.query.state as string;
  if (!encodedState) {
    console.error("No state parameter in OAuth callback");
    return res.redirect("http://localhost:5173/login?error=no_state");
  }

  const decodedState = JSON.parse(
    Buffer.from(encodedState, "base64").toString()
  );
  const userId = decodedState.userId;

  if (!userId) {
    console.error("No userId found in decoded state");
    return res.redirect("http://localhost:5173/login?error=not_authenticated");
  }

  const expiresAt = calculateSpotifyTokenExpiry(expires_in);
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
