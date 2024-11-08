const crypto = require('crypto');
const connectionDB = require('../../config/database');
const ClienteModel = require('../model/ClienteModel');
const TurmaModel = require('../model/TurmaModel');
const AlunoModel = require('../model/AlunoModel');
const AcessoService = require('../services/AcessoService');
const CheckinService = require('../services/CheckinService');
const ReservasService = require('../services/ReservasService');
const SlotService = require('../services/SlotsService')

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
 
        //adicionar cliente wellhub no sistema caso nao esteja cadastro

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

        const turmaModel = new TurmaModel(clienteDbConnection);

        let alunoRA = '';
        if (!dadosAlunno) {
            //return res.status(400).json({ error: 'Falha ao localizar Aluno' });


            let nome = `${data.event_data.user.first_name} ${data.event_data.user.last_name}`

            //registra o aluno na academia
            const criaAluno = await alunoModel.criarCliente({
                Nome:  nome,
                Celular: data.event_data.user.phone_number,
                Email: data.event_data.user.email,
                token_gympass: data.event_data.user.unique_token,
            });

            alunoRA = criaAluno.insertId;
            console.log(alunoRA)
        } else {
            alunoRA = dadosAlunno.RA;
        }



      //valida se tem agendamento e da baixa de presenca
         /* const GetTurma = await turmaModel.getTurmaGradeAluno({
            aluno: dadosAlunno.RA
        });
 
        if(GetTurma.CodGrade){
        
            await turmaModel.updateGradeAlunoPresensa({
                Presenca: 'S',
                gympass_bookingnumber: GetTurma.gympass_bookingnumber
            });

        }*/

        //valida se foi feita a baixa de frequencia no dia
        const validaFrequencia = await turmaModel.validaFrequencia({
            ra: alunoRA
        });

        if(validaFrequencia.length != 0){
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
               
                sqlbusca = `SELECT RA FROM tblalunos WHERE RA = '${alunoRA}'`;
            }
        
           
            const resultLibera = await alunoModel.libera(sqlbusca);
         
            buscaapi = (resultLibera && resultLibera.length > 0) ? resultLibera[0].RA : alunoRA;
        }

        let cliente;
        if(pegaNomeDb.NomeCliente == 'dm10fit'){
            cliente = 10002;
        } else {
            cliente = pegaNomeDb.NomeCliente;

        }

        const dadosCatraca = {
            codigoaluno: alunoRA,
            xcliente: cliente,
            usr_filial: 1,
            diasTolerancia: resultConf.DiasLiberacaoCatraca,
            buscaapi: buscaapi
        } 
        //const acessoService = new AcessoService();
        const responseCatraca = await acessoService.acessoCatraca(dadosCatraca);
         

        return res.status(200).json({ message: 'Evento de check-in recebido' });
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
        console.log(pegaNomeDb.NomeBD)

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
        

        const getTurmaGrade = await turmaModel.getTurmaGrade({
            gympass_classid: data.event_data.slot.class_id, 
            gympass_slotid: data.event_data.slot.id
        });

        if (!getTurmaGrade) {
            return res.status(400).json({ error: 'Turma não encontrado' });
        }

        if (validaExisteReserva.length != 0) {

            //da update na reserva
            await turmaModel.updateTurmaGradeAluno({
                gympass_bookingnumber: data.event_data.slot.booking_number,
                Sequencia: validaExisteReserva.Sequencia
            });
            
            
             
        } else {

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
            
        }
        

        //aceita a reserva do aluno
        const reservaService = new ReservasService();
        const resReservaService = await reservaService.ValidarReserva({
            status: 2,
            class_id:data.event_data.slot.class_id,
            gym_id: data.event_data.slot.gym_id,
            booking_number: data.event_data.slot.booking_number
        });

        console.log(resReservaService);

        //insere na tblreserva que notifica o sistema web
        await turmaModel.createNotificaReserva({
            ra: dadosAlunno.RA ,
            unique_token: data.event_data.user.unique_token,
            slot: data.event_data.slot.id,
            class_id: data.event_data.slot.class_id,
            booking_number: data.event_data.slot.booking_number
        });

        //atualiza slotgym passs
        const countTurmaGradeAluno = await turmaModel.countAlunosGrade({
            CodGrade: getTurmaGrade.Sequencia
        });

        console.log(countTurmaGradeAluno.count)

        //atualiza tblturmagrade
        await turmaModel.updateTurmaGrade({
            Sequencia: getTurmaGrade.Sequencia,
            maximoDeReserva: countTurmaGradeAluno.count
        })

        let occur_dateSlot = getTurmaGrade.Data; 
        let horaIniSlot = getTurmaGrade.HoraInicio; 
        let horaFimSlot = getTurmaGrade.HoraTermino;  

        // Combina a data e a hora inicial em um único objeto Date  
        let dataDe = new Date(`${occur_dateSlot}T${horaIniSlot}Z`);  

        // Formata a data no formato desejado (Y-m-d\TH:i:s.000\Z)  
        let formattedDate = dataDe.toISOString(); 

        // Calcula a diferença em minutos  
        let inicio = new Date(`${occur_dateSlot}T${horaIniSlot}Z`);  
        let fim = new Date(`${occur_dateSlot}T${horaFimSlot}Z`);  
        let diferencaEmMs = fim - inicio;   
        let diferencaEmMinutos = Math.floor(diferencaEmMs / (1000 * 60)); 

        const slotService = new SlotService();
        await slotService.updateSlot({
            occur_date: formattedDate,
            length_in_minutes: diferencaEmMinutos,
            total_capacity: getTurmaGrade.limiteAlunos,
            total_booked: countTurmaGradeAluno.count,
            product_id: getTurmaGrade.produto,
            gym_id: data.event_data.slot.gym_id,
            class_id: data.event_data.slot.class_id,
            slot_id: data.event_data.slot.id
        });

        

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


        //atualiza slotgym passs
        const countTurmaGradeAluno = await turmaModel.countAlunosGrade({
            CodGrade: getTurmaGrade.Sequencia
        });

        let occur_dateSlot = getTurmaGrade.Data; 
        let horaIniSlot = getTurmaGrade.HoraInicio; 
        let horaFimSlot = getTurmaGrade.HoraTermino;  

        // Combina a data e a hora inicial em um único objeto Date  
        let dataDe = new Date(`${occur_dateSlot}T${horaIniSlot}Z`);  

        // Formata a data no formato desejado (Y-m-d\TH:i:s.000\Z)  
        let formattedDate = dataDe.toISOString(); 

        // Calcula a diferença em minutos  
        let inicio = new Date(`${occur_dateSlot}T${horaIniSlot}Z`);  
        let fim = new Date(`${occur_dateSlot}T${horaFimSlot}Z`);  
        let diferencaEmMs = fim - inicio;   
        let diferencaEmMinutos = Math.floor(diferencaEmMs / (1000 * 60)); 

        const datacu ={
            occur_date: formattedDate,
            length_in_minutes: diferencaEmMinutos,
            total_capacity: getTurmaGrade.limiteAlunos,
            total_booked: countTurmaGradeAluno.count-1,
            product_id: getTurmaGrade.produto,
            gym_id: data.event_data.slot.gym_id,
            class_id: data.event_data.slot.class_id,
            slot_id: data.event_data.slot.id
        }

        console.log(datacu)

        const slotService = new SlotService();
        await slotService.updateSlot(datacu);

        //insere na tblreserva que notifica o sistema web
        await turmaModel.createNotificaReserva({
            ra: dadosAlunno.RA ,
            unique_token: data.event_data.user.unique_token,
            slot: data.event_data.slot.id,
            class_id: data.event_data.slot.class_id,
            booking_number: data.event_data.slot.booking_number
        });
        
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
