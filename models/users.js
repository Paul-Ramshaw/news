const db = require('../db/index');

exports.selectUsers = () => {
  return db.query('SELECT * FROM users').then(({ rows }) => {
    return rows;
  });
};
