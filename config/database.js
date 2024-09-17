const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('api', 'root', '', {
 host: 'localhost',
  dialect: 'mariadb', // Specify MariaDB as the dialect
  port: 3306
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize;
