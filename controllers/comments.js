const db = require('../db');
const { selectComments, checkArticleExists } = require('../models/comments');

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const comments = await selectComments(article_id);
    await checkArticleExists(article_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};
