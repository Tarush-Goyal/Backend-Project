const http = require('http');
const express=require('express');
const mongo=require('mongodb').MongoClient;
const assert=require('assert');
const bodyparser = require('body-parser');

const app=express();
const url='mongodb://localhost:27017/test';
const port = process.env.PORT || 3000;

interface Movie{
  name:string,
  img:string,
  summary:string
}

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

var  movies:Movie[]=[];

app.get("/get-movies", (req, res) => {
return res.send(movies);
});

app.use('/',(req,res,next)=>{
  console.log('Connected to Node.js server.');
  res.setHeader('Content-Type', 'text/html');
  res.send('<h1>Hello from Node.js!</h1>')
  next();
});

mongo.connect(url, (err, client) =>{
  assert.equal(null, err);
  console.log("Connected successfully to MongoDB server");
  const db = client.db('test');
  let cursor=db.collection('movies').find();
  cursor.forEach((doc,err)=>{
        assert.equal(null,err);
        movies.push(doc);
      });
  client.close();
});

app.listen(port, () => {
  console.log(`running at port ${port}`);
});
