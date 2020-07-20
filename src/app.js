require ('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {NODE_ENV} = require('./config');

const ArticlesService = require('./articles/articles-service');
// const ArticlesRoute = require('./articles/articles-router');
const usersRouter = require('./users/users-router');


const app = express();

const morgOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morgOption));
app.use(cors());
app.use(helmet());

// app.use('/articles', ArticlesRoute);

app.get('/articles', (req,res,next) => {
  const knexInstance = req.app.get('db');
  ArticlesService.getAllArticles(knexInstance)
    .then(articles => {
      if(!articles){
        return res.send(404).json({message: 'Not Found'});
      }
      res.json(articles);
    })
    .catch(next);
});

app.get('/articles/:articleId', express.json(), (req,res,next) => {
  const knexInstance = req.app.get('db');
  ArticlesService.getById(knexInstance,req.params.articleId)
    .then(article => {
      res.json(article);
    })
    .catch(next);
});

app.use('/api/users', usersRouter);

app.use(function errorHandler(error,req,res,next){ //eslint-disable-line
  let response;
  if(NODE_ENV === 'production') {
    response = {error: {message: 'server error'}};
  }else{
    console.log(error);
    response = {message: error.message, error};
  }
  res.status(400).json(response);
});

module.exports = app;