const Pool = require('pg').Pool
const pool = new Pool({
    user: '<USER>',
    host: 'localhost',
    database: 'MMO_Marketplace',
    password: '<PASSWORD',
    port: 5432
});

//  USER table

// GET USER
const getUser = async() => {
    try {
        return await new Promise(function (resolve, reject) {
            pool.query("SELECT * FROM \"USER\"", (error, results) => {
                if(error) {
                    reject(error);
                }
                
                if(results && results.rows) {
                    resolve(results.rows);
                } else {
                    reject(new Error("No results found"));
                }
            });
        });
    } catch (error_1) {
        console.error(error_1);
        throw new Error("Internal server error");
    }
};

// CREATE USER
const createUser = (body) => {
    return new Promise(function (resolve, reject) {
        const {
            user_id, username, email, 
            password, account_type, 
            has_free_chat, has_safe_chat, 
            has_safe_server_access} = body;
        pool.query(
            "INSERT INTO \"USER\" \
            (user_id, username, email, password, account_type, \
            has_free_chat, has_safe_chat, has_safe_server_access) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [user_id, username, email, password, account_type, 
                has_free_chat, has_safe_chat, 
                has_safe_server_access],
            (error, results) => {
                if(error) {
                    reject(error);
                }
                    
                if(results && results.rows) {
                    resolve(
                        `A new user has been added: ${JSON.stringify(results.rows[0])}`
                    )
                } else {
                    reject(new Error("No results found"));
                }
            }
        );
    });
};

const deleteUser = (user_id) => {
    return new Promise(function (resolve, reject) {
        pool.query(
            "DELETE FROM \"USER\" WHERE user_id = $1",
            [user_id],
            (error, results) => {
                if(error) {
                    reject(error);
                }

                resolve(`User deleted with ID: ${user_id}`);
            }
        );
    });
};

module.exports = {
    getUser,
    createUser,
    deleteUser
};

