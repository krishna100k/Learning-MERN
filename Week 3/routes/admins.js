import express from "express";
import fs from 'fs';
import jwt from "jsonwebtoken";
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

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      // req.user = user;
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

router.get("/", (req, res) => {
  res.send(ADMINS);
});

router.post("/signup", (req, res) => {
  const { userName, password } = req.body;
  const Admin = {
    id: Math.floor(Math.random() * 100000),
    userName: userName,
    password: password,
  };
  ADMINS.push(Admin);

  fs.writeFile("admins.json", JSON.stringify(ADMINS), (err)=>{
    if(err) throw err;
  });

  const token = jwt.sign({userName }, secret, { expiresIn: '1h' });
  res.send({message: "Admin Account Created Successfully!", token: token});
  });


router.post("/login", (req, res) => {
  const { username, password } = req.headers;
  const foundAdmin = ADMINS.find(
    (admin) => admin.userName === username && admin.password === password
  );
  if (foundAdmin) {
    const token = jwt.sign({username }, secret, { expiresIn: '1h' });
    res.status(200).send({ message: "Logged in Successfully", token: token });
  } else {
    res.status(403).send({ message: "Login Failed" });
  }
});


router.post("/courses", authenticateJwt,  (req, res) => {
  const { title, description, price, imageLink, published } = req.body;
  const Course = {
    id: Date.now(),
    title: title,
    description: description,
    price: price,
    imageLink: imageLink,
    published: published,
  };
  COURSES.push(Course);

  fs.writeFile("courses.json", JSON.stringify(COURSES), (err)=>{
      if(err) throw err;
    });

  res.status(201).send({ message: "Course Created Successfully" });
});

router.put("/courses/:id", authenticateJwt, (req, res) => {
    const  id = parseInt(req.params.id);
    const { title, description, price, imageLink, published } = req.body;
    const Course = {
        id: Date.now(),
        title: title,
        description: description,
        price: price,
        imageLink: imageLink,
        published: published,
      };
    let findId = COURSES.find(Course => Course.id === id);
    if(findId){
        Object.assign(findId, Course);
        fs.writeFile("courses.json", JSON.stringify(COURSES), (err)=>{
          if(err) throw err;
        });
        res.status(200).send({message:'Course Updated successfully'})
    }else{
        res.status(404).send({message:'Course Not Found'});
    }
})

router.get('/courses', authenticateJwt, (req, res) => {
    res.json(COURSES);
})

export {COURSES}
export {authenticateJwt}
export default router;