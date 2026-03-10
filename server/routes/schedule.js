import { Router } from "express";
import Schedule from "../models/Schedule.js";

const router = Router();

// GET schedule (returns object keyed by day)
router.get("/", async (_req, res) => {
  const docs = await Schedule.find();
  const schedule = {};
  for (const d of docs) {
    schedule[d.day] = { open: d.open, desde: d.desde, hasta: d.hasta };
  }
  res.json(schedule);
});

// PUT update entire schedule (receives object keyed by day)
router.put("/", async (req, res) => {
  const schedule = req.body;
  for (const [day, val] of Object.entries(schedule)) {
    await Schedule.findOneAndUpdate(
      { day },
      { day, open: val.open, desde: val.desde, hasta: val.hasta },
      { upsert: true, returnDocument: "after" }
    );
  }
  const docs = await Schedule.find();
  const result = {};
  for (const d of docs) {
    result[d.day] = { open: d.open, desde: d.desde, hasta: d.hasta };
  }
  res.json(result);
});

export default router;
