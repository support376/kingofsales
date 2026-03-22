import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";

const SESSION_COOKIE = "closr_session";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return NextResponse.json({ user: null });
  }

  const supabase = await createServiceClient();
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user });
}
