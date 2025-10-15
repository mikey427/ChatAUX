import React from "react";
import { Label } from "./ui/shadcn/label";
import { Button } from "./ui/shadcn/button";
import { useAuth } from "../providers/authProvider";

type Props = {};

export function Profile({}: Props) {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  async function linkSpotifyAccount() {
    // Redirect to the backend Spotify auth endpoint
    window.location.href = "http://localhost:3000/auth/spotify";
  }
  return (
    <div>
      <h1>Welcome {user?.email}!</h1>

      <Label>Link Spotify</Label>
      <Button onClick={linkSpotifyAccount}>Connect</Button>
    </div>
  );
}
