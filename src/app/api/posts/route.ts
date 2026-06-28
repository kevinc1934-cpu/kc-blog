import { NextRequest, NextResponse } from "next/server";
import { checkAuth, unauthorized } from "@/lib/auth";
import { getAllPosts } from "@/lib/posts";

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const posts = getAllPosts();
  return NextResponse.json({ posts });
}
