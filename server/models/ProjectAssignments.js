const mongoose = require("mongoose");

const ProjectAssignmentSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  start_date: Date,
});

module.exports = mongoose.model("ProjectAssignment", ProjectAssignmentSchema);
