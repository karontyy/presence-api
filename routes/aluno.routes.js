const express = require('express');
const router = express.Router();
const login = require('../middleware/login')

const AlunoController = require('../controllers/aluno.controller')

router.get('/', AlunoController.buscaTodosOsAlunos);
router.get('/:data', AlunoController.buscarAlunoPorId);
router.post('/', login.obrigatorio, AlunoController.salvarAluno);
router.patch('/:id_aluno', login.obrigatorio, AlunoController.alterarAluno);
router.delete('/:id_aluno', login.obrigatorio, AlunoController.deletarAluno);

module.exports = router;