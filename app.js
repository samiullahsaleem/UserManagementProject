const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { dirname } = require('path');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views','./views');
let results = {};
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee'
})

db.connect(err=>{
    if(err)
    {
        throw err;
    }
    else{
        "Database has been connected";
    }
})

//Create Table

app.get('/createtable',(req,res)=>{
    let sql = 'create or replace table employee (id int auto_increment, name varchar(20), designation varchar(30), primary key(id))'
    db.query(sql, err=>{
        if(err)
        {
            throw err;
        }
        else
        {
            res.send("Table has been created")
        }
    })
})
app.get('/', function(request, response){
    response.sendFile(__dirname + '/public/form.html');
});

app.post('/post',(req,res)=>{
    const emp = req.body
    let sql = `insert into employee set ?`
    db.query(sql,emp,err=>{
        if(err)
        {
            throw err
        }
        else{
            res.send('User has been added');
        }
    })
})

// Display ALL Data
app.post('/display',(req,res)=>{
    let sql = `select * from employee `
    db.query(sql,(err,result)=>{
        if(err)
        {
            throw err
        }
        else{
            res.render('index.pug',{'results': result});
        }
    })
})

// Delete user by id
app.post('/deleteid',(req,res)=>{
    let id = req.body.id;
    let sql = `delete from employee where id = ${id} `
    db.query(sql,(err)=>{
        if(err)
        {
            throw err
        }
        else{
            res.send('User has been deleted');
        }
    })
})

app.post('/searchid',(req,res)=>{
    const emp = req.body.id;
    let sql = `select * from employee where id = ${emp}`
    db.query(sql,emp,(err,result)=>{
        if(err)
        {
            throw err
        }
        else{
            res.render('index.pug',{'results': result});
        }
    })
})

// Search User by Name
app.post('/searchname',(req,res)=>{
    const name = req.body.name;
    let sql = `select * from employee where name = '${name}'`
    db.query(sql,name,(err,result)=>{
        if(err)
        {
            res.send("User doesn't exist")
        }
        else{
            res.render('index.pug',{'results': result});
        }
    })
})

app.post('/searchd',(req,res)=>{
    const designation = req.body.designation;
    let sql = `select * from employee where designation = '${designation}'`
    db.query(sql,designation,(err,result)=>{
        if(err)
        {
            res.send("User doesn't exist")
        }
        else{
            res.render('index.pug',{'results': result});
        }
    })
})
app.listen(3000, ()=>
{
    console.log("server is running");
})
