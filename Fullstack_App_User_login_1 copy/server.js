

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require('mongoose')
const passport = require('passport');
//global

let db, collection;
const url = 'mongodb+srv://dmorin2020:rHMaqBHnjjjPVffd@cluster0.aub17.mongodb.net/?retryWrites=true&w=majority'

// const dbName = "demo";
const dbName = "translation";
//higher order function
//  app.listen(9090, () => {
//    MongoClient.connect(
//      url,
//      { useNewUrlParser: true, useUnifiedTopology: true },
//      (error, client) => {
//        if (error) {
//          throw error;
//        }
//        db = client.db(dbName);
//        console.log("Connected to `" + dbName + "`!");
//      }
//    );
//  });

mongoose.set('useNewUrlParser', true)//gets rid of deprecation error 
mongoose.set('useUnifiedTopology', true)


mongoose.connect(configDB.url, (err, database) => {
   if (err) return console.log(err)
   db = database
   require('./app/routes.js')(app, passport, db);
 }); // connect to our database


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//client side static files are accessible/ public?
app.use(express.static("public"));

app.get("/", (req, res) => {
  db.collection("messages")
    .find()
    .toArray((err, msg) => {
      if (err) return console.log(err);
      res.render("index.ejs", { text: msg });
    });
});

app.post("/translate", (req, res) => {
  db.collection("messages").insertOne(
    {text: req.body.msg},
    (err, result) => {
      if (err) return console.log(err);
      console.log("saved to database");
      res.redirect("/");
    }
  );
});

app.put("/translate", (req, res) => {
  db.collection("messages").findOneAndUpdate(
    {text: req.body.msg},
    {
      $set: {
        post: req.body.msg
      }
    },

    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    }
    
  );
});
app.put("/translateMessage", (req, res) => {
  db.collection("messages").findOneAndUpdate(
    {text: req.body.msg },

    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    }
    
  );
});


app.delete("/translate", (req, res) => {
  db.collection("messages").findOneAndDelete(
    {text: req.body.msg },
    (err, result) => {
      if (err) return res.send(500, err);
      res.send("Message deleted!");
    }
  );
});