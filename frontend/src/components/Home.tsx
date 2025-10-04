import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import GenForm from "./ui/GenForm";
import { useAuth } from "../providers/authProvider";
import { Link } from "wouter";

type Props = {};

export default function Home({}: Props) {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  async function handleSignOut() {
    await logout();
    window.location.href = "/login";
  }
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Playlist Generator</h1>
          <p className="text-muted-foreground">
            Create the perfect playlist with AI-powered recommendations
          </p>
        </div>
        <Link to="/profile">
          <Button variant="outline">Profile</Button>
        </Link>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
      <GenForm />

      {/* Bottom Section - Your Music */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Playlists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-2 rounded hover:bg-accent cursor-pointer">
                🎵 Favorites
              </div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">
                🏃 Workout Mix
              </div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">
                🎯 Focus Flow
              </div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">
                🌙 Night Vibes
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mood Boards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-2 rounded hover:bg-accent cursor-pointer">
                😊 Happy & Upbeat
              </div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">
                😔 Melancholy
              </div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">
                🔥 High Energy
              </div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">
                🧘 Peaceful
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Discover</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-2 rounded hover:bg-accent cursor-pointer">
                📈 Trending Now
              </div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">
                🆕 New Releases
              </div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">
                💎 Hidden Gems
              </div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">
                🎲 Surprise Me
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
