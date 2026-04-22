const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// подключение к базе
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "en_market",
  password: "1234",
  port: 5432,
});

// ===== REGISTER =====
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, password]
    );
    res.json({ success: true });
  } catch {
    res.json({ success: false });
  }
});

// ===== LOGIN =====
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE username=$1 AND password=$2",
    [username, password]
  );

  res.json({ success: result.rows.length > 0 });
});

app.listen(3000, () => {
  console.log("🚀 Server started on http://localhost:3000");
});