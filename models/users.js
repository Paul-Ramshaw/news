const db = require('../db/index');

exports.selectUsers = () => {
  return db.query('SELECT * FROM users').then(({ rows }) => {
    return rows;
  });
};

exports.checkUserExists = (username) => {
  if (!username) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid request: username required',
    });
  }

  return db
    .query(
      `
        SELECT * 
        FROM users 
        WHERE username = $1`,
      [username]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: 'The user does not exist',
        });
      } else {
        return true;
      }
    });
};
