const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// database

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const exercisesSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  count: Number,
  log: [
    {
      description: String,
      duration: Number,
      date: Date,
    },
  ],
});

const Excercises = mongoose.model("Excercises", exercisesSchema);

// response user

app.post("/api/users", (req, res) => {
  const newUser = new Excercises({
    username: req.body.username,
    _id: req.body._id,
  });

  res.json({
    username: req.body.username,
    _id: req.body._id,
  });
});

// response  {"_id":"671d49b019a7460013b5abf4","username":"gastoncito","date":"Sun Feb 02 1997","duration":5,"description":"asdasd"}

app.post("/api/users/:_id/exercises", (req, res) => {
  res.json({
    _id: req.body._id,
    username: req.body.username,
    date: req.body.date,
    duration: req.body.duration,
    description: req.body.description,
  });
});

//response logs  {"_id":"671d49b019a7460013b5abf4","username":"gastoncito","count":1,"log":[{"description":"asdasd","duration":5,"date":"Sun Feb 02 1997"}]}

app.get("/api/users/:_id/logs", (req, res) => {
  res.json({
    _id: req.body._id,
    username: req.body.username,
    count: 1,
    log: [
      {
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date,
      },
    ],
  });
});
