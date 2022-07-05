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

exports.updateArticle = (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid request: No information to update',
    });
  }

  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, msg: 'The ID does not exist' });
      }
      return rows[0];
    });
};
