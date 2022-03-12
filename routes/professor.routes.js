const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

const ProfessorController = require('../controllers/professor.controllers')

router.post('/cadastro', ProfessorController.cadastroDeUsuarios);
router.post('/login', ProfessorController.loginDeUsuario);
router.get('/dadosCadastrais/:id_professor', login.obrigatorio, ProfessorController.buscaDadosProfessor);
module.exports = router;