const express = require('express');
const router = express.Router();
const CheckinController = require("../controllers/CheckinController"); 


router.post("/",   
    CheckinController.ValidarCheckin);

module.exports = router;