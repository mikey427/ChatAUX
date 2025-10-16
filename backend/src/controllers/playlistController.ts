import type { Request, Response } from "express";
import { prisma } from "index.js";
import { getValidSpotifyToken } from "@utils/spotify.js";
import { fetchUserLikedTracks } from "../../services/spotifyService.js";
import type { SpotifyLikedTrackItem } from "types/spotify.js";

type CreatePlaylistReq = {
  userId: number;
  customInstructions: string;
  audioFeatures: AudioFeatures;
  playlistLength: string;
  era: string;
  contentFilter: string;
  sources: Sources;
  artists: string[];
  genres: string[];
};

type AudioFeatures = {
  familiarity: number;
  energyLevel: number;
  tempo: number;
  danceability: number;
  mood: number;
  acousticness: number;
};

type Sources = {
  liked: boolean;
  discover: boolean;
  recent: boolean;
  top: boolean;
};

export async function createPlaylist(req: Request, res: Response) {
  try {
    const body: CreatePlaylistReq = req.body;

    // create playlist logic

    // Start pulling suspect tracks based on user input
    console.log("Creating playlist with the following data:", body);

    const user = await prisma.user.findUnique({
      where: { id: body.userId },
      include: {
        spotifyData: {
          select: {
            id: true,
            spotifyId: true,
            username: true,
            expiresAt: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
          },
        },
      },
    });

    const userAccessToken = await getValidSpotifyToken(body.userId);

    if (body.sources.liked) {
      const userLikedTracks = await getUserLikedTracks(userAccessToken);
    }

    res.status(201).json({ message: "Playlist created successfully" });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function testEndpoint(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user || !user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const accessToken = await getValidSpotifyToken(Number(user?.id));
  const tracks = await fetchUserLikedTracks(accessToken);
  const cleanedUpTracks = tracks.map((item) => ({
    id: item.track.id,
    name: item.track.name,
    artists: item.track.artists.map((a) => ({ id: a.id, name: a.name })),
    album: { id: item.track.album.id, name: item.track.album.name },
    added_at: item.added_at,
    duration_ms: item.track.duration_ms,
  }));
  res.json(cleanedUpTracks);
  return cleanedUpTracks;
}
