import mongoose from "mongoose";
const { Schema } = mongoose;

const chatHistorySchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  messages: [
    {
      role: { type: String, enum: ["user", "bot"], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);
