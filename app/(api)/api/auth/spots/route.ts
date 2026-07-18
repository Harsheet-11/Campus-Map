export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";

export async function GET() {
  console.log("RUNNING NEW FILE");

  return NextResponse.json(
    {
      test: "UPDATED CODE WORKING",
      time: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}