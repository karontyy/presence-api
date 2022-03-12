const express = require('express');
const router = express.Router();
// const multer = require('multer');
const login = require('../middleware/login')

const TurmaController = require('../controllers/turma.controller')

//EXEMPLO UPLOAD DE IMAGENS
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './uploads/')
//     },
//     filename: function(req, file, cb){
//         cb(null, new Date().toISOString() + file.originalname)
//     }
// })

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5
//     }
// });

router.get('/',  login.obrigatorio, TurmaController.buscaTodasAsTurmas);
router.get('/:id_turma', login.obrigatorio,TurmaController.buscaTurmaPeloId);
router.post('/', login.obrigatorio, TurmaController.salvarTurma);
router.patch('/:id_turma', login.obrigatorio, TurmaController.alterarTurma);
router.delete('/:id_turma', login.obrigatorio, TurmaController.deletarTurma);

module.exports = router;