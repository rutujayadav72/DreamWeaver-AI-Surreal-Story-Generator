// db.js
import mysql from "mysql2/promise";
import 'dotenv/config';


export const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


try {
  const connection = await db.getConnection();
  console.log("✅ Connected to MySQL database successfully!");
  connection.release();
} catch (error) {
  console.error("❌ MySQL connection failed:", error.message);
}
