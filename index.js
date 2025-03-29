require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

const PORT = process.env.PORT || 4000;
const URL = process.env.MONGO_URL;

mongoose.connect(URL)
  .then(() => console.log("Connected to database"))
  .catch(err => console.error("Database connection error:", err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// app.use(express.static("public")); // مش هنحتاجه لأن الصور هتكون Base64

app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).send("Something went wrong: " + err.message);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.use("", require("./routes/route"));

app.listen(PORT, () => {
  console.log(`SERVER WORKING ON PORT localhost:${PORT}`);
});

module.exports = app;