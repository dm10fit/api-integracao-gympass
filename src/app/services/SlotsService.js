const axios = require("axios");
require('dotenv').config();

const url = "https://api.partners.gympass.com";
const authToken = process.env.AUTH_TOKEN;

class SlotsService {

    async createSlot(data) {
        const dados = {
            occur_date: data.occur_date,
            status: data.status,
            room: data.room,
            length_in_minutes: data.length_in_minutes,
            total_capacity: data.total_capacity,
            total_booked: data.total_booked,
            product_id: data.product_id,
            booking_window: {
                opens_at: data.booking_window.opens_at,
                closes_at: data.booking_window.closes_at
            },
            cancellable_until: data.cancellable_until,
            instructors: data.instructors,
            rate: data.rate
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
            if (error.response) {
                console.error(`Erro [POST /booking/v1/gyms/${data.gym_id}/classes/${data.class_id}/slots]:`, error.response.status, error.response.data);
            } else {
                console.error(`Erro ao realizar a requisição:`, error.message);
            }
            throw error;
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
            if (error.response) {
                console.error(`Erro [GET /booking/v1/gyms/${data.gym_id}/classes/${data.class_id}/slots/${data.slot_id}]:`, error.response.status, error.response.data);
            } else {
                console.error(`Erro ao realizar a requisição:`, error.message);
            }
            throw error;
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
            if (error.response) {
                console.error(`Erro [GET /booking/v1/gyms/${data.gym_id}/classes/${data.class_id}/slots]:`, error.response.status, error.response.data);
            } else {
                console.error(`Erro ao realizar a requisição:`, error.message);
            }
            throw error;
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
            if (error.response) {
                console.error(`Erro [DELETE /booking/v1/gyms/${data.gym_id}/classes/${data.class_id}/slots/${data.slot_id}]:`, error.response.status, error.response.data);
            } else {
                console.error(`Erro ao realizar a requisição:`, error.message);
            }
            throw error;
        }
    }

    async updateSlot(data, params) {
        const dados = {
            occur_date: data.occur_date,
            room: data.room,
            status: data.status,
            length_in_minutes: data.length_in_minutes,
            total_capacity: data.total_capacity,
            total_booked: data.total_booked,
            product_id: data.product_id,
            booking_window: {
                opens_at: data.booking_window.opens_at,
                closes_at: data.booking_window.closes_at
            },
            instructors: data.instructors,
            cancellable_until: data.cancellable_until,
            rate: data.rate,
            virtual: data.virtual,
            virtual_class_url: data.virtual_class_url
        };

        try {
            const response = await axios({
                method: 'PUT',
                url: `${url}/booking/v1/gyms/${params.gym_id}/classes/${params.class_id}/slots/${params.slot_id}`,
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
            if (error.response) {
                console.error(`Erro [PUT /booking/v1/gyms/${data.gym_id}/classes/${data.class_id}/slots/${data.slot_id}]:`, error.response.status, error.response.data);
            } else {
                console.error(`Erro ao realizar a requisição:`, error.message);
            }
            throw error;
        }
    }

    async patchSlot(data) {
        const dados = {
            total_capacity: data.total_capacity,
            total_booked: data.total_booked,
            virtual_class_url: data.virtual_class_url
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
            if (error.response) {
                console.error(`Erro [PATCH /booking/v1/gyms/${data.gym_id}/classes/${data.class_id}/slots/${data.slot_id}]:`, error.response.status, error.response.data);
            } else {
                console.error(`Erro ao realizar a requisição:`, error.message);
            }
            throw error;
        }
    }
}

module.exports = SlotsService;
