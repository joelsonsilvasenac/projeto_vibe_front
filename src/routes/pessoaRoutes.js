const express = require('express');
const router = express.Router();
const pessoaController = require('../controllers/pessoaController');

router.get('/', pessoaController.listarPessoas);
router.get('/:id', pessoaController.buscarPessoaPorId);
router.get('/cpf/:cpf', pessoaController.buscarPessoaPorCpf);
router.post('/', pessoaController.criarPessoa);
router.put('/:id', pessoaController.atualizarPessoa);
router.delete('/:id', pessoaController.deletarPessoa);

module.exports = router;