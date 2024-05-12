const express = require("express");
const dotenv = require("dotenv");
const db = require("./db");

const apiRoutes = require("./src/routes/apiRoutes");
const route404 = require("./src/routes/404routes");
const app = express();

const errorHandler = require("./src/middleware/errorHandler");

dotenv.config();
const port = process.env.SERVER_PORT;

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT version();");

    res.status(200).send("DB IS RUNNING");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/api", apiRoutes, errorHandler);

app.use("/*", route404, errorHandler); // Generic 404 handler

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Teacher app listening on port ${port}`);
  });
}

module.exports = app;
