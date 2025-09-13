import crypto from "crypto";
import { query } from "./db.js";
import { sendMail } from "./mailer.js";

export async function generateAndSendOTP(email) {
  // 1. Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 2. Hash the OTP (for secure storage)
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  // 3. Expiry = 10 min from now
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // 4.1  Store in otps table
  await query(
    `INSERT INTO otps (email, otp_hash, expires_at, used, created_at)
     VALUES (?, ?, ?, false, NOW())
     ON DUPLICATE KEY UPDATE otp_hash=?, expires_at=?, used=false, created_at=NOW()`,
    [email, otpHash, expiresAt, otpHash, expiresAt]
  );

  //4.2 Store in user table
  await query(
    `INSERT INTO users (email,  created_at)
    VALUES (?, NOW())
    ON DUPLICATE KEY UPDATE created_at=NOW()`,
   [email]
  )


  // 5. Send via email (send plain OTP, not hash)
  await sendMail(
    email,
    "Your OTP Code",
    `Your OTP is: ${otp}. It expires in 10 minutes.`
  );

  return otp; // return plain OTP only for debugging (don’t log in prod!)
}
