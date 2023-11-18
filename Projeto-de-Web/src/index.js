const express = require("express");
const router = express.Router();
const path = require("path");
const bodyParser = require(body-parser);

const app = express();
const bd = require('./dao/db');
const Usuario = require('./models/usuario');
const UsuarioController = require('./controller/usuario_controller');

app.listen(3030, ()=>{
    console.log("Servidor rodando")
});

