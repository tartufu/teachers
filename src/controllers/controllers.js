const pool = require("../../db");

const model = require("../models/models");

const getTeachers = (req, res) => {
  pool.query(model.getTeachers, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

module.exports = {
  getTeachers,
};
