import { query } from "@lib/db";

export async function requireAuth(req, res) {
  try {
    const token = req.cookies?.session_token;
    if (!token) {
      res.status(401).json({ error: "Not authenticated" });
      return null;
    }

    const rows = await query(
      `SELECT * FROM sessions WHERE token=? AND expires_at > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      res.status(401).json({ error: "Invalid or expired session" });
      return null;
    }

    // return user info
    return { id: rows[0].user_id };
  } catch (err) {
    console.error("Auth check failed:", err);
    res.status(500).json({ error: "Server error during auth check" });
    return null;
  }
}
