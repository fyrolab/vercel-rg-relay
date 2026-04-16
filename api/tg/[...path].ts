import type { VercelRequest, VercelResponse } from "@vercel/node";

const TG_API = "https://api.telegram.org";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const pathSegments = req.query.path;
  if (!pathSegments || !Array.isArray(pathSegments)) {
    return res.status(400).json({ error: "Missing path" });
  }

  const tgPath = pathSegments.join("/");

  // Preserve original query string (minus the catch-all path param)
  const url = new URL(`${TG_API}/${tgPath}`);
  for (const [key, value] of Object.entries(req.query)) {
    if (key !== "path" && typeof value === "string") {
      url.searchParams.set(key, value);
    }
  }

  const headers: Record<string, string> = {};
  if (req.headers["content-type"]) {
    headers["content-type"] = req.headers["content-type"] as string;
  }

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    if (typeof req.body === "object" && req.body !== null) {
      fetchOptions.body = JSON.stringify(req.body);
      headers["content-type"] = "application/json";
    } else if (req.body) {
      fetchOptions.body = req.body;
    }
  }

  try {
    const tgRes = await fetch(url.toString(), fetchOptions);
    const data = await tgRes.text();

    res.status(tgRes.status);

    const contentType = tgRes.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    return res.send(data);
  } catch (err) {
    return res.status(502).json({
      error: "Failed to reach Telegram API",
      details: String(err),
    });
  }
}
