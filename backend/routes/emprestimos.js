  const express = require('express');
  const router = express.Router();
  const db = require('../db');
  
  // Criar novo empréstimo
  router.post('/', (req, res) => {
    const { livro_id, leitor_id, data_emprestimo, data_devolucao_prevista } = req.body;
  
    db.query(`INSERT INTO emprestimos (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista, status)
              VALUES (?, ?, ?, ?, 'ativo')`,
      [livro_id, leitor_id, data_emprestimo, data_devolucao_prevista],
      (err, result) => {
        if (err) {
          res.status(500).json({ erro: 'Erro ao registrar empréstimo.' });
        } else {
          db.query('UPDATE livros SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = ?', [livro_id]);
          res.json({ mensagem: 'Empréstimo registrado.' });
        }
      });
  });
  
  // Buscar empréstimos ativos
  router.get('/ativos', (req, res) => {
    const sql = `
      SELECT e.id, u.nome, l.titulo, e.data_emprestimo, e.data_devolucao_prevista, e.status
      FROM emprestimos e
      JOIN usuarios u ON e.leitor_id = u.id
      JOIN livros l ON e.livro_id = l.id
      WHERE e.status = 'ativo'`;
      
    db.query(sql, (err, results) => {
      if (err) res.status(500).json({ erro: 'Erro ao buscar empréstimos ativos.' });
      else res.json(results);
    });
  });
  
  // Marcar empréstimo como devolvido
  router.put('/:id/devolver', (req, res) => {
    const id = req.params.id;
    const dataHoje = new Date().toISOString().slice(0, 10);
  
    db.query('SELECT livro_id FROM emprestimos WHERE id = ?', [id], (err, result) => {
      if (err || result.length === 0) {
        return res.status(404).json({ erro: 'Empréstimo não encontrado.' });
      }
  
      const livroId = result[0].livro_id;
  
      db.query('UPDATE emprestimos SET status = "devolvido", data_devolucao_real = ? WHERE id = ?', [dataHoje, id]);
      db.query('UPDATE livros SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = ?', [livroId]);
      res.json({ mensagem: 'Devolução registrada.' });
    });
  });
  
  // Simular solicitação de devolução
  router.put('/:id/solicitar-devolucao', (req, res) => {
    res.json({ mensagem: 'Solicitação de devolução registrada (simulada).' });
  });
  
  // Buscar empréstimos do leitor
  router.get('/leitor/:id', (req, res) => {
    const id = req.params.id;
    const sql = `
      SELECT e.id, l.titulo, e.data_emprestimo, e.data_devolucao_prevista, e.status
      FROM emprestimos e
      JOIN livros l ON e.livro_id = l.id
      WHERE e.leitor_id = ?`;
  
    db.query(sql, [id], (err, results) => {
      if (err) res.status(500).json({ erro: 'Erro ao buscar empréstimos do leitor.' });
      else res.json(results);
    });
  });
  
  module.exports = router;
  