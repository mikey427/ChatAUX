import express from "express";
import dotenv from "dotenv";
import {
  register,
  login,
  getCurrentUser,
} from "./controllers/userController.js";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

console.log("Starting server...");

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  console.log("Root route accessed");
  res.send("Hello World!");
});

app.get("/api/user", getCurrentUser);
app.post("/api/login", login);
app.post("/api/register", register);

app.listen(port, () => {
  console.log(`ChatAUX app listening on port ${port}`);
});

console.log("Script finished executing");
