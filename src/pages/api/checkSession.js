import { parse } from "cookie";
import { query } from '@lib/db';


export default async function handler(req, res) {
  try {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.session_token;
    console.log(" token :",token);
    if (!token) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const rows = await query(
      "SELECT * FROM sessions WHERE token = ? AND expires_at > NOW()",
      [token]
    );

    console.log()
    if (rows.length === 0) {
      return res.status(401).json({ error: "Session expired" });
    }

    res.json({ message: "Valid session" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
