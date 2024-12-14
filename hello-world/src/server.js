const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const ejs = require('ejs');
const {login} = require('./rotas/login')
const createConnection = require('./rotas/db');
const {info} = require('./rotas/info')
const {loginUser} = require('./rotas/loginUser');
const { getUsers } = require('./rotas/crud');
 
//CRIAR UMA PAG ADMIN, COM UMA PALAVRA SECRETA QUE SÓ O ADM TEM ACESSO
 
const app = express(); 
console.log(__dirname)

app.set('view engine', 'ejs'); //renderizar os dados dinamicamente
app.set('views', path.join(__dirname, 'views')); //definir as pastas que estão os templates

//para processar dados do formulário
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('src'));

const connection = createConnection(); //função para conexão com o MySQL

app.get('/', login ); // para chamar a página de login

// Rota para informações dos usuários (listar usuários)
app.get('/usuarios', (req, res) => {
    connection.query('SELECT * FROM users', (err, result) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            res.sendStatus(500);
            return;
        }
        console.log(result);
        res.render('usuarios', { result }); 
    });
});


app.get('/info', info); 
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Cria a conexão com o banco de dados chamando a função
    const connection = createConnection();

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1';

    // Verificar o usuário no banco de dados
    connection.query(
        sql, 
        [username, password],
        (err, results) => {
            connection.end(); // Fechar a conexão após a consulta

            if (err) {
                return res.status(500).send('Erro na consulta ao banco de dados.');
            } 

            if (results.length > 0) {
                if (results[0].adm === 1) {
                    const users = getUsers()
                    const info = {
                        users, results
                    }
                    console.log(info)
                   // return res.render('usuarios', {info});
                } else {
                    return res.render('info', { info:results[0]});
                }
            } else {
                return res.send('Usuário ou senha incorretos.');
            }
        }
    );
}); 


// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
