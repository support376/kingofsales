import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("diagnosis_results")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "결과를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json(data);
}
