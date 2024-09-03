const express = require('express');
const router = express.Router();
const AulasController = require("../controllers/AulasController");
const authChurch = require("../../config/authenticate");

router.post('/', 
    authChurch.Authenticate, 
    AulasController.CreateAulas);

router.get('/:gym_id', 
    authChurch.Authenticate,
    AulasController.ListAulas);

router.get('/:gym_id/:class_id',
    authChurch.Authenticate, 
    AulasController.GetAulas);

router.put('/:gym_id/:class_id', 
    authChurch.Authenticate,
    AulasController.UpdateAulas);

module.exports = router;