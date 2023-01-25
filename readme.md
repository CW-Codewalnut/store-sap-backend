# Readme

# Getting Started with Condopark Node API

Setup db config
 - Goto root project/config/config.json
  "development": {
    "username": "db_username",
    "password": "db_password",
    "database": "db_name",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+05:30"
  },

In the project directory, you can run:

## `npm install`

It will install required dependency to run the node project.

## `npx sequelize-cli db:create`

It will create database for you in your


note: if you get error make sure you have valid .env file in your root directory.

## `npx sequelize-cli db:migrate`

It will create all required tables in the database.

## `npx sequelize-cli db:seed:all` 

It will added required rows on tables to getting started. eg. demo user

Note: Please run only once 

## `export NODE_ENV="development" && echo $NODE_ENV`
To set and check local environment

### `npm start`

It will run you node start

on the successfully run you will prompt with following info:

Environment: dev
Server is running on port 8011.
Executing (default): SELECT 1+1 AS result
Database connection has been established.

-default environment is dev, if you not pass any param on command-cli

Note: To run specific environment you can pass "prod/dev"


# Error and Resolutions
If email send is not working then run this command on terminal

sudo apt-get install libatk-bridge2.0-0 libcups2 libxkbcommon-x11-0 libxcomposite-dev libxdamage1 libxrandr2 libgbm-dev libpangocairo-1.0-0

ref: https://github.com/alixaxel/chrome-aws-lambda/issues/164#issuecomment-754621407