const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();

//para processar dados do formulário
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public'));

// Configuração da conexão com o MySQL
const connection = mysql.createConnection({
    host: 'saturnn',  // rede local ou nome do container 
    user: 'root',         // usuário do MySQL
    password: '123456',   // senha do usuário
    database: 'prod'  // banco de dados
    
});

//console.log(connection);

// Conectar ao MySQL
connection.connect((err) => {
    if (err) {;
        console.error('Erro ao conectar ao banco de dados:', err.stack);
        return;
    }
    console.log('Conectado ao banco de dados MySQL como ID ' + connection.threadId);
}); 



 // página de login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
}); 

//login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Verificar o usuário no banco de dados
    connection.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
            if (err) {
                return res.status(500).send('Erro na consulta ao banco de dados.');
            }
            if (results.length > 0) {
                res.send('Login bem-sucedido!');
            } else {
                res.send('Usuário ou senha incorretos.');
            } 
        }
    );
}); 

// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
