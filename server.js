const express = require('express');
const Sequelize = require('sequelize');

const app = express();
const port = 8001;

// app.listen(port, () => {
//   console.log('Running server on port ' + port)
// });

const connection = new Sequelize('db', 'user', 'pass', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'db.sqlite',
  operatorsAliases: false
})

const User  = connection.define('User', {
  name: Sequelize.STRING,
  bio: Sequelize.TEXT
})

connection
  .sync({
    logging: console.log
  }).then()
  .then(
  () => {
    console.log('Connect to the server established successfully.');
  }).catch(err => {
    console.error('Unable to establish connection to the database');
});
