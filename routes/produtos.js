const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login')

const ProdutoController = require('../controllers/peodutos-controller')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

router.get('/', ProdutoController.buscaPordutos);
router.get('/:id_produto', ProdutoController.buscaProdutoPeloId);
router.post('/', login.obrigatorio, upload.single('imagem_produto'), ProdutoController.salvaProduto);
router.delete('/:id_produto', login.obrigatorio, ProdutoController.deletaProduto);
router.patch('/:id_produto', login.obrigatorio, upload.single('imagem_produto'), ProdutoController.alteraProduto);

module.exports = router;