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

type SpotifyPaginatedResponse<T> = {
  href: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
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

// TODO: Refactor endpoint to use reusable Spotify API utilities
// Architecture plan:
// 1. Create makeSpotifyRequest() wrapper in services/ - handles rate limiting (429) with retry logic
// 2. Create fetchAllPaginatedItems() in services/ - uses wrapper to handle pagination via 'next' URLs
// 3. Keep token refresh logic in controller - controller catches 401, refreshes token via getValidSpotifyToken(), retries operation
// 4. This endpoint becomes: get token → call pagination helper → return results

// TODO: Implement backoff and retry logic
// Need to pass in the response type to ensure correct typing for different endpoints
async function makeSpotifyRequest<T>(url: string, token: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Spotify error: ${response.status}`);
  return (await response.json()) as T;
}

async function fetchAllPaginatedItems<T>(
  url: string,
  token: string
): Promise<T[]> {
  const items: T[] = [];
  let nextUrl: string | null = url;

  while (nextUrl) {
    const response: SpotifyPaginatedResponse<T> = await makeSpotifyRequest<
      SpotifyPaginatedResponse<T>
    >(nextUrl, token);
    items.push(...response.items);
    nextUrl = response.next;
  }

  return items;
}
