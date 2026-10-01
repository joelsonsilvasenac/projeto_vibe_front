const ProdutoRepository = require('../repositories/produtoRepository');

const listarProdutos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const produtos = await ProdutoRepository.getAllProdutos(limit, offset);
        res.json({ paginaAtual: page, itensPorPagina: limit, quantidadeRetornada: produtos.length, dados: produtos });
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: 'Erro interno' });
    }
};

const buscarProdutoPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ mensagem: 'ID inválido' });
        const resultado = await ProdutoRepository.getProdutoById(id);
        if (resultado.rowCount === 0) return res.status(404).json({ mensagem: 'Produto não encontrado' });
        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: 'Erro interno' });
    }
};

const criarProduto = async (req, res) => {
    try {
        const { nome, preco, descricao, estoque } = req.body;
        if (!nome || !preco || !descricao || estoque === undefined) {
             return res.status(400).json({ mensagem: 'nome, preco, descricao e estoque são obrigatórios' });
        }
        const novoProduto = await ProdutoRepository.createProduto(nome, preco, descricao, estoque);
        res.status(201).json(novoProduto);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: 'Erro ao cadastrar produto' });
    }
};

const atualizarProduto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ mensagem: 'ID inválido.' });

        const { nome, preco, descricao, estoque } = req.body;
        if (!nome || !preco || !descricao || estoque === undefined) {
            return res.status(400).json({ mensagem: 'Para atualizar, envie nome, preco, descricao e estoque obrigatoriamente.' });
        }

        const resultado = await ProdutoRepository.updateProduto(id, nome, preco, descricao, estoque);
        if (resultado.rowCount === 0) return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar produto' });
    }
};

const deletarProduto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ mensagem: 'ID inválido.' });
        const resultado = await ProdutoRepository.deleteProduto(id);
        if (resultado.rowCount === 0) return res.status(404).json({ mensagem: 'Produto não encontrado' });
        res.json({ mensagem: 'Produto deletado', deletado: resultado.rows[0] });
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: 'Erro ao deletar' });
    }
};

module.exports = { listarProdutos, buscarProdutoPorId, criarProduto, atualizarProduto, deletarProduto };