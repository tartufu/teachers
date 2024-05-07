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

const commonStudents = async (req, res) => {
  //TODO: to write code to check that students/teachers exist. Ensure no dupliacate records when writing to table
  //TODO: Error handling
  //TODO: Tests
  let teacherIds = [];
  let commonStudentEmailsArr = [];
  const teachers = req.query.teacher;
  let teacherEmails = Array.isArray(teachers)
    ? [...req.query.teacher]
    : [teachers];

  try {
    const result = await pool.query(
      model.getTeachersIdByEmail(inClauseQueryBuilder(teacherEmails)),
      [...teacherEmails]
    );

    teacherIds = result.rows.map((row) => row.id);

    console.log(teacherIds);
  } catch (e) {
    throw e;
  }

  try {
    let commonStudentsId = await pool.query(
      model.getCommonStudentsId(inClauseQueryBuilder(teacherIds)),
      [...teacherIds]
    );

    console.log(commonStudentsId.rows);

    commonStudentsId = commonStudentsId.rows.map((row) => row.student_id);

    console.log([...commonStudentsId]);

    const commonStudentsEmail = await pool.query(
      model.getCommonStudentsEmail(inClauseQueryBuilder(commonStudentsId)),
      [...commonStudentsId]
    );

    console.log(commonStudentsEmail.rows);

    commonStudentEmailsArr = commonStudentsEmail.rows.map(
      (student) => student.email
    );
  } catch (e) {
    throw e;
  }

  res.status(200).send(commonStudentEmailsArr);
};

module.exports = {
  registerStudents,
  commonStudents,
};
