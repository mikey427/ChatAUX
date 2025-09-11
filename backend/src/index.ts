import express from "express";
import { register, login } from "./controllers/userController.js";

const app = express();
app.use(express.json());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/login", login);
app.post("/register", register);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
