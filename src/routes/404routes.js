const { Router } = require("express");

const { errorType, errorMsg } = require("../utils/consts");
const { errorMessageBuilder } = require("../utils/utils");

const router = Router();

router.use("/*", (req, res) => {
  throw errorMessageBuilder(errorType[404], errorMsg.MISSING_ROUTE, 404);
});

module.exports = router;
