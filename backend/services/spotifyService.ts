import type { Request, Response } from "express";
import type {
  SpotifyTokenResponse,
  SpotifyPaginatedResponse,
  SpotifyLikedTrackItem,
} from "types/spotify.js";

export async function initialSpotifyUserDataSync() {}

export async function reSyncSpotifyUserData(accessToken: string) {}

export async function fetchUserLikedTracks(accessToken: string): Promise<SpotifyLikedTrackItem[]> {
  console.log("accessToken: ", accessToken);
  const limit = 50;
  const url = `https://api.spotify.com/v1/me/tracks?limit=${limit}`;

  const data = await fetchAllPaginatedItems<SpotifyLikedTrackItem>(
    url,
    accessToken
  );
  return data;
}

export async function fetchUserRecentlyPlayed(accessToken: string) {}

export async function makeSpotifyRequest<T>(
  url: string,
  token: string
): Promise<T> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    switch (response.status) {
      // Rate Limiting
      case 429:
        const retryAfter = parseInt(
          response.headers.get("Retry-After") || "2",
          10
        );
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        return makeSpotifyRequest(url, token);
      case 401:
        throw new Error("Spotify's Complaint: Token expired");
      default:
        throw new Error(`Spotify status: ${response.status}`);
    }
  }

  return (await response.json()) as T;
}

export async function fetchAllPaginatedItems<T>(
  url: string,
  token: string
): Promise<T[]> {
  const items: T[] = [];
  let nextUrl: string | null = url;
  let count = 0;
  while (nextUrl) {
    if (count >= 100) {
      throw new Error("Pagination limit exceeded (100 pages)");
    }
    const response: SpotifyPaginatedResponse<T> = await makeSpotifyRequest<
      SpotifyPaginatedResponse<T>
    >(nextUrl, token);
    count++;
    items.push(...response.items);
    nextUrl = response.next;
  }

  return items;
}
