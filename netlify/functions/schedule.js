import { connectDB, Schedule } from "./db.js";

export default async (req, context) => {
  await connectDB();

  if (req.method === "GET") {
    const docs = await Schedule.find();
    const schedule = {};
    for (const d of docs) {
      schedule[d.day] = { open: d.open, desde: d.desde, hasta: d.hasta };
    }
    return Response.json(schedule);
  }

  if (req.method === "PUT") {
    const body = await req.json();
    for (const [day, val] of Object.entries(body)) {
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
    return Response.json(result);
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

export const config = { path: "/api/schedule" };
