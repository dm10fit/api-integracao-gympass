const axios = require("axios");
require('dotenv').config();

const url = "https://api.partners.gympass.com";
const authToken = process.env.AUTH_TOKEN;

class CheckinService {

    async ValidateCheckin(data) {
        const dados = {
            gympass_id: data.gympass_id
        };

        return this.sendRequest('POST', '/access/v1/validate', dados, data.gym_id);
    }

    async sendRequest(method, path, data = null, gym_id = null) {
        try {
            const options = {
                method,
                url: `${url}${path}`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                    'X-Gym-Id': gym_id, 
                },
                data,
                maxBodyLength: Infinity,
            };

            const response = await axios.request(options);
            console.log(JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error(`Erro [${method.toUpperCase()} ${path}]:`, error.response.status, error.response.data);
            } else {
                console.error(`Erro ao realizar a requisição [${method.toUpperCase()} ${path}]:`, error.message);
            }
            throw error;
        }
    }
}

module.exports = CheckinService;
