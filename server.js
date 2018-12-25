import connection from './connection';

const express = require('express');
const Sequelize = require('sequelize');
// const _USERS = require('./users');

const { Op } = Sequelize;

const app = express();
const port = 8001;

app.listen(port, () => {
  console.log(`Running server on port ${port}`);
});


const User = connection.define('User', {
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      isAlphanumeric: true,
    },
  },
});

const Post = connection.define('Post', {
  title: Sequelize.STRING,
  content: Sequelize.TEXT,
});

const Comment = connection.define('Comments', {
  the_comment: Sequelize.STRING,
});

const Project = connection.define('Project', {
  title: Sequelize.STRING,
});

app.get('/allposts', (req, res) => {
  Post.findAll({
    include: [{ model: User, as: 'UserRef' }],
  })
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      console.log(error)
      res.status(404).send(error);
    });
});

app.get('/singlepost', (req, res) => {
  Post.findByPk('1', {
    include: [{
        model: Comment, as: 'All_Comments',
      attributes: ['the_comment']
      }, {
      model: User, as: 'UserRef'
    }],
  })
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      console.log(error)
      res.status(404).send(error);
    });
});

app.get('/findOne', (req, res) => {
  User.findByPk('50')
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
})

app.put('/update', (req, res) => {
  User.update({
    name: 'James Chege',
    password: 'password',
  }, {
    where: {
      id: 55,
    },
  })
    .then((rows) => {
      res.json(rows);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

// delete request
app.delete('/remove', (req, res) => {
  User.destroy({
    where: {
      id: '55',
    },
  })
    .then(() => {
      res.send('User successfully deleted');
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

app.get('/findall', (req, res) => {
  User.findAll({
    where: {
      name: {
        [Op.like]: 'Jo%',
      },
    },
  })
    .then((user) => {
      res.json(user);
    });
});

app.post('/post', (req, res) => {
  const newUser = req.body.user;
  // User.create(newUser) or the following alternative
  User.create({
    name: newUser.name,
    email: newUser.email,
  })
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

app.put('/addWorker', (req, res) => {
  Project.findById(2)
    .then((project) => {
      project.addWorkers(5);
      res.send('User added');
    })
    .then(() => {
      res.send('User  added ');
    })
    .catch((error) => {
      console.log(error)
      res.status(404).send(error);
    });
});

app.get('/getUserProjects', (res, req) => {
  User.findAll({
    attributes: ['name'],
    include: [{
      model: Project, as: 'Tasks',
      attributes: ['title']
    }]
  })
    .then((output) => {
      console.log(req)
      res.json5(output);
    })
    .catch((error) => {
      console.log(error)
      res.status(404).send(error);
    })
})
Post.belongsTo(User, { as: 'UserRef', foreignKey: 'userid' }); // puts foreign user( one to one relationship )
Post.hasMany(Comment, { as: 'All_Comments' }); // foreignKey = PostId in Comment table( one to many relationship )


User.belongsToMany(Project, {
  as: 'Tasks',
  through: 'UserProjects',
});

Project.belongsToMany(User, {
  as: 'Workers',
  through: 'UserProjects',
});

connection
  .sync({
    force: true,
  })
  .then(() => {
    Project.create({
      title: 'Project 1'
    }).then((project) => {
      project.setWorkers([4,5]);
    })
  })
  .then(() => {
    Project.create({
      title: 'Project 2'
    })
  })
  .then(() => {
    Project.create({
      title: 'Project 3'
    })
  })
  // .then(() => {
  //   User.bulkCreate(_USERS)
  //     .then((users) => {
  //       console.log('Success adding users');
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // })
  // .then(() => {
  //   Post.create({
  //     userid: 1,
  //     title: 'First post',
  //     content: 'post content 1',
  //   });
  // })
  .then(() => {
    Post.create({
      userid: 1,
      title: 'First post',
      content: 'post content 1',
    });
  })
  .then(() => {
Post.create({
  userid: 2,
  title: 'Second post',
  content: 'post content 2',
})
  })
  .then(() => {
    Comment.create({
      PostId: 1,
      the_comment: 'First comment',
    });
  })
  .then(() => {
Comment.create({
  PostId: 1,
  the_comment: 'Second comment here',
})
  })
  .then(
    () => {
      console.log('Connect to the server established successfully.');
    },
  ).catch((err) => {
    console.error('Unable to establish connection to the database');
    console.log(err)
  });
