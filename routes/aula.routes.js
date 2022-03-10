const express = require('express');
const router = express.Router();
// const multer = require('multer');
const login = require('../middleware/login')

const AulaController = require('../controllers/aula.controller')

router.get('/', AulaController.buscaTodasAsAulas);
router.get('/:data', AulaController.buscarAulaPorData);
router.post('/', login.obrigatorio, AulaController.salvarAula);
router.patch('/:id_aula', login.obrigatorio, AulaController.alterarAula);
router.delete('/:id_aula', login.obrigatorio, AulaController.deletarAula);

module.exports = router;