const express = require('express');
const router = express.Router();
const AulasController = require("../controllers/AulasController");

router.post('/',  
    AulasController.CreateAulas);

router.get('/:gym_id', 
    AulasController.ListAulas);

router.get('/:gym_id/:class_id',
    AulasController.GetAulas);

router.put('/:gym_id/:class_id', 
    AulasController.UpdateAulas);

module.exports = router;