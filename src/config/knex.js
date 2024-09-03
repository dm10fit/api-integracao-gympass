const knex = require('knex');
 
const envFile = `.env.${process.env.NODE_ENV}`;
 
require('dotenv').config({
  path: envFile
});

// Configuração do Knex
const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.host,
    user: process.env.userbd,
    password: process.env.pswbd,
    database: process.env.nomebd
  }
});

module.exports = db;
