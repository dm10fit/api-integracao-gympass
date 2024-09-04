const express = require('express');
const router = express.Router();
const SlotsController = require("../controllers/SlotsController");

router.post('/', 
    SlotsController.CreateSlot);

router.get('/', 
    SlotsController.ListSlot);

router.get('/:gym_id/:class_id/:slot_id',
    SlotsController.GetSlot);

router.put('/:gym_id/:class_id/:slot_id', 
    SlotsController.UpdateSlot);

router.patch('/:gym_id/:class_id/:slot_id', 
    SlotsController.PatchSlot);

router.delete('/deletarslot/:gym_id/:class_id/:slot_id',
    SlotsController.DeleteSlot);

module.exports = router;