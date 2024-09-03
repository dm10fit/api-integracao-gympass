const app = require('./config/custom-express');

const port = 8009;

app.listen(port, () => {
    console.log(`Server Rodando na porta ${port}`)
})