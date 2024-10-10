const axios = require("axios");
require('dotenv').config();

const url = "https://api.partners.gympass.com";
const authToken = process.env.AUTH_TOKEN;

class AulasService {
    async criarAula(data) {
        const dados = {
            classes: [
                {
                    name: data.nome,
                    description: data.descricao,
                    notes: data.notas,
                    bookable: true,
                    visible: true,
                    is_virtual: false,
                    product_id: data.product_id
                }
            ]
        };

        try {
            const options = {
                method: 'POST',
                url: `${url}/booking/v1/gyms/${data.gym_id}/classes`,
                headers: {
                    Authorization: `Bearer ${authToken}`
                },
                data: dados,
                maxBodyLength: Infinity
            };

            const response = await axios.request(options);
            console.log(JSON.stringify(response.data, null, 2));

            return response.data;

        } catch (error) {
            
            return  error.response.data;
        }
    }

    async listAulas(data) {
        try {
            const options = {
                method: 'GET',
               url: `${url}/setup/v1/gyms/${data}/classes`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                maxBodyLength: Infinity
            };

            const response = await axios.request(options);
            console.log(JSON.stringify(response.data, null, 2));

            return response.data;

        } catch (error) {
            
            return  error.response.data;
        }
    }

    async getAula(data) {
        try {
            const options = {
                method: 'GET',
                url: `${url}/booking/v1/gyms/${data.gym_id}/classes/${data.class_id}`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    'show-deleted': false
                },
                maxBodyLength: Infinity
            };

            const response = await axios.request(options);
            console.log(JSON.stringify(response.data, null, 2));

            return response.data;

        } catch (error) {
            if (error.response) {
                console.error(`Erro [GET /booking/v1/gyms/${data.gym_id}/classes/${data.class_id}]:`, error.response.status, error.response.data);
            } else {
                console.error(`Erro ao realizar a requisição:`, error.message);
            }
            throw error;
        }
    }

    async updateAula(data) {
        const dados = {
            name: data.nome,
            description: data.descricao, 
            bookable: true,
            visible: true, 
            product_id: data.product_id
        };

        try {
            const options = {
                method: 'PUT',
                url: `${url}/booking/v1/gyms/${data.gym_id}/classes/${data.class_id}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                data: dados,
                maxBodyLength: Infinity
            };

            const response = await axios.request(options);
            console.log(JSON.stringify(response.data, null, 2));

            return response.data;
            
        } catch (error) {
           
            return  error.response.data;
        }
    }
}

module.exports = AulasService;
