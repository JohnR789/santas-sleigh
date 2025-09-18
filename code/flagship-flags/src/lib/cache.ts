import Redis from "ioredis";
import type { EnvSnapshot } from "@/lib/types";

const url = process.env.REDIS_URL;
const redis = url ? new Redis(url) : null;

declare global {
  // eslint-disable-next-line no-var
  var __FLAGSHIP_MEM_CACHE__: Map<string, string> | undefined;
}
const g = globalThis as any;
if (!g.__FLAGSHIP_MEM_CACHE__) g.__FLAGSHIP_MEM_CACHE__ = new Map<string, string>();
const mem = g.__FLAGSHIP_MEM_CACHE__ as Map<string, string>;

const keyOf = (envPublicKey: string) => `env:${envPublicKey}:snapshot`;

export async function putSnapshot(envPublicKey: string, snapshot: EnvSnapshot) {
  const json = JSON.stringify(snapshot);
  if (redis) {
    await redis.set(keyOf(envPublicKey), json);
  } else {
    mem.set(keyOf(envPublicKey), json);
  }
}

export async function getSnapshot(envPublicKey: string): Promise<EnvSnapshot | null> {
  const raw = redis ? await redis.get(keyOf(envPublicKey)) : mem.get(keyOf(envPublicKey)) ?? null;
  return raw ? (JSON.parse(raw) as EnvSnapshot) : null;
}
