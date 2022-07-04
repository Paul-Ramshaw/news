const db = require('../db/index');

exports.selectArticle = (article_id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, msg: 'The ID does not exist' });
      }
      return rows[0];
    });
};
