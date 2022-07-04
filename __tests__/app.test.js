const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data');
const db = require('../db');
const request = require('supertest');
const app = require('../app.js');

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
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

describe('api/topics', () => {
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
