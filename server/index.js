import express from 'express';
import cors from 'cors';
import pg from 'pg';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "2todolist",
    port: 5432,
    password: "Vamsi@1440",
  });
  db.connect();

  //create a todo
  app.post('/todos',async(req,res) =>{
    try{
        const {description} = req.body;
        const newtodo = await db.query("insert into todos (description) values ($1) RETURNING *",[description]);
        
        res.json(newtodo.rows[0]);
    }
   catch(error){
    //res.render('uploadride.ejs', { successMessage: 'Error occured please check all try one again' });
    console.log(error.message);
   }
});

///get all todos
app.get('/todos',async(req,res)=>{
    try{
        const result = await db.query('SELECT * FROM todos');
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
});

//get single todo
app.get('/todos/:id',async(req,res) =>{
    try{
        const {id} = req.params;
        const todo = await db.query("select * from todos where id = $1",[id]);
        
        res.json(todo.rows[0]);
    }
   catch(error){
    //res.render('uploadride.ejs', { successMessage: 'Error occured please check all try one again' });
    console.log(error.message);
   }
});

//update a todo
app.put('/todos/:id',async(req,res) =>{
    try{
        const {id} = req.params;
        const {description} = req.body;
        await db.query("update todos set description = $1 where id = $2",[description,id]);
        
        res.json("todo was updated");
    }
   catch(error){
    //res.render('uploadride.ejs', { successMessage: 'Error occured please check all try one again' });
    console.log(error.message);
   }
});

//delete single todo
app.delete('/todos/:id',async(req,res) =>{
    try{
        const {id} = req.params;
        await db.query("delete from todos where id = $1",[id]);
        
        res.json("todo was deleted");
    }
   catch(error){
    //res.render('uploadride.ejs', { successMessage: 'Error occured please check all try one again' });
    console.log(error.message);
   }
});



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});