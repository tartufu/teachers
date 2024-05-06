const getTeachers = "SELECT * FROM teacher";

const getTeacherByEmail = "SELECT id FROM teacher WHERE email = $1";

const getStudentsByEmailBuilder = (whereClause) => {
  return `SELECT id FROM student where email in (${whereClause})`;
};

const postToStudentsTeachersTable =
  "INSERT INTO students_teachers (teacher_id, student_id) VALUES ($1, $2)";

module.exports = {
  getTeachers,
  getTeacherByEmail,
  getStudentsByEmailBuilder,
  postToStudentsTeachersTable,
};
