const connectionDB = require('../../config/database');

class ClienteModel {
    constructor(db) {
        this.conn = db;
     
      }

    async pegaNomeDb(data){
        const [result] = await this.conn.raw(`SELECT NomeBD, NomeCliente FROM tblclienteacesso WHERE gympass_gymid = ?`, [data.id]);

        return result;
    }
}

module.exports = ClienteModel;