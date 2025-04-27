// server/routes/projectassignments.js
const express           = require("express");
const router            = express.Router();
const ProjectAssignment = require("../models/ProjectAssignment");

// POST /api/projectassignments
router.post("/", async (req, res) => {
  try {
    const { employee_id, project_code, start_date } = req.body;

    // create and save a new assignment
    const newPA = new ProjectAssignment({ employee_id, project_code, start_date });
    await newPA.save();

    res.status(201).json({ message: "Assignment created", assignment: newPA });
  } catch (err) {
    console.error("POST /api/projectassignments error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/projectassignments
router.get("/", async (req, res) => {
  try {
    // .find() the assignments, then populate both refs
    const docs = await ProjectAssignment.find()
      .populate("employee_id", "employee_id full_name")
      .populate("project_code", "project_name");

    // map each doc into the shape your client expects
    const assignments = docs.map((pa) => ({
      _id:        pa._id,
      employee_id: pa.employee_id,   // now an object { employee_id, full_name }
      project_code: pa.project_code, // now an object { project_name }
      start_date: pa.start_date,
    }));

    res.json(assignments);
  } catch (err) {
    console.error("GET /api/projectassignments error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
