const express = require('express');
const router = express.Router();

const pedidosController = require('../controllers/pedidos-controller')

router.get('/', pedidosController.getPedidos);
router.get('/:id_pedido', pedidosController.getPedidoById);
router.post('/', pedidosController.salvaPedido);
router.delete('/:id_pedido', pedidosController.deletaPedido);

module.exports = router;