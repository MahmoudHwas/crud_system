require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const app = express();
var bodyParser = require('body-parser');
const URL = process.env.MONGO_URL;
const path = require('path');
app.set("views", path.join(__dirname, "./views"));
app.use("", require(path.join(__dirname, "./routes/route")));
// MongoDB Connection مع Error Handling
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'my secret key',
  saveUninitialized: true,
  resave: false
}));

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.set("view engine", 'ejs');
app.set("views", "./views"); // تأكد إن المسار صح
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