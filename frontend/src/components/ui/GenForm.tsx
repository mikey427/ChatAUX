import React, { useEffect, useState } from "react";
import InputLabeled from "./inputLabeled";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {};

export default function GenForm({}: Props) {
  const [formData, setFormData] = useState({
    customInstructions: "",
    audioFeatures: {
      familiarity: 50,
      energyLevel: 50,
      tempo: 50,
      danceability: 50,
      mood: 50,
      acousticness: 50,
    },
    playlistLength: "30",
    era: "any",
    contentFilter: "allow",
    sources: {
      liked: true,
      discover: true,
      recent: false,
      top: false,
    },
  });

  const updateFormData = (path: string, value: any) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const result = { ...prev };
      let current: any = result;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return result;
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted", formData);
  }

  return (
    <div>
      {/* Main Generator Form */}
      <form className="w-full" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Generate New Playlist</CardTitle>
            <CardDescription>
              Customize every aspect of your playlist with advanced audio
              features and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Custom Instructions */}
            <div>
              <InputLabeled
                label="Custom Instructions (Optional)"
                placeholder="e.g., 'Something like Tame Impala but more upbeat for a road trip'"
                value={formData.customInstructions}
                onChange={(e) =>
                  updateFormData("customInstructions", e.target.value)
                }
              />
            </div>

            {/* Audio Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Audio Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Familiarity</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Discovery
                    </span>
                    <Slider
                      className="flex-1"
                      value={[formData.audioFeatures.familiarity]}
                      onValueChange={([value]) =>
                        updateFormData("audioFeatures.familiarity", value)
                      }
                      max={100}
                      step={10}
                    />
                    <span className="text-sm text-muted-foreground">
                      Favorites
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Energy Level</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Chill</span>
                    <Slider
                      className="flex-1"
                      value={[formData.audioFeatures.energyLevel]}
                      onValueChange={([value]) =>
                        updateFormData("audioFeatures.energyLevel", value)
                      }
                      max={100}
                      step={10}
                    />
                    <span className="text-sm text-muted-foreground">Hype</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tempo</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Slow</span>
                    <Slider
                      className="flex-1"
                      value={[formData.audioFeatures.tempo]}
                      onValueChange={([value]) =>
                        updateFormData("audioFeatures.tempo", value)
                      }
                      max={100}
                      step={10}
                    />
                    <span className="text-sm text-muted-foreground">Fast</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Danceability</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Ambient
                    </span>
                    <Slider
                      className="flex-1"
                      value={[formData.audioFeatures.danceability]}
                      onValueChange={([value]) =>
                        updateFormData("audioFeatures.danceability", value)
                      }
                      max={100}
                      step={10}
                    />
                    <span className="text-sm text-muted-foreground">
                      Danceable
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Mood (Valence)</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Melancholy
                    </span>
                    <Slider
                      className="flex-1"
                      value={[formData.audioFeatures.mood]}
                      onValueChange={([value]) =>
                        updateFormData("audioFeatures.mood", value)
                      }
                      max={100}
                      step={10}
                    />
                    <span className="text-sm text-muted-foreground">Happy</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Acousticness</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Electronic
                    </span>
                    <Slider
                      className="flex-1"
                      value={[formData.audioFeatures.acousticness]}
                      onValueChange={([value]) =>
                        updateFormData("audioFeatures.acousticness", value)
                      }
                      max={100}
                      step={10}
                    />
                    <span className="text-sm text-muted-foreground">
                      Acoustic
                    </span>
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
                  <Select
                    value={formData.playlistLength}
                    onValueChange={(value) =>
                      updateFormData("playlistLength", value)
                    }
                  >
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
                  <Select
                    value={formData.era}
                    onValueChange={(value) => updateFormData("era", value)}
                  >
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
                  <Select
                    value={formData.contentFilter}
                    onValueChange={(value) =>
                      updateFormData("contentFilter", value)
                    }
                  >
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
                      <Checkbox
                        id="liked"
                        checked={formData.sources.liked}
                        onCheckedChange={(checked) =>
                          updateFormData("sources.liked", checked)
                        }
                      />
                      <Label htmlFor="liked">Liked Songs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="discover"
                        checked={formData.sources.discover}
                        onCheckedChange={(checked) =>
                          updateFormData("sources.discover", checked)
                        }
                      />
                      <Label htmlFor="discover">Discover Weekly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="recent"
                        checked={formData.sources.recent}
                        onCheckedChange={(checked) =>
                          updateFormData("sources.recent", checked)
                        }
                      />
                      <Label htmlFor="recent">Recently Played</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="top"
                        checked={formData.sources.top}
                        onCheckedChange={(checked) =>
                          updateFormData("sources.top", checked)
                        }
                      />
                      <Label htmlFor="top">Top Artists</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Seed Artists</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">Tame Impala ×</Badge>
                    <Badge variant="secondary">Arctic Monkeys ×</Badge>
                    <Button variant="outline" size="sm">
                      + Add Artist
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Genres</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">Indie Rock ×</Badge>
                    <Badge variant="secondary">Electronic ×</Badge>
                    <Button variant="outline" size="sm">
                      + Add Genre
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex gap-4">
              <Button size="lg" className="flex-1" type="submit">
                Generate Playlist
              </Button>
              <Button variant="outline" size="lg">
                Save as Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
