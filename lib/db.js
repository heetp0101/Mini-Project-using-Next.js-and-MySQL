// // lib/db.js
// import  mysql  from 'mysql2/promise';
// import 'dotenv/config'; 

// let pool;

// export function getPool() {
//   if (!pool) {
//     pool = mysql.createPool({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       waitForConnections: true,
//       connectionLimit: 10,
//       namedPlaceholders: true,
//     });
//   }
//   return pool;
// }

// export async function query(sql, params = []) {
//   const [rows] = await getPool().execute(sql, params);
//   return rows;
// }


// lib/db.js
import mysql from 'mysql2/promise';
import { parse } from 'url';

const mysqlUrl = process.env.MYSQL_URL;

if (!mysqlUrl) {
  throw new Error('MYSQL_URL is not defined');
}

// Parse MYSQL_URL -> mysql://user:password@host:port/database
const { hostname, port, auth, pathname } = parse(mysqlUrl);
const [user, password] = auth.split(':');
const database = pathname.replace('/', '');

// Reuse pool for serverless functions (important for Vercel)
let pool;
export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: hostname,
      port: port || 3306,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: { rejectUnauthorized: false }, // ✅ Required for Railway
    });
  }
  return pool;
}

// Query helper
export async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}
