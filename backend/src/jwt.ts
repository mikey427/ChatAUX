import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  email: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return secret;
}

export function generateToken(user: { id: string; email: string }): string {
  try {
    const token = jwt.sign(
      { id: user.id, email: user.email },
      getJwtSecret(),
      {
        expiresIn: "2h",
      }
    );
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token");
  }
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
