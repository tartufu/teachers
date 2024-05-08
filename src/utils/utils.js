const inClauseQueryBuilder = (array) =>
  array.map((el, index) => `$${index + 1}`).join(", ");

const errorMessageBuilder = (type, message, statusCode = 400) => {
  return { type, message, statusCode };
};

module.exports = {
  inClauseQueryBuilder,
  errorMessageBuilder,
};
