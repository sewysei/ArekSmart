import { GoogleGenAI } from "@google/genai";
import { ChatHistory } from "../../models/chatbotModel.js";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const chatBot = async (req, res) => {
  try {
    const userId = req.userId;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message diperlukan." });
    }

    // Ambil atau buat history dari MongoDB
    let chatDoc = await ChatHistory.findOne({ userId });
    if (!chatDoc) {
      chatDoc = new ChatHistory({ userId, messages: [] });
    }

    const systemPrompt = {
      role: "user",
      parts: [
        {
          text: `Kamu adalah asisten Kota Surabaya. Jawablah hanya pertanyaan mengenai Kota Surabaya . 
          Jika pertanyaan di luar topik, tolak secara sopan. Jangan gunakan tanda cetak tebal, bintang, 
          atau frasa pembuka seperti "Tentu" atau "Berikut adalah".
          Jangan tanda kutip tiga. Jawaban tidak lebih dari 300 kata. Jika jawaban dalam bentuk list, berikan penanda.`,
        },
      ],
    };

    // Siapkan history untuk dikirim ke Gemini
    const historyForGemini = chatDoc.messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const contents = [
      systemPrompt,
      ...historyForGemini,
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    // Tambahkan pesan baru dari user ke history yang akan dikirim
    historyForGemini.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Kirim ke Gemini
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: contents,
    });

    const candidates = result?.candidates;
    const reply = candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({ error: "Tidak ada respons dari Gemini." });
    }

    // Simpan percakapan ke database
    chatDoc.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });
    chatDoc.messages.push({
      role: "bot",
      content: reply,
      timestamp: new Date(),
    });

    if (chatDoc.messages.length > 50) {
      chatDoc.messages = chatDoc.messages.slice(-50); // Simpan maksimal 50 pesan
    }

    await chatDoc.save();

    res.status(200).json({
      status: "Success",
      reply: reply,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: "Failed", message: `Catch error: ${err.message}` });
  }
};
