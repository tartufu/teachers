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
      model.getCommonStudentsId(
        inClauseQueryBuilder(teacherIds),
        teacherIds.length > 1
      ),
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

const suspendStudent = async (req, res) => {
  //TODO: to write code to check that students/teachers exist. Ensure no dupliacate records when writing to table
  //TODO: Error handling
  //TODO: Tests
  //TODO: Refactor the messy code
  const { student } = req.body;

  try {
    await pool.query(model.updateSuspendStudent, [student]);
  } catch (e) {
    throw e;
  }
  res.status(204).send();
};

const retrieveNotifications = async (req, res) => {
  //TODO: to write code to check that students exist and has not been suspended.
  //TODO: Error handling
  //TODO: Tests
  const { teacher, notification } = req.body;
  let teacherId = [];
  let studentsId = [];
  let studentNotificationsArr = [];
  console.log(teacher);
  console.log(notification);

  const notificationsArr = notification.split(" ");

  const taggedStudents = notificationsArr
    .filter((word) => word[0] === "@")
    .map((word) => word.substring(1));

  console.log(taggedStudents);

  try {
    const result = await pool.query(model.getTeacherByEmail, [teacher]);

    console.log(result.rows[0].id);
    teacherId = [result.rows[0].id];

    console.log(teacherId);
  } catch (e) {
    throw e;
  }

  try {
    const result = await pool.query(
      model.getCommonStudentsId(inClauseQueryBuilder(teacherId), false),
      [...teacherId]
    );

    studentsId = result.rows.map((row) => row.student_id);
  } catch (e) {
    throw e;
  }

  try {
    const result = await pool.query(
      model.getCommonStudentsEmail(inClauseQueryBuilder(studentsId), true),
      [...studentsId]
    );

    const result2 = await pool.query(
      model.getUnsuspendedStudentsEmail(inClauseQueryBuilder(taggedStudents)),
      [...taggedStudents]
    );

    console.log("test", result2.rows);

    studentNotificationsArr = result.rows.map((row) => row.email);
    studentNotificationsArr2 = result2.rows.map((row) => row.email);

    studentNotificationsArr = [
      ...studentNotificationsArr,
      ...studentNotificationsArr2,
    ];
  } catch (e) {
    throw e;
  }

  const set = new Set(studentNotificationsArr);

  const resBody = {
    recipients: [...set],
  };

  res.status(200).send(resBody);
};

module.exports = {
  registerStudents,
  commonStudents,
  suspendStudent,
  retrieveNotifications,
};
