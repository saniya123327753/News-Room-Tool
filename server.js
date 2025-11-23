require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/newsroom");

// Import Routes
const articleRoutes = require("./routes/articles");
const messageRoutes = require("./routes/messages");

// Use Routes
app.use("/articles", articleRoutes);
app.use("/messages", messageRoutes);

app.listen(5000, () => {
    console.log("Backend running on port 5000");
});