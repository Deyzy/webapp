const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const ejs = require('ejs');
const { login } = require('./rotas/login')
const createConnection = require('./rotas/db');
const { info } = require('./rotas/info')
const { loginUser } = require('./rotas/loginUser');

//CRIAR UMA PAG ADMIN, COM UMA PALAVRA SECRETA QUE SÓ O ADM TEM ACESSO

const app = express();
console.log(__dirname)

app.set('view engine', 'ejs'); //renderizar os dados dinamicamente
app.set('views', path.join(__dirname, 'views')); //definir as pastas que estão os templates

//para processar dados do formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src'));

const connection = createConnection();

app.get('/', login);

app.get('/info', info);
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const connection = createConnection();

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1';

    // Verificar o usuário no banco de dados
    connection.query(
        sql,
        [username, password],
        (err, results) => {
            if (err) {
                connection.end();
                return res.status(500).send('Erro na consulta ao banco de dados.');
            }

            if (results.length > 0) {
                if (results[0].adm === 1) {

                    connection.query('SELECT * FROM users', (err, users) => {
                        if (err) {
                            connection.end();
                            return res.status(500).send('Erro ao buscar usuários');
                        }
                        const info = {
                            users,
                            results
                        };
                        res.render('admin', { user: results[0], usuarios: users });
                    });
                } else {
                    connection.end();
                    return res.render('info', { info: results[0] });
                }
            } else {
                connection.end();
                return res.send('Usuário ou senha incorretos.');
            }
        }
    );
});

// Rota para o painel de administração
app.get('/admin', (req, res) => {
    const connection = createConnection();
    connection.query('SELECT * FROM users', (err, users) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).send('Erro ao buscar usuários');
        }
        res.render('admin', { usuarios: users });
    });
});

// Exibir a página de cadastro
app.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

app.post('/cadastro', (req, res) => {
    const { username, password, fullname, cpf, phonenumber, address, dateofbirth } = req.body;

    // console.log('Dados recebidos do formulário:', req.body); 

    const connection = createConnection();

    // Verificar se o usuário já existe
    const sqlCheck = 'SELECT * FROM users WHERE username = ? LIMIT 1';
    connection.query(sqlCheck, [username], (err, results) => {
        if (err) {
            // console.error(err); // Log de erro
            connection.end();
            return res.status(500).send('Erro ao verificar o usuário.');
        }

        // console.log(results); 

        if (results.length > 0) {
            // console.log(username); // Log de usuário existente
            connection.end();
            return res.send('usuario já existe. Tente outro.');
        }

        // Inserir o novo usuário no banco de dados
        const sqlInsert = 'INSERT INTO users (username, password, fullname, cpf, phonenumber, address, dateofbirth) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(sqlInsert, [username, password, fullname, cpf, phonenumber, address, dateofbirth], (err, results) => {
            if (err) {
                // console.error('Erro ao cadastrar usuário:', err); // Log de erro
                connection.end();
                return res.status(500).send('Erro ao cadastrar o usuário.');
            }

            // console.log(results); // Log de sucesso
            connection.end();
            res.send('Cadastro realizado com sucesso!');
        });
    });
});


//excluir um usuário
app.post('/usuarios/excluir/:id', (req, res) => {
    const { id } = req.params;
    const connection = createConnection();

    connection.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao excluir usuário:', err);
            return res.status(500).send('Erro ao excluir usuário');
        } else {
            console.log("usuario excluido")
        }
        res.redirect('/admin');
    });
});

//editar um usuário
app.get('/usuarios/editar/:id', (req, res) => {
    const { id } = req.params;
    const connection = createConnection();

    connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).send('Erro ao buscar usuário');
        }
        res.render('aditarUsuario', { usuario: results[0] });
    });
});

//atualizar um usuário 
app.post('/usuarios/editar/:id', (req, res) => {
    const { id } = req.params;
    const { fullname, cpf, phonenumber, address, dateofbirth } = req.body;
    const connection = createConnection();

    const query = 'UPDATE users SET fullname = ?, cpf = ?, phonenumber = ?, address = ?, dateofbirth = ? WHERE id = ?';
    connection.query(query, [fullname, cpf, phonenumber, address, dateofbirth, id], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar usuário:', err);
            return res.status(500).send('Erro ao atualizar usuário');
        }
        res.redirect('/admin');
    });
});



app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
