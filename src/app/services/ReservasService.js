const axios = require("axios");
require('dotenv').config();

const url = "https://api.partners.gympass.com";
const authToken = process.env.AUTH_TOKEN;

class ReservasService {

    async ValidarReserva(data) {
        const dados = {
            status: data.status,
            reason: data.reason,
            reason_category: data.reason_category,
            virtual_class_url: data.virtual_class_url
        };

        const method = 'PATCH';
        const path = `/booking/v1/gyms/${data.gym_id}/bookings/${data.booking_number}`;
        
        try {
            const response = await axios({
                method: method,
                url: `${url}${path}`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                data: dados,
                maxBodyLength: Infinity,
            });

            console.log(JSON.stringify(response.data, null, 2));
            return response.data;

        } catch (error) {
            if (error.response) {
                console.error(`Erro [${method} ${path}]:`, error.response.status, error.response.data);
            } else {
                console.error(`Erro ao realizar a requisição [${method} ${path}]:`, error.message);
            }
            throw error;
        }
    }
}

module.exports = ReservasService;
