import { Filter } from "bad-words";
import blocklist from "@/data/custom-blocklist.json";

const filter = new Filter();
filter.addWords(...blocklist);

export function containsProfanity(text: string): boolean {
  return filter.isProfane(text);
}