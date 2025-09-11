import express from "express";
import { register, login } from "./controllers/userController.js";

console.log("Starting server...");

const app = express();
app.use(express.json());
const port = 3000;

app.get("/", (req, res) => {
  console.log("Root route accessed");
  res.send("Hello World!");
});

app.post("/login", login);
app.post("/register", register);

app.listen(port, () => {
  console.log(`ChatAUX app listening on port ${port}`);
});

console.log("Script finished executing");
