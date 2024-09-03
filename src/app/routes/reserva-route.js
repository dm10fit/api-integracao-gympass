const express = require('express');
const router = express.Router();
const ReservaController = require("../controllers/ReservaController");
const authChurch = require("../../config/authenticate");

router.patch('/',  
    authChurch.Authenticate, 
    ReservaController.PatchReserva);

module.exports = router;