const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

// إضافة User
router.post('/add', upload, async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file ? req.file.buffer.toString('base64') : ''
    });
    await user.save();
    req.session.message = {
      type: "success",
      message: "User Added successfully"
    };
    res.redirect("/");
  } catch (err) {
    console.error("Error in POST /add:", err.message);
    res.status(500).send("Error adding user: " + err.message);
  }
});

// جلب كل الـ Users
router.get("/", async (req, res) => {
  try {
    console.log("GET / called");
    const allUsers = await User.find();
    res.render("index", {
      title: "Home Page",
      users: allUsers || []
    });
  } catch (err) {
    console.error("Error in GET /:", err.message);
    res.status(500).send("Error fetching users: " + err.message);
  }
});

router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add-User" });
});

// تعديل User
router.get("/edit/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.redirect("/");
    } else {
      res.render("edit_users", {
        title: "Edit User",
        user: user
      });
    }
  } catch (err) {
    console.error("Error in GET /edit/:id:", err.message);
    res.status(500).send("Error fetching user: " + err.message);
  }
});

router.post("/update/:id", upload, async (req, res) => {
  try {
    let id = req.params.id;
    let new_image = req.body.old_image;
    if (req.file) {
      new_image = req.file.buffer.toString('base64');
    }
    const user = await User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_image
    });
    if (!user) {
      res.status(400).send("No user found");
    } else {
      req.session.message = {
        type: "success",
        message: "User updated successfully"
      };
      res.redirect("/");
    }
  } catch (err) {
    console.error("Error in POST /update/:id:", err.message);
    res.status(500).send("Error updating user: " + err.message);
  }
});

// حذف User
router.get("/delete/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const result = await User.findByIdAndDelete(id);
    if (result) {
      req.session.message = {
        type: "danger",
        message: "User deleted successfully"
      };
      res.redirect("/");
    } else {
      res.status(400).send("No user found");
    }
  } catch (err) {
    console.error("Error in GET /delete/:id:", err.message);
    res.status(500).send("Error deleting user: " + err.message);
  }
});

module.exports = router;