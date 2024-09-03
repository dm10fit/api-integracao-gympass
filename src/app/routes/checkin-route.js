const express = require('express');
const router = express.Router();
const CheckinController = require("../controllers/CheckinController");
const authChurch = require("../../config/authenticate");


router.post("/",  
    authChurch.Authenticate, 
    CheckinController.ValidarCheckin);

module.exports = router;