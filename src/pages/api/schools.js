import {query} from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const rows = await query(`SELECT * FROM schools ORDER BY id DESC`);
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch schools" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
