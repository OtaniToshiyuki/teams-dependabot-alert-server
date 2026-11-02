import { sendRequestSchema } from "@/lib/send-schema";

export async function POST(request: Request) {
  const parsed = sendRequestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // TODO(次PR): parsed.data から Teams 通知 (Adaptive Card) を組み立てて destination に送信
  return Response.json({ error: "Not implemented" }, { status: 501 });
}
