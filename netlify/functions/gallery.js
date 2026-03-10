import { connectDB, Gallery } from "./db.js";

export default async (req, context) => {
  await connectDB();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (req.method === "GET") {
    const images = await Gallery.find().sort({ order: 1, createdAt: -1 });
    return Response.json(images);
  }

  const body = await req.json();

  if (req.method === "POST") {
    const image = await Gallery.create(body);
    return Response.json(image, { status: 201 });
  }

  if (req.method === "PUT" && id) {
    const image = await Gallery.findByIdAndUpdate(id, body, { returnDocument: "after" });
    if (!image) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(image);
  }

  if (req.method === "DELETE" && id) {
    const image = await Gallery.findByIdAndDelete(id);
    if (!image) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

export const config = { path: "/api/gallery" };
