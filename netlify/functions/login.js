export default async (req, context) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { password } = await req.json();

  if (password === process.env.ADMIN_PASS) {
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Wrong password" }, { status: 401 });
};

export const config = { path: "/api/login" };
