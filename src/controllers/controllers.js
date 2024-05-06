const pool = require("../../db");

const model = require("../models/models");

const getTeachers = (req, res) => {
  pool.query(model.getTeachers, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const registerStudents = async (req, res) => {
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
    const studentQueryStringBuilder = students
      .map((student, index) => `$${index + 1}`)
      .join(", ");

    const result = await pool.query(
      model.getStudentsByEmailBuilder(studentQueryStringBuilder),
      [...students]
    );

    studentIds = result.rows.map((row) => row.id);
  } catch (e) {
    throw e;
  }

  console.log("teacherId", teacherid);
  console.log("student IDs", studentIds);

  try {
    studentIds.map(async (studentId) => {
      await pool.query(model.postToStudentsTeachersTable, [
        teacherid,
        studentId,
      ]);
    });
    // await pool
  } catch (e) {
    throw e;
  }

  res.status(204).send();
};

module.exports = {
  getTeachers,
  registerStudents,
};
