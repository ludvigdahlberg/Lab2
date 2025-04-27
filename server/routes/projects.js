const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// post new project
router.post("/",async (req,res) =>{
    try{
        const{project_code,project_name, project_description} =req.body;

        const existing = await Project.findOne({
            $or: [{ project_code }, { project_name}]
        });
        if (existing){
            return res.status(400).json({message: "Project code or project name already exists"});
        }

        const newProject = new Project({project_code,project_name, project_description})
        await newProject.save();

        res.status(201).json({message: "Project created", project: newProject});

    }catch(err) {
        res.status(500).json({message:"Server error", error:err.message})

    }
})
// GET /api/projects
router.get("/", async (req, res) => {
    try {
      const projects = await Project.find();
      res.json(projects);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });

module.exports=router;