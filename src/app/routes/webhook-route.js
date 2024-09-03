const express = require('express');
const router = express.Router();
const WebhookController = require("../controllers/WebhookController");

router.post("/requested", WebhookController.requested.bind(WebhookController));
router.post("/cancelation", WebhookController.cancelation.bind(WebhookController));
router.post("/lateCancelation", WebhookController.lateCancelation.bind(WebhookController));
router.post("/checkin-booking-occurred", WebhookController.checkin_booking_occurred.bind(WebhookController));

module.exports = router;
