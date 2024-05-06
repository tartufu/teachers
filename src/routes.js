const { Router } = require("express");

const router = Router();

router.get("/health-check", (req, res) => {
  res.send("Server is running!");
});

module.exports = router;
