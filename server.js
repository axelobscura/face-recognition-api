const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'IMCYC',
    password : '',
    database : 'smart-brain'
  }
});

db.select('*').from('users').then(data => {
  console.log(data);
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@beatles.com',
      password: 'john',
      entries: 0,
      joined: new Date()
    },
    {
      id: '1234',
      name: 'Paul',
      email: 'paul@beatles.com',
      password: 'paul',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res) => {
  res.send(database.users)
})

app.post('/signin', (req, res) => {
  if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
    //console.log(database.user[0]);
    res.json(database.users[0])
  } else {
    res.status(400).json('errror!!!');
  }
})

app.post('/register', (req, res) => {
  const {email,name,password} = req.body;
  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json('Unable to register!'))
})

app.get('/profile/:id', (req, res) => {
  const {id} = req.params;
  let found = false;
  database.users.forEach(user => {
    if(user.id === id){
      found = true;
      return res.json(user);
    }
  })
  if(!found){
    res.status(400).json('not found');
  }
})

app.put('/image', (req, res) => {
  const {id} = req.body;
  let found = false;
  database.users.forEach(user => {
    if(user.id === id){
      found = true;
      user.entries++
      console.log(user.entries);
      return res.json(user.entries);
    }
  })
  if(!found){
    res.status(400).json('not found');
  }
})

app.listen(3000, () => {
  console.log('app is running on port 3000');
})

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:id --> GET = user
/image --> PUT --> user
*/