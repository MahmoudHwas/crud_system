require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();
var bodyParser = require('body-parser');
const URL = process.env.MONGO_URL;

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'my secret key',
  saveUninitialized: false, // غيرنا true لـ false عشان ما يحفظش Sessions فاضية
  resave: false,
  store: MongoStore.create({
    mongoUrl: URL,
    ttl: 14 * 24 * 60 * 60 // 14 يوم
  })
}));

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  res.locals.message = req.session.message || null; // أضفنا null كـ Default
  delete req.session.message;
  next();
});

app.set("view engine", 'ejs');
app.set("views", "./views");
app.use(express.static("uploads"));

app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).send("Something went wrong: " + err.message);
});

app.get("/test", (req, res) => {
  res.send("Test route working!");
});

app.use("", require("./routes/route"));

module.exports = app;