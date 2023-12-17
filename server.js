const http = require("http");
const express = require("express");
const session = require('express-session');
const ejs = require("ejs");
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const app = express();
const Data = require("./models/mongodb");
const puppeteer = require('puppeteer');
const mongoose = require("mongoose");
const route = require("./route/route");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//const controls = require('./controls.js'); // Adjust the path accordingly

app.use(cookie());
app.use(
  session({
    secret: 'Praveen', // Replace with a strong, random secret key
    resave: false,
    saveUninitialized: true,
  })
);

// Connecting to MongoDB
var mongoDB = "mongodb+srv://telugulyrics13:lNNU39ulzSz47dKg@cluster0.766j4zh.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.error("MongoDB connection error:", error));


app.use(route);
app.listen(3000, () => console.log("Server is running on port 3000"));
