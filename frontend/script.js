const API_URL = 'http://localhost:3000/api';

function registrar() {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const perfil = document.getElementById('perfil').value;

  fetch(`${API_URL}/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha, perfil })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('mensagem').innerText = data.mensagem || data.erro;
  });
}

function login() {
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;

  fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  })
  .then(res => res.json())
  .then(data => {
    if (data.usuario) {
      const id = data.usuario.id;
      localStorage.setItem("leitorId", id);

      if (data.usuario.perfil === 'bibliotecario') {
        window.location.href = 'bibliotecario.html';
      } else {
        window.location.href = 'leitor.html';
      }
    } else {
      document.getElementById('mensagem').innerText = data.erro;
    }
  });
}

// bibliotecario.js
function cadastrarLivro() {
  const titulo = document.getElementById('titulo').value;
  const autor = document.getElementById('autor').value;
  const ano = document.getElementById('ano').value;
  const quantidade = document.getElementById('quantidade').value;

  fetch(`${API_URL}/livros`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, autor, ano_publicacao: ano, quantidade_disponivel: quantidade })
  }).then(() => {
    alert('Livro cadastrado!');
    listarLivros();
  });
}

function listarLivros() {
  fetch(`${API_URL}/livros`)
    .then(res => res.json())
    .then(livros => {
      const tbody = document.querySelector('#tabelaLivros tbody');
      tbody.innerHTML = '';
      livros.forEach(l => {
        tbody.innerHTML += `
          <tr>
            <td>${l.id}</td>
            <td>${l.titulo}</td>
            <td>${l.autor}</td>
            <td>${l.ano_publicacao}</td>
            <td>${l.quantidade_disponivel}</td>
            <td><button onclick="deletarLivro(${l.id})">Excluir</button></td>
          </tr>
        `;
      });
    });
}

function deletarLivro(id) {
  fetch(`${API_URL}/livros/${id}`, { method: 'DELETE' })
    .then(() => listarLivros());
}

function listarEmprestimos() {
  fetch(`${API_URL}/emprestimos/ativos`)
    .then(res => res.json())
    .then(emp => {
      const tbody = document.querySelector('#tabelaEmprestimos tbody');
      tbody.innerHTML = '';
      emp.forEach(e => {
        tbody.innerHTML += `
          <tr>
            <td>${e.nome}</td>
            <td>${e.titulo}</td>
            <td>${e.data_emprestimo}</td>
            <td>${e.data_devolucao_prevista}</td>
            <td>${e.status}</td>
            <td><button onclick="aprovarDevolucao(${e.id})">Aprovar Devolução</button></td>
          </tr>
        `;
      });
    });
}

function aprovarDevolucao(id) {
  fetch(`${API_URL}/emprestimos/${id}/devolver`, {
    method: 'PUT'
  }).then(() => listarEmprestimos());
}

// Carregar dados automaticamente
if (window.location.pathname.includes("bibliotecario.html")) {
  listarLivros();
  listarEmprestimos();
}
