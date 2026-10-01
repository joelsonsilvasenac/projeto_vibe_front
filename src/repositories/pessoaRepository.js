const pool = require('../config/db');

const getAllPessoas = async (limit, offset) => {
    const sql = 'SELECT * FROM pessoas ORDER BY id LIMIT $1 OFFSET $2';
    const resultado = await pool.query(sql, [limit, offset]);
    return resultado.rows;
};

const getPessoaById = async (id) => {
    const sql = 'SELECT * FROM pessoas WHERE id = $1';
    const resultado = await pool.query(sql, [id]);
    return resultado;
};

const getPessoaByCpf = async (cpf) => {
    const sql = 'SELECT * FROM pessoas WHERE cpf = $1';
    const resultado = await pool.query(sql, [cpf]);
    return resultado;
};

const createPessoa = async (nome, email, telefone, cpf, senha) => {
    const sql = 'INSERT INTO pessoas (nome, email, telefone, cpf, senha) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const resultado = await pool.query(sql, [nome, email, telefone, cpf, senha]);
    return resultado.rows[0];
};

const updatePessoa = async (id, nome, email, telefone, cpf, senha) => {
    const sql = 'UPDATE pessoas SET nome = $1, email = $2, telefone = $3, cpf = $4, senha = $5 WHERE id = $6 RETURNING *';
    const resultado = await pool.query(sql, [nome, email, telefone, cpf, senha, id]);
    return resultado;
};

const deletePessoa = async (id) => {
    const sql = 'DELETE FROM pessoas WHERE id = $1 RETURNING *';
    const resultado = await pool.query(sql, [id]);
    return resultado;
};

module.exports = { getAllPessoas, getPessoaById, getPessoaByCpf, createPessoa, updatePessoa, deletePessoa };