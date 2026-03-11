import { connectDB, Product } from "./db.js";

export default async (req, context) => {
  await connectDB();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (req.method === "GET") {
    const products = await Product.find().sort({ order: 1, createdAt: -1 });
    return Response.json(products);
  }

  if (req.method === "DELETE" && id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ok: true });
  }

  const body = await req.json();

  if (req.method === "POST") {
    const product = await Product.create(body);
    return Response.json(product, { status: 201 });
  }

  if (req.method === "PUT" && id) {
    const product = await Product.findByIdAndUpdate(id, body, { returnDocument: "after" });
    if (!product) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(product);
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

export const config = { path: "/api/products" };
