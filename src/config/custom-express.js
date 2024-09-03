require("dotenv").config({
    path: process.env.NODE_ENV,
});

const MyCustomErrors = require("./MyCustomErrors");

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require("../app/routes");

routes(app);

app.use((error, req, res, next) => {
    console.log(error);

    if (error instanceof MyCustomErrors) {
        return res.status(error.statusCode).json({
            message: error.message,
        });
    }

    return res.status(500).json({ message: "Internal Error" });
});
module.exports = app;
