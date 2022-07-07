const {
  selectComments,
  addComment,
  removeComment,
} = require('../models/comments');
const { checkArticleExists } = require('../models/articles');
const { checkUserExists } = require('../models/users');

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

exports.postComment = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { username } = req.body;
    const newComment = req.body;

    if (Object.keys(newComment).length) {
      await checkUserExists(username);
      await checkArticleExists(article_id);
    }

    const comment = await addComment(article_id, newComment);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    await removeComment(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
