require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Employee = require("./models/Employee");
const Project = require("./models/Project");
const ProjectAssignment = require("./models/ProjectAssignment");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // Rensa
  await Employee.deleteMany();
  await Project.deleteMany();
  await ProjectAssignment.deleteMany();

  // 1) Plaintext-data
  const rawEmployees = [
    { employee_id: "E001", full_name: "Alice Smith", email: "alice@example.com", password: "pass1" },
    { employee_id: "E002", full_name: "Bob Johnson",   email: "bob@example.com",   password: "pass2" },
    { employee_id: "E003", full_name: "Carol Davis",    email: "carol@example.com", password: "pass3" },
    { employee_id: "E004", full_name: "David Lee",      email: "david@example.com", password: "pass4" },
    { employee_id: "E005", full_name: "Eva Chen",       email: "eva@example.com",   password: "pass5" },
  ];

  // 2) Hasha dem
  const employeesToInsert = await Promise.all(
    rawEmployees.map(async ({ password, ...rest }) => {
      const salt = await bcrypt.genSalt(10);
      const hashed_password = await bcrypt.hash(password, salt);
      return { ...rest, hashed_password };
    })
  );

  // 3) Spara alla på en gång
  const employees = await Employee.insertMany(employeesToInsert);

  // Projects (samma som du redan har)
  const projects = await Project.insertMany([
    { project_code: "P001", project_name: "Apollo",   project_description: "Space exploration" },
    { project_code: "P002", project_name: "Hermes",   project_description: "Logistics" },
    { project_code: "P003", project_name: "Athena",   project_description: "AI research" },
    { project_code: "P004", project_name: "Poseidon", project_description: "Ocean monitoring" },
    { project_code: "P005", project_name: "Zeus",     project_description: "Cloud infra" },
  ]);

  // Assignments (använd rätt fältnamn i ProjectAssignment‐modellen: "employee" & "project")
  await ProjectAssignment.insertMany([
    { employee: employees[0]._id, project: projects[0]._id, start_date: new Date("2024-01-01") },
    { employee: employees[1]._id, project: projects[1]._id, start_date: new Date("2024-02-01") },
    { employee: employees[2]._id, project: projects[2]._id, start_date: new Date("2024-03-01") },
    { employee: employees[3]._id, project: projects[3]._id, start_date: new Date("2024-04-01") },
    { employee: employees[4]._id, project: projects[4]._id, start_date: new Date("2024-05-01") },
  ]);

  console.log("Sample data inserted successfully");
  mongoose.disconnect();
}

seed();
