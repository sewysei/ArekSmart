import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./connectDB.js";
import { registerUser } from "./handler/AUTH/register.js";
import { loginUSer } from "./handler/AUTH/login.js";
import { verifyToken } from "./verifyToken.js";
import { chatBot } from "./handler/CHATBOT/chatbot.js";
import { getChatHistory } from "./handler/CHATBOT/getHistory.js";
import { logoutUser } from "./handler/AUTH/logout.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
await connectDB();

app.get("/", (req, res) => {
  const message = "Welcome to Arek Smart";
  res.json({
    message,
  });
});

app.post("/auth/register", registerUser);

app.post("/auth/login", loginUSer);

app.post("/chat", verifyToken, chatBot);

app.get("/chat", verifyToken, getChatHistory);

app.post("/auth/logout", logoutUser);

export default app;
