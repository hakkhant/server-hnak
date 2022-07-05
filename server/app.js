const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
require('dotenv').config();

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log(err));

const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.get('/', (req, res) => {
  res.send('API is running');
});

module.exports = app;
