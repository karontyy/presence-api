const express = require('express');
const router = express.Router();

const UsuarioController = require('../controllers/usuarios-controller')

router.post('/cadastro', UsuarioController.cadastroDeUsuarios);

router.post('/login', UsuarioController.loginDeUsuario);

module.exports = router;