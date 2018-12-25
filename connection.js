const Sequelize = require('sequelize');

const connection = new Sequelize('sequelize', 'jameschege', '', {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,
});

export default connection;
