const SimulacaoService = require('../services/SimulacaoService.js');
const simulacaoService = new SimulacaoService();

class SimulacaoController{

    async BookingRequest(req, res, next){
        try {
            const data = req.body;

            const response = await simulacaoService.Request(data);

            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao fazer o pedido de reserva' });
            }

            res.status(201).json(response);

        } catch (error) {
            next(error);
        }
    }

    async BookingCancel(req, res, next){
        try {
            
            const data = req.body;

            const response = await simulacaoService.Cancel(data);

            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao Cancelar a reserva' });
            }

            res.status(201).json(response);

        } catch (error) {
            next(error);
        }
    }

    async Checkin(req, res, next){
        try {
            
            const data = req.body;

            const response = await simulacaoService.Checkin(data);

            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao fazer checkin' });
            }

            res.status(201).json(response);

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SimulacaoController();