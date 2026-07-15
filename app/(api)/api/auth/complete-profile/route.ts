import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";

// ── Validation schema ─────────────────────────────────────────
// Must match DB constraints exactly:
//   npc_name: 4-24 chars, ^[a-zA-Z0-9_]+$
//   avatar: 1-8 chars
//   roll_number_hash: 64 char sha256 hex string
const Schema = z.object({
  nickname: z
    .string()
    .min(4, "Minimum 4 characters.")
    .max(24, "Maximum 24 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Only letters, numbers and underscores."
    ),

  avatar: z
    .string()
    .min(1)
    .max(8),

  roll_number_hash: z
    .string()
    .length(64),
});

export async function POST(request: NextRequest) {

  // ── Step 1: must be logged in ────────────────────────────────
  const user = await requireAuth();

  if (!user) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required.",
        },
      },
      { status: 401 }
    );
  }

  // ── Step 2: parse request body ───────────────────────────────
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_BODY",
          message: "Invalid request body.",
        },
      },
      { status: 400 }
    );
  }

  // ── Step 3: validate with Zod ────────────────────────────────
  const result = Schema.safeParse(body);

  if (!result.success) {
    const issue = result.error.issues[0];

    // map Zod issues to specific error codes
    // so NicknameCard can show the right message
    if (issue.path[0] === "nickname") {
      if (issue.code === "too_small") {
        return NextResponse.json(
          {
            error: {
              code: "INVALID_NICKNAME",
              message: "Minimum 4 characters.",
            },
          },
          { status: 400 }
        );
      }

      if (issue.code === "too_big") {
        return NextResponse.json(
          {
            error: {
              code: "INVALID_NICKNAME",
              message: "Maximum 24 characters.",
            },
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: {
            code: "INVALID_NICKNAME",
            message: "Only letters, numbers and underscores.",
          },
        },
        { status: 400 }
      );
    }

    if (issue.path[0] === "roll_number_hash") {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_ROLL_NUMBER",
            message: "Invalid roll number.",
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: "INVALID_BODY",
          message: "Invalid data.",
        },
      },
      { status: 400 }
    );
  }

  const { nickname, avatar, roll_number_hash } = result.data;

  const supabase = createServiceClient();

  // ── Step 4: check if profile already exists ──────────────────
  // this user already completed onboarding
  const { data: existingProfile } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (existingProfile) {
    return NextResponse.json(
      {
        error: {
          code: "PROFILE_EXISTS",
          message: "Profile already exists.",
        },
      },
      { status: 409 }
    );
  }

  // ── Step 5: check roll number uniqueness ─────────────────────
  // DB has unique constraint but we check early
  // to return a clean error before hitting the constraint
  const { data: existingRoll } = await supabase
    .from("users")
    .select("id")
    .eq("roll_number_hash", roll_number_hash)
    .single();

  if (existingRoll) {
    return NextResponse.json(
      {
        error: {
          code: "ROLL_NUMBER_EXISTS",
          message: "This roll number is already registered.",
        },
      },
      { status: 409 }
    );
  }

  // ── Step 6: check nickname uniqueness ────────────────────────
  // DB has unique constraint on npc_name
  // check early for a clean error message
  const { data: existingNickname } = await supabase
    .from("users")
    .select("id")
    .eq("npc_name", nickname)
    .single();

  if (existingNickname) {
    return NextResponse.json(
      {
        error: {
          code: "NICKNAME_TAKEN",
          message: "This nickname is already taken.",
        },
      },
      { status: 409 }
    );
  }

  // ── Step 7: insert user row ──────────────────────────────────
  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert({
      id:               user.id,
      npc_name:         nickname,     // maps to npc_name column
      avatar:           avatar,
      roll_number_hash: roll_number_hash,
      role:             "student",    // default, matches constraint
    })
    .select("id, npc_name, avatar, created_at")
    .single();

  if (insertError || !newUser) {
    // 23505 = unique constraint violation
    // means a race condition — two people grabbed the same
    // nickname or roll number at the exact same moment
    if (insertError?.code === "23505") {
      // figure out which constraint was violated
      const isNickname =
        insertError.message.includes("npc_name");

      return NextResponse.json(
        {
          error: {
            code: isNickname
              ? "NICKNAME_TAKEN"
              : "ROLL_NUMBER_EXISTS",
            message: isNickname
              ? "This nickname was just taken. Try another."
              : "This roll number was just registered.",
          },
        },
        { status: 409 }
      );
    }

    // 23514 = check constraint violation
    // means npc_name failed the DB regex or length check
    if (insertError?.code === "23514") {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_NICKNAME",
            message:
              "Nickname must be 4-24 characters, letters, numbers and underscores only.",
          },
        },
        { status: 400 }
      );
    }

    console.error("Profile insert failed:", insertError);

    return NextResponse.json(
      {
        error: {
          code: "DB_ERROR",
          message: "Could not create profile. Try again.",
        },
      },
      { status: 500 }
    );
  }

  // ── Step 8: bake data into JWT metadata ──────────────────────
  // this is the key step for zero-DB return visits
  // future page loads read from JWT — never hit the DB
  const { error: metaError } =
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        npc_name:         newUser.npc_name,
        avatar:           newUser.avatar,
        profile_complete: true,
      },
    });

  if (metaError) {
    // non-fatal — profile was created successfully
    // only affects the fast path on return visits
    // they will fall through to the one DB query instead
    console.error("JWT metadata update failed:", metaError);
  }

  // ── Step 9: founding soul badge ──────────────────────────────
  // silent — badge failure never blocks profile creation
  const launchDate = process.env.LAUNCH_DATE;

  if (launchDate) {
    const launch  = new Date(launchDate);
    const cutoff  = new Date(
      launch.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    const created = new Date(newUser.created_at);

    if (created >= launch && created <= cutoff) {
      const { error: badgeError } = await supabase
        .from("user_badges")
        .insert({
          user_id:    user.id,
          badge_slug: "founding_soul",
        });

      if (badgeError) {
        console.error("Founding soul badge failed:", badgeError);
      }
    }
  }

  // ── Step 10: set has_profile cookie ──────────────────────────
  // app/page.tsx reads this cookie on every return visit
  // if found → skips the DB query entirely
  // this is what makes return visits zero-DB
  const response = NextResponse.json(
    {
      user: {
        id:       newUser.id,
        npc_name: newUser.npc_name,
        avatar:   newUser.avatar,
      },
    },
    { status: 201 }
  );

  response.cookies.set("has_profile", "true", {
    httpOnly: true,   // not readable by JS, safe from XSS
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    path:     "/",
    // no maxAge = session cookie
    // cleared when browser closes
    // app/page.tsx re-sets it on next login if missing
  });

  return response;
}