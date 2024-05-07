const getTeacherByEmail = "SELECT id FROM teacher WHERE email = $1";

const getStudentsByEmailBuilder = (whereClause) => {
  return `SELECT id FROM student where email in (${whereClause})`;
};

const getTeachersIdByEmail = (whereClause) => {
  return `SELECT id FROM teacher where email in (${whereClause})`;
};

const getCommonStudentsId = (whereClause, moreThanOneTeacher) => {
  return `SELECT student_id FROM students_teachers where teacher_id in (${whereClause}) ${
    moreThanOneTeacher ? "GROUP BY student_id HAVING COUNT(*) > 1;" : ""
  }`;
};

const getCommonStudentsEmail = (whereClause, filterOutSuspendedStudents) => {
  return `SELECT email, username FROM student where id in (${whereClause}) ${
    filterOutSuspendedStudents ? "AND is_suspended=false" : ""
  } `;
};

const updateSuspendStudent =
  "UPDATE student SET is_suspended=true where email=$1";

const postToStudentsTeachersTable =
  "INSERT INTO students_teachers (teacher_id, student_id) VALUES ($1, $2)";

module.exports = {
  getTeacherByEmail,
  getTeachersIdByEmail,
  getStudentsByEmailBuilder,
  getCommonStudentsId,
  postToStudentsTeachersTable,
  getCommonStudentsEmail,
  updateSuspendStudent,
};
