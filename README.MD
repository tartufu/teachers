# Installation and Setup

## Express App

Requirements: Node.JS installed
Run npm i to installed required dependencies
create .env file in root folder.

### Env Vars Explanation

SERVER_PORT: Set to a local port, usually 8000
DB_USERNAME, set to your postgres admin username
DB_PASSWORD, set to your postgres admin password
DB_HOST=localhost
DB_PORT=5432
DB_NAME, set to your postgres database name.

### DB Setup & Migration Scripts

Create DB named School
Run this command in postgres: CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; to allow tables to use UUID.
Run migration scripts to generate tables and pre-populate data.
npm knex migrate:latest

### Dependencies

dotenv: used to access env variables
express: rest framework for creating apis
knex: SQL query builder, used for creating migration scripts
nodemon: hot reloads node app on save
pg: postgres library
jest: library for writing unit tests
supertest: library for writing unit tests for https

## Structure

- app.js is the main entry point for the express app.
- src/utils is where common utility funcs and consts are stored
- src/routes stores routers for user stories and calls controllers
- src/controllers stores business logic pertaining to the user stories
- src/models stores the SQL queries that call DB.
- src/middleware stores the middlware that should be called before/after controller actions.
