// middleware.js
import { NextResponse } from "next/server";
import { parse } from "cookie";
import { getPool } from "@lib/db"; // adjust path if needed

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // 1) Define public routes (no login required)
  const publicPaths = [
    "/login",
    "/api/requestOtp",
    "/api/verifyOtp",
    "/api/checkSession",
    "/api/logout",
    "/",              // homepage
    "/schools",       // list schools (view only)
    "/api/schools",   // public GET of schools
  ];

  // if route is public, allow
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2) Check for session cookie
  const cookie = req.headers.get("cookie") || "";
  const cookies = parse(cookie);
  const token = cookies.session_token;

  if (!token) {
    // redirect to /login if not logged in
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 3) Verify session in DB
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      `SELECT * FROM sessions WHERE token = ? AND expires_at > NOW() LIMIT 1`,
      [token]
    );

    if (rows.length === 0) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // session valid → allow
    return NextResponse.next();
  } catch (err) {
    console.error("Middleware DB check error:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
    matcher: [
      // protect these routes
      "/addSchool",
      "/api/addSchool",
      "/api/*",
    ],
  };
  