import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

interface User {
  id: string;
  email: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Check for token in Authorization header
  const authHeader = req.headers.authorization;
  // Check for token in cookies (since you set it as a cookie in controllers)
  const cookieToken = req.cookies?.token;

  let token = null;

  if (authHeader) {
    token = authHeader.split(" ")[1]; // Bearer TOKEN format
  } else if (cookieToken) {
    token = cookieToken;
  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }

    (req as any).user = user;

    next();
  });
}
