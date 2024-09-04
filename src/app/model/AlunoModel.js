const connectionDB = require('../../config/database');

class AlunoModel {
    constructor(db) {
        this.conn = db;
    }

    async getAluno(data){
        const [result] = await this.conn.raw(`SELECT RA, Nome FROM tblalunos WHERE token_gympass = ?`, [data.unique_token]);

        return result;
    }
}

module.exports = AlunoModel;