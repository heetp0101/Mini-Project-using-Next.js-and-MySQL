// src/pages/api/verifyOtp.js
import crypto from "crypto";
import { randomBytes } from "crypto";
import { query } from '@lib/db';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    // 1. Hash the OTP (same way as when storing)
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    // 2. Get latest OTP for this email
    const rows = await query(
      `SELECT * FROM otps 
       WHERE email = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "No OTP found for this email" });
    }

    const otpRecord = rows[0];

    // 3. Check validity
    if (otpRecord.used) {
      return res.status(400).json({ error: "OTP already used" });
    }

    if (otpRecord.expires_at < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    if (otpRecord.otp_hash !== otpHash) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // 4. Mark OTP as used
    await query(`UPDATE otps SET used = true WHERE id = ?`, [otpRecord.id]);

    // 5. Get user_id from users table
    const userRows = await query(`SELECT id FROM users WHERE email = ?`, [email]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }


    const userId = userRows[0].id;

    // 5. Generate session token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const sessionExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hrs

    // 6. Insert into sessions table
    await query(
      `INSERT INTO sessions (user_id, token, expires_at, created_at)
       VALUES (?, ?, ?, NOW())`,
      [userId, sessionToken, sessionExpiry]
    );


    // 7. Set Header for cookie for session token
    res.setHeader(
        "Set-Cookie",
        serialize("session_token", sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // secure only in prod
          sameSite: "strict",
          maxAge: 60 * 60 * 24, // 1 day
          path: "/",
        })
      );


    return res.status(200).json({
      message: "OTP verified. Session created.",
      token: sessionToken,
    });






    // // 5. Create session
    // const sessionToken = randomBytes(48).toString("hex");
    // const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    // await query(
    //   `INSERT INTO sessions (email, session_token, expires_at, created_at)
    //    VALUES (?, ?, ?, NOW())`,
    //   [email, sessionToken, sessionExpiry]
    // );

    // // 6. Send back session token
    // return res.status(200).json({ message: "Login successful", sessionToken });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
