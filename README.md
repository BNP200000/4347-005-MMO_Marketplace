# 4347-005-MMO_Marketplace

# Instructions for running the project

1. Remove any existing database tables from your database.
2. Run all the SQL code in "create_tables.sql"
3. Run all the SQL code in "insert_tables.sql"
4. Run all the SQL code in "create_view.sql"

5. In "server/src/dbConfig.ts", change the DATABASE and PASSWORD to the correct fields for your local environment.

6. Run the following in one terminal:
```bash
cd client
npm i
npm run dev
```

6. Then, in a new terminal:
```bash
cd server
npm i
npm start
```

7. Now, go to http://localhost:3000/


## Here are some helpful development resources:
- https://react-bootstrap.netlify.app/docs/components/accordion
- https://nextjs.org/docs/app/building-your-application/routing/defining-routes
- https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
- https://getbootstrap.com/docs/4.0/utilities/spacing/

## And good extensions
- Name: Git Graph
Id: mhutchie.git-graph
Description: View a Git Graph of your repository, and perform Git actions from the graph.
Version: 1.30.0
Publisher: mhutchie
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph
