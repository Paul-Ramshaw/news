const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics');
const { getUsers } = require('./controllers/users');
const { getCommentsByArticleId } = require('./controllers/comments');
const {
  getArticle,
  getArticles,
  patchArticle,
} = require('./controllers/articles');

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/users', getUsers);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticle);
app.patch('/api/articles/:article_id', patchArticle);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.use('*', (req, res) => {
  res.status(404).send({ msg: 'Route not found' });
});

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid request' });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Internal server error' });
});

module.exports = app;
