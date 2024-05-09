const pool = require("../../db");

const model = require("../models/models");

const { inClauseQueryBuilder, errorMessageBuilder } = require("../utils/utils");

const { errorType, errorMsg } = require("../utils/consts");

const registerStudents = async (req, res, next) => {
  //TODO: to write code to check that students/teachers exist. Ensure no dupliacate records when writing to table
  //TODO: Error handling
  //TODO: Tests

  const { teacher, students } = req.body;

  let teacherid = null;
  let studentIds = [];

  try {
    const result = await pool.query(model.getTeacherByEmail, [teacher]);
    if (!result.rows.length) {
      throw errorMessageBuilder(
        errorType.MISSING_RECORD,
        errorMsg.MISSING_TEACHER
      );
    }
    teacherid = result.rows[0].id;
  } catch (e) {
    return next(e);
  }

  try {
    const result = await pool.query(
      model.getStudentsByEmail(inClauseQueryBuilder(students)),
      [...students]
    );

    if (result.rows.length !== students.length) {
      throw errorMessageBuilder(
        errorType.MISSING_RECORD,
        errorMsg.MISSING_STUDENT
      );
    }

    studentIds = result.rows.map((row) => row.id);
  } catch (e) {
    return next(e);
  }

  try {
    // need to check if has already been registered
    studentIds.map(async (studentId) => {
      await pool.query(model.postToStudentsTeachersTable, [
        teacherid,
        studentId,
      ]);
    });
  } catch (e) {
    return next(e);
  }

  res.status(204).send();
};

const commonStudents = async (req, res, next) => {
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

    if (!result.rows.length) {
      throw errorMessageBuilder(
        errorType.MISSING_RECORD,
        errorMsg.MISSING_TEACHER
      );
    }

    teacherIds = result.rows.map((row) => row.id);
  } catch (e) {
    return next(e);
  }

  try {
    let commonStudentsId = await pool.query(
      model.getCommonStudentsId(
        inClauseQueryBuilder(teacherIds),
        teacherIds.length > 1
      ),
      [...teacherIds]
    );

    commonStudentsId = commonStudentsId.rows.map((row) => row.student_id);

    const commonStudentsEmail = await pool.query(
      model.getCommonStudentsEmail(inClauseQueryBuilder(commonStudentsId)),
      [...commonStudentsId]
    );

    commonStudentEmailsArr = commonStudentsEmail.rows.map(
      (student) => student.email
    );
  } catch (e) {
    throw e;
  }

  res.status(200).send(commonStudentEmailsArr);
};

const suspendStudent = async (req, res, next) => {
  //TODO: to write code to check that students/teachers exist. Ensure no dupliacate records when writing to table
  //TODO: Error handling
  //TODO: Tests
  //TODO: Refactor the messy code
  const { student } = req.body;

  try {
    await pool.query(model.updateSuspendStudent, [student]);
  } catch (e) {
    return next(e);
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
