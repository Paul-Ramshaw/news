const {
  selectArticle,
  selectArticles,
  updateArticle,
} = require('../models/articles');
const { checkTopicExists } = require('../models/topics');

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  selectArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = async (req, res, next) => {
  try {
    const { sort_by, order_by, topic } = req.query;
    await checkTopicExists(topic);
    const articles = await selectArticles(sort_by, order_by, topic);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};
