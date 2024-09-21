const express = require('express');
const cors= require('cors');
const dotenv = require('dotenv').config()
const sequelize = require('./config/database');

const authRoutes = require('./routes/v1/authRoutes')
const applicantRoutes = require('./routes/v1/applicantRoutes')

const app = express()
app.use(cors());
app.use(express.json())

sequelize.sync()
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  })

app.use("/api/v1/", authRoutes);
app.use("/api/v1/applicant", applicantRoutes);

const port = process.env.PORT || 5000;

app.listen(port,()=>(console.log("SERVER is running "+port)))