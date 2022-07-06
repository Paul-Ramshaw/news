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

exports.selectArticles = (sort_by = 'created_at', order_by = 'desc', topic) => {
  const sortOptions = [
    'article_id',
    'title',
    'topic',
    'author',
    'body',
    'created_at',
    'votes',
  ];
  const orderOptions = ['asc', 'desc'];

  const topicOptions = ['mitch', 'cats', 'paper'];

  if (!sortOptions.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid request',
    });
  }

  if (!orderOptions.includes(order_by)) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid request',
    });
  }

  let whereStr = '';

  if (topic !== undefined && !topicOptions.includes(topic)) {
    return Promise.reject({
      status: 400,
      msg: 'Invalid request',
    });
  }

  if (topic !== undefined) {
    whereStr = `WHERE articles.topic = '${topic}'`;
  }

  const queryStr = `
    SELECT 
    articles.*,
    COUNT(comments.comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    ${whereStr}
    GROUP BY articles.article_id
    ORDER BY articles.${sort_by} ${order_by};`;

  return db.query(queryStr).then(({ rows }) => {
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
      } else {
        return true;
      }
    });
};
