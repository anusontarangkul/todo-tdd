const express = require("express");
const todoRoutes = require("./routes/todo.routes");
const app = express();
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/todo', {}, () => {
    console.log('todo DB connected')
})

app.use(express.json());

app.use("/todos", todoRoutes);

app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).json({ message: error.message })
})

app.get("/", (req, res) => {
    res.json("Hello world!");
});

module.exports = app;