import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import productsRouter from "./routes/products.js";
import galleryRouter from "./routes/gallery.js";
import messagesRouter from "./routes/messages.js";
import scheduleRouter from "./routes/schedule.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/products", productsRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/schedule", scheduleRouter);

// Auth check (simple)
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASS) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: "Wrong password" });
  }
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
