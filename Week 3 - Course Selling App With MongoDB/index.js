import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose'
import adminsRoutes from './routes/admins.js'
import usersRoutes from './routes/users.js'
const app = express();
const PORT = 3000;
app.use(bodyParser.json())

mongoose.connect('mongodb+srv://krishnaprasadawala:krishna@cluster1.hvowd8q.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "test" });

app.use('/admins', adminsRoutes);
app.use('/users', usersRoutes);

app.get('/', (req, res) => {
    res.send("Hello From Homepage")
})


app.listen(PORT, ()=>{
    console.log(`server listening on http://localhost:${PORT}`)
})