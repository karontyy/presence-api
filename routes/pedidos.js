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
    res.status(201).send({
        mensagem: 'PEDIDO ADICIONADO'
    });
});


// DELETA UM PEDIDOS
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'PEDIDO DELETADO'
    });
});

module.exports = router;