const express = require("express");
import { Request, Response } from "express";
import pool from "./dbConfig";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    // Fetch the user from the database
    const result = await pool.query(
      `SELECT * FROM "USER" WHERE username = $1`,
      [username]
    );

    // If user not found, return an error
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const user = result.rows[0];

    // Compare the provided password with the stored hashed password
    const isMatch = password == user.password;
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // Authentication successful, return the user information
    // (You might want to send a token instead for a real-world application)
    res.json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        username: user.username,
        password: user.password,
        email: user.email,
        account_type: user.account_type,
        has_free_chat: user.has_free_chat,
        has_safe_chat: user.has_safe_chat,
        has_safe_server_access: user.has_safe_server_access,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "An error occurred during login." });
  }
});

module.exports = router;
