// const path = require('path');
const mysql = require('mysql2');

// Função para criar e retornar a conexão com o MySQL
function createConnection() {
    const connection = mysql.createConnection({
        host: 'localhost',  // localhost ou nome do container 
        user: 'root',       // Usuário MySQL
        password: '123456', // Senha do MySQL
        database: 'prod'    // Nome do banco de dados
    });

    // Verifica se a conexão foi bem-sucedida
    connection.connect((err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err.stack);
            return;
        }
        console.log('Conectado ao banco de dados MySQL como ID ' + connection.threadId);
    });

    return connection;  
}

module.exports = createConnection;
