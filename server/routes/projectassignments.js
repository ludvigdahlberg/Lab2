const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const ProjectAssignment = require("../models/ProjectAssignment"); // <- singular, matches model
const Employee = require("../models/Employee");

// POST /api/projectassignments
router.post("/", async (req, res) => {
  try {
    const { employee_id, project_code, start_date } = req.body;

    // Find employee by employee_id
    const employee = await Employee.findOne({ employee_id });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // Find project by project_code
    const project = await Project.findOne({ project_code });
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Create and save assignment
    const newAssignment = new ProjectAssignment({
      employee: employee._id,
      project: project._id,
      start_date,
    });

    await newAssignment.save();

    res.status(201).json({
      message: "Assignment created",
      assignment: newAssignment,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/projectassignments
router.get("/", async (req, res) => {
  try {
    const projectAssignments = await ProjectAssignment.find()
  .populate("employee", "employee_id full_name")  
  .populate("project", "project_name");

    res.json(projectAssignments);
  } catch (error) {
    res.status(404).json({ message: "No project assignments found" });
  }
});

module.exports = router;
