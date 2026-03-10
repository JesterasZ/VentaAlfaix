import { connectDB, Message } from "./db.js";

export default async (req, context) => {
  await connectDB();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (req.method === "GET") {
    const messages = await Message.find().sort({ createdAt: -1 });
    return Response.json(messages);
  }

  const body = await req.json();

  if (req.method === "POST") {
    const message = await Message.create(body);
    return Response.json(message, { status: 201 });
  }

  if (req.method === "PUT" && id) {
    const message = await Message.findByIdAndUpdate(id, body, { returnDocument: "after" });
    if (!message) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(message);
  }

  if (req.method === "DELETE" && id) {
    const message = await Message.findByIdAndDelete(id);
    if (!message) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

export const config = { path: "/api/messages" };
