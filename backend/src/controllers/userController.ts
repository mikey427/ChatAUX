import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../jwt.js";

const saltRounds = 12;
const prisma = new PrismaClient();

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (email == "" || email == null || password == "" || password == null) {
    res.status(401).json({ error: "Invalid email or password" });
  }
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  const isValidUser = user !== null;
  const isValidPassword = user
    ? await bcrypt.compare(password, user.password)
    : false;

  if (isValidUser && isValidPassword) {
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }

  //   const user = await getUser(username)
}
export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  // hash password
  bcrypt.hash(
    password,
    saltRounds,
    async (err: Error | null, hash: string | undefined) => {
      if (err) {
        // Handle error
        console.error("Error hashing password:", err);
        res.status(500).send("Internal server error");
        return;
      }

      // Hashing successful, 'hash' contains the hashed password
      console.log("Hashed password:", hash);

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user) {
        // User already exists
        console.log("User already exists:", user);
        res.status(409).send("User already exists");
        return;
      }

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hash || "",
        },
      });

      const jwt = await generateToken(newUser.email);
      console.log("Generated JWT:", jwt);

      res.status(201).json({
        success: true,
        data: {
          userId: newUser.id,
          email: newUser.email,
          token: jwt,
        },
      });
    }
  );
}
