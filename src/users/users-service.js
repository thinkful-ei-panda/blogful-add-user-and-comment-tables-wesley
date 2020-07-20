const UsersService = {
  getAllUsers(db){
    return db
      .select()
      .from('blogful_users');
  },

  insertUser(db,newUser){
    return db
      .insert(newUser)
      .into('blogful_users')
      .returning('*')
      .then(rows => rows[0] );
  },

  getById(db,id){
    return db('blogful_users')
      .select()
      .where({ id })
      .first();
  },

  deleteUser(db,id){
    return db('blogful_users')
      .delete()
      .where({ id });
  },

  updateUser(db,id,newUserFields){
    return db('blogful_users')
      .update(newUserFields)
      .where({ id });
  }
};

module.exports = UsersService;