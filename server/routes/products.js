import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

router.get("/", async (_req, res) => {
  const products = await Product.find().sort({ order: 1, createdAt: -1 });
  res.json(products);
});

router.post("/", async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

router.put("/", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "Missing id" });
  const product = await Product.findByIdAndUpdate(id, req.body, { returnDocument: "after" });
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
});

router.delete("/", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "Missing id" });
  const product = await Product.findByIdAndDelete(id);
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

export default router;
