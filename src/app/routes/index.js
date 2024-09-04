module.exports = (app) => {
    app.use("/aulas", require("./aulas-route")); 
    app.use("/slot", require("./reserva-route"));
    app.use("/reserva", require("./reserva-route"));
    app.use("/produtos", require("./produtos-route"));
    app.use("/checkin", require("./checkin-route"));
    app.use("/gym-webhook-url/booking", require("./webhook-route"));
    app.use("/simulacao", require("./simulacao-route"))
};
