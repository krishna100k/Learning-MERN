import express from "express";
const router = express.Router();

const ADMINS = [];
const COURSES = [];

const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const foundAdmin = ADMINS.find(
    (admin) => admin.userName === username && admin.password === password
  );
  if (foundAdmin) {
    next();
  } else {
    res.status(403).send({ message: "Login Failed" });
  }
};

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
  res.send("Admin Account Created Successfully!");
});

router.post("/login", adminAuthentication, (req, res) => {
  res.status(200).send({ message: "Logged in Successfully" });
});

router.post("/courses", adminAuthentication,  (req, res) => {
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
  res.status(201).send({ message: "Course Created Successfully" });
});

router.put("/courses/:id", adminAuthentication, (req, res) => {
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
        res.status(200).send({message:'Course Updated successfully'})
    }else{
        res.status(404).send({message:'Course Not Found'});
    }
})

router.get('/courses', adminAuthentication, (req, res) => {
    res.json(COURSES);
})

export {COURSES}
export default router;