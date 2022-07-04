const db = require('../db/index');

exports.selectTopics = () => {
  return db.query('SELECT * FROM topics').then(({ rows }) => {
    return rows;
  });
};
