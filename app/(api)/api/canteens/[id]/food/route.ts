import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();

  const { id: canteenId } = await params;

  const { data, error } = await supabase
    .from("food_items")
    .select("*")
    .eq("canteen_id", canteenId);

  if (error) {
    console.error("SUPABASE GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Could not fetch food items",
        details: error.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    food_items: data,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();

  const { id: canteenId } = await params;

  // Get currently logged-in user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      {
        error: "You must be logged in to submit a food item",
      },
      { status: 401 },
    );
  }

  const body = await request.json();

  const { dish_name, suggestion } = body;

  if (!dish_name || !suggestion) {
    return NextResponse.json(
      {
        error: "dish_name and suggestion are required",
      },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("food_submissions")
    .insert({
      canteen_id: canteenId,
      dish_name,
      suggestion,
      submitted_by: user.id,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("SUPABASE POST ERROR:", error);

    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message: "Food suggestion submitted successfully",
      submission: data,
    },
    { status: 201 },
  );
}