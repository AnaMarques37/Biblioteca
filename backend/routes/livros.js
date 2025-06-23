
const express = require('express');
const router = express.Router();
const db = require('../db');

//Rota para listar todos os livros
router.get('/', (req, res) => {
  db.query('SELECT * FROM livros', (err, results) => {
    if (err) res.status(500).json({ erro: 'Erro ao buscar livros.' });
    else res.json(results);
  });
});

//Get livros por id para edição
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM livros WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Erro ao buscar livro por ID:', err);
      res.status(500).json({ erro: 'Erro ao buscar livro.' });
    } else if (result.length === 0) {
      res.status(404).json({ erro: 'Livro não encontrado.' });
    } else {
      res.json(result[0]); 
    }
  });
});

//Rota para cadastro de livros
router.post('/', (req, res) => {
  const { titulo, autor, ano_publicacao, quantidade_disponivel } = req.body;
  db.query('INSERT INTO livros (titulo, autor, ano_publicacao, quantidade_disponivel) VALUES (?, ?, ?, ?)',
    [titulo, autor, ano_publicacao, quantidade_disponivel],
    (err, result) => {
      if (err) res.status(500).json({ erro: 'Erro ao cadastrar livro.' });
      else res.json({ mensagem: 'Livro cadastrado!' });
    });
});

//Rota para atualizar livros
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { titulo, autor, ano_publicacao, quantidade_disponivel } = req.body;

  db.query(
    'UPDATE livros SET titulo = ?, autor = ?, ano_publicacao = ?, quantidade_disponivel = ? WHERE id = ?',
    [titulo, autor, ano_publicacao, quantidade_disponivel, id],
    (err, result) => {
      if (err) {
        console.error('Erro ao atualizar livro:', err);
        res.status(500).json({ erro: 'Erro ao atualizar livro.' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ erro: 'Livro não encontrado para atualização.' });
      } else {
        res.json({ mensagem: 'Livro atualizado com sucesso!' });
      }
    }
  );
});

//rota para excluir livros
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.beginTransaction(err => {
    if (err) {
      console.error('Erro ao iniciar transação:', err);
      return res.status(500).json({ erro: 'Erro no servidor.' });
    }

    // Excluir todos os empréstimos associados a este livro
    const sqlDeleteEmprestimos = 'DELETE FROM emprestimos WHERE livro_id = ?';
    db.query(sqlDeleteEmprestimos, [id], (errEmprestimos, resultEmprestimos) => {
      if (errEmprestimos) {
      
        return db.rollback(() => {
          console.error('Erro ao excluir empréstimos:', errEmprestimos);
          res.status(500).json({ erro: 'Erro ao excluir empréstimos associados.' });
        });
      }

      //  Excluir o livro
      const sqlDeleteLivro = 'DELETE FROM livros WHERE id = ?';
      db.query(sqlDeleteLivro, [id], (errLivro, resultLivro) => {
        if (errLivro) {
  
          return db.rollback(() => {
            console.error('Erro ao excluir livro:', errLivro);
            res.status(500).json({ erro: 'Erro ao excluir livro.' });
          });
        }

        db.commit(errCommit => {
          if (errCommit) {
            return db.rollback(() => {
              console.error('Erro ao confirmar transação:', errCommit);
              res.status(500).json({ erro: 'Erro ao finalizar a operação.' });
            });
          }
          if (resultLivro.affectedRows === 0) {
            return res.status(404).json({ erro: 'Livro não encontrado.' });
          }
          res.json({ mensagem: 'Livro e empréstimos relacionados removidos com sucesso.' });
        });
      });
    });
  });
});

module.exports = router;
