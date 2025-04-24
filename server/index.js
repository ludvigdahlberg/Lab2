require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;
// Middleware for serving static files  
app.use(express.static(path.join(__dirname, "../client/build")));

// Middleware
app.use(cors());
app.use(express.json());

//routes
const employeeRoutes = require("./routes/employees");
app.use("/api/employees", employeeRoutes);

const projectRoutes = require("./routes/projects");
app.use("/api/projects", projectRoutes)

const projectAssignmentRoutes = require("./routes/assignments");
app.use("/api/projectassignments", projectAssignmentRoutes)

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
})
.then(() => {
  console.log("Connected to MongoDB Atlas");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.get('*', (req, res ) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
