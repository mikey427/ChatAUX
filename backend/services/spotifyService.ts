import type { Request, Response } from "express";

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

export async function fetchUserPlaylists(accessToken: string) {}
