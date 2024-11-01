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
        const hmac = crypto.createHmac('sha1', this.secret); 
        const digest = hmac.update(body).digest('hex').toUpperCase(); 
      console.log(digest)
        return signature === digest; 
    }

    async handleCheckin(req, res, next) {

        if (!this.verifySignature(req)) {
            return res.status(403).json({ error: 'Assinatura inválida' });
        }

        const data = req.body;

        const dbConnection = await connectionDB('dm10fitaccess');
        const clienteModel = new ClienteModel(dbConnection);

        const pegaNomeDb = await clienteModel.pegaNomeDb({
            id: data.event_data.gym.id
        });

        if (!pegaNomeDb) {
            return res.status(404).json({ error: 'Banco de dados do cliente não encontrado' });
        }
 

        // Trocar a conexão para o banco de dados do cliente
        const clienteDbConnection = await connectionDB(pegaNomeDb.NomeBD);
        if (!clienteDbConnection) {
            return res.status(400).json({ error: 'Falha ao conectar ao banco de dados do cliente' });
        }

        // Pega os dados do aluno
        const alunoModel = new AlunoModel(clienteDbConnection);
        const dadosAlunno = await alunoModel.getAluno({
            unique_token: data.event_data.user.unique_token
        });

        if (!dadosAlunno) {
            return res.status(400).json({ error: 'Falha ao localizar Aluno' });
        }

        //valida se tem agendamento e da baixa de presenca
        const turmaModel = new TurmaModel(clienteDbConnection);
        const GetTurma = await turmaModel.getTurmaGradeAluno({
            aluno: dadosAlunno.RA
        });
 
        if(GetTurma.CodGrade){
        
            await turmaModel.updateGradeAlunoPresensa({
                Presenca: 'S',
                gympass_bookingnumber: GetTurma.gympass_bookingnumber
            });

        }

        //valida se foi feita a baixa de frequencia no dia
        const validaFrequencia = await turmaModel.validaFrequencia({
            ra: dadosAlunno.RA
        });

        if(validaFrequencia){
            res.status(200).json({ message: 'Aluno ja entrou na academia' });
        }

        //da acesso a catraca da academia e gera a frequencia
        const resultConf = await alunoModel.catracaConf();

        let sqlbusca;
        let buscaapi;
         
        if (pegaNomeDb.NomeCliente !== 18215) {
            
            if (resultConf.DiasLiberacaoCatraca === 'S') {
               
                sqlbusca = `SELECT RA FROM tblalunos WHERE CartaoAcesso = '${dadosAlunno.CartaoAcesso}'`; 
            } else {
               
                sqlbusca = `SELECT RA FROM tblalunos WHERE RA = '${dadosAlunno.RA}'`;
            }
        
           
            const resultLibera = await alunoModel.libera(sqlbusca);
         
            buscaapi = (resultLibera && resultLibera.length > 0) ? resultLibera[0].RA : dadosAlunno.RA;
        }

        let cliente;
        if(pegaNomeDb.NomeCliente == 'dm10fit'){
            cliente = 10002;
        } else {
            cliente = pegaNomeDb.NomeCliente;

        }

        const dadosCatraca = {
            codigoaluno: dadosAlunno.RA,
            xcliente: cliente,
            usr_filial: 1,
            diasTolerancia: resultConf.DiasLiberacaoCatraca,
            buscaapi: buscaapi
        } 
        const acessoService = new AcessoService();
        const responseCatraca = await acessoService.acessoCatraca(dadosCatraca);
         

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
            id: data.event_data.slot.gym_id
        });

        if (!pegaNomeDb) {
            return res.status(404).json({ error: 'Banco de dados do cliente não encontrado' });
        }

         await dbConnection.destroy();

         const clienteDbConnection = await connectionDB(pegaNomeDb.NomeBD); 
         if (!clienteDbConnection) {
             return res.status(400).json({ error: 'Falha ao conectar ao banco de dados do cliente' });
         }

        
        //pega os dados do aluno
        const alunoModel = new AlunoModel(clienteDbConnection);
        const dadosAlunno = await alunoModel.getAluno({
            unique_token: data.event_data.user.unique_token
        });
 
        if (!dadosAlunno) {
            return res.status(400).json({ error: 'Aluno não encontrado' });
        }

        //localiza em qual turma o aluno esta localizado
        const turmaModel = new TurmaModel(clienteDbConnection);

        //valida se reserva existe
        const validaExisteReserva = await turmaModel.validaRegistroTurma({
            ra: dadosAlunno.RA,
            gympass_bookingnumber: data.event_data.slot.booking_number
        })
        
        if (validaExisteReserva.length != 0) {
            return res.status(400).json({ error: 'Reserva ja foi criada' });
        }

        const getTurmaGrade = await turmaModel.getTurmaGrade({
            gympass_classid: data.event_data.slot.class_id, 
            gympass_slotid: data.event_data.slot.id
        });

        if (!getTurmaGrade) {
            return res.status(400).json({ error: 'Turma não encontrado' });
        }

        //adiciona a grade da turma do aluno
        const createGradeTurmaAluno = await turmaModel.createGradeTurmaAluno({
            CodGrade: getTurmaGrade.Sequencia,
            Aluno: dadosAlunno.RA ,
            AgendadoPor: 'A', 
            gympass_bookingnumber: data.event_data.slot.booking_number
        });

        if (!createGradeTurmaAluno) {
            return res.status(400).json({ error: 'Falha na solicitação na reserva no banco de dados' });
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
            id: data.event_data.slot.gym_id
        });

        if (!pegaNomeDb) {
            return res.status(404).json({ error: 'Banco de dados do cliente não encontrado' });
        }

        await dbConnection.destroy();

        // Trocar a conexão para o banco de dados do cliente
        const clienteDbConnection = await connectionDB(pegaNomeDb.NomeBD);
        if (!clienteDbConnection) {
            return res.status(400).json({ error: 'Falha ao conectar ao banco de dados do cliente' });
        }
 

        //pega os dados do aluno
        const alunoModel = new AlunoModel(clienteDbConnection);
        const dadosAlunno = await alunoModel.getAluno({
            unique_token: data.event_data.user.unique_token
        });
        if (!dadosAlunno) {
            return res.status(400).json({ error: 'Aluno não encontrado' });
        }

        //localiza a turma do aluno
        const turmaModel = new TurmaModel(clienteDbConnection);
        const getTurmaGrade = await turmaModel.getTurmaGrade({
            gympass_classid: data.event_data.slot.class_id,
            gympass_slotid:  data.event_data.slot.id
        }); 

        if (!getTurmaGrade) {
            return res.status(400).json({ error: 'Turma não encontrado' });
        }

        //exclui a grade da turma do aluno
        const deleteGradeTurma = await turmaModel.deleteGradeTurma({
            Sequencia: getTurmaGrade.Sequencia,
            gympass_bookingnumber: data.event_data.slot.booking_number
        });

        if (!deleteGradeTurma) {
            return res.status(400).json({ error: 'Falha ao cancelar reserva no banco de dados' });
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
