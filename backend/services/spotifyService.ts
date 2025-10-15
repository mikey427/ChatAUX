import type { Request, Response } from "express";
import type {
  SpotifyTokenResponse,
  SpotifyPaginatedResponse,
  SpotifyLikedTracksResponse,
} from "types/spotify.js";

export async function initialSpotifyUserDataSync() {}

export async function reSyncSpotifyUserData(accessToken: string) {}

export async function fetchUserLikedTracks(accessToken: string) {
  console.log("accessToken: ", accessToken);
  const response = await fetch("https://api.spotify.com/v1/me/tracks", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  console.log("data: ", data);
  return data;
}

export async function fetchUserRecentlyPlayed(accessToken: string) {}

// Architecture plan:
// 1. Create makeSpotifyRequest() wrapper in services/ - handles rate limiting (429) with retry logic
// 2. Create fetchAllPaginatedItems() in services/ - uses wrapper to handle pagination via 'next' URLs
// 3. Keep token refresh logic in controller - controller catches 401, refreshes token via getValidSpotifyToken(), retries operation
// 4. This endpoint becomes: get token → call pagination helper → return results

// TODO: Implement backoff and retry logic
// Need to pass in the response type to ensure correct typing for different endpoints
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
        setTimeout(() => {
          return makeSpotifyRequest(url, token);
        }, retryAfter * 1000);
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
