import { createHmac } from "crypto";

export function hashRollNumber(rawRollNumber: string): string {
  const secret = process.env.ROLL_NUMBER_HMAC_SECRET;
  if (!secret) throw new Error("ROLL_NUMBER_HMAC_SECRET is not set");

  const normalized = rawRollNumber.trim().toLowerCase();
  return createHmac("sha256", secret).update(normalized).digest("hex");
}