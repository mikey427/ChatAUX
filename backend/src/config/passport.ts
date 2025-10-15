import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";
import { prisma } from "../index.js";
import type { Profile } from "passport-spotify";

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  throw new Error("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set");
}

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/spotify/callback",
    },
    async function (
      accessToken: string,
      refreshToken: string,
      expires_in: number,
      profile: Profile,
      done: any
    ) {
      try {
        return done(null, {
          profile,
          accessToken,
          refreshToken,
          expires_in,
        });
      } catch (error) {
        console.error("Error in Spotify OAuth strategy:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.profile.username);
});

passport.deserializeUser(async (username: string, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: { spotifyData: { username: username } },
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

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    console.error("Error deserializing user:", error);
    done(error, null);
  }
});
