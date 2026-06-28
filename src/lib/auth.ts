import { NextRequest, NextResponse } from "next/server";

export function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "");
  const adminToken = process.env.CMS_ADMIN_TOKEN || "K3v1n2585";
  return token === adminToken;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
