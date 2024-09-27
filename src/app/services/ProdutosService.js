const axios = require("axios");
require('dotenv').config();

const url = "https://api.partners.gympass.com";
const authToken = process.env.AUTH_TOKEN;

class ProdutosService {

    async getProdutos(gym_id) { 
        const method = 'GET'; 
        const path = `/setup/v1/gyms/${gym_id}/products`; 

        try {
            const response = await axios({
                method: method,
                url: `${url}${path}`,
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
            
            return  error.response.data;
        }
    }
}

module.exports = new ProdutosService();
