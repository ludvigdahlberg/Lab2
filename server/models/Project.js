const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  project_code: { type: String, unique: true },
  project_name: String,
  project_description: String,
  start_date:  { type: Date, required: true }
});

module.exports = mongoose.model("Project", ProjectSchema);
