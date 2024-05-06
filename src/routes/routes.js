const { Router } = require("express");
const controller = require("../controllers/controllers");

const router = Router();

router.get("/health-check", (req, res) => {
  res.send("Server is running!");
});

router.get("/teachers", controller.getTeachers);

router.post("/register", controller.registerStudents);

module.exports = router;
