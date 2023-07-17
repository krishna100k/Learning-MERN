import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { COURSES } from "./admins.js";
import { authenticateJwt } from "./admins.js";
import { Course } from "./admins.js";
const router = express.Router();

// Reading Users File
let USERS = [];
fs.readFile("users.json", "utf-8", (err, data) => {
  if (err) throw err;
  USERS = JSON.parse(data);
});
//Reading Purchased File
let purchasedCourses = [];
fs.readFile("purchased.json", "utf-8", (err, data) => {
  if (err) throw err;
  purchasedCourses = JSON.parse(data);
});

const secret = "s3cr3t";

//Defining the Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{type : mongoose.Schema.Types.ObjectId, ref: 'Course'}]
})

//Defining the model

const User = new mongoose.model('User', userSchema)

// const userAuthentication = (req, res, next) => {
//     const {username, password} = req.headers;
//     const foundUser = USERS.find(user => user.userName === username && user.password === password);
//     if(foundUser) {
//         next();
//     }else {
//         res.status(401).json({message:"Login Failed"});
//     }
// }


router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({username})
  if(user){
    res.status(401).json({message:"User already exists"});
  }else{
    const newuser = new User({username: username, password: password});
    await newuser.save();
    const token = jwt.sign({ username }, secret, { expiresIn: "1hr" });
    res.json({ message: "User added successfully", token: token });
  }

});

router.post("/login", async (req, res) => {
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password})
  if(user){
    const token = jwt.sign({username}, secret, {expiresIn: "1hr"})
    res.status(200).send({message: "Logged In Successfully", token: token})
  }else{
    res.status(403).send({message: "User not found"})
  }
});

router.get("/courses", authenticateJwt, async (req, res) => {
  const course = await Course.find({published: true})
  res.status(200).send(course);
});

router.post("/courses/:id", authenticateJwt, async (req, res) => {
  const course = await Course.findById(req.params.id)
  if(course){
    const user = await User.findOne({username: req.user.username})
    if(user){
      user.purchasedCourses.push(course);
      await user.save();
      res.json({message: 'Course Purchased Successfully'})
    }else{
      res.status(401).json({message: "User not found"})
    }
  }else{
    res.status(404).json({message: "Course not found"})
  }
});

router.get("/purchasedCourses", authenticateJwt, async (req, res) => {
  const user = await User.findOne({username: req.user.username}).populate('purchasedCourses')
  if(user){
    res.status(200).send(user.purchasedCourses)
  }else{
    res.status(401).json({message: "User not found"})
  }
});

export default router;
