const express = require('express');
const router = express.Router();
const WebhookController = require("../controllers/WebhookController");

router.post("/requested", WebhookController.handleBookingRequested.bind(WebhookController));
router.post("/cancelation", WebhookController.handleBookingCanceled.bind(WebhookController));
router.post("/lateCancelation", WebhookController.handleBookingCanceled.bind(WebhookController));
router.post("/checkin-booking-occurred", WebhookController.handleCheckin.bind(WebhookController));

module.exports = router;
