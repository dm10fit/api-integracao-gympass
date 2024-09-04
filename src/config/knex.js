const knex = require('knex');
 
const envFile = `.env.${process.env.NODE_ENV}`;
 
require('dotenv').config({
  path: envFile
});

// Função para configurar o Knex com o banco de dados passado como parâmetro
const createKnexInstance = (databaseName) => {
  return knex({
    client: 'mysql2',
    connection: {
      host: process.env.host,
      user: process.env.userbd,
      password: process.env.pswbd,
      database: databaseName || process.env.nomebd  // Usa o banco de dados passado ou o padrão do .env
    }
  });
};

module.exports = createKnexInstance;
