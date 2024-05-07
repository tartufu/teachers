const inClauseQueryBuilder = (array) =>
  array.map((el, index) => `$${index + 1}`).join(", ");

module.exports = {
  inClauseQueryBuilder,
};
