const axios = require("axios");
require('dotenv').config();

const url = "https://api.partners.gympass.com";
const authToken = process.env.AUTH_TOKEN;

class SlotsService {

    async createSlot(data) {
        const dados = {
            occur_date: data.occur_date,
            length_in_minutes: data.length_in_minutes,
            total_capacity: data.total_capacity,
            total_booked: data.total_booked,
            product_id: data.product_id
             
        };

        try {
            const response = await axios({
                method: 'POST',
                url: `${url}/booking/v1/gyms/${data.gym_id}/classes/${data.class_id}/slots`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                data: dados,
                maxBodyLength: Infinity
            });
            console.log(JSON.stringify(response.data, null, 2));
            
            return response.data;

        } catch (error) {
            return  error.response.data;
        }
    }

    async getSlot(data) {
        try {
            const response = await axios({
                method: 'GET',
                url: `${url}/booking/v1/gyms/${data.gym_id}/classes/${data.class_id}/slots/${data.slot_id}`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                maxBodyLength: Infinity
            });

            console.log(JSON.stringify(response.data, null, 2));
            
            return response.data;

        } catch (error) {
          
            return  error.response.data;

        }
    }

    async listSlots(data) {
        try {
            const response = await axios({
                method: 'GET',
                url: `${url}/booking/v1/gyms/${data.gym_id}/classes/${data.class_id}/slots`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                params: {
                    from: data.from,
                    to: data.to
                },
                maxBodyLength: Infinity
            });

            console.log(JSON.stringify(response.data, null, 2));

            return response.data;

        } catch (error) {
            return  error.response.data;
        }
    }

    async deleteSlot(data) {
        try {
            const response = await axios({
                method: 'DELETE',
                url: `${url}/booking/v1/gyms/${data.gym_id}/classes/${data.class_id}/slots/${data.slot_id}`,
                headers: {
                    Accept: 'aplication/json',
                    Authorization: `Bearer ${authToken}`
                },
                maxBodyLength: Infinity
            });

            console.log(JSON.stringify(response.data, null, 2));

            return response.data;
            
        } catch (error) {
            return  error.response.data;
        }
    }

    async updateSlot(data) {
        const dados = {
            occur_date: data.occur_date, 
            length_in_minutes: data.length_in_minutes,
            total_capacity: data.total_capacity,
            total_booked: data.total_booked,
            product_id: data.product_id,  
        };


        let method = 'PUT';
        let patch = `${url}/booking/v1/gyms/${data.gym_id}/classes/${data.class_id}/slots/${data.slot_id}`;
        
        try {
            const response = await axios({
                method: method,
                url: patch,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                data: dados,
                maxBodyLength: Infinity
            });
            
            console.log(JSON.stringify(response.data, null, 2));
           
            return response.data;
            
        } catch (error) {
           
            return  error.response.data;
        }
    }

    async patchSlot(data) {
        const dados = {
            total_capacity: data.total_capacity,
            total_booked: data.total_booked
        };

        try {
            const response = await axios({
                method: 'PATCH',
                url: `${url}/booking/v1/gyms/${data.gym_id}/classes/${data.class_id}/slots/${data.slot_id}`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: dados,
                maxBodyLength: Infinity
            });

            console.log(JSON.stringify(response.data, null, 2));

            return response.data;
            
        } catch (error) {
            return  error.response.data;
        }
    }
}

module.exports = SlotsService;
