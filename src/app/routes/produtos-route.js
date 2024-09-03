const express = require('express');
const router = express.Router();
const ProdutosController = require("../controllers/ProdutosController");
const authChurch = require("../../config/authenticate");


router.get('/:gym_id', 
    authChurch.Authenticate,  
    ProdutosController.GetProdutos);

module.exports = router;