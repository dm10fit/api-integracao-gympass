const axios = require("axios");
require('dotenv').config();

const url = "https://api.partners.gympass.com";
const authToken = process.env.AUTH_TOKEN;

class SimulacaoService {

    async Request(data) {

        const dados = {
            gympass_user_id: data.gympass_user_id,
            slot_id: data.slot_id,
            class_id: data.class_id
        }

        try {
            const response = await axios({
                method: 'POST',
                url: `${url}/helper/v1/gyms/${data.gym_id}/simulate/bookings`,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                data: dados
            });

            console.log(JSON.stringify(response.data, null, 2));

            return response.data;

        } catch (error) {
            
            return  error.response.data;
        }

    }

    async Cancel(data) {

        try {

            const response = await axios({
                method: 'POST',
                url: `${url}/helper/v1/gyms/${data.gym_id}/simulate/bookings/${data.booking}/cancel`,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                }
            });

            console.log(JSON.stringify(response.data, null, 2));

            return response.data;

        } catch (error) {
          
            return  error.response.data;
        }

    }

    async Checkin(data) {
        const dados = {
            gympass_user_id: data.gympass_user_id,
            product_id: data.product_id,
            booking_number: data.booking_number
        }

        try {

            const response = await axios({
                method: 'POST',
                url: `${url}/helper/v1/gyms/${data.gym_id}/simulate/checkins`,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                data: dados
            });

            console.log(JSON.stringify(response.data, null, 2));

            return response.data;

        } catch (error) {
          
            return  error.response.data
        }
    }


}

module.exports = SimulacaoService;