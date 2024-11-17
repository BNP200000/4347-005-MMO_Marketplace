Instructions for running the project

1. Remove any existing database tables from your database.

2. Run all the SQL code in "create_tables.sql"

3. Run all the SQL code in "insert_tables.sql"

4. Run all the SQL code in "create_view.swl

5. In "server/src/dbConfig.ts", change the DATABASE and PASSWORD to the correct fields for your local environment.

6. Run the following in one terminal:
   cd client
   npm i
   npm run dev

7. Then, in a new terminal:
   cd server
   npm i
   npm start

8. Now, go to http://localhost:3000/