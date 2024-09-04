const crypto = require('crypto');
const connectionDB = require('../../config/database');
const ClienteModel = require('../model/ClienteModel');
const TurmaModel = require('../model/TurmaModel');
const AlunoModel = require('../model/AlunoModel');
const AcessoService = require('../services/AcessoService');

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

        const acessoService = new AcessoService();
        const responseCatraca = acessoService.acessoCatraca({
            codigoaluno: dadosAlunno.RA,
            xcliente: pegaNomeDb.NomeCliente,
            usr_filial: 1
        });

        res.status(200).json({ message: 'Evento de check-in recebido' });
    }

    async handleBookingRequested(req, res) {
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

        const alunoModel = new AlunoModel(clienteDbConnection);
        const dadosAlunno = await alunoModel.getAluno({
            unique_token: data.user.unique_token
        });

        if (!dadosAlunno) {
            return res.status(500).json({ error: 'Aluno não encontrado' });
        }

        const turmaModel = new TurmaModel(clienteDbConnection);

        const getTurmaGrade = await turmaModel.getTurmaGrade({
            gympass_classid: data.slot.id,
            gympass_slotid: data.slot.class_id
        });

        const updateTurmaGradeAluno = await turmaModel.updateGradeAlunoCancela({
            gympass_bookingnumber: data.slot.booking_number,
            Presenca: 'cancelada',
            Sequencia: getTurmaGrade.Sequencia
        });

        if (!updateTurmaGradeAluno) {
            return res.status(500).json({ error: 'Falha na solicitação de cancelamento na reserva no banco de dados' });
        }

        res.status(200).json({ message: 'Evento de cancelamento de solicitação de reserva recebido' });
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

        const alunoModel = new AlunoModel(clienteDbConnection);
        const dadosAlunno = await alunoModel.getAluno({
            unique_token: data.user.unique_token
        });

        if (!dadosAlunno) {
            return res.status(500).json({ error: 'Aluno não encontrado' });
        }

        const turmaModel = new TurmaModel(clienteDbConnection);

        const getTurmaGrade = await turmaModel.getTurmaGrade({
            gympass_classid: data.slot.id,
            gympass_slotid: data.slot.class_id
        });

        const updateTurmaGradeAluno = await turmaModel.agendarTurma({
            gympass_bookingnumber: data.slot.booking_number,
            Presenca: 'S',
            AgendadoPor: 'n sei ainda',
            Sequencia: getTurmaGrade.Sequencia
        });

        if (!updateTurmaGradeAluno) {
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
