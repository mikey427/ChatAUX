import jwt from "jsonwebtoken";

export function generateToken(user: { id: string; email: string }) {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "2h",
    }
  );
  return token;
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
