import express, { Request, Response } from "express";
import { parseLoginCookie } from "./cookieUtil";
import { getUserId } from "./getId";
import pool from "./dbConfig";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    // Get login data from cookie instead of header
    const loginData = parseLoginCookie(req.headers.cookie);
    
    if (!loginData?.username) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    
    const userId = await getUserId(loginData.username);
    
    const result = await pool.query(
      `SELECT c.character_id, c.character_name, c.exp_level, cl.class_name AS character_class
       FROM "CHARACTER" c
       JOIN "CLASS" cl ON c.character_class = cl.class_id
       WHERE c.owner_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error in getCharacters:", err);
    res.status(500).json({ error: err instanceof Error ? err.message : "Failed to fetch characters" });
  }
});

export default router;