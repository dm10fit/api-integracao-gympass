const connectionDB = require('../../config/database');

class TurmaModel {
    constructor(db) {
        this.conn = db;
    }

    async agendarTurma(data) {
        const [result] = await this.conn.raw(`INSERT INTO  tblcalendario (Titulo,Aluno, Sala,Profissional,  Situacao,Obs,CodAula, Filial)
VALUES ( 'Titulo','Aluno', 'Data','Hora', 'HoraFim', 'Sala', 'Profissional', 'Situacao',  'Obs', 'CodAula', 'Filial')`, [data]);

        return result;
    }

    async getTurma(data) {
        const [result] = await this.conn.raw(`
SELECT Codigo FROM tblturmas WHERE gympass_classid = ?`, [data.class_id]);

        return result[0]
    }

    async getTurmaGrade(data) {


        const [result] = await this.conn.raw(`select Sequencia, Turma from tblturmasgrade where gympass_classid = ? and gympass_slotid = ?`, [data.gympass_classid, data.gympass_slotid]);
    

        return result[0];
    }

    async createGradeTurmaAluno(data) {
 
        const [result] = await this.conn.raw(`INSERT INTO  tblturmasgradealunos ( CodGrade,Aluno,AgendadoPor,gympass_bookingnumber)
VALUES (?,?,?,?)`, [data.CodGrade, data.Aluno, data.AgendadoPor, data.gympass_bookingnumber]);

        return result;
    }

    async deleteGradeTurma(data){
 
        const [result] = await this.conn.raw(`DELETE FROM tblturmasgradealunos
WHERE CodGrade = ? AND gympass_bookingnumber = ?`, [data.Sequencia, data.gympass_bookingnumber]);
       
        return result;
    }

    async updateGradeAluno(data) {
        const [result] = await this.conn.raw(`UPDATE  tblturmasgradealunos SET  Presenca = ?, AgendadoPor = ?, gympass_bookingnumber = ? WHERE Sequencia = ?`, [data.Presenca, data.AgendadoPor, data.gympass_bookingnumber, data.Sequencia]);

        return result;
    }

    async updateGradeAlunoCancela(data) {
        const [result] = await this.conn.raw(`UPDATE  tblturmasgradealunos SET  Presenca = ?, gympass_bookingnumber = ? WHERE Sequencia = ?`, [data.Presenca, data.gympass_bookingnumber, data.Sequencia]);

        return result;
    }

    async updateGradeAlunoPresensa(data) {
        const [result] = await this.conn.raw(`UPDATE  tblturmasgradealunos SET  Presenca = ? WHERE gympass_bookingnumber = ?`, [data.Presenca, data.gympass_bookingnumber]);

        return result;
    }

    async getTurmaGradeAluno(data){
        const [result] = await this.conn.raw(`SELECT CodGrade, Data, gympass_bookingnumber FROM tblturmasgradealunos INNER JOIN tblturmasgrade ON tblturmasgradealunos.CodGrade = tblturmasgrade.Sequencia   WHERE DATA = CURDATE() AND Aluno = ?`, [data.aluno]);
    
        return result;
    }

    async validaRegistroTurma(data) {
        const [result] = await this.conn.raw(`select Sequencia from tblturmasgradealunos where Aluno = ? and gympass_bookingnumber = ?`, [data.ra, data.gympass_bookingnumber]);

        return result;
    }

    async validaFrequencia(data){
        const [result] = await this.conn.raw(`SELECT ra FROM tblfrequencia WHERE RA = ? AND DATA = CURDATE()`, [data.ra]);

        return result;
    }

    async validaLimiteTurma(data) {
        const [result] = await this.conn.raw(``);

        return result;
    }
}

module.exports = TurmaModel;