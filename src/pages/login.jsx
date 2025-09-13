// src/pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGetOtp = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/requestOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setMessage("✅ OTP sent to your email");
      } else {
        setMessage(data.message || "❌ Failed to send OTP");
      }
    } catch (err) {
      setMessage("⚠️ Error sending OTP");
    }

    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("🎉 Login successful!");

        // Get redirect query param if present, else default to addSchool
        const redirect = router.query.redirect || "/addSchool";
        setTimeout(() => router.push(redirect), 1500);
      } else {
        setMessage(data.message || "❌ Invalid OTP");
      }
    } catch (err) {
      setMessage("⚠️ Error verifying OTP");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Email OTP Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={otpSent}
        />

        {!otpSent ? (
          <button onClick={handleGetOtp} disabled={loading || !email}>
            {loading ? "Sending..." : "Get OTP"}
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp} disabled={loading || !otp}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {message && <p className="message">{message}</p>}
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #333;
          padding: 20px;
        }
        .card {
          background: #fff;
          padding: 30px 25px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        h2 {
          margin-bottom: 20px;
          font-size: 22px;
          color: #333;
        }
        input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #bbb;
          border-radius: 8px;
          font-size: 16px;
          transition: border 0.3s, background 0.3s;
          background: #fdfdfd; /* Slightly off-white so placeholder stands out */
          color: #222;
        }
        input:focus {
          outline: none;
          border-color: #0070f3;
          background: #ffffff;
        }
        input::placeholder {
          color: #666; /* Darker placeholder for better visibility */
          opacity: 1; /* Ensure placeholder isn’t too faint */
        }
        button {
          width: 100%;
          padding: 14px;
          font-size: 18px;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          background: #0070f3;
          color: #fff;
          cursor: pointer;
          transition: background 0.3s, transform 0.1s;
        }
        button:hover:not(:disabled) {
          background: #0059c9;
        }
        button:active:not(:disabled) {
          transform: scale(0.97);
        }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .message {
          margin-top: 16px;
          font-size: 14px;
          color: #444;
        }
      `}</style>
    </div>
  );
}
