import express from "express";
import fs from "fs";

const router = express.Router();

router.get("/", (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    let todos = JSON.parse(data);
    res.send(todos);
  });
});

router.post("/", (req, res) => {
  const newTodo = {
    id: Math.floor(Math.random() * 1000000),
    title: req.body.title,
    description: req.body.description,
  };

  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    let todos = JSON.parse(data);
    todos.push(newTodo);
    fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
      if (err) throw err;
    });
  });

  // const userWithId = {...todo, id:userID}
  // todos.push(userWithId);

  res.send(`todo with name ${newTodo.title} has been added to the database`);
});

router.get("/:id", (req, res) => {

  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    let todos = JSON.parse(data);

    const id = req.params.id;
    const foundTodo = todos.find((check) => check.id == id);
    if (!foundTodo) {
      res.status(404).send();
    } else {
      res.send(foundTodo);
    }

  });

});

router.delete("/:id", (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    let todos = JSON.parse(data);
    const id = req.params.id;
    let filtered = todos.filter((todo) => todo.id != id);
    fs.writeFile("todos.json", JSON.stringify(filtered), (err) => {
      if (err) throw err;
    });
    res.send(`todo with id ${id} has been deleted`);
  });
});


router.patch("/:id", (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    let todos = JSON.parse(data);

    const id = req.params.id;
    const { title, description } = req.body;
    const foundtodo = todos.find((todo) => todo.id == id);
    if (title) {
      foundtodo.title = title;
    }
  
    if (description) {
      foundtodo.description = description;
    }

    fs.writeFile("todos.json", JSON.stringify([...todos, foundtodo]), (err) => {
      if (err) throw err;
    });

    res.send(`${id} patched successfully`);
  });

});

export default router;
