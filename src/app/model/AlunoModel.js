const connectionDB = require('../../config/database');

class AlunoModel {
    constructor(db) {
        this.conn = db;
    }

    async getAluno(data){
        const [result] = await this.conn.raw(`SELECT RA, Nome FROM tblalunos WHERE token_gympass = ? `, [data.unique_token]);
        
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

    async criarCliente(data){
        const [result] = await this.conn.raw(`INSERT INTO tblalunos
            ( 
             Nome,
             Celular,
             Email,
             DataCadastro,
             DataAceitoLGPD,
             HoraAceitoLGPD,
             StatusAceitoLGPD,
             token_gympass,
             alunoGympass)
VALUES (?,
        ?,
        ?,
        now(),
        now(),
        now(),
        'S',
        ?,
        'S')`, [
            data.Nome,
            data.Celular,
            data.Email, 
            data.token_gympass
        ]);
        console.log(result)
        return result;
    }
}

module.exports = AlunoModel;