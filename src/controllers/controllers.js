const pool = require("../../db");

const model = require("../models/models");

const { inClauseQueryBuilder } = require("../utils/utils");

const registerStudents = async (req, res) => {
  //TODO: to write code to check that students/teachers exist. Ensure no dupliacate records when writing to table
  //TODO: Error handling
  //TODO: Tests

  const { teacher, students } = req.body;

  let teacherid = null;
  let studentIds = [];

  try {
    const result = await pool.query(model.getTeacherByEmail, [teacher]);
    teacherid = result.rows[0].id;
  } catch (e) {
    throw e;
  }

  try {
    const result = await pool.query(
      model.getStudentsByEmailBuilder(inClauseQueryBuilder(students)),
      [...students]
    );

    studentIds = result.rows.map((row) => row.id);
  } catch (e) {
    throw e;
  }

  try {
    studentIds.map(async (studentId) => {
      await pool.query(model.postToStudentsTeachersTable, [
        teacherid,
        studentId,
      ]);
    });
  } catch (e) {
    throw e;
  }

  res.status(204).send();
};

module.exports = {
  registerStudents,
};
