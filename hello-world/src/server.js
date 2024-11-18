const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const ejs = require('ejs');
const {login} = require('./rotas/login')

//criar uma pag admin, com uma palavra secreta que só o admin tem acesso

const app = express(); 
console.log(__dirname)

app.set('view engine', 'ejs'); //renderizar os dados dinamicamente
app.set('views', path.join(__dirname, 'views')); //definir as pastas que estão os templates

//para processar dados do formulário
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('src'));

// Configuração da conexão com o MySQL criar function
const connection = mysql.createConnection({
    host: 'localhost',  // rede local ou nome do container 
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
app.get('/', login ); 

app.get('/info', (req, res) => { //criar function
    res.render('info', {info} );
}); 

//login 
app.post('/login', (req, res) => { //criar function
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1';

    // Verificar o usuário no banco de dados
    connection.query(
        sql, 
        [username, password],
        (err, results) => {
            if (err) {
                return res.status(500).send('Erro na consulta ao banco de dados.');
            } 
            if (results.length > 0) {
                const info = {
                    username: results[0].username, 
                    fullname: results[0].fullname,
                    cpf: results[0].cpf,
                    phonenumber: results[0].phonenumber,
                    address: results[0].address,
                    dateofbirth: results[0].dateofbirth,
                }
                res.render('info', {info})
                //res.redirect('/info');
            } else {
                res.send('Usuário ou senha incorretos.');
            } 
        }
    );
}); 


// Página de administração
app.get('/admin', (req, res) => {
    res.render('admin'); // Exibe o formulário para digitar o nome de usuário e a senha
});

app.post('/admin', (req, res) => {
    const { username, password } = req.body;
    
    // Verificar se o usuário é um administrador
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ? AND is_admin = 1 LIMIT 1';

    connection.query(
        sql,
        [username, password],
        (err, results) => {
            if (err) {
                return res.status(500).send('Erro na consulta ao banco de dados.');
            }
            if (results.length > 0) {
                // Usuário encontrado e é administrador
                res.render('adm'); 
            } else {
                // Usuário não encontrado ou não é administrador
                res.send('Acesso negado!');
            }
        }
    );
});


// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
