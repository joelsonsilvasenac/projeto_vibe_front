const pool = require('../config/db');

const getAllProdutos = async (limit, offset) => {
    const sql = 'SELECT * FROM produtos ORDER BY id LIMIT $1 OFFSET $2';
    const resultado = await pool.query(sql, [limit, offset]);
    return resultado.rows;
};

const getProdutoById = async (id) => {
    const sql = 'SELECT * FROM produtos WHERE id = $1';
    const resultado = await pool.query(sql, [id]);
    return resultado;
};

const createProduto = async (nome, preco, descricao, estoque) => {
    const sql = 'INSERT INTO produtos (nome, preco, descricao, estoque) VALUES ($1, $2, $3, $4) RETURNING *';
    const resultado = await pool.query(sql, [nome, preco, descricao, estoque]);
    return resultado.rows[0];
};

const updateProduto = async (id, nome, preco, descricao, estoque) => {
    const sql = 'UPDATE produtos SET nome = $1, preco = $2, descricao = $3, estoque = $4 WHERE id = $5 RETURNING *';
    const resultado = await pool.query(sql, [nome, preco, descricao, estoque, id]);
    return resultado;
};

const deleteProduto = async (id) => {
    const sql = 'DELETE FROM produtos WHERE id = $1 RETURNING *';
    const resultado = await pool.query(sql, [id]);
    return resultado;
};

const decrementarEstoque = async (id, quantidadeComprada) => {
    const sql = 'UPDATE produtos SET estoque = estoque - $1 WHERE id = $2 RETURNING *';
    await pool.query(sql, [quantidadeComprada, id]);
};

module.exports = { getAllProdutos, getProdutoById, createProduto, updateProduto, deleteProduto, decrementarEstoque };