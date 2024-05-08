const { errorType } = require("../utils/consts");

const errorHandler = (error, req, res, next) => {
  console.log(error.type);

  const { type, message, statusCode } = error;

  if (type === errorType.MISSING_RECORD) res.status(statusCode).send(message);

  return res.status(500).send("Something went wrong");
};

module.exports = errorHandler;
