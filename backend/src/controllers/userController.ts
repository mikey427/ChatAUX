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
    return;
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    const isValidUser = user !== null;
    const isValidPassword = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (isValidUser && isValidPassword) {
      const jwt = await generateToken({
        id: String(user.id),
        email: user.email,
      });
      res.cookie("token", jwt, {
        maxAge: 900000,
        httpOnly: false, // TODO: Update this to true for prod
        secure: true,
      });
      res
        .status(200)
        .json({ success: true, user: { id: user.id, email: user.email } });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }

  //   const user = await getUser(username)
}
export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  if (email == "" || email == null || password == "" || password == null) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  try {
    const hash = await bcrypt.hash(password, saltRounds);
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

    const jwt = generateToken({
      id: String(newUser.id),
      email: newUser.email,
    });
    res.cookie("token", jwt, {
      maxAge: 900000,
      httpOnly: false, // TODO: Update this to true for prod
      secure: true,
    });
    res.status(201).json({
      success: true,
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
