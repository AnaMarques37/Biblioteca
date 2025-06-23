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
    })
    .catch(error => {
        console.error('Erro no registro:', error);
        document.getElementById('mensagem').innerText = 'Erro ao registrar usuário.';
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
    })
    .catch(error => {
        console.error('Erro no login:', error);
        document.getElementById('mensagem').innerText = 'Erro ao tentar login. Verifique sua conexão ou credenciais.';
    });
}

// Funções para o painel do bibliotecário

function cadastrarLivro() {
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const ano = document.getElementById('ano').value;
    const quantidade = document.getElementById('quantidade').value;

    fetch(`${API_URL}/livros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, autor, ano_publicacao: ano, quantidade_disponivel: quantidade })
    }).then(res => res.json())
      .then(data => {
        if (data.mensagem) {
            alert(data.mensagem);
        } else if (data.erro) {
            alert(data.erro);
        }
        listarLivros();
        // Limpar campos após cadastro
        document.getElementById('titulo').value = '';
        document.getElementById('autor').value = '';
        document.getElementById('ano').value = '';
        document.getElementById('quantidade').value = '';
      })
      .catch(error => {
        console.error('Erro ao cadastrar livro:', error);
        alert('Erro ao cadastrar livro. Verifique o console.');
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
                        <td>
                            <button onclick="editarLivro(${l.id})">Editar</button>
                            <button onclick="deletarLivro(${l.id})">Excluir</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => {
            console.error('Erro ao listar livros:', error);
            alert('Erro ao carregar lista de livros. Verifique o console.');
        });
}


function editarLivro(id) {
    
    document.getElementById('edicaoLivroSection').style.display = 'block';

    
    fetch(`${API_URL}/livros/${id}`)
        .then(res => res.json())
        .then(livro => {
            if (livro) {
                document.getElementById('editLivroId').value = livro.id;
                document.getElementById('editTitulo').value = livro.titulo;
                document.getElementById('editAutor').value = livro.autor;
                document.getElementById('editAno').value = livro.ano_publicacao;
                document.getElementById('editQuantidade').value = livro.quantidade_disponivel;
            } else {
                alert('Livro não encontrado para edição.');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar livro para edição:', error);
            alert('Erro ao carregar dados do livro para edição. Verifique o console.');
        });
}


function salvarEdicaoLivro() {
    const id = document.getElementById('editLivroId').value;
    const titulo = document.getElementById('editTitulo').value;
    const autor = document.getElementById('editAutor').value;
    const ano = document.getElementById('editAno').value;
    const quantidade = document.getElementById('editQuantidade').value;

    fetch(`${API_URL}/livros/${id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, autor, ano_publicacao: ano, quantidade_disponivel: quantidade })
    })
    .then(res => res.json())
    .then(data => {
        if (data.mensagem) {
            alert(data.mensagem);
        } else if (data.erro) {
            alert(data.erro);
        }
        cancelarEdicao(); 
        listarLivros(); 
    })
    .catch(error => {
        console.error('Erro ao salvar edição do livro:', error);
        alert('Erro ao salvar edição do livro. Verifique o console.');
    });
}


function cancelarEdicao() {
    document.getElementById('edicaoLivroSection').style.display = 'none';
   
    document.getElementById('editLivroId').value = '';
    document.getElementById('editTitulo').value = '';
    document.getElementById('editAutor').value = '';
    document.getElementById('editAno').value = '';
    document.getElementById('editQuantidade').value = '';
}


function deletarLivro(id) {
    if (!confirm('Tem certeza que deseja excluir este livro e todos os seus empréstimos históricos? Esta ação é irreversível.')) {
        return;
    }

    fetch(`${API_URL}/livros/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            if (data.mensagem) {
                alert(data.mensagem);
            } else if (data.erro) {
                alert(data.erro);
            }
            listarLivros();
        })
        .catch(error => {
            console.error('Erro ao tentar excluir livro:', error);
            alert('Erro ao excluir livro. Verifique o console para mais detalhes.');
        });
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
        })
        .catch(error => {
            console.error('Erro ao listar empréstimos:', error);
            alert('Erro ao carregar lista de empréstimos. Verifique o console.');
        });
}

function aprovarDevolucao(id) {
    fetch(`${API_URL}/emprestimos/${id}/devolver`, {
        method: 'PUT'
    }).then(res => res.json())
      .then(data => {
        if (data.mensagem) {
            alert(data.mensagem);
        } else if (data.erro) {
            alert(data.erro);
        }
        listarEmprestimos();
        listarLivros(); 
      })
      .catch(error => {
        console.error('Erro ao aprovar devolução:', error);
        alert('Erro ao aprovar devolução. Verifique o console.');
      });
}

// Carregar dados quando a página bibliotecario.html é carregada
if (window.location.pathname.includes("bibliotecario.html")) {
    listarLivros();
    listarEmprestimos();
}