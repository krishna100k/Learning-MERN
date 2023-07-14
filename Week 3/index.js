import express from "express";
import bodyParser from "body-parser";
import adminsRoutes from './routes/admins.js'
import usersRoutes from './routes/users.js'
const app = express();
const PORT = 3000;
app.use(bodyParser.json())


app.use('/admins', adminsRoutes);
app.use('/users', usersRoutes);

app.get('/', (req, res) => {
    res.send("Hello From Homepage")
})


app.listen(PORT, ()=>{
    console.log(`server listening on http://localhost:${PORT}`)
})