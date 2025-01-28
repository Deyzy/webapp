
const mysql = require('mysql2');

// Função para criar e retornar a conexão com o MySQL
function createConnection() {
    const connection = mysql.createConnection({
        host: 'localhost',  
        user: 'root',      
        password: '123456',
        database: 'prod'    
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
