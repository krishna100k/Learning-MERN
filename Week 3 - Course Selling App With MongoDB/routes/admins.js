import express from "express";
import fs from 'fs';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { stringify } from "querystring";
const router = express.Router();

// Reading ADMINS file
let ADMINS = []
fs.readFile("admins.json", "utf-8", (err, data)=> {
  if(err) throw err;
   ADMINS = JSON.parse(data);
})
//Reading Courses File
let COURSES = [];
fs.readFile("courses.json", "utf-8", (err, data)=>{
  if(err) throw err;
  COURSES = JSON.parse(data);
})

const secret = "s3cr3t"

//defining mongoDb schemas
const adminSchema = new mongoose.Schema({
  username: String,
  password: String
})

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price : Number,
  imageLink: String,
  published: Boolean
})

//defining mongoose models

const Admin = new mongoose.model('Admin', adminSchema);
const Course = new mongoose.model('Course', courseSchema)

let originalKey ;

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }

};

// const adminAuthentication = (req, res, next) => {
//   const { username, password } = req.headers;
//   const foundAdmin = ADMINS.find(
//     (admin) => admin.userName === username && admin.password === password
//   );
//   if (foundAdmin) {
//     next();
//   } else {
//     res.status(403).send({ message: "Login Failed" });
//   }
// };



router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const admins = await Admin.findOne({username})
  if(admins){
    res.status(403).send({message: 'Admin Already Exists!'})
  }else{
    const newAdmin = new Admin({username:username, password:password});
    await newAdmin.save();
    const token = jwt.sign({username }, secret, { expiresIn: '1h' });
    res.send({message: "Admin Account Created Successfully!", token: token});
  }
  });


router.post("/login", async (req, res) => {
  const { username, password } = req.headers;
  const admin = await Admin.findOne({username, password});
  if (admin) {
    const token = jwt.sign({username }, secret, { expiresIn: '1h' });
    res.status(200).send({ message: "Logged in Successfully", token: token });
  } else {
    res.status(403).send({ message: "Login Failed" });
  }
});


router.post("/courses", authenticateJwt, async (req, res) => {
  const { title, description, price, imageLink, published } = req.body;
  const course =  new Course({title, description, price, imageLink, published});
  await course.save();
  res.status(201).send({ message: "Course Created Successfully" });
});

router.put("/courses/:id", authenticateJwt, async (req, res) => {
    const  id = req.params.id;
    const { title, description, price, imageLink, published } = req.body;
    const course = await Course.findByIdAndUpdate(id, req.body)
    if(course){
      res.status(200).send({message:'Course Updated successfully'})
    }else{
      res.status(404).send({message:'Course Not Found'})
    }
})

router.get('/courses', authenticateJwt, async (req, res) => {
  const courses = await Course.find({});
  res.status(200).send(courses);
})

export {COURSES}
export {Course}
export {authenticateJwt}
export default router;