import { NextRequest } from "next/server";
import { EvalQuery } from "@/lib/z";
import { getSnapshot } from "@/lib/cache";
import { evaluateFlag } from "@/lib/eval";

// Run this route on Node.js (NOT Edge), so ioredis and Node builtins are available
export const runtime = "nodejs";

function base64urlDecode(input: string): string {
  // Convert base64url -> base64 and add padding
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  const padded = pad ? b64 + "=".repeat(4 - pad) : b64;

  // Use Buffer on Node; fall back to atob for edge/browser if ever needed
  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf8");
  } else {
    // @ts-ignore - atob exists in non-Node runtimes
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = Object.fromEntries(url.searchParams);
  const parsed = EvalQuery.safeParse({
    env: q.env,
    flag: q.flag,
    userId: q.userId,
    ctx: q.ctx
  });
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "bad_request" }), { status: 400 });
  }
  const { env, flag, userId, ctx } = parsed.data;

  const snapshot = await getSnapshot(env);
  if (!snapshot) {
    return new Response(JSON.stringify({ error: "no_snapshot" }), { status: 404 });
  }

  let context: Record<string, unknown> = {};
  if (ctx) {
    try {
      const json = JSON.parse(base64urlDecode(ctx));
      if (typeof json === "object" && json) context = json as Record<string, unknown>;
    } catch {}
  }

  const res = evaluateFlag(snapshot, flag, userId, context);
  return new Response(JSON.stringify(res), { status: 200, headers: { "content-type": "application/json" } });
}
