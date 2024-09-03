const axios = require("axios");
require('dotenv').config();

const url = "https://api.partners.gympass.com";
const authToken = process.env.AUTH_TOKEN;

class ProdutosService {

    async getProdutos(gym_id) { 
        
        try {
            const response = await axios({
                method: 'GET',
                url: `${url}/setup/v1/gyms/${gym_id}/products`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                maxBodyLength: Infinity
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

module.exports = new ProdutosService();
