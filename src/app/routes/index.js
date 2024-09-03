module.exports = (app) => {
    app.use("/:idAcademia/aulas", require("./aulas-route")); 
    app.use("/:idAcademia/slot", require("./reserva-route"));
    app.use("/:idAcademia/reserva", require("./reserva-route"));
    app.use("/:idAcademia/produtos", require("./produtos-route"));
    app.use("/:idAcademia/checkin", require("./checkin-route"));
    app.use("/:idAcademia/gym-webhook-url/booking", require("./webhook-route"));
    app.use("/:idAcademia/simulacao", require("./simulacao-route"))
};
