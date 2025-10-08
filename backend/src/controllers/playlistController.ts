import type { Request, Response } from "express";
import { prisma } from "index.js";
import { getValidSpotifyToken } from "@utils/spotify.js";

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

type SpotifyLikedTracksResponse = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: Array<{
    added_at: string;
    track: {
      album: {
        album_type: string;
        total_tracks: number;
        available_markets: string[];
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        images: Array<{
          url: string;
          height: number;
          width: number;
        }>;
        name: string;
        release_date: string;
        release_date_precision: string;
        restrictions?: {
          reason: string;
        };
        type: string;
        uri: string;
        artists: Array<{
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          name: string;
          type: string;
          uri: string;
        }>;
      };
      artists: Array<{
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }>;
      available_markets: string[];
      disc_number: number;
      duration_ms: number;
      explicit: boolean;
      external_ids: {
        isrc?: string;
        ean?: string;
        upc?: string;
      };
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      is_playable?: boolean;
      linked_from?: object;
      restrictions?: {
        reason: string;
      };
      name: string;
      popularity: number;
      preview_url: string | null;
      track_number: number;
      type: string;
      uri: string;
      is_local: boolean;
    };
  }>;
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

  // TODO: Implement pagination and move to dedicated function
  const accessToken = await getValidSpotifyToken(Number(user?.id));
  console.log("accessToken: ", accessToken);
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

  console.log("data: ", data);
  res.json(data.items);
  return data.items;
}
