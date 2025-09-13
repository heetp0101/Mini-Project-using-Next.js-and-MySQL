// pages/api/addSchool.js
import formidable from "formidable";
import fs from "fs";
import os from "os";
// import { query } from "../../../lib/db"; // keep your existing DB helper path
// import cloudinary from "../../../lib/cloudinary";
import { query } from "@lib/db";
import  cloudinary  from "@lib/cloudinary";
import { requireAuth } from "@lib/auth";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Method Not Allowed");
  }

  const form = formidable({
    uploadDir: os.tmpdir(), // temporary directory
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Error parsing form data" });
    }

    const session = await requireAuth(req, res);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { name, address, city, state, contact, email_id } = fields;

      // Validate minimal fields
      if (!name || !address || !city || !state || !contact || !email_id) {
        return res.status(422).json({ error: "Missing required fields" });
      }

      // Handle file (support single file or array)
      const fileField = files.image;
      if (!fileField) {
        return res.status(422).json({ error: "Image file is required" });
      }
      const fileObj = Array.isArray(fileField) ? fileField[0] : fileField;
      const tmpFilePath = fileObj.filepath || fileObj.filePath || fileObj.path;

      // Upload to Cloudinary
      const uploadResp = await cloudinary.uploader.upload(tmpFilePath, {
        folder: "schools",         // optional folder in your Cloudinary account
        use_filename: true,
        unique_filename: true,
      });

      // Remove temp file
      try { fs.unlinkSync(tmpFilePath); } catch (e) { /* ignore */ }

      const imageUrl = uploadResp.secure_url; // store this in DB

      // Insert into DB
      await query(
        `INSERT INTO schools (name, address, city, state, contact, image, email_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, address, city, state, contact, imageUrl, email_id]
      );

      return res.status(201).json({ message: "School added", image: imageUrl });
    } catch (e) {
      console.error("Error in addSchool handler:", e);
      return res.status(500).json({ error: e.message || "Server error" });
    }
  });
}
