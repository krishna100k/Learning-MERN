import express from "express"
const router = express.Router();

let users = []

router.get("/", (req,res)=>{
    res.send(users);
})

router.post("/signup", (req,res)=>{
    const user = req.body
    const userid = Math.floor(Math.random()*100000000);
    const userWithId = {...user, id:userid}

    let foundUser = users.find((check)=> check.userName == user.userName)

    if(foundUser){
        res.status(400).send(`User with User Name ${user.userName} already exists`);
    }else{

    users.push(userWithId);
    res.send(`User with name ${user.firstName} has been added to the database`)
}
})

let userData = []

router.post("/login", (req, res)=>{
    const {userName, password} = req.body;
    const foundUser = users.find((user)=> user.userName == userName && user.password == password)

    if(foundUser){
    userData.push({firstName:foundUser.firstName, lastName:foundUser.lastName, email:foundUser.email})
    res.send("Login Successfull")
}else{
    res.status(401).send("Invalid Cresidentials")
}
})


router.get("/data", (req, res)=>{
    res.send(userData);
})

export default router;