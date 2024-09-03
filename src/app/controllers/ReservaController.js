const ReservasService = require('../services/ReservasService');
const reservasService = new ReservasService();

class ReservaController{

    async PatchReserva(req, res, next){
        try {
            const data = req.body;

            const response = await reservasService.ValidarReserva(data);

            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao Atualizar as reservas' });
            }

            res.status(200).json(response);

        } catch (error) {
            next(error)
        }
    }

}

module.exports = new ReservaController();