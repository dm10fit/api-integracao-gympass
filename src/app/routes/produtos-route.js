const express = require('express');
const router = express.Router();
const ProdutosController = require("../controllers/ProdutosController"); 

router.get('/:gym_id',  
    ProdutosController.GetProdutos);

module.exports = router;