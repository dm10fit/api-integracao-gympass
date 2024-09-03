const express = require('express');
const router = express.Router();
const SlotsController = require("../controllers/SlotsController");
const authChurch = require("../../config/authenticate");

router.post('/', 
    authChurch.Authenticate, 
    SlotsController.CreateSlot);

router.get('/', 
    authChurch.Authenticate, 
    SlotsController.ListSlot);

router.get('/:gym_id/:class_id/:slot_id', 
    authChurch.Authenticate, 
    SlotsController.GetSlot);

router.put('/:id', 
    authChurch.Authenticate, 
    SlotsController.UpdateSlot);

router.patch('/:id', 
    authChurch.Authenticate, 
    SlotsController.PatchSlot);

router.delete('/deletarslot/:gym_id/:class_id/:slot_id', 
    authChurch.Authenticate, 
    SlotsController.DeleteSlot);

module.exports = router;