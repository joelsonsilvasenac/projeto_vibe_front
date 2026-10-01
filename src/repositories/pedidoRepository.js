const pool = require('../config/db');

const getAllPedidos = async (limit, offset) => {
    const sql = `SELECT pedidos.id AS pedido_id, pessoas.nome AS cliente, produtos.nome AS produto, pedidos.quantidade, pedidos.data_pedido FROM pedidos INNER JOIN pessoas ON pedidos.pessoa_id = pessoas.id INNER JOIN produtos ON pedidos.produto_id = produtos.id ORDER BY pedidos.data_pedido DESC LIMIT $1 OFFSET $2;`;
    const resultado = await pool.query(sql, [limit, offset]);
    return resultado.rows;
};

const getPedidosByPessoaId = async (pessoa_id) => {
    const sql = `SELECT pedidos.id AS pedido_id, pessoas.nome AS cliente, produtos.nome AS produto, pedidos.quantidade, pedidos.data_pedido FROM pedidos INNER JOIN pessoas ON pedidos.pessoa_id = pessoas.id INNER JOIN produtos ON pedidos.produto_id = produtos.id WHERE pedidos.pessoa_id = $1 ORDER BY pedidos.data_pedido DESC;`;
    const resultado = await pool.query(sql, [pessoa_id]);
    return resultado.rows;
};

const createPedido = async (pessoa_id, produto_id, quantidade) => {
    const sql = 'INSERT INTO pedidos (pessoa_id, produto_id, quantidade) VALUES ($1, $2, $3) RETURNING *';
    const resultado = await pool.query(sql, [pessoa_id, produto_id, quantidade]);
    return resultado.rows[0];
};

const updatePedido = async (id, pessoa_id, produto_id, quantidade) => {
    const sql = 'UPDATE pedidos SET pessoa_id = $1, produto_id = $2, quantidade = $3 WHERE id = $4 RETURNING *';
    const resultado = await pool.query(sql, [pessoa_id, produto_id, quantidade, id]);
    return resultado;
};

const deletePedido = async (id) => {
    const sql = 'DELETE FROM pedidos WHERE id = $1 RETURNING *';
    const resultado = await pool.query(sql, [id]);
    return resultado;
};

module.exports = { getAllPedidos, getPedidosByPessoaId, createPedido, updatePedido, deletePedido };