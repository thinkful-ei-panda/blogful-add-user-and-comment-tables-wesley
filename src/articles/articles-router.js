const express = require('express');
const ArticlesRouter = express.Router();

const ArticlesService = ('./articles-service');

ArticlesRouter
  .route('/')
  .get((req,res,next) => {
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

module.exports = ArticlesRouter;