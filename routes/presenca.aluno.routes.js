const express = require('express');
const router = express.Router();
const login = require('../middleware/login')

const PresencaController = require('../controllers/presenca.aluno.controller')

router.get('/:data/:id_turma', PresencaController.buscaTodosOsPresentes);
// router.get('/:data', PresencaController.buscarAlunoPorId);
router.post('/', PresencaController.salvarPresencaAluno);
// router.patch('/:id_aluno', login.obrigatorio, PresencaController.alterarAluno);
// router.delete('/:id_aluno', login.obrigatorio, PresencaController.deletarAluno);

module.exports = router;