import { prisma } from "index.js";
import type { Request, Response } from "express";
import type {
  SpotifyTokenResponse,
  SpotifyPaginatedResponse,
  SpotifyLikedTracksResponse,
} from "types/spotify.js";

export function calculateSpotifyTokenExpiry(expiresInSeconds: number): Date {
  return new Date(Date.now() + expiresInSeconds * 1000);
}

export async function getValidSpotifyToken(userId: number): Promise<string> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      spotifyData: {
        select: {
          accessToken: true,
          refreshToken: true,
          expiresAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (
    user?.spotifyData?.expiresAt == undefined ||
    user?.spotifyData?.expiresAt == null
  ) {
    throw new Error("Missing Spotify token data");
  }
  const expired = user.spotifyData.expiresAt < new Date();
  if (!expired) {
    if (!user.spotifyData?.accessToken) {
      throw new Error("Missing Spotify access token");
    }
    return user.spotifyData.accessToken;
  }

  if (!process.env.SPOTIFY_CLIENT_SECRET) {
    throw new Error("Spotify Client Secret missing from .env");
  }
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: user.spotifyData.refreshToken,
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.status}`);
  }
  const data = (await response.json()) as SpotifyTokenResponse;
  const newSpotifyData = {
    accessToken: data.access_token,
    expiresAt: calculateSpotifyTokenExpiry(data.expires_in),
    ...(data.refresh_token && { refreshToken: data.refresh_token }),
  };

  const userWithUpdateSpotifyData = await prisma.spotifyData.update({
    where: { userId: userId },
    data: {
      accessToken: newSpotifyData.accessToken,
      expiresAt: newSpotifyData.expiresAt,
      ...(newSpotifyData.refreshToken && {
        refreshToken: newSpotifyData.refreshToken,
      }),
    },
  });

  // 4. Return valid access tokens
  return data.access_token;
}

export async function testEndpoint(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user || !user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // TODO: Implement pagination and move to dedicated function
  const accessToken = await getValidSpotifyToken(Number(user?.id));
  console.log("accessToken: ", accessToken);
  let likedTracks = [];
  const limit = 50;
  const response = await fetch(
    `https://api.spotify.com/v1/me/tracks?limit=${limit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.json();
    console.log("Spotify API Error:", errorBody);
    throw new Error(`Failed to fetch liked tracks: ${response.status}`);
  }

  const data = (await response.json()) as SpotifyLikedTracksResponse;
  likedTracks.push(data.items);

  console.log("data: ", data);
  res.json(data.items);
  return data.items;
}
