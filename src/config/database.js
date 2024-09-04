const createKnexInstance = require('./knex');

const connectionDB = async (databaseName) => {
  const db = createKnexInstance(databaseName);  // Passa o nome do banco de dados para a instância do Knex
  try {
    // Verificar se a conexão está funcionando
    await db.raw('SELECT 1+1');
    console.log(`Conexão com o banco de dados "${databaseName}" bem-sucedida`);
    return db;
  } catch (err) {
    console.log(err);
    return false;
  } 
}

module.exports = connectionDB;
