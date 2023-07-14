import express from 'express';
import {COURSES} from "./admins.js"
const router = express.Router();

const USERS = [];
const purchasedCourses = []


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
    res.json(COURSES)
})

router.post('/signup', (req, res)=> {
    const {userName, password} = req.body;

    const user = {
        id : Math.floor(Math.random() * 100000),
        userName: userName,
        password: password
    }

    USERS.push(user);
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
        res.status(200).json({message:"Purchased Successfully"});
    }else{
        res.status(401).json({message:"Invalid Course"})
    }
})

router.get('/purchasedCourses', userAuthentication, (req, res)=>{
    res.status(200).json(purchasedCourses);
})

export default router;