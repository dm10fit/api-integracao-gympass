const axios = require("axios");
require('dotenv').config();

const url = "https://api.partners.gympass.com";

class AcessoService {

    async acessoCatraca(data){

        try {
            const url = 'https://app.dm10fit.com.br/ctrFrequenciaManualXHRGympass/ctrFrequenciaManualXHRGympass.php';
            
            const dados = {
                xcliente: data.xcliente,
                codigoaluno: data.codigoaluno,
                usr_filial: data.usr_filial,
                diasTolerancia: data.DiasLiberacaoCatraca,
                buscaapi: data.buscaapi
            };

            // Configurações da requisição
            const options = {
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Ou 'application/json' se for o caso
                },
                data: new URLSearchParams(dados), // Se for enviar como form-data
                maxBodyLength: Infinity
            };

            const response = await axios(options);
            
            return response.data;
            
        } catch (error) {
            console.error('Erro ao acessar a catraca:', error);
            throw error;
        }
    }

}


module.exports = AcessoService;