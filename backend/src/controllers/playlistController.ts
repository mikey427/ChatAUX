type CreatePlaylistReq = {
  userId: number;
  name: string;
  description?: string;
  isPublic?: boolean;
  customInstructions?: string;
  audioFeatures?: AudioFeatures;
  playlistLength?: number;
  era?: string;
  contentFilter?: boolean;
};

type AudioFeatures = {
  familiarity: string;
  energyLevel: string;
  tempo: string;
  danceability: string;
  mood: string;
  acousticness: string;
};

async function createPlaylist(req: Request, res: Response) {
  try {
  } catch (error) {}
}
