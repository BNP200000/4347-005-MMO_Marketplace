import { getSession } from "next-auth/react";
import pool from "./dbConfig"; // Adjust the path to your dbConfig

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get session of the logged-in user
    const session = await getSession({ req });

    if (!session || !session.user?.name) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch user_id from the database based on the logged-in username
    const username = session.user.name;

    const userResult = await pool.query(
      `SELECT user_id FROM "USER" WHERE username = $1`,
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userResult.rows[0].user_id;

    // Fetch characters associated with the user_id
    const charactersResult = await pool.query(
      `SELECT character_id, character_name, exp_level, character_class
       FROM characters
       WHERE user_id = $1`,
      [userId]
    );

    res.status(200).json(charactersResult.rows);
  } catch (error) {
    console.error("Error fetching characters:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
