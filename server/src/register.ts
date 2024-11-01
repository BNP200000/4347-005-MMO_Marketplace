import pool from "./dbConfig";
import UUID from "uuid";
import { NewUser } from "./types/NewUser";
import { User } from "./types/User";

export const registerNewUser = (body: NewUser) => {
  // generate random user id, using uuid
  const newUser: User = {
    ...body,
    user_id: UUID.v4(),
    account_type: "user",
    has_free_chat: true,
    has_safe_chat: false,
    has_safe_server_access: false,
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
      `INSERT INTO USER \
            (user_id, username, email, password, account_type, \
            has_free_chat, has_safe_chat, has_safe_server_access) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
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
        }

        if (results && results.rows) {
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

// const deleteUser = (user_id) => {
//   return new Promise(function (resolve, reject) {
//     pool.query(
//       'DELETE FROM "USER" WHERE user_id = $1',
//       [user_id],
//       (error, results) => {
//         if (error) {
//           reject(error);
//         }

//         resolve(`User deleted with ID: ${user_id}`);
//       }
//     );
//   });
// };
