const SlotsService = require('../services/SlotsService');
const slotsService = new SlotsService();


class SlotsController {

    async CreateSlot(req, res, next) {
        try {
            const data = req.body;

            const response = await slotsService.createSlot(data);

            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao Criar Slot' });
            }

            res.status(201).json(response);

        } catch (error) {
            next(error);
        }
    }

    async GetSlot(req, res, next) {
        try {
            const data = {
                gym_id: req.params.gym_id,
                class_id: req.params.class_id,
                slot_id: req.params.slot_id
            };

            const response = await slotsService.getSlot(data);
            console.log(response.status)
            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao Consultar Slot' });
            }

            res.status(200).json(response);

        } catch (error) {
            next(error);
        }
    }

    async ListSlot(req, res, next) {
        try {
            const { from, to, gym_id, class_id } = req.body;

            // Verifica se from e to estão no formato ISO 8601 e os corrige se necessário
            //const formattedFrom = new Date(from).toISOString();
            //const formattedTo = new Date(to).toISOString();

            const data = {
                from: from,
                to: to,
                gym_id,
                class_id
            };

            const response = await slotsService.listSlots(data);

            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao Listar Slot' });
            }

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async DeleteSlot(req, res, next) {
        try {
            const data = {
                gym_id: req.params.gym_id,
                class_id: req.params.class_id,
                slot_id: req.params.slot_id
            };

            const response = await slotsService.deleteSlot(data);

            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao Deletar Slot' });
            }

            res.status(200).json(response);

        } catch (error) {
            next(error);
        }
    }

    async UpdateSlot(req, res, next) {
        try {

            req.body.gym_id = req.params.gym_id;
            req.body.slot_id = req.params.slot_id;
            req.body.class_id = req.params.class_id;

            const data = req.body;

            const response = await slotsService.updateSlot(data);
           
            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao Atualizar Slot' });
            }

            res.status(200).json(response);

        } catch (error) {
            next(error);
        }
    }

    async PatchSlot(req, res, next) {
        try {

            req.body.gym_id = req.params.gym_id;
            req.body.slot_id = req.params.slot_id;
            req.body.class_id = req.params.class_id;

            const data = req.body;
            console.log(data)
            const response = await slotsService.patchSlot(data);

            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao Atualizar Slot' });
            }

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SlotsController();
