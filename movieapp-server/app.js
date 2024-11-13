// app.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const router = require("./routes/router");
app.use("/", router);

module.exports = app;