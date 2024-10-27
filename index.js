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

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
});
const exercisesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: String,
  duration: Number,
  date: String,
});

const Users = mongoose.model("Users", userSchema);

const Excercises = mongoose.model("Excercises", exercisesSchema);

// response user

app.post("/api/users", (req, res) => {
  const newUser = new Users({
    username: req.body.username,
  });

  newUser.save();

  res.json({
    username: newUser.username,
    _id: newUser._id,
  });
});

// response  {"_id":"671d49b019a7460013b5abf4","username":"gastoncito","date":"Sun Feb 02 1997","duration":5,"description":"asdasd"}

app.post("/api/users/:_id/exercises", (req, res) => {
  let noStringDate = new Date(req.body.date);
  const newExercise = new Excercises({
    userId: req.body._id,
    description: req.body.description,
    duration: req.body.duration,
    date: noStringDate.toDateString(),
  });

  newExercise.save();

  Users.findById(req.body._id).then((user) => {
    res.json({
      _id: newExercise.userId,
      username: user.username,
      date: newExercise.date,
      duration: newExercise.duration,
      description: newExercise.description,
    });
  });
});
//response logs  {"_id":"671d49b019a7460013b5abf4","username":"gastoncito","count":1,"log":[{"description":"asdasd","duration":5,"date":"Sun Feb 02 1997"}]}

app.get("/api/users", (req, res) => {
  Users.find().then((users) => {
    res.json(users);
  });
});

app.get("/api/users/:_id/logs", (req, res) => {
  Excercises.find({ userId: req.params._id }).then((exercise) => {
    Users.findById(req.params).then((user) => {
      res.json({
        _id: user._id,
        username: user.username,
        count: exercise.length,
        log: exercise.map((ex) => ({
          description: ex.description,
          duration: ex.duration,
          date: ex.date,
        })),
      });
    });
  });
});
