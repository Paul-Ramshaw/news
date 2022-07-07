const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data');
const db = require('../db');
const request = require('supertest');
const app = require('../app.js');
const sorted = require('jest-sorted');
const endpoints = require('../endpoints.json');

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe('Bad paths', () => {
  test('404 status: returns 404 and error message for invalid paths', () => {
    return request(app)
      .get('/api/topicz')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found');
      });
  });
});

describe('GET /api/topics', () => {
  test('200 status: returns topics with slug and description properties', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(topic).toHaveProperty('slug');
          expect(topic).toHaveProperty('description');
        });
      });
  });
  test('200 status: returns all topics.', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
      });
  });
});

describe('GET /api/articles/:article_id', () => {
  test('200 status: responds with a single matching article', () => {
    return request(app)
      .get('/api/articles/3')
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 3,
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          author: 'icellusedkars',
          body: 'some gifs',
          created_at: '2020-11-03T09:12:00.000Z',
          votes: 0,
          comment_count: '2',
        });
      });
  });
  test('404 status: responds with an error message if the ID does not exist', () => {
    return request(app)
      .get('/api/articles/1000')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('The ID does not exist');
      });
  });
  test('400 status: responds with an error message if given an invalid ID type', () => {
    return request(app)
      .get('/api/articles/words')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Invalid request');
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('200 status: updates votes and returns the updated article', () => {
    const votes = { inc_votes: 10 };

    return request(app)
      .patch('/api/articles/3')
      .send(votes)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 3,
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          author: 'icellusedkars',
          body: 'some gifs',
          created_at: '2020-11-03T09:12:00.000Z',
          votes: 10,
        });
      });
  });
  test('404 status: responds with an error message if the ID does not exist', () => {
    const votes = { inc_votes: 10 };

    return request(app)
      .patch('/api/articles/1000')
      .send(votes)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('The ID does not exist');
      });
  });
  test('400 status: responds with an error message if given an invalid ID type', () => {
    const votes = { inc_votes: 10 };

    return request(app)
      .patch('/api/articles/words')
      .send(votes)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Invalid request');
      });
  });
  test('400 status: responds with an error message if given votes that are not a number', () => {
    const votes = { inc_votes: 'words' };

    return request(app)
      .patch('/api/articles/3')
      .send(votes)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Invalid request');
      });
  });
  test('400 status: responds with an error message if given an empty votes object', () => {
    const votes = {};

    return request(app)
      .patch('/api/articles/3')
      .send(votes)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Invalid request: No information to update');
      });
  });
});

describe('GET api/users', () => {
  test('200 status: returns an array of all users and each user has username, name and avatar_url properties', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toHaveProperty('username');
          expect(user).toHaveProperty('name');
          expect(user).toHaveProperty('avatar_url');
        });
      });
  });
});

describe('GET /api/articles', () => {
  test('200 status: returns an array of all articles', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toHaveProperty('author');
          expect(article).toHaveProperty('title');
          expect(article).toHaveProperty('article_id');
          expect(article).toHaveProperty('topic');
          expect(article).toHaveProperty('body');
          expect(article).toHaveProperty('created_at');
          expect(article).toHaveProperty('votes');
          expect(article).toHaveProperty('comment_count');
        });
      });
  });
  test('200 status: articles array is sorted by created_at date in descending order by default', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy('created_at', {
          descending: true,
        });
      });
  });
  test('200 status: returns articles with correct property values', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles[0]).toEqual({
          article_id: 3,
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          author: 'icellusedkars',
          body: 'some gifs',
          created_at: '2020-11-03T09:12:00.000Z',
          votes: 0,
          comment_count: '2',
        });
      });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  test('200 status: responds with an array of comments matching an article id.', () => {
    return request(app)
      .get('/api/articles/3/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty('comment_id');
          expect(comment).toHaveProperty('votes');
          expect(comment).toHaveProperty('created_at');
          expect(comment).toHaveProperty('author');
          expect(comment).toHaveProperty('body');
        });
      });
  });
  test('200 status: responds with an empty array when an article exists but has no comments', () => {
    return request(app)
      .get('/api/articles/12/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test('404 status: responds with an error message if the article ID does not exist', () => {
    return request(app)
      .get('/api/articles/1000/comments')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('The article does not exist');
      });
  });
  test('400 status: responds with an error message if given an invalid article ID type', () => {
    return request(app)
      .get('/api/articles/words/comments')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Invalid request');
      });
  });
});

describe('POST: /api/articles/:article_id/comments', () => {
  test('201 status: adds a new comment to the database and returns the newly added comment', () => {
    const comment = {
      username: 'icellusedkars',
      body: 'Love this',
    };
    return request(app)
      .post('/api/articles/3/comments')
      .send(comment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toHaveProperty('comment_id');
        expect(comment).toHaveProperty('votes');
        expect(comment).toHaveProperty('created_at');
        expect(comment).toHaveProperty('author');
        expect(comment).toHaveProperty('body');
      });
  });
  test('404 status: responds with an error message if the article ID does not exist', () => {
    const comment = {
      username: 'icellusedkars',
      body: 'Love this',
    };
    return request(app)
      .post('/api/articles/1000/comments')
      .send(comment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('The article does not exist');
      });
  });
  test('404 status: responds with an error message if the user does not exist', () => {
    const comment = {
      username: 'bob',
      body: 'Love this',
    };
    return request(app)
      .post('/api/articles/3/comments')
      .send(comment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('The user does not exist');
      });
  });
  test('400 status: responds with an error message if a username is not provided', () => {
    const comment = {
      body: 'Love this',
    };
    return request(app)
      .post('/api/articles/3/comments')
      .send(comment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Invalid request: username required');
      });
  });
  test('400 status: responds with an error message if comment body is not provided', () => {
    const comment = {
      username: 'icellusedkars',
    };
    return request(app)
      .post('/api/articles/3/comments')
      .send(comment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Invalid request: comment body required');
      });
  });
  test('400 status: responds with an error message if post body is not provided', () => {
    const comment = {};
    return request(app)
      .post('/api/articles/3/comments')
      .send(comment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Invalid request');
      });
  });
});

describe('GET /api', () => {
  test('200 status: responds with information about each endpoint', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});
