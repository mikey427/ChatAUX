import express from "express";
import { register, login } from "../controllers/userController.js";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/login", loginRoute);
app.post("/register", registerRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
