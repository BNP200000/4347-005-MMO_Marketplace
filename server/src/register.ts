import pool from "./dbConfig";
import { v4 as uuidv4 } from "uuid";
import { NewUser } from "./types/NewUser";
import { User } from "./types/User";

export const registerNewUser = (body: NewUser) => {
  // generate random user id, using uuid
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
  return new Promise(function (resolve, reject) {
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
          reject(error);
        } else if (results && results.rows) {
          resolve(
            `A new user has been added: ${JSON.stringify(results.rows[0])}`
          );
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};
