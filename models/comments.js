const db = require('../db/connection');

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

exports.addComment = (article_id, comment) => {
  const { username, body } = comment;

  if (Object.keys(comment).length === 0) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid request',
    });
  }

  if (!username) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid request: username required',
    });
  }

  if (!body) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid request: comment body required',
    });
  }

  return db
    .query(
      `
        INSERT INTO comments
        (body, votes, author, article_id)
        VALUES
        ($1, 0, $2, $3)
        RETURNING *;
        `,
      [body, username, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: 'The comment ID does not exist',
        });
      }
    });
};
