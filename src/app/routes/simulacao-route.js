const express = require('express');
const router = express.Router();
const SimulacaoController = require("../controllers/SimulacaoController"); 

router.post('/pedido-reserva',  
    SimulacaoController.BookingRequest
);

router.post('/pedido-cancelar', 
    SimulacaoController.BookingCancel
)

router.post('/Check-in', 
    SimulacaoController.Checkin
)

module.exports = router;