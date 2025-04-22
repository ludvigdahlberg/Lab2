require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');


// Middleware
app.use(cors());
app.use(express.json());

//routes
const employeeRoutes = require("./routes/employees");
app.use("/api/employees", employeeRoutes);


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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
