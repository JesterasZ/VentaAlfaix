import { Router } from "express";
import Gallery from "../models/Gallery.js";

const router = Router();

router.get("/", async (_req, res) => {
  const images = await Gallery.find().sort({ order: 1, createdAt: -1 });
  res.json(images);
});

router.post("/", async (req, res) => {
  const image = await Gallery.create(req.body);
  res.status(201).json(image);
});

router.put("/", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "Missing id" });
  const image = await Gallery.findByIdAndUpdate(id, req.body, { returnDocument: "after" });
  if (!image) return res.status(404).json({ error: "Not found" });
  res.json(image);
});

router.delete("/", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "Missing id" });
  const image = await Gallery.findByIdAndDelete(id);
  if (!image) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

export default router;
