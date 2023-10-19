import express from "express";
import { execute } from "./observe";

const port = 3000;
const app = express();

execute();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
