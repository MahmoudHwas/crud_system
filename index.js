require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require('body-parser');
const URL = process.env.MONGO_URL;

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware للـ Logging
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

app.set("view engine", "ejs");
app.set("views", "./views"); // المسار نسبي من api/
app.use(express.static("uploads"));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).send("Something went wrong: " + err.message);
});

// Test Route
app.get("/test", (req, res) => {
  res.send("Test route working!");
});

app.use("", require("./routes/route"));

module.exports = app;