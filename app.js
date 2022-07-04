const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics');
const { getArticle } = require('./controllers/articles');

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticle);

app.use('*', (req, res) => {
  res.status(404).send({ msg: 'Route not found' });
});

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid request: ID must be a number' });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(404).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Internal server error' });
});

module.exports = app;
