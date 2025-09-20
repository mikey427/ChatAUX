import React, { useEffect } from "react";
import InputLabeled from "./ui/inputLabeled";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
type Props = {};

export default function Home({}: Props) {
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:3000/api/user", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        window.location.href = "/login";
      }
    }
    checkAuth();
  }, []);

  async function handleSignOut() {
    const res = await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Signed out", res);
    window.location.href = "/login";
  }
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Playlist Generator</h1>
          <p className="text-muted-foreground">Create the perfect playlist with AI-powered recommendations</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
      </div>

      {/* Main Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Playlist</CardTitle>
          <CardDescription>
            Customize every aspect of your playlist with advanced audio features and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Custom Instructions */}
          <div>
            <InputLabeled label="Custom Instructions (Optional)" placeholder="e.g., 'Something like Tame Impala but more upbeat for a road trip'" />
          </div>

          {/* Audio Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Audio Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <Label>Familiarity</Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Discovery</span>
                  <Slider className="flex-1" defaultValue={[50]} max={100} step={10} />
                  <span className="text-sm text-muted-foreground">Favorites</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Energy Level</Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Chill</span>
                  <Slider className="flex-1" defaultValue={[50]} max={100} step={10} />
                  <span className="text-sm text-muted-foreground">Hype</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tempo</Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Slow</span>
                  <Slider className="flex-1" defaultValue={[50]} max={100} step={10} />
                  <span className="text-sm text-muted-foreground">Fast</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Danceability</Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Ambient</span>
                  <Slider className="flex-1" defaultValue={[50]} max={100} step={10} />
                  <span className="text-sm text-muted-foreground">Danceable</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mood (Valence)</Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Melancholy</span>
                  <Slider className="flex-1" defaultValue={[50]} max={100} step={10} />
                  <span className="text-sm text-muted-foreground">Happy</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Acousticness</Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Electronic</span>
                  <Slider className="flex-1" defaultValue={[50]} max={100} step={10} />
                  <span className="text-sm text-muted-foreground">Acoustic</span>
                </div>
              </div>

            </div>
          </div>

          {/* Content Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Content Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="space-y-2">
                <Label>Playlist Length</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 songs</SelectItem>
                    <SelectItem value="30">30 songs</SelectItem>
                    <SelectItem value="50">50 songs</SelectItem>
                    <SelectItem value="1hr">1 hour</SelectItem>
                    <SelectItem value="2hr">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Era</Label>
                <Select defaultValue="any">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Era</SelectItem>
                    <SelectItem value="2020s">2020s</SelectItem>
                    <SelectItem value="2010s">2010s</SelectItem>
                    <SelectItem value="2000s">2000s</SelectItem>
                    <SelectItem value="90s">90s</SelectItem>
                    <SelectItem value="80s">80s</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Content Filter</Label>
                <Select defaultValue="allow">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allow">Allow Explicit</SelectItem>
                    <SelectItem value="clean">Clean Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>

          {/* Source Material */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Source Material</h3>
            <div className="space-y-4">

              <div>
                <Label className="text-base">Include from your music:</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="liked" defaultChecked />
                    <Label htmlFor="liked">Liked Songs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="discover" defaultChecked />
                    <Label htmlFor="discover">Discover Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="recent" />
                    <Label htmlFor="recent">Recently Played</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="top" />
                    <Label htmlFor="top">Top Artists</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Seed Artists</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">Tame Impala ×</Badge>
                  <Badge variant="secondary">Arctic Monkeys ×</Badge>
                  <Button variant="outline" size="sm">+ Add Artist</Button>
                </div>
              </div>

              <div>
                <Label>Genres</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">Indie Rock ×</Badge>
                  <Badge variant="secondary">Electronic ×</Badge>
                  <Button variant="outline" size="sm">+ Add Genre</Button>
                </div>
              </div>

            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-4">
            <Button size="lg" className="flex-1">Generate Playlist</Button>
            <Button variant="outline" size="lg">Save as Template</Button>
          </div>

        </CardContent>
      </Card>

      {/* Bottom Section - Your Music */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Playlists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-2 rounded hover:bg-accent cursor-pointer">🎵 Favorites</div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">🏃 Workout Mix</div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">🎯 Focus Flow</div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">🌙 Night Vibes</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mood Boards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-2 rounded hover:bg-accent cursor-pointer">😊 Happy & Upbeat</div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">😔 Melancholy</div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">🔥 High Energy</div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">🧘 Peaceful</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Discover</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-2 rounded hover:bg-accent cursor-pointer">📈 Trending Now</div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">🆕 New Releases</div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">💎 Hidden Gems</div>
              <div className="p-2 rounded hover:bg-accent cursor-pointer">🎲 Surprise Me</div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
