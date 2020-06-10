const http = require("http");
const path = require("path");
const express = require("express");
const mongo = require("mongodb").MongoClient;
const assert = require("assert");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const url = "mongodb://localhost:27017/test";
const port = process.env.PORT || 3000;

mongoose.connect(url);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function callback() {
  console.log("Connected To MongoDB Database");
});
const Schema = mongoose.Schema;
const movieSchema = new Schema({
  name: String,
  image: String,
  summary: String
});

const moviesModel = mongoose.model("Movie", movieSchema);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

app.get("/get-movies", (req, res) => {
  moviesModel.find({},(error, movies)=> {
    res.send(movies);
  });
});

app.post("/insert-movies", (req, res) => {
  console.log(req.body);
  const movie = new moviesModel(req.body);
  movie.save(function(err, Movie) {
    if (err) return console.error(err);
    console.log(Movie.name + " saved to database.");
  });

  console.log("insertion complete");
  res.redirect("/");
});

app.get("/insert-movies", (req, res) => {
  res.sendFile(path.join(__dirname, "./insert-movies.html"));
});

app.use("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "./home.html"));
});

app.listen(port, () => {
  console.log(`running at port ${port}`);
});
