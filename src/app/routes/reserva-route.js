const express = require('express');
const router = express.Router();
const ReservaController = require("../controllers/ReservaController");


router.patch('/',   
    ReservaController.PatchReserva);

module.exports = router;