import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5001;

const marketplace = require("./marketplace");

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => { 
  marketplace.getUser().then((response) => {
    res.status(200).send(response);
  })
  .catch((error) => {
    console.log(error);
  });
  //res.status(200).send("Hello from Express!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
