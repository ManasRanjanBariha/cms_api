const express = require('express');

const dotenv = require('dotenv').config()
const sequelize = require('./config/database');
const User = require('./models/user');
const app = express()
app.use(express.json())

sequelize.sync()
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  })

app.use("/users", require('./routes/userRoutes'));



// app.use()


const port = process.env.PORT || 5000;

app.listen(port,()=>(console.log("SERVER is running "+port)))