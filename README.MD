# Installation and Setup

## Express App

Requirements: Node.JS installed <br />
Run npm i to installed required dependencies <br />
create .env file in root folder. <br />

### Env Vars Explanation

SERVER_PORT: Set to a local port, usually 8000 <br />
DB_USERNAME, set to your postgres admin username <br />
DB_PASSWORD, set to your postgres admin password <br />
DB_HOST=localhost <br />
DB_PORT=5432 <br />
DB_NAME, set to your postgres database name. <br />

### DB Setup & Migration Scripts

Create DB named School <br />
Run this command in postgres: CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; to allow tables to use UUID. <br />
Run migration scripts to generate tables and pre-populate data. <br />
npx knex migrate:list => To check there are pending migrations <br />
npx knex migrate:latest <br />

### Dependencies

dotenv: used to access env variables <br />
express: rest framework for creating apis <br />
knex: SQL query builder, used for creating migration scripts <br />
nodemon: hot reloads node app on save <br />
pg: postgres library <br />
jest: library for writing unit tests <br />
supertest: library for writing unit tests for https <br />

## Structure

- app.js is the main entry point for the express app. <br />
- src/utils is where common utility funcs and consts are stored <br />
- src/routes stores routers for user stories and calls controllers <br />
- src/controllers stores business logic pertaining to the user stories <br />
- src/models stores the SQL queries that call DB. <br />
- src/middleware stores the middlware that should be called before/after controller actions. <br />

## Api Hosted

https://reasonable-nicol-tartufu-0b211aaf.koyeb.app/ <br />
