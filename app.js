const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics');
app.use(express.json());

app.get('/api/topics', getTopics);

app.use('*', (req, res) => {
  res.status(404).send({ msg: 'Route not found' });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Internal server error' });
});

module.exports = app;
