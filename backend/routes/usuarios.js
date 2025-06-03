const express = require('express');
const router = express.Router();
const db = require('../db');

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

module.exports = router;
