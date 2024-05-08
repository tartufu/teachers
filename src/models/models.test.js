const {
  getStudentsByEmail,
  getTeachersIdByEmail,
  getCommonStudentsId,
  getCommonStudentsEmail,
  getUnsuspendedStudentsEmail,
} = require("./models");

describe("#getStudentsByEmailBuilder", () => {
  test("should return SQL string with where in clause ", () => {
    expect(getStudentsByEmail("$1, $2, $3")).toBe(
      "SELECT id FROM student where email in ($1, $2, $3)"
    );
  });
});

describe("#getTeachersIdByEmail", () => {
  test("should return SQL string with where in clause ", () => {
    expect(getTeachersIdByEmail("$1, $3")).toBe(
      "SELECT id FROM teacher where email in ($1, $3)"
    );
  });
});

describe("#getCommonStudentsId", () => {
  test("should return SQL string without group by clause if moreThanOneTeacher param is false", () => {
    expect(getCommonStudentsId("$1, $3", false)).toBe(
      "SELECT student_id FROM students_teachers where teacher_id in ($1, $3)"
    );
  });

  test("should return SQL string without group by clause if moreThanOneTeacher param is not provided", () => {
    expect(getCommonStudentsId("$1, $3")).toBe(
      "SELECT student_id FROM students_teachers where teacher_id in ($1, $3)"
    );
  });

  test("should return SQL string without group by clause if moreThanOneTeacher param is true", () => {
    expect(getCommonStudentsId("$1, $3", true)).toBe(
      "SELECT student_id FROM students_teachers where teacher_id in ($1, $3) GROUP BY student_id HAVING COUNT(*) > 1;"
    );
  });
});

describe("#getCommonStudentsEmail", () => {
  test("should return SQL string without group by clause if filterOutSuspendedStudents param is false", () => {
    expect(getCommonStudentsEmail("$1, $5", false)).toBe(
      "SELECT email, username FROM student where id in ($1, $5)"
    );
  });

  test("should return SQL string without group by clause if moreThanOneTeacher param is not provided", () => {
    expect(getCommonStudentsEmail("$1, $5")).toBe(
      "SELECT email, username FROM student where id in ($1, $5)"
    );
  });

  test("should return SQL string without group by clause if moreThanOneTeacher param is true", () => {
    expect(getCommonStudentsEmail("$1, $3", true)).toBe(
      "SELECT email, username FROM student where id in ($1, $3) AND is_suspended=false"
    );
  });
});

describe("#getUnsuspendedStudentsEmail", () => {
  test("should return SQL string with where in clause ", () => {
    expect(getUnsuspendedStudentsEmail("$1, $3")).toBe(
      "SELECT email from student where email in ($1, $3) AND is_suspended=false;"
    );
  });
});
