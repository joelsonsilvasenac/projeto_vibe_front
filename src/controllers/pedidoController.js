const PedidoRepository = require('../repositories/pedidoRepository');
const ProdutoRepository = require('../repositories/produtoRepository');

const listarPedidos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const pedidos = await PedidoRepository.getAllPedidos(limit, offset);
        res.json({ paginaAtual: page, itensPorPagina: limit, quantidadeRetornada: pedidos.length, dados: pedidos });
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: 'Erro interno ao buscar pedidos' });
    }
};

const buscarPedidosPorPessoa = async (req, res) => {
    try {
        const pessoa_id = parseInt(req.params.pessoa_id);
        if (isNaN(pessoa_id)) return res.status(400).json({ mensagem: 'ID da pessoa inválido' });
        const pedidos = await PedidoRepository.getPedidosByPessoaId(pessoa_id);
        if (pedidos.length === 0) return res.status(404).json({ mensagem: 'Nenhum pedido encontrado para esta pessoa.' });
        res.json(pedidos);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: 'Erro interno' });
    }
};

const criarPedido = async (req, res) => {
    try {
        const { pessoa_id, produto_id, quantidade } = req.body;
        
        if (!pessoa_id || !produto_id || !quantidade) {
            return res.status(400).json({ mensagem: 'pessoa_id, produto_id e quantidade são obrigatórios' });
        }
        if (quantidade <= 0) return res.status(400).json({ mensagem: 'A quantidade deve ser maior que zero' });

        const produtoResult = await ProdutoRepository.getProdutoById(produto_id);
        if (produtoResult.rowCount === 0) {
            return res.status(404).json({ mensagem: 'O produto informado não existe.' });
        }

        const produto = produtoResult.rows[0];
        if (produto.estoque < quantidade) {
            return res.status(400).json({ mensagem: `Estoque insuficiente. Temos apenas ${produto.estoque} unidade(s) do produto '${produto.nome}'.` });
        }

        const novoPedido = await PedidoRepository.createPedido(pessoa_id, produto_id, quantidade);
        await ProdutoRepository.decrementarEstoque(produto_id, quantidade);

        res.status(201).json(novoPedido);
    } catch (erro) {
        if (erro.code === '23503') return res.status(404).json({ mensagem: 'Pessoa informada não existe.' });
        console.error(erro.message);
        res.status(500).json({ mensagem: 'Erro ao cadastrar pedido' });
    }
};

const atualizarPedido = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ mensagem: 'O ID informado na URL é inválido.' });

        const { pessoa_id, produto_id, quantidade } = req.body;
        if (!pessoa_id || !produto_id || !quantidade) {
            return res.status(400).json({ mensagem: 'Para atualizar, envie pessoa_id, produto_id e quantidade obrigatoriamente.' });
        }

        const resultado = await PedidoRepository.updatePedido(id, pessoa_id, produto_id, quantidade);
        if (resultado.rowCount === 0) return res.status(404).json({ mensagem: 'Pedido não encontrado no banco de dados.' });
        res.json(resultado.rows[0]);
    } catch (erro) {
        if (erro.code === '23503') return res.status(404).json({ mensagem: 'A pessoa ou o produto informado não existe.' });
        res.status(500).json({ mensagem: 'Erro ao atualizar pedido' });
    }
};

const deletarPedido = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ mensagem: 'O ID informado na URL é inválido.' });

        const resultado = await PedidoRepository.deletePedido(id);
        if (resultado.rowCount === 0) return res.status(404).json({ mensagem: 'Pedido não encontrado para exclusão' });
        res.json({ mensagem: 'Pedido deletado com sucesso', deletado: resultado.rows[0] });
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: 'Erro ao deletar pedido' });
    }
};

module.exports = { listarPedidos, buscarPedidosPorPessoa, criarPedido, atualizarPedido, deletarPedido };