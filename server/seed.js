require("dotenv").config();
const mongoose          = require("mongoose");
const bcrypt            = require("bcryptjs");
const Employee          = require("./models/Employee");
const Project           = require("./models/Project");
const ProjectAssignment = require("./models/ProjectAssignment");

async function seed() {
  // 1. Connect to MongoDB Atlas
  await mongoose.connect(process.env.MONGO_URI);
  console.log("🗄️  Connected to MongoDB");

  // 2. Clear existing data
  await Promise.all([
    Employee.deleteMany({}),
    Project.deleteMany({}),
    ProjectAssignment.deleteMany({})
  ]);
  console.log("Cleared old data");

  // 3. Create 5 employees
  const rawEmployees = [
    { employee_id: "E001", full_name: "Alice Smith",  email: "alice@example.com",  password: "pass1234" },
    { employee_id: "E002", full_name: "Bob Johnson",  email: "bob@example.com",    password: "pass1234" },
    { employee_id: "E003", full_name: "Carol Davis",  email: "carol@example.com",  password: "pass1234" },
    { employee_id: "E004", full_name: "David Lee",    email: "david@example.com",  password: "pass1234" },
    { employee_id: "E005", full_name: "Eva Thompson", email: "eva@example.com",    password: "pass1234" },
  ];

  const employees = [];
  for (let e of rawEmployees) {
    // hash each password
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(e.password, salt);
    const doc = await Employee.create({
      employee_id: e.employee_id,
      full_name:   e.full_name,
      email:       e.email,
      hashed_password
    });
    employees.push(doc);
  }
  console.log(" Seeded Employees");

  // 4. Create 5 projects
  const rawProjects = [
    { project_code: "P001", project_name: "Apollo",        project_description: "Space exploration" },
    { project_code: "P002", project_name: "Hermes",        project_description: "Logistics platform" },
    { project_code: "P003", project_name: "Athena",        project_description: "AI research" },
    { project_code: "P004", project_name: "Zephyr",        project_description: "Wind energy" },
    { project_code: "P005", project_name: "Poseidon",      project_description: "Underwater mapping" },
  ];

  const projects = [];
  for (let p of rawProjects) {
    const doc = await Project.create(p);
    projects.push(doc);
  }
  console.log("✅ Seeded Projects");

  // 5. Create 5 assignments (linking by ObjectId refs)
  
  const assignments = rawEmployees.map((_, i) => ({
    employee_id:  employees[i]._id,
    project_code: projects[i]._id,
    start_date:   new Date(2024, i, 1)  
  }));

  await ProjectAssignment.insertMany(assignments);
  console.log("✅ Seeded ProjectAssignments");

  // 6. Done
  console.log(" All seed data created!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});