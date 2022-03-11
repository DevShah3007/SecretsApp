// require("dotenv").config(); //level 2

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");//level 4
const saltRounds = 10 //level 4
// const md5 = require("md5"); //level 3
// const encrypt = require("mongoose-encryption"); //level2

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});//level2

const User = new mongoose.model("user",userSchema);


app.get("/",function(req,res){
  res.render("home");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/register",function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(error, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err){
      if(!err){
        res.render("secrets");
      } else{
        console.log(err);
      }
    });
  });
});

app.post("/login",function(req,res){
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email: userName},function(err,foundUser){
    if(!err && foundUser){
      bcrypt.compare(password, foundUser.password, function(error, result) {
        if(result === true){
          res.render("secrets");
        } else{
          res.send("Invalid Credentials!");
        }
      });
    } else{
      console.log(err);
    }
  });
});

app.listen(3000,function(err){
  if(!err){
    console.log("Server listening on port 3000");
  } else{
    console.log(err);
  }
});
