import express, { Request, Response } from "express";
import cors from "cors";
import getCharacters from "./getCharacters";
const marketplace = require("./marketplace");

const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Username"], // Add X-Username
};


app.use(express.json());
app.use(cors(corsOptions));
app.use("/login", require("./login"));
app.use("/register", require("./register"));
app.use("/listing", require("./listing"));
app.use("/getCharacters", getCharacters);

// ROUTES

// QUERY
app.get("/table/:table", (req: Request, res: Response) => {
  const table = req.params.table;
  marketplace
    .getTable(table)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// INSERT
app.post("/table/:table", (req: Request, res: Response) => {
  const table = req.params.table;
  const data = req.body;

  // Check if the request body is empty
  if (!data || typeof data === "object" && Object.keys(data).length === 0) {
    res.status(400).json({ error: "Request body cannot be empty" });
  }

  // Insert new record into the table if it does not exist
  // Otherwise, reject it
  marketplace.createRecord(table, data).then((response) => {
    res.status(201).json(response);
  })
  .catch((error) => {
    console.error(`Response was: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  });
});

// UPDATE
app.put("/table/:table", (req: Request, res: Response) => {
  const table = req.params.table;
  const data = req.body;

  console.log(`DATA: ${JSON.stringify(data, null, 2)}`);

  if (!data || typeof data === "object" && Object.keys(data).length === 0) {
    res.status(400).json({ error: "Request body cannot be empty" });
  }

  marketplace.updateRecord(table, data).then((response) => {
    res.status(200).json(response);
    console.log(response);
  })
  .catch((error) => {
    console.error(`Response was: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  });
});

// DELETE
app.delete("/table/:table", (req: Request, res: Response) => {
  const table = req.params.table;
  const data = req.body;

  marketplace.deleteRecord(table, data).then((response) => {
    res.status(204).send()
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({error:"Internal server error"});
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
