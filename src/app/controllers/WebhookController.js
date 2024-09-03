const crypto = require('crypto');

class Webhook {
    constructor() {
        this.secret = process.env.WEBHOOK_SECRET; 
    }

    verifySignature(req) {
        const signature = req.headers['x-gympass-signature'];
        const body = JSON.stringify(req.body);
        const hmac = crypto.createHmac('sha1', this.secret);
        const digest = hmac.update(body).digest('hex').toUpperCase();
        return signature === digest;
    }

    async requested(req, res, next) {
        if (!this.verifySignature(req)) {
            return res.status(401).send('Assinatura inválida');
        }
        
        res.status(200).send('Evento solicitado recebido');
    }

    async cancelation(req, res, next) {
        if (!this.verifySignature(req)) {
            return res.status(401).send('Assinatura inválida');
        }
        
        res.status(200).send('Received cancelation event');
    }

    async lateCancelation(req, res, next) {
        if (!this.verifySignature(req)) {
            return res.status(401).send('Assinatura inválida');
        }
  
        res.status(200).send('Received lateCancelation event');
    }

    async checkin_booking_occurred(req, res, next) {
        if (!this.verifySignature(req)) {
            return res.status(401).send('Assinatura inválida');
        } 

        res.status(200).send('Received checkin_booking_occurred event');
    }
}

module.exports = new Webhook();
