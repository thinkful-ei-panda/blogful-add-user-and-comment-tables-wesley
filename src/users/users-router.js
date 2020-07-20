const express = require('express');
const xss = require('xss');
const path = require('path');
const usersRouter = express.Router();

const UsersService = require('./users-service');

const serializeUser = (user) => ({
  id:user.id,
  fullname:xss(user.fullname),
  username:xss(user.username),
  nickname:xss(user.nickname),
  password:user.password,
  date_created:user.date_created  
});

usersRouter
  .route('/')
  .get((req,res,next) =>{
    UsersService.getAllUsers(req.app.get('db'))
      .then(users => {
        res.json(users.map(user => serializeUser(user)));
      })
      .catch(next);
  })
  .post(express.json(), (req,res,next) => {    
    const {
      fullname,
      username,
      nickname,
      password
    } = req.body;
    let newUser = {fullname, username};
    for(const [key,value] of Object.entries(newUser)){
      if(value == null){
        return res.status(400).json({
          error:{
            message: `Missing '${key}' in request body`
          }
        });
      }
    }

    newUser.nickname = nickname;
    newUser.password = password;
    
    UsersService.insertUser(req.app.get('db'),newUser)
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl,`/${user.id}`))
          .json(serializeUser(user));
      })
      .catch(next);
  });

usersRouter
  .route('/:userId/')
  .all((req,res,next) => {
    UsersService.getById(req.app.get('db'),req.params.userId)
      .then(user => {
        if(!user){
          return res.status(400).json({
            error: {message: 'User doesn\'t exist'}
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req,res,next) => {
    res.json(serializeUser(res.user));
  })
  .delete((req,res,next) => {
    UsersService.deleteUser(req.app.get('db'),req.params.userId)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(express.json(), (req,res,next) => {
    const {firstname, username, nickname, password} = req.body;
    const newUserFields = {firstname, username, nickname, password};
    
    if(Object.values(newUserFields).filter(Boolean).length === 0){
      return res.status(400).json({
        error: {message: 'Request body must contain either \'fullname\', \'username\', \'nickname\', or \'password\''}
      });
    }
    
    UsersService.updateUser(req.app.get('db'),req.params.userId,newUserFields)
      .then(() => {
        res.status(204).send();
      })
      .catch(next);    
  });

module.exports = usersRouter;
