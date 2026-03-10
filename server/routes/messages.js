import { Router } from "express";
import Message from "../models/Message.js";

const router = Router();

router.get("/", async (_req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
});

router.post("/", async (req, res) => {
  const message = await Message.create(req.body);
  res.status(201).json(message);
});

router.put("/", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "Missing id" });
  const message = await Message.findByIdAndUpdate(id, req.body, { returnDocument: "after" });
  if (!message) return res.status(404).json({ error: "Not found" });
  res.json(message);
});

router.delete("/", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "Missing id" });
  const message = await Message.findByIdAndDelete(id);
  if (!message) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

export default router;
