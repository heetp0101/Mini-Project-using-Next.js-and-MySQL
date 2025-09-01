import { query } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const schools = await query("SELECT id, name, address, city, image FROM schools");
      return res.status(200).json(schools);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching schools", details: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
