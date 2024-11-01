import express, { Request, Response } from "express";
import cors from "cors";
import { registerNewUser } from "./register";
const marketplace = require("./marketplace");

const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions = {
  origin: true, // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
};

app.use(express.json());
app.use(cors(corsOptions));
app.use("/login", require("./login"));

// ROUTES
app.get("/table/:table", (req: Request, res: Response) => {
  const table = req.params.table;
  marketplace
    .getTable(table)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
});

app.post("/table/:table", (req: Request, res: Response) => {
  const table = req.params.table;
  const data = req.body;

  if (!data) {
    res.status(400).json({ error: "Request body cannot be empty" });
  }

  marketplace
    .createRecord(table, data)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      res.status(500).json({ error: "Duplicate record" });
    });
});

app.post("/register", (req: Request, res: Response) => {
  const body = req.body;
  registerNewUser(body)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: error });
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
