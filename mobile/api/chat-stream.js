const BACKEND_URL = process.env.BACKEND_URL || "https://p01--calmora--y7mbybhlhn8f.code.run";

export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  const authHeader = request.headers.get("Authorization");

  const headers = {
    "Content-Type": "application/json",
  };

  if (authHeader) {
    headers["Authorization"] = authHeader;
  }

  const body = await request.json();

  const backendResponse = await fetch(`${BACKEND_URL}/api/v1/chat/stream`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!backendResponse.ok) {
    return new Response(JSON.stringify({ detail: "Backend error" }), {
      status: backendResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(backendResponse.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
