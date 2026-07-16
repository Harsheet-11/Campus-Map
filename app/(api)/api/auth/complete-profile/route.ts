import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";

// Validate incoming profile data
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

  // 1. Check authentication
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


  // 2. Read request body
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


  // 3. Validate input
  const result = Schema.safeParse(body);

  if (!result.success) {
    const issue = result.error.issues[0];

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


  // 4. Prevent duplicate profiles
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


  // 5. Prevent duplicate roll numbers
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


  // 6. Prevent duplicate nicknames
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


  // 7. Create profile
  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert({
      id:               user.id,
      npc_name:         nickname,     
      avatar:           avatar,
      roll_number_hash: roll_number_hash,
      role:             "student",   
    })
    .select("id, npc_name, avatar, created_at")
    .single();

  if (insertError || !newUser) {
    
    if (insertError?.code === "23505") {

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


    // Handle database conflicts and errors
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


  // Store profile data in JWT for faster future loads
  const { error: metaError } =
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        npc_name:         newUser.npc_name,
        avatar:           newUser.avatar,
        profile_complete: true,
      },
    });

  if (metaError) {
    console.error("JWT metadata update failed:", metaError);
  }


  // Add launch badge (non-blocking)
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

  
  // Mark profile as completed
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
    httpOnly: true,   
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    path:     "/",
  });

  return response;
}


export async function GET() {

  // 1. Check authentication
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


  // 2. Fetch profile
  const supabase = createServiceClient();

  const { data: profile, error } = await supabase
    .from("users")
    .select(
      "id, npc_name, avatar, role"
    )
    .eq("id", user.id)
    .single();


  if (error || !profile) {

    return NextResponse.json(
      {
        error: {
          code: "PROFILE_NOT_FOUND",
          message: "Profile not found.",
        },
      },
      { status: 404 }
    );

  }


  // 3. Send profile to client
  return NextResponse.json(
    {
      user: {
        id: profile.id,
        npc_name: profile.npc_name,
        avatar: profile.avatar,
        hasProfile: true,
      },
    },
    {
      status: 200,
    }
  );
}