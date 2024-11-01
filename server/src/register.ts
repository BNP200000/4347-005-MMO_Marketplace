import express, { Request, Response } from "express";
import pool from "./dbConfig";
import { v4 as uuidv4 } from "uuid";
import { NewUser } from "./types/NewUser";
import { User } from "./types/User";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  const body: NewUser = req.body;

  // Generate random user ID using uuid
  const newUser: User = {
    username: body.username,
    email: body.email,
    password: body.password,
    user_id: uuidv4(),
    account_type: body.isAdult ? "adult" : "child",
    has_free_chat: body.isAdult ? true : false,
    has_safe_chat: body.isAdult ? false : true,
    has_safe_server_access: body.isAdult ? true : false,
  };

  const {
    user_id,
    username,
    email,
    password,
    account_type,
    has_free_chat,
    has_safe_chat,
    has_safe_server_access,
  } = newUser;

  pool.query(
    `INSERT INTO "USER" (
       user_id, username, email, password, account_type,
       has_free_chat, has_safe_chat, has_safe_server_access
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      user_id,
      username,
      email,
      password,
      account_type,
      has_free_chat,
      has_safe_chat,
      has_safe_server_access,
    ],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else if (results && results.rows) {
        res.status(201).json({
          message: `A new user has been added: ${JSON.stringify(
            results.rows[0]
          )}`,
          user: results.rows[0],
        });
      } else {
        res.status(400).json({ error: "User not created" });
      }
    }
  );
});

module.exports = router;
