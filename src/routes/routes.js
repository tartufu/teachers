const { Router } = require("express");
const controller = require("../controllers/controllers");

const router = Router();

router.get("/health-check", (req, res) => {
  res.send("Server is running!");
});

router.post("/register", controller.registerStudents);
router.get("/commonstudents", controller.commonStudents);
router.post("/suspend", controller.suspendStudent);

module.exports = router;
