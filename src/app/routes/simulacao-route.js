const express = require('express');
const router = express.Router();
const SimulacaoController = require("../controllers/SimulacaoController");
const authChurch = require("../../config/authenticate");

router.post('/pedido-reserva', 
    authChurch.Authenticate, 
    SimulacaoController.BookingRequest
);

router.post('/pedido-cancelar',
    authChurch.Authenticate, 
    SimulacaoController.BookingCancel
)

router.post('/Check-in',
    authChurch.Authenticate, 
    SimulacaoController.Checkin
)

module.exports = router;