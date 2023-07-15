import express from 'express';
import fs from 'fs';
import {COURSES} from "./admins.js"
const router = express.Router();

let USERS = [];
fs.readFile("users.json", "utf-8", (err, data)=>{
    if(err) throw err;
    USERS = JSON.parse(data);
})

let purchasedCourses = []
fs.readFile("purchased.json", "utf-8", (err, data)=>{
    if(err) throw err;
    purchasedCourses = JSON.parse(data);
})

const userAuthentication = (req, res, next) => {
    const {username, password} = req.headers;
    const foundUser = USERS.find(user => user.userName === username && user.password === password);
    if(foundUser) {
        next();
    }else {
        res.status(401).json({message:"Login Failed"});
    }
}

router.get('/', (req, res)=>{
    res.json(USERS)
})

router.post('/signup', (req, res)=> {
    const {userName, password} = req.body;

    const user = {
        id : Math.floor(Math.random() * 100000),
        userName: userName,
        password: password
    }

    USERS.push(user);
    fs.writeFile("users.json", JSON.stringify(USERS), (err)=>{
        if(err) throw err;
    })
    res.json({message:"User added successfully"});
})

router.post('/login', userAuthentication, (req, res) => {
    res.status(200).json({message:"Login Successfull"});
})


router.get('/courses', (req, res) => {
    res.status(200).json(COURSES);
})

router.post('/courses/:id', userAuthentication, (req, res)=> {
    const id = parseInt(req.params.id);
    const foundCourse = COURSES.find((course) => course.id === id);
    if(foundCourse) {
        purchasedCourses.push(foundCourse)
        fs.writeFile("purchased.json", JSON.stringify(purchasedCourses), (err)=> {
            if (err) throw err;
        })
        res.status(200).json({message:"Purchased Successfully"});
    }else{
        res.status(401).json({message:"Invalid Course"})
    }
})

router.get('/purchasedCourses', userAuthentication, (req, res)=>{
    res.status(200).json(purchasedCourses);
})

export default router;