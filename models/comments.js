const db = require('../db/index');

exports.selectComments = (article_id) => {
  return db
    .query(
      `SELECT *
        FROM comments 
        WHERE comments.article_id = $1
          `,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(
      `
        SELECT * 
        FROM articles 
        WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: 'The article does not exist',
        });
      }
    });
};
