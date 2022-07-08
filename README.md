# Northcoders News API

## Project Summary

The aim of this project was to build an API for accessing and updating article data programatically. The project was also built with the intention of being capable of providing that article data to a frontend architecture. The backend service is built around an Express server and a PSQL database.

To try out a deployed version of the API a good place to start is: https://northcoders-api-news.herokuapp.com/api. Here you can find details for each available endpoint. To try the app locally follow the 'Getting started' instructions.

## Getting started

1. Clone the repo

```
git clone https://github.com/Paul-Ramshaw/news.git
```

2. Install npm packages

```
npm install
```

3. Setup local postgres databases

```
npm run setup-dbs
```

4. Seed the databases

```
npm run seed
```

5. Run tests with

```
npm test
```

## Adding Environment Variables

To use this application locally, you will need to add two .env files to the project: `.env.test` and `.env.development`. Add `PGDATABASE=nc_news_test` into the .env.test file. And add `PGDATABASE=nc_news` into the the .env.development file.

## Requirements

Minimum node version v18.0.0.
Minimum postgres version 8.7.3.
