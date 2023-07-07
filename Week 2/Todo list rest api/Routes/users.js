import express from 'express';

const router = express.Router();


let todos = []

router.get('/', (req, res) => {
    res.send(todos);
});

router.post('/', (req,res) => {
    const todo = req.body;
    const userID = Math.floor(Math.random() * 1000000);

    const userWithId = {...todo, id:userID}
    todos.push(userWithId);
    res.send(`todo with name ${todo.title} has been added to the database`);
})

router.get('/:id', (req, res)=>{
    const id = req.params.id;
    const foundTodo = todos.find((check)=> check.id == id)
    if(!foundTodo){
        res.status(404).send()
    }else{
        res.send(foundTodo)
    }
    
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    todos = todos.filter((todo)=> todo.id != id);
    res.send(`todo with id ${id} has been deleted`)
})

router.patch('/:id', (req, res)=>{
    const id = req.params.id;
    const {title, description} = req.body;
    const foundtodo = todos.find((todo)=> todo.id == id);
    if(title){
        foundtodo.title = title;
    }

    if(description){
        foundtodo.description = description;
    }

    res.send(`${id} patched successfully`)
})

export default router;