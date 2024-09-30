const connectionDB = require('../../config/database');

class AlunoModel {
    constructor(db) {
        this.conn = db;
    }

    async getAluno(data){
        const [result] = await this.conn.raw(`SELECT RA, Nome FROM tblalunos WHERE token_gympass = ?`, [data.unique_token]);
        
        return result[0];
    }

    async catracaConf(){
        const [result] = await this.conn.raw(`SELECT DiasLiberacaoCatraca FROM tblconfiguracoes`);
  
        return result[0];
    }

    async libera(sql){
        const [result] = await this.conn.raw(sql);
  
        return result[0];
    }
}

module.exports = AlunoModel;