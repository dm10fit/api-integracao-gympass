const ProdutosService = require('../services/ProdutosService'); 

class ProdutosController {

    async GetProdutos(req, res, next) {
        try {
            const gym_id = req.params.gym_id;
            const response = await ProdutosService.getProdutos(gym_id);

            if (response.error) {
                return res.status(response.error.status || 400).json({ error: response.error.message || 'Erro ao obter produtos' });
            }

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProdutosController();
