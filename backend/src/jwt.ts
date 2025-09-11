import jwt from "jsonwebtoken";

export async function generateToken(userEmail: string) {
  const token = jwt.sign(
    { email: userEmail },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "2h",
    }
  );
  return token;
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
