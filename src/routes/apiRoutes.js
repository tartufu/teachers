const { Router } = require("express");
const controller = require("../controllers/controllers");

const router = Router();

// GET ROUTES
router.get("/health-check", (req, res) => {
  res.send("Server is running!");
});
router.get("/commonstudents", controller.commonStudents);

// POST ROUTES
router.post("/register", controller.registerStudents);
router.post("/suspend", controller.suspendStudent);
router.post("/retrievefornotifications", controller.retrieveNotifications);

module.exports = router;
