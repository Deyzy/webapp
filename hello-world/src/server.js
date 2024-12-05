const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const ejs = require('ejs');
const {login} = require('./rotas/login')
const createConnection = require('./rotas/db');
const {info} = require('./rotas/info')
const {loginUser} = require('./rotas/loginUser');
// const { createUser, getUsers, getUser, updateUser, deleteUser } = require('./rotas/app');


 
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
    connection.query('SELECT * FROM usuarios', (err, result) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            res.sendStatus(500);
            return;
        }
        res.render('users', { usuarios: result }); // Renderiza a lista de usuários
    });
});

// Rota para exibir página de adicionar usuário
app.get('/usuarios/adicionar', (req, res) => {
    res.render('adicionarUsuario'); // Crie um formulário de adição de usuário
});

// Rota para processar a adição de um usuário
app.post('/usuarios/adicionar', (req, res) => {
    const { username, fullname, cpf, phonenumber, address, dateofbirth } = req.body;
    const query = 'INSERT INTO usuarios (username, fullname, cpf, phonenumber, address, dateofbirth) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [username, fullname, cpf, phonenumber, address, dateofbirth], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar usuário:', err);
            res.sendStatus(500);
            return;
        }
        res.redirect('/usuarios'); // Redireciona para a lista de usuários
    });
});

// Rota para editar um usuário (exibe o formulário de edição)
app.get('/usuarios/editar/:id', (req, res) => {
    const usuarioId = req.params.id;
    connection.query('SELECT * FROM usuarios WHERE id = ?', [usuarioId], (err, result) => {
        if (err) {
            console.error('Erro ao buscar usuário para edição:', err);
            res.sendStatus(500);
            return;
        }
        res.render('editarUsuario', { usuario: result[0] }); // Exibe o formulário com os dados do usuário
    });
});

// Rota para processar a edição de um usuário
app.post('/usuarios/editar/:id', (req, res) => {
    const { username, fullname, cpf, phonenumber, address, dateofbirth } = req.body;
    const usuarioId = req.params.id;
    const query = 'UPDATE usuarios SET username = ?, fullname = ?, cpf = ?, phonenumber = ?, address = ?, dateofbirth = ? WHERE id = ?';
    connection.query(query, [username, fullname, cpf, phonenumber, address, dateofbirth, usuarioId], (err, result) => {
        if (err) {
            console.error('Erro ao editar usuário:', err);
            res.sendStatus(500);
            return;
        }
        res.redirect('/usuarios'); // Redireciona para a lista de usuários
    });
});

// Rota para excluir um usuário
app.post('/usuarios/deletar/:id', (req, res) => {
    const usuarioId = req.params.id;
    connection.query('DELETE FROM usuarios WHERE id = ?', [usuarioId], (err, result) => {
        if (err) {
            console.error('Erro ao excluir usuário:', err);
            res.sendStatus(500);
            return;
        }
        res.redirect('/usuarios'); // Redireciona para a lista de usuários
    });
});

// Rota para detalhes de um usuário
app.get('/usuarios/:id', (req, res) => {
    const usuarioId = req.params.id;
    connection.query('SELECT * FROM usuarios WHERE id = ?', [usuarioId], (err, result) => {
        if (err) {
            console.error('Erro ao buscar detalhes do usuário:', err);
            res.sendStatus(500);
            return;
        }
        res.render('detalhesUsuario', { usuario: result[0] }); // Exibe os detalhes do usuário
    });
});

app.get('/', info); 
app.post('/login', loginUser); 


// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
