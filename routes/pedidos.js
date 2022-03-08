const express = require('express');
const router = express.Router();

//RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'RETORNA OS PEDIDOS'
    });
});

//RETORNA OS DADOS DE UM PEDIDO PELO ID
router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido;
        res.status(200).send({
            mensagem: 'DETALHES DO PEDIDO',
            id: id
        });
});

// SALVA UM PEDIDO
router.post('/', (req, res, next) => {
    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade,
    }

    res.status(201).send({
        mensagem: 'INSERE PEDIDO',
        produtoCriado: pedido
    });
});


// DELETA UM PEDIDOS
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'PEDIDO DELETADO'
    });
});

module.exports = router;