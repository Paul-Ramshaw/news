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
