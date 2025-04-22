require("dotenv").config();
const mongoose = require("mongoose");

const Employee = require("./models/Employee");
const Project = require("./models/Project");
const ProjectAssignment = require("./models/ProjectAssignments");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // Clean database
  await Employee.deleteMany();
  await Project.deleteMany();
  await ProjectAssignment.deleteMany();

  // Create Employees
  const employees = await Employee.insertMany([
    { employee_id: "E001", full_name: "Alice Smith", email: "alice@example.com", hashed_password: "hashedpass1" },
    { employee_id: "E002", full_name: "Bob Johnson", email: "bob@example.com", hashed_password: "hashedpass2" },
    { employee_id: "E003", full_name: "Carol Davis", email: "carol@example.com", hashed_password: "hashedpass3" },
    { employee_id: "E004", full_name: "David Lee", email: "david@example.com", hashed_password: "hashedpass4" },
    { employee_id: "E005", full_name: "Eva Chen", email: "eva@example.com", hashed_password: "hashedpass5" },
  ]);

  // Create Projects
  const projects = await Project.insertMany([
    { project_code: "P001", project_name: "Apollo", project_description: "Space exploration project" },
    { project_code: "P002", project_name: "Hermes", project_description: "Logistics system" },
    { project_code: "P003", project_name: "Athena", project_description: "AI research" },
    { project_code: "P004", project_name: "Poseidon", project_description: "Ocean monitoring" },
    { project_code: "P005", project_name: "Zeus", project_description: "Cloud infrastructure" },
  ]);

  // Create Assignments 
  await ProjectAssignment.insertMany([
    { employee_id: employees[0]._id, project_code: projects[0]._id, start_date: new Date("2024-01-01") },
    { employee_id: employees[1]._id, project_code: projects[1]._id, start_date: new Date("2024-02-01") },
    { employee_id: employees[2]._id, project_code: projects[2]._id, start_date: new Date("2024-03-01") },
    { employee_id: employees[3]._id, project_code: projects[3]._id, start_date: new Date("2024-04-01") },
    { employee_id: employees[4]._id, project_code: projects[4]._id, start_date: new Date("2024-05-01") },
  ]);

  console.log("Sample data inserted successfully");
  mongoose.disconnect();
}

seed();
