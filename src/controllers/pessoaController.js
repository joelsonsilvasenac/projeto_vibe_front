const PessoaRepository = require('../repositories/pessoaRepository');

const listarPessoas = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const pessoas = await PessoaRepository.getAllPessoas(limit, offset);
        res.json({ paginaAtual: page, itensPorPagina: limit, quantidadeRetornada: pessoas.length, dados: pessoas });
    } catch (erro) {
        console.error('Erro ao buscar pessoas:', erro.message);
        res.status(500).json({ mensagem: 'Erro interno ao buscar pessoas' });
    }
};

const buscarPessoaPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ mensagem: 'ID inválido' });
        const resultado = await PessoaRepository.getPessoaById(id);
        if (resultado.rowCount === 0) return res.status(404).json({ mensagem: 'Pessoa não encontrada pelo ID' });
        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: 'Erro interno' });
    }
};

const buscarPessoaPorCpf = async (req, res) => {
    try {
        const cpf = req.params.cpf;
        const resultado = await PessoaRepository.getPessoaByCpf(cpf);
        if (resultado.rowCount === 0) return res.status(404).json({ mensagem: 'Pessoa não encontrada pelo CPF' });
        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: 'Erro interno' });
    }
};

const criarPessoa = async (req, res) => {
    try {
        const { nome, email, telefone, cpf, senha } = req.body;
        const novaPessoa = await PessoaRepository.createPessoa(nome, email, telefone, cpf, senha);
        res.status(201).json(novaPessoa);
    } catch (erro) {
        if (erro.code === '23505') return res.status(400).json({ mensagem: 'Este email ou CPF já está cadastrado' });
        res.status(500).json({ mensagem: 'Erro ao cadastrar pessoa' });
    }
};

const atualizarPessoa = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ mensagem: 'O ID informado na URL é inválido.' });

        const { nome, email, telefone, cpf, senha } = req.body;
        if (!nome || !email || !telefone || !cpf || !senha) {
            return res.status(400).json({ mensagem: 'Para atualizar, você deve enviar nome, email, telefone, cpf e senha obrigatoriamente.' });
        }

        const resultado = await PessoaRepository.updatePessoa(id, nome, email, telefone, cpf, senha);
        if (resultado.rowCount === 0) return res.status(404).json({ mensagem: 'Pessoa não encontrada no banco de dados.' });
        res.json(resultado.rows[0]);
    } catch (erro) {
        if (erro.code === '23505') return res.status(400).json({ mensagem: 'Este email ou CPF já pertence a outro usuário' });
        res.status(500).json({ mensagem: 'Erro ao atualizar pessoa' });
    }
};

const deletarPessoa = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ mensagem: 'O ID informado na URL é inválido.' });

        const resultado = await PessoaRepository.deletePessoa(id);
        if (resultado.rowCount === 0) return res.status(404).json({ mensagem: 'Pessoa não encontrada para exclusão' });
        res.json({ mensagem: 'Pessoa deletada com sucesso', deletada: resultado.rows[0] });
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: 'Erro ao deletar pessoa' });
    }
};

module.exports = { listarPessoas, buscarPessoaPorId, buscarPessoaPorCpf, criarPessoa, atualizarPessoa, deletarPessoa };