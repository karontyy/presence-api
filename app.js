const express = require('express');
const req = require('express/lib/request');
const app = express();

app.use((req, res, next) => {
    res.status(200).send({
        mensagem: "Ok, Deu bom"
    });
});

module.exports = app;
