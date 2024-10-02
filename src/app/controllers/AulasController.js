const AulasService = require('../services/AulasService');
const aulasService = new AulasService();
class AulasController {

    async CreateAulas(req, res, next) {
        try {
            const data = req.body;

            console.log(data)

            const response = await aulasService.criarAula(data);

             
            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao criar aula' });
            }

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    async ListAulas(req, res, next) {
        try {
            const data = req.params.gym_id;
            const response = await aulasService.listAulas(data);

            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao listar aulas' });
            }

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async GetAulas(req, res, next) {
        try {
            const data = {
                gym_id: req.params.gym_id,
                class_id: req.params.class_id
            };
            const response = await aulasService.getAula(data);

            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao obter aula' });
            }

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async UpdateAulas(req, res, next) {
        try {
            req.body.gym_id = req.params.gym_id;
            req.body.class_id = req.params.class_id;

            const data = req.body;
            const response = await aulasService.updateAula(data);

            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao atualizar aula' });
            }

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AulasController();
