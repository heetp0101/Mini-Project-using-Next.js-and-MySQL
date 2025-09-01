// test-db.js
import { query } from "./db.js";
import dotenv from 'dotenv';


dotenv.config({ path: '../.env.local' });

async function testDB() {
  try {
    console.log("Loaded ENV:", {
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,
      });
    const result = await query("SELECT NOW()");
    console.log("Database Connected:", result);
  } catch (error) {
    console.error("DB Error:", error.message);
  }
}

testDB();