const express = require('express');
const path = require('path');
// const mysql = require('mysql2');
// const ejs = require('ejs');
const {login} = require('./rotas/login')
const createConnection = require('./rotas/db');
const {info} = require('./rotas/info')
const {loginUser} = require('./rotas/loginUser');
 
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

app.get('/', info); // para chamar a pag de informações dos users que está no banco.

app.post('/login', loginUser); // para processar o login


// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
