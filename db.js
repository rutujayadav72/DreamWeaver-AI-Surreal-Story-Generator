import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const db = await mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT
});

async function recreateTable() {
  await db.query("DROP TABLE IF EXISTS stories");
  await db.query(`
    CREATE TABLE stories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      prompt VARCHAR(255),
      story TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Table recreated!");
  db.end();
}

recreateTable();