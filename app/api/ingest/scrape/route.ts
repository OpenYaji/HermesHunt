import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const INGEST_AGENT_URL = process.env.INGEST_AGENT_URL ?? "http://localhost:8001";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let url: string;
  try {
    const body = await request.json();
    url = body?.url;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!url) {
    return NextResponse.json({ error: "url field required" }, { status: 400 });
  }

  let agentResponse: Response;
  try {
    agentResponse = await fetch(`${INGEST_AGENT_URL}/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(90_000),
    });
  } catch {
    return NextResponse.json(
      { error: "Ingest agent unreachable. Is the Python server running? Run: cd agents && uvicorn ingest.server:app --port 8001" },
      { status: 503 }
    );
  }

  if (!agentResponse.ok) {
    const err = await agentResponse.json().catch(() => ({ detail: "Unknown error" }));
    return NextResponse.json(
      { error: err.detail ?? "Ingest failed" },
      { status: agentResponse.status }
    );
  }

  const requirements = await agentResponse.json();
  return NextResponse.json(requirements);
}
