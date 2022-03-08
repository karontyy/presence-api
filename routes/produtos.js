const express = require('express');
const router = express.Router();

//RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'RETORNA TODOS OS PRODUTOS'
    });
});

//RETORNA OS DADOS DE UM PRODUTO PELO I
router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto;

    if (id === 'especial') {
        res.status(200).send({
            mensagem: 'Você descobriu o ID especial',
            id: id
        });
    } else {
        res.status(200).send({
            mensagem: 'Vc passou um ID',
            id: id
        });
    }
});

// SALVA UM PRODUTO
router.post('/', (req, res, next) => {
    const produto = {
        nome: req.body.nome,
        preco: req.body.preco,
    }

    res.status(201).send({
        mensagem: 'INSERE PRODUTO',
        produtoCriado: produto
    });
});


// DELETA UM PRODUTO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'PRODUTO DELETADO'
    });
});

// ALTERA UM PRODUTO
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'PRODUTO ALTERADO'
    });
});
module.exports = router;