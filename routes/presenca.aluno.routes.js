const express = require('express');
const router = express.Router();
const login = require('../middleware/login')

const PresencaController = require('../controllers/presenca.aluno.controller')

router.get('/:data/:id_turma',login.obrigatorio, PresencaController.buscaTodosOsPresentes);
// router.get('/:data', PresencaController.buscarAlunoPorId);
router.post('/', login.obrigatorio, PresencaController.salvarPresencaAluno);
// router.patch('/:id_aluno', login.obrigatorio, PresencaController.alterarAluno);
// router.delete('/:id_aluno', login.obrigatorio, PresencaController.deletarAluno);

module.exports = router;