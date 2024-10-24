import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
