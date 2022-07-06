const db = require('../db/index');

exports.selectArticle = (article_id) => {
  return db
    .query(
      `SELECT 
          articles.*,
          COUNT(comments.comment_id) AS comment_count
        FROM articles 
        LEFT JOIN comments ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
        `,
      [article_id]
    )
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

exports.selectArticles = () => {
  return db
    .query(
      `SELECT 
        articles.*,
        COUNT(comments.comment_id) AS comment_count
      FROM articles 
      LEFT JOIN comments ON comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
      `
    )
    .then(({ rows }) => {
      return rows;
    });
};
