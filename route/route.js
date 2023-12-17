const express = require("express");
const route = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Data = require("../models/mongodb.js");
const c = require("../controller/controls.js");
const puppeteer = require('puppeteer');
const bcrypt = require("bcrypt");

route.use(cookieParser());

route.get("/", (req, res) => {
  res.render("loginregister");
});

route.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new Data.User({
      user_name: username,
      email: email,
      password: hashedPassword,
    });

    await user.save();
    console.log("User saved:", user);
    req.session.userId = user._id;
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error during registration:", error);
    res.render("loginregister");
  }
});

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Data.User.findOne({ email }); // Assuming your user model is named "User"

    if (!user) {
      return res.render("login", { error: "User not found" }); // Update the error message
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.render("login", { error: "Invalid password" });
    }

    req.session.isAuthenticated = true;
    req.session.userId = user._id;
    const url = `/${user._id}/dashboard`;
    res.redirect(url);
  } catch (error) {
    console.error("Error during login:", error);
    res.render("login-failed", { error: "Login failed" });
  }
});


route.get("/:userId/dashboard", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.redirect("/"); // Redirect to login/register if user ID is not provided
    }

    const user = await Data.User.findById(userId);

    if (!user) {
      return res.render("error", { error: "User not found" });
    }

    const userName = user.user_name;
    const email = user.email;

    res.render("dashboard", { userName, email });
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.render("loginregister");
  }
});


module.exports = route;