const express = require('express');
const Sequelize = require('sequelize');

const app = express();
const port = 8001;

app.listen(port, () => {
  console.log('Running server on port ' + port)
});

const connection = new Sequelize('db', 'user', 'pass', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'db.sqlite',
  operatorsAliases: false,
  freezeTableName: true
})

const User  = connection.define('User', {
  uuid: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  first: Sequelize.STRING,
  last: Sequelize.STRING,
  full_name: Sequelize.STRING,
  bio: Sequelize.TEXT,
}, {
  hooks: {
    beforeValidate: () => {
      console.log('before validate');
    },
    afterValidate: () => {
      console.log('after validate');
    },
    beforeCreate: (user) => {
      user.full_name = `${user.first} ${user.last}`
      console.log('before create');
    },
    afterCreate: () => {
      console.log('after create');
    }
  }
})

app.get('/', (req, res) => {
  User.create({
    name: 'Jo',
    bio: 'New bio entry'
  })
      .then(user => {
        res.json(user);
      })
      .catch(error => {
        res.status(404).send(error);
      })
})

connection
  .sync({
    logging: console.log,
    force: true
  }).then(() => {
    User.create({
      first: 'Joe',
      last: 'Smith',
      bio: 'New bio entry'
    })
})
  .then(
  () => {
    console.log('Connect to the server established successfully.');
  }).catch(err => {
    console.error('Unable to establish connection to the database');
});
