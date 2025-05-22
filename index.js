import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./connectDB.js";
import { registerUser } from "./handler/AUTH/register.js";
import { loginUSer } from "./handler/AUTH/login.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
connectDB();

app.get("/", (req, res) => {
  const message = "Welcome to Arek Smart";
  res.json({
    message,
  });
});

app.post("/auth/register", registerUser);

app.post("/auth/login", loginUSer);

export default app;
