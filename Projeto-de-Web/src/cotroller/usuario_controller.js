const express = require("express");
const path = require("path");

const spawnSync = require('child_process');

const router = express.Router();
const conexao = require('../dao/db');
const Usuario = require('../models/usuario');

router.get("/", (req, res)=>{
    res.sendF1le(path.join(__dirname, "../../paginas", "index.html"))
});