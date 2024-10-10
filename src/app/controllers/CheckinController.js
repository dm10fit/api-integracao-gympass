const CheckinService = require('../services/CheckinService');
const checkinService = new CheckinService();
const connectionDB = require('../../config/database');
const ClienteModel = require('../model/ClienteModel'); 
const AlunoModel = require('../model/AlunoModel');
const AcessoService = require('../services/AcessoService');


class CheckinController {

    async ValidarCheckin(req, res, next) {
        try {
            const data = req.body;
            const response = await checkinService.ValidateCheckin(data);

            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao validar check-in' });
            }

            const dbConnection = await connectionDB('dm10fitaccess');
            const clienteModel = new ClienteModel(dbConnection);
            console.log(response)
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CheckinController();
