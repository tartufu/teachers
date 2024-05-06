const express = require("express");
const dotenv = require("dotenv");
const db = require("./db");

const routes = require("./src/routes");
const app = express();

dotenv.config();
const port = process.env.SERVER_PORT;

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT version();");

    res.status(200).send("DB IS RUNNING");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});