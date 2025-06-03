
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM livros', (err, results) => {
    if (err) res.status(500).json({ erro: 'Erro ao buscar livros.' });
    else res.json(results);
  });
});

router.post('/', (req, res) => {
  const { titulo, autor, ano_publicacao, quantidade_disponivel } = req.body;
  db.query('INSERT INTO livros (titulo, autor, ano_publicacao, quantidade_disponivel) VALUES (?, ?, ?, ?)',
    [titulo, autor, ano_publicacao, quantidade_disponivel],
    (err, result) => {
      if (err) res.status(500).json({ erro: 'Erro ao cadastrar livro.' });
      else res.json({ mensagem: 'Livro cadastrado!' });
    });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM livros WHERE id = ?', [id], (err, result) => {
    if (err) res.status(500).json({ erro: 'Erro ao excluir livro.' });
    else res.json({ mensagem: 'Livro removido.' });
  });
});

module.exports = router;
