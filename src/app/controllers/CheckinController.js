const CheckinService = require('../services/CheckinService');
const checkinService = new CheckinService();

class CheckinController {

    async ValidarCheckin(req, res, next) {
        try {
            const data = req.body;
            const response = await checkinService.ValidateCheckin(data);

            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao validar check-in' });
            }

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CheckinController();
