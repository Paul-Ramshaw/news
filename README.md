# Northcoders News API

## Project Summary

The aim of this project was to build an API for accessing and updating article data programatically. The project was also built with the intention of being capable of providing that article data to a frontend architecture. The backend service is built around an Express server and a PSQL database.

To try out a deployed version of the API a good place to start is: https://northcoders-api-news.herokuapp.com/api. Here you can find details for each available endpoint. To try the app locally follow the 'Getting started' instructions.

## Getting started

To run this application on your local machine, you'll need [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/en/download/) installed on your computer. Then take the following steps:

1. Clone the repository to your local machine

```
$ git clone https://github.com/Paul-Ramshaw/news.git
```

2. Go into the repository

```
$ cd news
```

3. Install all the required dependencies

```
$ npm install
```

4. To setup local test and development postgres databases use

```
$ npm run setup-dbs
```

5. Populate those databases with sample data by using

```
$ npm run seed
```

## Running Tests

The application has been built using test driven development and integration testing has been carried out for each of the API endpoints. To run those tests, from the root directory of the project, use:

```
npm test
```

## Adding Environment Variables

To use this application locally, you will need to add two .env files to the project: `.env.test` and `.env.development`. Add `PGDATABASE=nc_news_test` into the .env.test file. And add `PGDATABASE=nc_news` into the the .env.development file.

## Dependencies

- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://expressjs.com/)
- [pg](https://www.npmjs.com/package/pg)

## Development Dependencies

- [husky](https://typicode.github.io/husky/#/)
- [jest](https://jestjs.io/)
- [jest-extended](https://www.npmjs.com/package/jest-extended)
- [jest-sorted](https://www.npmjs.com/package/jest-sorted)
- [pg-format](https://www.npmjs.com/package/pg-format)
- [supertest](https://www.npmjs.com/package/supertest)

## System Requirements

Node.js v18 or above<br>
Postgres v8.7.3. or above
