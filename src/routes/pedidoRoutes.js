const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.get('/', pedidoController.listarPedidos);
router.get('/pessoa/:pessoa_id', pedidoController.buscarPedidosPorPessoa);
router.post('/', pedidoController.criarPedido);
router.put('/:id', pedidoController.atualizarPedido);
router.delete('/:id', pedidoController.deletarPedido);

module.exports = router;