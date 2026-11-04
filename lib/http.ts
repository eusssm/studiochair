import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function zodError(err: ZodError) {
  return NextResponse.json(
    { error: "Ongeldige invoer", issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })) },
    { status: 422 },
  );
}

export function siteUrl(req: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
}
