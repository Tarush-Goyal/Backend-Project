"use strict";
var http = require('http');
var express = require('express');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var bodyparser = require('body-parser');
var app = express();
var url = 'mongodb://localhost:27017/test';
var port = process.env.PORT || 3000;
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
var movies = [];
// var movies=[];
var hi;
app.get("/get-movies", function (req, res) {
    return res.send(movies);
});
app.use('/', function (req, res, next) {
    console.log('Connected to Node.js server.');
    res.setHeader('Content-Type', 'text/html');
    res.send('<h1>hello world</h1>');
    next();
});
mongo.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to MongoDB server");
    var db = client.db('test');
    var cursor = db.collection('movies').find();
    cursor.forEach(function (doc, err) {
        assert.equal(null, err);
        movies.push(doc);
    });
    client.close();
});
app.listen(port, function () {
    console.log("running at port " + port);
});
