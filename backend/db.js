const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: '',
  password: '',
  database: 'biblioteca',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error('Erro na conexão com o MySQL:', err);
  } else {
    console.log('Conectado ao MySQL com sucesso!');
  }
});

module.exports = db; 
