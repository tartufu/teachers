const { errorType } = require("../utils/consts");

const errorHandler = (error, req, res, next) => {
  const { type, message, statusCode } = error;

  if (type === errorType[404]) return res.status(statusCode).send(message);

  if (type === errorType.MISSING_RECORD)
    return res.status(statusCode).send(message);

  return res.status(500).send("Something went wrong");
};

module.exports = errorHandler;
