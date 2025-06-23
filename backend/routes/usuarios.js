const express = require('express');
const router = express.Router();
const db = require('../db');

//Rota para registra leitor ou bibliotecario
router.post('/registro', (req, res) => {
  const { nome, email, senha, perfil } = req.body;

  const sql = 'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)';
  db.query(sql, [nome, email, senha, perfil], (err, result) => {
    if (err) {
      console.error(err); 
      res.status(500).json({ erro: 'Erro ao registrar usuário.' });
    } else {
      res.status(201).json({ mensagem: 'Usuário registrado com sucesso!' });
    }
  });
});

//Rota de login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const sql = 'SELECT id, nome, email, perfil FROM usuarios WHERE email = ? AND senha = ?';
  db.query(sql, [email, senha], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao fazer login.' });
    } else if (results.length > 0) {
      res.json({ mensagem: 'Login bem-sucedido!', usuario: results[0] });
    } else {
      res.status(401).json({ erro: 'Email ou senha inválidos.' });
    }
  });
});

module.exports = router;
