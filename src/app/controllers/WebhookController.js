const crypto = require('crypto');
const connectionDB = require('../../config/database');
const ClienteModel = require('../model/ClienteModel');
const TurmaModel = require('../model/TurmaModel');
const AlunoModel = require('../model/AlunoModel');
const AcessoService = require('../services/AcessoService');
const CheckinService = require('../services/CheckinService');

class WebhookController {
    constructor() {
        this.secret = process.env.WEBHOOK_SECRET;
    }

    // Método para verificar a assinatura do webhook
    verifySignature(req) {
        const signature = req.headers['x-gympass-signature'];
        const body = JSON.stringify(req.body);
        const hmac = crypto.createHmac('sha256', this.secret); // Usando SHA-256 para consistência com o código PHP
        const digest = hmac.update(body).digest('hex').toUpperCase();
        return signature === digest;
    }

    async handleCheckin(req, res, next) {
        if (!this.verifySignature(req)) {
            return res.status(403).json({ error: 'Assinatura inválida' });
        }

        const data = req.body;

        const db = await connectionDB();
        if (!db) {
            throw new Error('Falha ao obter conexão com o banco de dados');
        }

        const dbConnection = await connectionDB('dm10fitaccess');
        const clienteModel = new ClienteModel(dbConnection);

        const pegaNomeDb = await clienteModel.pegaNomeDb({
            id: data.id
        });

        if (!pegaNomeDb) {
            return res.status(404).json({ error: 'Banco de dados do cliente não encontrado' });
        }

        // Trocar a conexão para o banco de dados do cliente
        const clienteDbConnection = await connectionDB(pegaNomeDb.nomeDB);
        if (!clienteDbConnection) {
            return res.status(500).json({ error: 'Falha ao conectar ao banco de dados do cliente' });
        }

        // Pega os dados do aluno
        const alunoModel = new AlunoModel(clienteDbConnection);
        const dadosAlunno = await alunoModel.getAluno({
            unique_token: data.user.unique_token
        });

        //envia post no gympass que foi feito o checkin
        const checkinService = new CheckinService();
        const responseCheckin = await checkinService.ValidateCheckin({
            gympass_id: data.user.unique_token,
            gym_id: data.gym.id
        });

        if(responseCheckin.metadata.total !== 1){
            return res.status(500).json({ error: 'erro ao validar no gympass' });
        }

        //da baixa na reserva
        const turmaModel = new TurmaModel(clienteDbConnection);
        await turmaModel.updateGradeAlunoPresensa({
            Presenca: 'S',
            gympass_bookingnumber: data.booking.booking_number
        });

        //da acesso a catraca da academia e gera a frequencia
        const acessoService = new AcessoService();
        const responseCatraca = await acessoService.acessoCatraca({
            codigoaluno: dadosAlunno.RA,
            xcliente: pegaNomeDb.NomeCliente,
            usr_filial: 1
        });

        res.status(200).json({ message: 'Evento de check-in recebido' });
    }

    async handleBookingRequested(req, res, next) {

        if (!this.verifySignature(req)) {
            return res.status(403).json({ error: 'Assinatura inválida' });
        }

        const data = req.body;

        const dbConnection = await connectionDB('dm10fitaccess');
        const clienteModel = new ClienteModel(dbConnection);

        const pegaNomeDb = await clienteModel.pegaNomeDb({
            id: data.id
        });

        if (!pegaNomeDb) {
            return res.status(404).json({ error: 'Banco de dados do cliente não encontrado' });
        }

        // Trocar a conexão para o banco de dados do cliente
        const clienteDbConnection = await connectionDB(pegaNomeDb.nomeDB);
        if (!clienteDbConnection) {
            return res.status(500).json({ error: 'Falha ao conectar ao banco de dados do cliente' });
        }

        //pega os dados do aluno
        const alunoModel = new AlunoModel(clienteDbConnection);
        const dadosAlunno = await alunoModel.getAluno({
            unique_token: data.user.unique_token
        });
        if (!dadosAlunno) {
            return res.status(500).json({ error: 'Aluno não encontrado' });
        }

        //localiza em qual turma o aluno esta localizado
        const turmaModel = new TurmaModel(clienteDbConnection);
        const getTurmaGrade = await turmaModel.getTurmaGrade({
            gympass_classid: data.slot.id,
            gympass_slotid: data.slot.class_id
        });

        //adiciona a grade da turma do aluno
        const createGradeTurmaAluno = await turmaModel.createGradeTurmaAluno({
            CodGrade: getTurmaGrade.Sequencia,
            Aluno: dadosAlunno.ra ,
            AgendadoPor: 'A', 
            gympass_bookingnumber: data.slot.booking_number
        });

        if (!createGradeTurmaAluno) {
            return res.status(500).json({ error: 'Falha na solicitação na reserva no banco de dados' });
        }

        res.status(200).json({ message: 'Evento de solicitação de reserva recebido' });
    }

    async handleBookingCanceled(req, res) {
        if (!this.verifySignature(req)) {
            return res.status(403).json({ error: 'Assinatura inválida' });
        }

        const data = req.body;

        const dbConnection = await connectionDB('dm10fitaccess');
        const clienteModel = new ClienteModel(dbConnection);

        const pegaNomeDb = await clienteModel.pegaNomeDb({
            id: data.id
        });

        if (!pegaNomeDb) {
            return res.status(404).json({ error: 'Banco de dados do cliente não encontrado' });
        }

        // Trocar a conexão para o banco de dados do cliente
        const clienteDbConnection = await connectionDB(pegaNomeDb.nomeDB);
        if (!clienteDbConnection) {
            return res.status(500).json({ error: 'Falha ao conectar ao banco de dados do cliente' });
        }

        //pega os dados do aluno
        const alunoModel = new AlunoModel(clienteDbConnection);
        const dadosAlunno = await alunoModel.getAluno({
            unique_token: data.user.unique_token
        });
        if (!dadosAlunno) {
            return res.status(500).json({ error: 'Aluno não encontrado' });
        }

        //localiza a turma do aluno
        const turmaModel = new TurmaModel(clienteDbConnection);
        const getTurmaGrade = await turmaModel.getTurmaGrade({
            gympass_classid: data.slot.id,
            gympass_slotid: data.slot.class_id
        });

        //exclui a grade da turma do aluno
        const deleteGradeTurma = await turmaModel.deleteGradeTurma({
            Sequencia: getTurmaGrade.Sequencia,
            gympass_bookingnumber: data.slot.booking_number
        });

        if (!deleteGradeTurma) {
            return res.status(500).json({ error: 'Falha na solicitação de reserva no banco de dados' });
        }

        res.status(200).json({ message: 'Evento de cancelamento de reserva recebido' });
    }

    async handleBookingLateCanceled(req, res) {
        if (!this.verifySignature(req)) {
            return res.status(403).json({ error: 'Assinatura inválida' });
        }

        // Processar os dados do webhook
        const data = req.body;
        // Lógica específica para o evento de cancelamento tardio de reserva

        res.status(200).json({ message: 'Evento de cancelamento tardio de reserva recebido' });
    }
}

module.exports = new WebhookController();
