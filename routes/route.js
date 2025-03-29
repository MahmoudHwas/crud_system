const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB حد أقصى
}).single("image");

// إضافة User
router.post("/add", upload, async (req, res) => {
  try {
    console.log("POST /add called");
    console.log("File received:", req.file);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file ? req.file.buffer.toString("base64") : "",
      created: Date.now(), // لأن الـ Schema بتطلب created
    });
    await user.save();
    console.log("User saved:", user);
    res.redirect("/?message=User+Added+successfully&type=success");
  } catch (err) {
    console.error("Error in POST /add:", err.message);
    res.redirect("/?message=Error+adding+user&type=danger");
  }
});

// جلب كل الـ Users
router.get("/", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.render("index", {
      title: "Home Page",
      users: allUsers || [],
      message: req.query.message ? { message: req.query.message, type: req.query.type } : null,
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
      res.redirect("/?message=No+user+found&type=danger");
    } else {
      res.render("edit_users", {
        title: "Edit User",
        user: user,
      });
    }
  } catch (err) {
    console.error("Error in GET /edit/:id:", err.message);
    res.status(500).send("Error fetching user: " + err.message);
  }
});

router.post("/update/:id", upload, async (req, res) => {
  try {
    console.log("POST /update/:id called");
    console.log("File received:", req.file);
    let id = req.params.id;
    let new_image = req.body.old_image || "";
    if (req.file) {
      new_image = req.file.buffer.toString("base64");
    }
    const user = await User.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image,
      },
      { new: true }
    );
    if (!user) {
      res.redirect("/?message=No+user+found&type=danger");
    } else {
      res.redirect("/?message=User+updated+successfully&type=success");
    }
  } catch (err) {
    console.error("Error in POST /update/:id:", err.message);
    res.redirect("/?message=Error+updating+user&type=danger");
  }
});

// حذف User
router.get("/delete/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const result = await User.findByIdAndDelete(id);
    if (result) {
      res.redirect("/?message=User+deleted+successfully&type=danger");
    } else {
      res.redirect("/?message=No+user+found&type=danger");
    }
  } catch (err) {
    console.error("Error in GET /delete/:id:", err.message);
    res.redirect("/?message=Error+deleting+user&type=danger");
  }
});

module.exports = router;