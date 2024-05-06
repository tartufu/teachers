const studentTable = "student";
const teacherTable = "teacher";

const teacherData = [
  { username: "teacherOne", email: "teacherOne@mail.com" },
  { username: "teacherOne", email: "teacherTwo@mail.com" },
  { username: "teacherThree", email: "teacherThree@mail.com" },
  { username: "teacherFour", email: "teacherFour@mail.com" },
  { username: "teacherFive", email: "teacherFive@mail.com" },
];

const studentData = [
  { username: "studentOne", email: "studentOne@mail.com" },
  { username: "studentTwo", email: "studentTwo@mail.com" },
  { username: "studentThree", email: "studentThree@mail.com" },
  { username: "studentFour", email: "studentFour@mail.com" },
  { username: "studentFive", email: "studentFive@mail.com" },
  { username: "studentSix", email: "studentSix@mail.com" },
  { username: "studentSeven", email: "studentSeven@mail.com" },
  { username: "studentEight", email: "studentEight@mail.com" },
  { username: "studentNine", email: "studentNine@mail.com" },
  { username: "studentTen", email: "studentTen@mail.com" },
];

exports.up = function (knex) {
  knex(teacherTable)
    .insert(teacherData)
    .then(function () {
      console.log("Teacher Data inserted successfully");
    })
    .catch(function (error) {
      console.error("Error inserting teacher data:", error);
    });

  knex(studentTable)
    .insert(studentData)
    .then(function () {
      console.log("Student Data inserted successfully");
    })
    .catch(function (error) {
      console.error("Error inserting student data:", error);
    });
};

exports.down = async function (knex) {
  await knex(teacherTable)
    .del()
    .then(() => console.log("teacher rows deleted!"))
    .catch((e) => console.log("error deleting teacher table", e));

  await knex(studentTable)
    .del()
    .then(() => console.log("student rows deleted!"))
    .catch((e) => console.log("error deleting student table", e));
};
